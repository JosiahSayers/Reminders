import express from "express";
import { prisma } from "../../../prisma/db";

export const reminderHistoryRouter = express.Router();

reminderHistoryRouter.get("/", async (req, res, next) => {
  let successFilter: boolean | undefined;
  if (req.query.success) {
    successFilter = req.query.success === "true" ? true : false;
  }

  const history = await prisma.reminderHistory.findMany({
    where: {
      successful: successFilter,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: { reminder: true },
  });
  return res.json(history);
});
