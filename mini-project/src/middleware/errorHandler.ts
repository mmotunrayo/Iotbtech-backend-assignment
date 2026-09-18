/**
 * src/middleware/errorHandler.ts
 *
 * Global Express error handler (4-argument signature).
 * Catches all errors forwarded via next(err) and returns structured JSON.
 */

import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err.statusCode ?? 500;
  const isProd = process.env.NODE_ENV === "production";

  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, { stack: err.stack });

  res.status(status).json({
    error: err.name ?? "Error",
    message: err.message ?? "An unexpected error occurred",
    ...(isProd ? {} : { stack: err.stack }),
  });
}