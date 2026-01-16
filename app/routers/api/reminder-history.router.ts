import express from "express";
import { prisma } from "../../../prisma/db";

export const reminderHistoryRouter = express.Router();

reminderHistoryRouter.get("/", async (req, res, next) => {
  let successFilter: boolean | undefined;
  if (req.query.success) {
    successFilter = req.query.success === "true" ? true : false;
  }
  const page = Number(req.query.page) || 1;
  const pageSize = 25;

  const history = await prisma.reminderHistory.findMany({
    where: {
      successful: successFilter,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: { reminder: true },
    take: pageSize,
    skip: pageSize * page,
  });

  const totalHistorySize = await prisma.reminderHistory.count({
    where: { successful: successFilter },
  });
  const totalPages = Math.max(Math.floor(totalHistorySize / pageSize), 1);
  return res.json({ history, totalPages, totalHistorySize, currentPage: page });
});
