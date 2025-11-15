import express from "express";
import { healthRouter } from "./health.router";
import { logger } from "../utils/logger";
import { httpLog } from "../middleware/http-log";
import { frontendRouter } from "./frontend.router";
import { apiRouter } from "./api/api.router";

export const app = express();

app.use(httpLog);

app.use(healthRouter);
app.use("/api", apiRouter);
app.use(frontendRouter);

// @ts-ignore
app.use((err, req, res, next) => {
  logger.error(err);
  res.sendStatus(500);
});
