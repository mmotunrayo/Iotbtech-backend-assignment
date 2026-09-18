/**
 * src/index.ts
 *
 * Application entry point.
 * Boots Express, wires middleware and routes, starts the HTTP server.
 */

import "dotenv/config";
import express from "express";
import logger from "./config/logger";
import { validateEnv } from "./config/validate";
import { corsHandler } from "./phase-c/middleware/corsHandler";
import { requestLogger } from "./phase-c/middleware/requestLogger";
import { notFoundHandler } from "./phase-c/middleware/notFoundHandler";
import { errorHandler } from "./phase-c/middleware/errorHandler";
import readingRouter from "./phase-b/routes/reading.routes";
import healthRouter from "./phase-b/routes/health.routes";
import { seedStore } from "./phase-b/services/reading.service";

// Validate required env vars before anything else
validateEnv();

const app = express();
const PORT = parseInt(process.env["PORT"] ?? "3000", 10);

// ---------------------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------------------
app.use(corsHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use("/health", healthRouter);
app.use("/api", readingRouter);

// ---------------------------------------------------------------------------
// 404 and Error handlers (must be last)
// ---------------------------------------------------------------------------
app.use(notFoundHandler);
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
seedStore();

app.listen(PORT, () => {
  logger.info(`Server listening on http://localhost:${PORT}`);
  logger.info(`Environment: ${process.env["NODE_ENV"] ?? "development"}`);
});

export default app;