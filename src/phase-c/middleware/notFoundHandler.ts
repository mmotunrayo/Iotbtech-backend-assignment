/**
 * middleware/notFoundHandler.ts
 *
 * Catches any request that did not match a registered route and
 * returns a structured 404 JSON response.
 */

import { Request, Response, NextFunction } from 'express';
import logger from '../../config/logger';

export function notFoundHandler(req: Request, res: Response, _next: NextFunction): void {
  logger.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
}
