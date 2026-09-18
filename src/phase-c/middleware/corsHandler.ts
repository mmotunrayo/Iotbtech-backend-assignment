/**
 * phase-c/middleware/corsHandler.ts
 *
 * Applies CORS headers to allow cross-origin requests from configured origins.
 * Uses the cors npm package; origin is read from the CORS_ORIGIN env variable.
 *
 * In development, all origins are allowed (*).
 * In production, set CORS_ORIGIN to your frontend domain.
 */

import cors from 'cors';

const origin = process.env['CORS_ORIGIN'] ?? '*';

export const corsHandler = cors({
  origin,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
});