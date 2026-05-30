import { prisma } from "../../prisma/db";
import type { Configuration, Setting } from "../../prisma/generated/client";
import { createQuoteJob, stopQuoteJob } from "./jobs";

interface InitializeQuotesArgs {
  setting?: Setting;
  configuration?: Configuration;
}

export async function initializeQuotes({
  setting,
  configuration,
}: InitializeQuotesArgs = {}) {
  const quoteSetting =
    setting ||
    (await prisma.setting.findUnique({
      where: { name: "Send Quotes" },
    }));
  const quoteCron =
    configuration ||
    (await prisma.configuration.findUnique({
      where: { name: "Quote CRON" },
    }));

  if (quoteSetting?.enabled && quoteCron?.value) {
    createQuoteJob(quoteCron.value);
  } else {
    stopQuoteJob();
  }
}
