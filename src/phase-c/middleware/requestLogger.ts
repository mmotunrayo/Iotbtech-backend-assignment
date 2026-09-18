/**
 * middleware/requestLogger.ts
 *
 * Logs every incoming HTTP request with method, URL, status code,
 * and response time in milliseconds using the Winston logger.
 */

import { Request, Response, NextFunction } from 'express';
import logger from '../../config/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  // Log when the response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} — ${duration}ms`;

    if (res.statusCode >= 500) {
      logger.error(message);
    } else if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.http(message);
    }
  });

  next();
}
