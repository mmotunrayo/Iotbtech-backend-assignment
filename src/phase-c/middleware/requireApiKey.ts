/**
 * middleware/requireApiKey.ts
 *
 * Validates the `x-api-key` header against the API_KEY environment variable.
 * Returns 401 if the header is missing or does not match.
 */

import { Request, Response, NextFunction } from 'express';
import logger from '../../config/logger';

export function requireApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    logger.warn('API_KEY environment variable is not set — all requests will be rejected');
    res.status(500).json({ error: 'Server misconfiguration: API_KEY not set' });
    return;
  }

  const provided = req.headers['x-api-key'];

  if (!provided || provided !== apiKey) {
    logger.warn(`Unauthorized request to ${req.method} ${req.originalUrl} — invalid or missing API key`);
    res.status(401).json({ error: 'Unauthorized: invalid or missing API key' });
    return;
  }

  next();
}
