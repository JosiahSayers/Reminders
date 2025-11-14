import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/db";
import { logger } from "../utils/logger";

export const requireReminderExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = Number(req.params.id);

  try {
    const reminder = await prisma.reminder.findUnique({ where: { id } });
    if (!reminder) {
      return res.sendStatus(404);
    }
    // @ts-ignore
    req.reminder = reminder;
    next();
  } catch (e) {
    logger.error("Failed finding reminder", e, { reminderId: id });
    return res.status(500);
  }
};
