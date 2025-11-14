import express from "express";
import { prisma } from "../../prisma/db";

export const healthRouter = express.Router();

healthRouter.get("/livez", (req, res) => {
  return res.sendStatus(200);
});

healthRouter.get("/readyz", async (req, res) => {
  const dbConnected = !!(await prisma.$queryRaw`SELECT 1`);
  const success = dbConnected; // chain any future services to this boolean to this boolean
  return res
    .json({
      dbConnected,
    })
    .status(success ? 200 : 500);
});
