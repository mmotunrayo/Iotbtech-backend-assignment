/**
 * src/utils/logger.ts
 *
 * Application-wide Winston logger.
 * Transports: colourised console + combined.log + error.log file.
 */

import winston from "winston";
import fs from "fs";
import path from "path";

const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const { combine, timestamp, printf, colorize, errors } = winston.format;

const consoleFmt = printf(({ level, message, timestamp: ts, stack }) =>
  stack ? `${ts} [${level}]: ${message}\n${stack}` : `${ts} [${level}]: ${message}`
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? "info",
  format: combine(errors({ stack: true }), timestamp({ format: "YYYY-MM-DD HH:mm:ss" })),
  transports: [
    new winston.transports.Console({ format: combine(colorize(), consoleFmt) }),
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      format: winston.format.json(),
    }),
    new winston.transports.File({
      level: "error",
      filename: path.join(logsDir, "error.log"),
      format: winston.format.json(),
    }),
  ],
});

export default logger;