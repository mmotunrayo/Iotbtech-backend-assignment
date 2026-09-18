/**
 * src/middleware/requestLogger.ts
 *
 * Logs every HTTP request: method, URL, status code, and response time.
 */

import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;
    const msg = `${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`;
    if (res.statusCode >= 500) logger.error(msg);
    else if (res.statusCode >= 400) logger.warn(msg);
    else logger.http(msg);
  });

  next();
}