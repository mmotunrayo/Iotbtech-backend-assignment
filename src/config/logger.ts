/**
 * config/logger.ts
 *
 * Creates and exports the application-wide Winston logger.
 * Transports:
 *   - Console (colourised in development, plain in production)
 *   - Combined log file  → logs/combined.log
 *   - Error-only file    → logs/error.log
 */

import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure the logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const { combine, timestamp, printf, colorize, errors } = winston.format;

/** Custom log line format for the console. */
const consoleFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return stack
    ? `${ts} [${level}]: ${message}\n${stack}`
    : `${ts} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
  transports: [
    // Console — colourised in dev
    new winston.transports.Console({
      format: combine(colorize(), consoleFormat),
    }),
    // All logs → combined.log
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: winston.format.json(),
    }),
    // Errors only → error.log
    new winston.transports.File({
      level: 'error',
      filename: path.join(logsDir, 'error.log'),
      format: winston.format.json(),
    }),
  ],
});

export default logger;
