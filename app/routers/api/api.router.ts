import express, { Router } from "express";
import { cronRouter } from "./cron.router";
import { remindersRouter } from "./reminders.router";
import { messagesRouter } from "./messages.router";
import { reminderHistoryRouter } from "./reminder-history.router";
import { adminRouter } from "./admin.router";
import { quotesRouter } from "./quotes.router";

export const apiRouter = Router();

apiRouter.use("/cron", cronRouter);
apiRouter.use("/reminders", remindersRouter);
apiRouter.use("/messages", messagesRouter);
apiRouter.use("/reminder-history", reminderHistoryRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/quotes", quotesRouter);
