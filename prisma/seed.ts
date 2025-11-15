import cronstrue from "cronstrue";
import { prisma } from "./db";

async function main() {
  await prisma.reminder.createManyAndReturn({
    data: [
      {
        title: "Vacuum Downstairs",
        content: `⠀⠀⢀⣤⠶⠟⠛⠛⠛⠛⠛⠛⠛⠷⠶⢤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢠⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢉⣠⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠸⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠙⢷⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣷⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠉⠛⠦⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢛⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⠙⠳⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣇⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⡇⠀⠀⠀⠀⠀⠀⠀⠀⢸⣇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠠⠀⠀⠀⠀⠀⠀⢀⣀⡈⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡀⠀⠀⠀⠀⠀
⠀⢠⣶⣶⣤⣤⣤⣤⣤⣀⣈⡙⠛⠻⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣇⠀⠀⠀⠀⠀
⠀⢸⣿⠿⠛⠋⠛⠻⣿⣿⣿⣿⣿⣶⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡀⠀⠀⠀⠀
⠀⢸⡏⢠⣾⣿⣿⣦⠈⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⣈⣀⠀⠀⠀⠀
⠀⠀⠃⠘⣿⣿⣿⠟⠀⠿⠿⠿⠿⠿⠃⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⣀⣀⣀⡀⠀`,
        cron: "*/30 * * * * *",
        cronExplanation: cronstrue.toString("*/30 * * * * *"),
      },
      {
        title: "Fold Laundry",
        content:
          "What's better than a clean closet full of ready to wear outfits?",
        cron: "*/2 * * * *",
        cronExplanation: cronstrue.toString("*/2 * * * *"),
      },
      {
        title: "Clean Downstairs Toilet",
        content:
          "It's that time again. The bowl is getting messy and nobody wants that.",
        cron: "0 18 * * 2",
        cronExplanation: cronstrue.toString("0 18 * * 2"),
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
