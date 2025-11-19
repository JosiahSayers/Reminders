import {
  ThermalPrinter,
  PrinterTypes,
  CharacterSet,
  BreakLine,
} from "node-thermal-printer";
import { logger } from "./logger";
import type { Reminder } from "../../prisma/generated/client";

export async function getPrinter() {
  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: `tcp://${Bun.env.PRINTER_IP}`,
    characterSet: CharacterSet.PC852_LATIN2,
    width: 42,
    breakLine: BreakLine.WORD,
  });

  const isConnected = await printer.isPrinterConnected();
  if (!isConnected) {
    logger.error("Unable to connect to printer");
  }

  return printer;
}

export async function printReminder(reminder: Reminder) {
  const printer = await getPrinter();

  printTitle(printer, reminder.title);
  printer.newLine();

  printLongContent(printer, reminder.content);
  printer.newLine();

  printer.drawLine();
  await printLogo(printer);

  printer.cut();

  try {
    await printer.execute();
  } catch (e) {
    logger.error("Failed to print reminder", e, { reminder });
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
  printer.alignCenter();
  await printer.printImage("./app/assets/logo.png");
}
