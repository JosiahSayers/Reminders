import {
  ThermalPrinter,
  PrinterTypes,
  CharacterSet,
} from "node-thermal-printer";
import { logger } from "./logger";
import type { Image, Message, Reminder } from "../../prisma/generated/client";
import { uploadFolder } from "./image-processor";
import { prisma } from "../../prisma/db";

export async function getPrinter() {
  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: `tcp://${Bun.env.PRINTER_IP}`,
    characterSet: CharacterSet.PC852_LATIN2,
    width: 42,
  });

  const isConnected = await printer.isPrinterConnected();
  if (!isConnected) {
    logger.error("Unable to connect to printer");
  }

  return printer;
}

function shouldPrint() {
  return Bun.env.SEND_TO_PRINTER?.toLowerCase() === "true";
}

export async function printReminder(reminder: Reminder) {
  if (!shouldPrint()) {
    return;
  }

  const printer = await getPrinter();

  printTitle(printer, reminder.title);
  printer.newLine();

  printLongContent(printer, reminder.content);
  printer.newLine();

  await printLogo(printer);

  printer.cut();

  try {
    await printer.execute();
  } catch (e) {
    logger.error("Failed to print reminder", e, { reminder });
  }
}

export async function printMessage(message: Message & { image: Image | null }) {
  if (!shouldPrint()) {
    return;
  }

  const printer = await getPrinter();

  if (message.title) {
    printTitle(printer, message.title);
    printer.newLine();
  }

  if (message.content) {
    printLongContent(printer, message.content);
    printer.newLine();
  }

  if (message.image) {
    const file = `${uploadFolder}/compressed/${message.image.id}.png`;
    printer.alignCenter();
    await printer.printImage(file);
  }

  if (message.includeLogo) {
    await printLogo(printer);
  }

  printer.cut();

  try {
    await printer.execute();
  } catch (e) {
    logger.error("Failed to print message", e, { message });
    throw e;
  }
}

function printTitle(printer: ThermalPrinter, title: string) {
  printer.alignCenter();
  printer.underline(true);
  printer.bold(true);
  printer.setTextDoubleHeight();

  printer.println(title);

  printer.underline(false);
  printer.bold(false);
  printer.setTextNormal();
  printer.alignLeft();
}

function printLongContent(printer: ThermalPrinter, content: string) {
  // Sequential newline characters get truncated to a single newline. This forces them to print correctly.
  content.split("\n").forEach((segment) => {
    if (segment) {
      printer.println(segment);
    } else {
      printer.newLine();
    }
  });
}

async function printLogo(printer: ThermalPrinter) {
  const printLogoSetting = await prisma.setting.findUnique({
    where: { name: "Print Logo" },
  });

  if (printLogoSetting?.enabled) {
    printer.drawLine();
    printer.alignCenter();
    await printer.printImage("./app/assets/logo.png");
  }
}
