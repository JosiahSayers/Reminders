import express from "express";
import {
  compressImage,
  getStorageStatistics,
  uploadFolder,
} from "../../utils/image-processor";
import { prisma } from "../../../prisma/db";
import z from "zod";
import {
  validateBody,
  type ValidatedRequest,
} from "../../middleware/validate-body";
import multer from "multer";

const upload = multer();

const settingSchema = z.strictObject({
  name: z.string(),
  enabled: z.boolean(),
});
type SettingSchema = z.infer<typeof settingSchema>;

const configurationSchema = z.strictObject({
  name: z.string(),
  value: z.string().optional().default(""),
});
type ConfigurationSchema = z.infer<typeof configurationSchema>;

export const adminRouter = express.Router();

adminRouter.get("/stats", async (req, res) => {
  const storage = await getStorageStatistics();
  const activeReminders = await prisma.reminder.count({
    where: { archivedAt: null },
  });
  const deletedReminders = await prisma.reminder.count({
    where: { archivedAt: { not: null } },
  });
  const remindersSent = await prisma.reminderHistory.count();
  const oneTimeMessages = await prisma.message.count();

  return res.json({
    storage,
    activeReminders,
    deletedReminders,
    remindersSent,
    oneTimeMessages,
  });
});

adminRouter.get("/settings", async (req, res) => {
  const settings = await prisma.setting.findMany();
  const configurations = await prisma.configuration.findMany();

  return res.json({ settings, configurations });
});

adminRouter.put(
  "/settings",
  validateBody(settingSchema),
  async (req: ValidatedRequest<SettingSchema>, res) => {
    // find setting to update
    let setting = await prisma.setting.findUnique({
      where: { name: req.body.name },
    });
    if (!setting) {
      return res.json({ error: `Setting not found` }).status(404);
    }

    // update it
    const updatedSetting = await prisma.setting.update({
      where: { id: setting.id },
      data: { enabled: req.body.enabled },
    });

    // return it
    return res.json(updatedSetting);
  },
);

adminRouter.put(
  "/configurations",
  validateBody(configurationSchema),
  async (req: ValidatedRequest<ConfigurationSchema>, res) => {
    let configuration = await prisma.configuration.findUnique({
      where: { name: req.body.name },
    });

    if (!configuration) {
      return res.json({ error: "Configuration not found" }).status(404);
    }

    const updatedConfiguration = await prisma.configuration.update({
      where: { id: configuration.id },
      data: { value: req.body.value },
    });

    return res.json(updatedConfiguration);
  },
);

adminRouter.get("/logo", async (req, res) => {
  return res.sendFile(`${process.cwd()}/app/assets/logo.png`);
});

adminRouter.post("/logo", upload.single("logo"), async (req, res) => {
  if (!req.file) {
    return res.json({ error: "No file was uploaded" }).status(500);
  }

  // First try to compress new image before moving existing files
  const compressed = await compressImage(req.file.buffer);

  // Move current logo to a safe location (if there is a current logo)
  const currentLogo = Bun.file("./app/assets/logo.png");
  let previousLogoFilename: string | null = null;
  if (await currentLogo.exists()) {
    previousLogoFilename = `${new Date().toISOString()}.png`;
    await Bun.write(
      `${uploadFolder}/previous-logos/${previousLogoFilename}`,
      currentLogo,
    );
  }

  // Write the new logo to disk
  await Bun.write("./app/assets/logo.png", compressed);

  return res.json({ previousLogoFilename });
});
