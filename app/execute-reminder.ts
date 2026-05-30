import { prisma } from "../prisma/db";
import { type Quote, type Reminder } from "../prisma/generated/client";
import { logger } from "./utils/logger";
import { printMessage, printReminder } from "./utils/printer";

export async function executeReminder(reminder: Reminder) {
  let successful = true;

  try {
    logger.info("Sending reminder", { reminder });
    await printReminder(reminder);
  } catch (e) {
    successful = false;
    logger.error("Error sending reminder", e, { reminder });
  } finally {
    await prisma.reminderHistory.create({
      data: { reminderId: reminder.id, successful },
    });
  }
}

export async function executeQuote() {
  let successful = true;
  const [randomQuote] = await prisma.$queryRaw<
    Array<Quote>
  >`SELECT * FROM Quote WHERE id IN (SELECT id FROM Quote ORDER BY RANDOM() LIMIT 1)`;
  if (!randomQuote) {
    logger.warn("Unable to retrieve a quote");
    return;
  }

  const image = randomQuote.imageId
    ? await prisma.image.findUnique({ where: { id: randomQuote.imageId } })
    : null;

  const message = await prisma.message.create({
    data: {
      content: `${randomQuote.quote}\n\n- ${randomQuote.author}`,
      successful: false,
      includeLogo: false,
    },
  });

  try {
    logger.info("Sending quote", { randomQuote, message });
    await printMessage({ ...message, image });
  } catch (e) {
    successful = false;
    logger.error("Error sending quote", e, { randomQuote, message });
  } finally {
    await prisma.message.update({
      where: { id: message.id },
      data: { successful },
    });
  }
}
