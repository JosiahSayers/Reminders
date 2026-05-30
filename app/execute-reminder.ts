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

export async function executeQuote(quote?: Quote) {
  let successful = true;
  let quoteToSend = quote;

  if (!quoteToSend) {
    const [randomQuote] = await prisma.$queryRaw<
      Array<Quote>
    >`SELECT * FROM Quote WHERE id IN (SELECT id FROM Quote ORDER BY RANDOM() LIMIT 1)`;
    if (!randomQuote) {
      logger.warn("Unable to retrieve a quote");
      return;
    }
    quoteToSend = randomQuote;
  }

  const image = quoteToSend.imageId
    ? await prisma.image.findUnique({ where: { id: quoteToSend.imageId } })
    : null;

  const message = await prisma.message.create({
    data: {
      content: `${quoteToSend.quote}\n\n- ${quoteToSend.author}`,
      successful: false,
      includeLogo: false,
    },
  });

  try {
    logger.info("Sending quote", { quoteToSend, message });
    await printMessage({ ...message, image });
  } catch (e) {
    successful = false;
    logger.error("Error sending quote", e, { quoteToSend, message });
  } finally {
    await prisma.message.update({
      where: { id: message.id },
      data: { successful },
    });
  }
}
