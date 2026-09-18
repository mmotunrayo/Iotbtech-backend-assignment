/**
 * src/middleware/notFoundHandler.ts
 *
 * Catches unmatched routes and returns a structured 404 JSON response.
 */

import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  logger.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
  const err: any = new Error(`Cannot ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
}