import type { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const httpLog = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Store basic info before any routers mutate it
  const logMeta = {
    path: req.path,
    method: req.method,
    ip: req.ip,
    ipList: req.ips,
  };

  res.on("finish", () => {
    logger.http("HTTP Request", {
      ...logMeta,
      status: res.status,
      duration: Date.now() - start,
    });
  });

  next();
};
