/**
 * phase-b/services/reading.service.ts
 *
 * Business logic and in-memory data store for sensor readings.
 * Framework-agnostic — no req/res here.
 */

import { v4 as uuidv4 } from 'uuid';
import {
  SensorReading,
  CreateReadingDto,
  ReadingStats,
  PaginatedResult,
} from '../types/reading.types';

// ---------------------------------------------------------------------------
// In-memory store (replaces a real database for this assignment)
// ---------------------------------------------------------------------------

let store: SensorReading[] = [];

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

/** Return a paginated list of all readings. */
export function getAllReadings(page = 1, limit = 20): PaginatedResult<SensorReading> {
  const total = store.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = store.slice(start, start + limit);

  return { data, total, page, limit, totalPages };
}

/** Find a single reading by ID. Returns undefined if not found. */
export function getReadingById(id: string): SensorReading | undefined {
  return store.find((r) => r.id === id);
}

/** Create and persist a new reading. */
export function createReading(dto: CreateReadingDto): SensorReading {
  const reading: SensorReading = {
    id: uuidv4(),
    sensorId: dto.sensorId,
    timestamp: new Date().toISOString(),
    temperature: dto.temperature,
    humidity: dto.humidity,
    pressure: dto.pressure,
  };

  store.push(reading);
  return reading;
}

/** Delete a reading by ID. Returns true if deleted, false if not found. */
export function deleteReading(id: string): boolean {
  const index = store.findIndex((r) => r.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
}

/** Compute per-sensor aggregated statistics. */
export function getStats(): ReadingStats[] {
  const map = new Map<string, { count: number; temp: number[]; hum: number[]; pres: number[] }>();

  for (const r of store) {
    if (!map.has(r.sensorId)) {
      map.set(r.sensorId, { count: 0, temp: [], hum: [], pres: [] });
    }
    const entry = map.get(r.sensorId)!;
    entry.count++;
    entry.temp.push(r.temperature);
    entry.hum.push(r.humidity);
    entry.pres.push(r.pressure);
  }

  return [...map.entries()].map(([sensorId, d]) => ({
    sensorId,
    count: d.count,
    temperature: {
      min: Math.min(...d.temp),
      max: Math.max(...d.temp),
      avg: parseFloat((d.temp.reduce((a, b) => a + b, 0) / d.count).toFixed(2)),
    },
    humidity: {
      min: Math.min(...d.hum),
      max: Math.max(...d.hum),
      avg: parseFloat((d.hum.reduce((a, b) => a + b, 0) / d.count).toFixed(2)),
    },
    pressure: {
      min: Math.min(...d.pres),
      max: Math.max(...d.pres),
      avg: parseFloat((d.pres.reduce((a, b) => a + b, 0) / d.count).toFixed(2)),
    },
  }));
}

/** Seed a few initial readings so the API is not empty on first start. */
export function seedStore(): void {
  const sensors = ['SENSOR-01', 'SENSOR-02', 'SENSOR-03'];
  for (let i = 0; i < 15; i++) {
    createReading({
      sensorId: sensors[i % sensors.length],
      temperature: parseFloat((Math.random() * 30 + 15).toFixed(2)),
      humidity: parseFloat((Math.random() * 60 + 20).toFixed(2)),
      pressure: parseFloat((Math.random() * 45 + 980).toFixed(2)),
    });
  }
}
