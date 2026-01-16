import express from "express";
import { prisma } from "../../prisma/db";
import { isAiEnabled } from "../utils/llm";

export const healthRouter = express.Router();

healthRouter.get("/livez", (req, res) => {
  return res.sendStatus(200);
});

healthRouter.get("/readyz", async (req, res) => {
  const dbConnected = !!(await prisma.$queryRaw`SELECT 1`);
  const aiEnabled = isAiEnabled();
  const success = dbConnected; // chain any future services to this boolean
  return res
    .json({
      dbConnected,
      aiEnabled,
    })
    .status(success ? 200 : 500);
});
