/**
 * phase-b/routes/reading.routes.ts
 *
 * Mounts reading resource routes under /api.
 * Protected routes require a valid x-api-key header.
 */

import { Router } from 'express';
import { requireApiKey } from '../../phase-c/middleware/requireApiKey';
import {
  listReadings,
  getReading,
  createReading,
  deleteReading,
  getStats,
} from '../controllers/reading.controller';

const router = Router();

// Public read endpoints
router.get('/readings', listReadings);
router.get('/readings/:id', getReading);

// Stats endpoint — public
router.get('/stats', getStats);

// Write endpoints — require API key
router.post('/readings', requireApiKey, createReading);
router.delete('/readings/:id', requireApiKey, deleteReading);

export default router;
