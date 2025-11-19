import express, { Router } from "express";
import { cronRouter } from "./cron.router";
import { remindersRouter } from "./reminders.router";
import { messagesRouter } from "./messages.router";

export const apiRouter = Router();

apiRouter.use("/cron", cronRouter);
apiRouter.use("/reminders", remindersRouter);
apiRouter.use("/messages", messagesRouter);
