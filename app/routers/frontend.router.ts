import { Router } from "express";
import request from "request";
import indexPage from "../../frontend/index.html";

export const frontendRouter = Router();

if (!Bun.env.NODE_ENV || Bun.env.NODE_ENV === "development") {
  const bunPort = Number(Bun.env.PORT) + 1;
  Bun.serve({
    port: bunPort,
    routes: {
      "/*": indexPage,
    },
  });

  frontendRouter.use("*path", (req, res) => {
    const url = `http://127.0.0.1:${bunPort}${req.originalUrl}`;
    req.pipe(request(url)).pipe(res);
  });
}
