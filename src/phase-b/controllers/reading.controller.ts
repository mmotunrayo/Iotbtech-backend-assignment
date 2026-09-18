/**
 * phase-b/controllers/reading.controller.ts
 *
 * Handles HTTP request/response for the readings resource.
 * Calls service functions — contains NO business logic itself.
 */

import { Request, Response, NextFunction } from 'express';
import * as ReadingService from '../services/reading.service';
import { CreateReadingDto } from '../types/reading.types';

// GET /api/readings?page=1&limit=20
export function listReadings(req: Request, res: Response, next: NextFunction): void {
  try {
    const page = Math.max(1, parseInt(req.query['page'] as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query['limit'] as string) || 20));
    const result = ReadingService.getAllReadings(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// GET /api/readings/:id
export function getReading(req: Request, res: Response, next: NextFunction): void {
  try {
    const reading = ReadingService.getReadingById(req.params['id']!);
    if (!reading) {
      res.status(404).json({ error: 'Not Found', message: `Reading ${req.params['id']} not found` });
      return;
    }
    res.json(reading);
  } catch (err) {
    next(err);
  }
}

// POST /api/readings
export function createReading(req: Request, res: Response, next: NextFunction): void {
  try {
    const { sensorId, temperature, humidity, pressure } = req.body as CreateReadingDto;

    // Basic validation
    if (!sensorId || temperature === undefined || humidity === undefined || pressure === undefined) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'sensorId, temperature, humidity, and pressure are required',
      });
      return;
    }

    const reading = ReadingService.createReading({ sensorId, temperature, humidity, pressure });
    res.status(201).json(reading);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/readings/:id
export function deleteReading(req: Request, res: Response, next: NextFunction): void {
  try {
    const deleted = ReadingService.deleteReading(req.params['id']!);
    if (!deleted) {
      res.status(404).json({ error: 'Not Found', message: `Reading ${req.params['id']} not found` });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// GET /api/stats
export function getStats(_req: Request, res: Response, next: NextFunction): void {
  try {
    const stats = ReadingService.getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}
