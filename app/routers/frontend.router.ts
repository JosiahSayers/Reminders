import { Router } from "express";
import request from "request";
import indexPage from "../../frontend/index.html";

export const frontendRouter = Router();

const bunPort = Number(Bun.env.PORT) + 1;
Bun.serve({
  port: bunPort,
  routes: {
    "/favicon.ico": new Response(
      await Bun.file("./frontend/favicon.ico").bytes(),
      {
        headers: {
          "Content-Type": "image/x-icon",
        },
      }
    ),
    "/*": indexPage,
  },
  development: Bun.env.NODE_ENV === "development",
});

frontendRouter.use("*path", (req, res) => {
  const url = `http://127.0.0.1:${bunPort}${req.originalUrl}`;
  req.pipe(request(url)).pipe(res);
});
