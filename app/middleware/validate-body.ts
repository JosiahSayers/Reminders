import type { NextFunction, Request, Response } from "express";
import type { ZodObject } from "zod";
import { fromError } from "zod-validation-error";
import { logger } from "../utils/logger";

// export type ValidatedRequest<Body> = Request<any, any, Body>;

export interface ValidatedRequest<Body> extends Request<any, any, Body> {
  validatedBody: Body;
}

export const validateBody =
  <T extends ZodObject>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      // @ts-ignore we're modifying the request shape in this middleware
      req.validatedBody = parsed;
      next();
    } catch (e) {
      const validationError = fromError(e);
      logger.error("Request body validation error", {
        validationError,
        zodError: e,
        body: req.body,
      });
      return res.status(400).json({ errors: validationError.message });
    }
  };
