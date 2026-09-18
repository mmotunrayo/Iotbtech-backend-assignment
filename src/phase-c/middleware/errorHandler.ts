/**
 * middleware/errorHandler.ts
 *
 * Global Express error-handling middleware (4-argument signature).
 * Catches anything passed via next(err) and returns a structured JSON response.
 */

import { Request, Response, NextFunction } from 'express';
import logger from '../../config/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err.statusCode ?? 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Always log the full error
  logger.error(`${req.method} ${req.originalUrl} — ${err.message}`, { stack: err.stack });

  res.status(statusCode).json({
    error: err.name ?? 'InternalServerError',
    message: err.message ?? 'An unexpected error occurred',
    // Hide stack traces in production
    ...(isProduction ? {} : { stack: err.stack }),
  });
}
