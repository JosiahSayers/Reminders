import { Router } from "express";
import { Readable } from "stream";
import indexPage from "../../frontend/index.html";

export const frontendRouter = Router();

if (!Bun.env.NODE_ENV || Bun.env.NODE_ENV === "development") {
  const bunPort = Number(Bun.env.PORT) + 1;
  Bun.serve({
    port: bunPort,
    routes: {
      "/": indexPage,
    },
  });

  frontendRouter.get("*path", async (req, res) => {
    const resource = new URL(`http://localhost:${bunPort}${req.path}`);
    resource.port = bunPort.toString();
    const data = await fetch(resource);
    Readable.fromWeb(data.body as any).pipe(res);
  });
}
