import express from "express";
import z from "zod";
import {
  validateBody,
  type ValidatedRequest,
} from "../../middleware/validate-body";
import { prisma } from "../../../prisma/db";
import { logger } from "../../utils/logger";
import { printMessage } from "../../utils/printer";
import multer from "multer";
import { processImage } from "../../utils/image-processor";

export const messagesRouter = express.Router();
const upload = multer();

const messageSchema = z.strictObject({
  title: z.string().optional(),
  content: z.string(),
});

messagesRouter.post(
  "/",
  upload.single("image"),
  validateBody(messageSchema),
  async (req, res, next) => {
    try {
      let message = await prisma.message.create({
        data: {
          title: req.body.title,
          content: req.body.content,
          successful: false,
          includeLogo: false,
        },
      });

      if (req.file) {
        await processImage(req.file, message);
      }

      const messageWithImage = await prisma.message.findUnique({
        where: { id: message.id },
        include: { image: true },
      });

      await printMessage(messageWithImage!);

      message = await prisma.message.update({
        where: { id: message.id },
        data: { successful: true },
      });

      return res.sendStatus(201);
    } catch (e) {
      logger.error(e);
      return res.sendStatus(500);
    }
  }
);
