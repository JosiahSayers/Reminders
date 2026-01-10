import express, { type Response } from "express";
import { zod } from "../../utils/validation";
import {
  validateBody,
  type ValidatedRequest,
} from "../../middleware/validate-body";
import type z from "zod";
import { prisma } from "../../../prisma/db";
import { validateCronExpression } from "cron";
import { logger } from "../../utils/logger";
import { createJob, resetJob, stopJob } from "../../utils/jobs";
import { requireReminderExists } from "../../middleware/require-reminder-exists";
import cronstrue from "cronstrue";
import { executeReminder } from "../../execute-reminder";

export const remindersRouter = express.Router();

const reminderSchema = zod.strictObject({
  title: zod.string(),
  cron: zod.string(),
  content: zod.string(),
});
const partialReminderSchema = reminderSchema.partial();

type ValidatedReminder = z.infer<typeof reminderSchema>;
type ValidatedPartialReminder = z.infer<typeof partialReminderSchema>;

remindersRouter.get("/", async (req, res, next) => {
  const reminders = await prisma.reminder.findMany({
    where: { archivedAt: null },
  });
  return res.json(reminders);
});

remindersRouter.get("/counts", async (req, res, next) => {
  const activeReminderCount = await prisma.reminder.count({
    where: { archivedAt: null },
  });
  return res.json({ activeReminderCount });
});

remindersRouter.post(
  "/",
  validateBody(reminderSchema),
  async (req: ValidatedRequest<ValidatedReminder>, res: Response) => {
    const validationResult = validateCronExpression(req.body.cron);
    if (!validationResult.valid) {
      return res
        .json({
          error: `The provided value for cron was not valid. ${validationResult.error?.message}`,
        })
        .status(400);
    }

    try {
      const reminder = await prisma.reminder.create({
        data: {
          ...req.body,
          cronExplanation: cronstrue.toString(req.body.cron),
        },
      });
      createJob(reminder);
      return res.json(reminder);
    } catch (e) {
      logger.error(e);
      return res.sendStatus(500);
    }
  }
);

remindersRouter.delete("/:id", requireReminderExists, async (req, res) => {
  try {
    const updatedReminder = await prisma.reminder.update({
      where: { id: Number(req.params.id) },
      data: {
        archivedAt: new Date(),
      },
    });

    stopJob(updatedReminder);

    return res.json(updatedReminder);
  } catch (e) {
    logger.error(e);
    return res.sendStatus(500);
  }
});

remindersRouter.patch(
  "/:id",
  requireReminderExists,
  validateBody(partialReminderSchema),
  async (req: ValidatedRequest<ValidatedPartialReminder>, res) => {
    const updatedReminder = await prisma.reminder.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    resetJob(updatedReminder);
    return res.json(updatedReminder);
  }
);

remindersRouter.post(
  "/:id/resend",
  requireReminderExists,
  async (req, res, next) => {
    const reminder = await prisma.reminder.findUnique({
      where: { id: Number(req.params.id) },
    });
    await executeReminder(reminder!);
    return res.sendStatus(200);
  }
);
