/**
 * src/index.ts  — Phase B + C
 *
 * Boots the Express application:
 *   - Applies global middleware (CORS, JSON parser, requestLogger)
 *   - Mounts /api/products router
 *   - Applies notFoundHandler and errorHandler last
 *   - Seeds the in-memory store and starts the server
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import logger from "./utils/logger";
import { requestLogger } from "./middleware/requestLogger";
import { notFoundHandler } from "./middleware/notFoundHandler";
import { errorHandler } from "./middleware/errorHandler";
import productRouter from "./routes/product.routes";
import { seed } from "./services/product.service";

const app = express();
const PORT = parseInt(process.env["PORT"] ?? "3000", 10);

// ---------------------------------------------------------------------------
// Middleware pipeline
// ---------------------------------------------------------------------------
app.use(cors({ origin: process.env["CORS_ORIGIN"] ?? "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------
app.use("/api/products", productRouter);

// ---------------------------------------------------------------------------
// 404 + global error handler (must be last)
// ---------------------------------------------------------------------------
app.use(notFoundHandler);
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
seed();

const server = app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
  logger.info(`Environment : ${process.env["NODE_ENV"] ?? "development"}`);
});

export { app, server };