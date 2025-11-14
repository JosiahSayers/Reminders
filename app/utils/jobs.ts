import { CronJob } from "cron";
import type { Reminder } from "../../prisma/generated/client";
import { executeReminder } from "../execute-reminder";
import { logger } from "./logger";

const jobs = new Map<
  number,
  CronJob<null, { reminder: Reminder; created: string }>
>();

export function createJob(reminder: Reminder) {
  const newJob = CronJob.from({
    cronTime: reminder.cron,
    onTick: () => executeReminder(reminder),
    context: { reminder, created: new Date().toDateString() },
    start: true,
    timeZone: "America/New_York",
  });
  jobs.set(reminder.id, newJob);
  logger.verbose("Created job", { reminder, jobCount: jobs.size });
}

export function stopJob(reminder: Reminder) {
  if (jobs.has(reminder.id)) {
    const job = jobs.get(reminder.id);
    job!.stop();
    jobs.delete(reminder.id);
    logger.verbose("Stopped job", {
      reminder: job!.context.reminder,
      jobCount: jobs.size,
    });
  }
}

export function resetJob(reminder: Reminder) {
  stopJob(reminder);
  createJob(reminder);
}

export function getJobs() {
  return jobs;
}
