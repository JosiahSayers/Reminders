import { generateText } from "ai";
import cronstrue from "cronstrue";
import { validateCronExpression } from "cron";
import { logger } from "./logger";

export async function generateCron(description: string) {
  let outputIsValid = false;
  let iteration = 1;

  while (!outputIsValid && iteration < 5) {
    const prompt = `Given the following description generate a cron string. Return only the cron string with no other text. The description is: ${description}`;
    const response = await generateText({
      model: "anthropic/claude-haiku-4.5",
      prompt,
    });
    const { valid } = validateCronExpression(response.text);
    const explanation = cronstrue.toString(response.text);

    if (valid) {
      logger.info("Successfully generated a cron expression", {
        description,
        prompt,
        generatedCron: response.text,
        numberOfTries: iteration,
        explanation,
      });
      return response.text;
    } else {
      logger.info("Failed to generate a valid cron expression", {
        description,
        prompt,
        generatedCron: response.text,
        numberOfTries: iteration,
      });
      iteration += 1;
    }
  }

  logger.error(
    "Gave up trying to generate a valid cron expression after 5 tries",
    { description }
  );
  throw new Error("Unable to generate cron string from the given description");
}

export function isAiEnabled(): boolean {
  const apiKey = Bun.env.AI_GATEWAY_API_KEY;
  return !!apiKey;
}
