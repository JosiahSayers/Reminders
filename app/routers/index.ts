import express from "express";
import { healthRouter } from "./health.router";
import { cronRouter } from "./cron.router";
import { remindersRouter } from "./reminders.router";
import { logger } from "../utils/logger";
import { httpLog } from "../middleware/http-log";

export const app = express();

app.use(httpLog);
app.use(express.json());

app.use(healthRouter);
app.use("/cron", cronRouter);
app.use("/reminders", remindersRouter);

// @ts-ignore
app.use((err, req, res, next) => {
  logger.error(err);
  res.sendStatus(500);
});
