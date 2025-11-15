import express, { Router } from "express";
import { cronRouter } from "./cron.router";
import { remindersRouter } from "./reminders.router";

export const apiRouter = Router();

apiRouter.use(express.json());

apiRouter.use("/cron", cronRouter);
apiRouter.use("/reminders", remindersRouter);
