import express from "express";
import z from "zod";
import {
  validateBody,
  type ValidatedRequest,
} from "../../middleware/validate-body";
import { prisma } from "../../../prisma/db";
import { logger } from "../../utils/logger";
import { printMessage } from "../../utils/printer";

export const messagesRouter = express.Router();

const messageSchema = z.strictObject({
  title: z.string().optional(),
  content: z.string(),
});

type ValidatedMessage = z.infer<typeof messageSchema>;

messagesRouter.post(
  "/",
  validateBody(messageSchema),
  async (req: ValidatedRequest<ValidatedMessage>, res, next) => {
    try {
      let message = await prisma.message.create({
        data: {
          ...req.body,
          successful: false,
        },
      });
      await printMessage(message);
      message = await prisma.message.update({
        where: { id: message.id },
        data: { successful: true },
      });

      return res.json(message);
    } catch (e) {
      logger.error(e);
      return res.sendStatus(500);
    }
  }
);
