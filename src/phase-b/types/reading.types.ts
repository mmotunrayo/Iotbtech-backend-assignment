/**
 * Shared TypeScript types for the Readings resource.
 */

export interface SensorReading {
  id: string;
  sensorId: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  pressure: number;
}

export interface CreateReadingDto {
  sensorId: string;
  temperature: number;
  humidity: number;
  pressure: number;
}

export interface ReadingStats {
  sensorId: string;
  count: number;
  temperature: { min: number; max: number; avg: number };
  humidity: { min: number; max: number; avg: number };
  pressure: { min: number; max: number; avg: number };
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
