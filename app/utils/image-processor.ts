import { $ } from "bun";
import mime from "mime-types";
import sharp from "sharp";
import { prisma } from "../../prisma/db";
import type { Message } from "../../prisma/generated/client";

export const uploadFolder =
  Bun.env.NODE_ENV === "production" ? "/usr/src/app/uploads" : "./uploads";

export async function processImage(
  image: Express.Multer.File,
  message: Message,
) {
  const imageRecord = await prisma.image.create({
    data: {
      originalSizeInBytes: image.size,
      originalFilename: image.originalname,
      convertedSizeInBytes: 0,
      messageId: message.id,
    },
  });

  await writeBufferToDisk(
    image.buffer,
    `${imageRecord.id}.${mime.extension(image.mimetype)}`,
    true,
  );

  const compressed = await compressImage(image.buffer);

  await writeBufferToDisk(compressed, `${imageRecord.id}.png`, false);

  return await prisma.image.update({
    where: { id: imageRecord.id },
    data: { convertedSizeInBytes: compressed.byteLength },
  });
}

async function writeBufferToDisk(
  buffer: Buffer,
  filename: string,
  isOriginal: boolean,
) {
  const subFolder = isOriginal ? "originals" : "compressed";
  await Bun.write(`${uploadFolder}/${subFolder}/${filename}`, buffer);
}

export async function compressImage(buffer: Buffer) {
  return sharp(buffer).resize(320).png().toBuffer();
}

export async function getStorageStatistics() {
  const directorySize = async (directory: string) =>
    Number(
      (await $`du -s ${directory} | awk '{print$1}'`.quiet().text()).trim(),
    );
  const originalsSize = await directorySize(`${uploadFolder}/originals`);
  const compressedSize = await directorySize(`${uploadFolder}/compressed`);
  const totalUploadsSize = await directorySize(uploadFolder);
  return { originalsSize, compressedSize, totalUploadsSize };
}
