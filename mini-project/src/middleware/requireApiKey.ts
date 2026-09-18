/**
 * src/middleware/requireApiKey.ts
 *
 * Validates the x-api-key header against the API_KEY env variable.
 * Returns 401 if missing or incorrect.
 */

import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export function requireApiKey(req: Request, res: Response, next: NextFunction): void {
  const expected = process.env.API_KEY;

  if (!expected) {
    logger.error("API_KEY env variable is not configured");
    res.status(500).json({ error: "Server misconfiguration: API_KEY not set" });
    return;
  }

  const provided = req.headers["x-api-key"];

  if (!provided || provided !== expected) {
    logger.warn(`Unauthorized: ${req.method} ${req.originalUrl}`);
    res.status(401).json({ error: "Unauthorized", message: "Invalid or missing x-api-key header" });
    return;
  }

  next();
}