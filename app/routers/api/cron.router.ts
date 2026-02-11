import express from "express";
import cronstrue from "cronstrue";
import { requireQuery } from "../../middleware/require-query";
import { generateCron, isAiEnabled } from "../../utils/llm";

export const cronRouter = express.Router();

cronRouter.get("/", requireQuery("description"), async (req, res) => {
  const aiEnabled = await isAiEnabled();
  if (!aiEnabled) {
    return res
      .json({
        error:
          'AI usage is not enabled. Provide a valid vercel API key in the "AI_GATEWAY_API_KEY" environment variable and turn on the "AI Enabled" setting on the admin settings page.',
      })
      .status(403);
  }

  const description = req.query.description!.toString();
  try {
    const cron = await generateCron(description);
    const explanation = cronstrue.toString(cron);
    return res.json({ cron, explanation });
  } catch (e) {
    return res.json({ error: "An unexpected error has occured" }).status(500);
  }
});
