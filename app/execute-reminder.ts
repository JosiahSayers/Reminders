import { prisma } from "../prisma/db";
import type { Reminder } from "../prisma/generated/client";
import { logger } from "./utils/logger";
import { printReminder } from "./utils/printer";

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
