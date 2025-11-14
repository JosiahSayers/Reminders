import { validateCronExpression } from "cron";
import { generateCron } from "../app/utils/llm";

const prompt = "Describe when you want the reminder to happen: ";
process.stdout.write(prompt);
for await (const line of console) {
  const cronExpression = await generateCron(line);
  const { valid, error } = validateCronExpression(cronExpression);
  if (valid) {
    console.log(
      `The expression generated is: ${cronExpression} and it is valid`
    );
  } else {
    console.log(
      `The expression generated is ${cronExpression} and it is not valid for the following reason: ${error}`
    );
  }
  break;
}
