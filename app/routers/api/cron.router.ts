import express from "express";
import cronstrue from "cronstrue";
import { requireQuery } from "../../middleware/require-query";
import { generateCron } from "../../utils/llm";

export const cronRouter = express.Router();

cronRouter.get("/", requireQuery("description"), async (req, res) => {
  const description = req.query.description!.toString();
  try {
    const cron = await generateCron(description);
    const explanation = cronstrue.toString(cron);
    return res.json({ cron, explanation });
  } catch (e) {
    return res.json({ error: "An unexpected error has occured" }).status(500);
  }
});
