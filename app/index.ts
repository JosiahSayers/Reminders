import { prisma } from "../prisma/db";
import { logger } from "./utils/logger";
import { app } from "./routers";
import { createJob, getJobs } from "./utils/jobs";

const reminders = await prisma.reminder.findMany({
  where: { archivedAt: null },
});

reminders.forEach((reminder) => {
  createJob(reminder);
});
const allJobs = getJobs();

const port = Bun.env.PORT || 3000;
app.listen(port);

logger.info("Application started", {
  scheduledReminderCount: allJobs.size,
  port,
});
