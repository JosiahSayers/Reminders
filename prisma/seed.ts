import cronstrue from "cronstrue";
import { prisma } from "./db";

async function main() {
  await prisma.reminder.createManyAndReturn({
    data: [
      {
        title: "30 Seconds",
        content: "This reminder should run every 30 seconds",
        cron: "*/30 * * * * *",
        cronExplanation: cronstrue.toString("*/30 * * * * *"),
      },
      {
        title: "2 minutes",
        content: "This reminder should run every 2 minutes",
        cron: "*/2 * * * *",
        cronExplanation: cronstrue.toString("*/2 * * * *"),
      },
    ],
  });

  console.log("Seed data inserted!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
