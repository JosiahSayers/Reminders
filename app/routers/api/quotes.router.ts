import { Router } from "express";
import multer from "multer";
import z from "zod";
import {
  validateBody,
  type ValidatedRequest,
} from "../../middleware/validate-body";
import { prisma } from "../../../prisma/db";
import { logger } from "../../utils/logger";
import type { Image } from "../../../prisma/generated/client";

export const quotesRouter = Router();

const quoteSchema = z.strictObject({
  quote: z.string(),
  author: z.string(),
});

type QuoteSchema = z.infer<typeof quoteSchema>;

quotesRouter.post(
  "/",
  validateBody(quoteSchema),
  async (req: ValidatedRequest<QuoteSchema>, res, next) => {
    try {
      const quote = await prisma.quote.create({
        data: {
          quote: req.validatedBody.quote,
          author: req.validatedBody.author,
        },
      });

      return res.sendStatus(201);
    } catch (e) {
      logger.error(e);
      return res.sendStatus(500);
    }
  },
);

quotesRouter.get("/", async (req, res, next) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const pageSize = 25;

  const quotes = await prisma.quote.findMany({
    orderBy: {
      createdAt: "asc",
    },
    include: { image: true },
    take: pageSize,
    skip: pageSize * (page - 1),
  });

  const totalQuoteSize = await prisma.quote.count();
  const totalPages = Math.max(Math.floor(totalQuoteSize / pageSize), 1);
  return res.json({ quotes, totalQuoteSize, totalPages, currentPage: page });
});

quotesRouter.delete("/:id", async (req, res, next) => {
  const deleted = await prisma.quote.delete({
    where: { id: Number(req.params.id) },
  });
  let deletedImage: Image | undefined;

  if (deleted.imageId) {
    deletedImage = await prisma.image.delete({
      where: { id: deleted.imageId },
    });
  }

  logger.info("Deleted a quote", { quote: deleted, deletedImage });

  return res.sendStatus(200);
});
