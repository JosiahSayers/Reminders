import type { NextFunction, Request, Response } from "express";

export const requireQuery =
  (...requiredNames: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    for (const requiredName of requiredNames) {
      if (!req.query[requiredName]) {
        return res
          .json({
            error: `The required query parameter "${requiredName}" was not sent.`,
          })
          .status(400);
      }
    }

    next();
  };
