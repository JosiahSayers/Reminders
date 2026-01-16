import express from "express";
import { getStorageStatistics } from "../../utils/image-processor";
import { prisma } from "../../../prisma/db";

export const adminRouter = express.Router();

adminRouter.get("/stats", async (req, res) => {
  const storage = await getStorageStatistics();
  const activeReminders = await prisma.reminder.count({
    where: { archivedAt: null },
  });
  const deletedReminders = await prisma.reminder.count({
    where: { archivedAt: { not: null } },
  });
  const remindersSent = await prisma.reminderHistory.count();
  const oneTimeMessages = await prisma.message.count();

  return res.json({
    storage,
    activeReminders,
    deletedReminders,
    remindersSent,
    oneTimeMessages,
  });
});
