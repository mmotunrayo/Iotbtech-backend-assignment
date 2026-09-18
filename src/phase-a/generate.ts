/**
 * Phase A — generate.ts
 *
 * Generates a CSV file containing simulated IoT sensor readings.
 * Each row has: id, sensorId, timestamp, temperature, humidity, pressure
 *
 * Usage:
 *   npx ts-node src/phase-a/generate.ts
 *   npm run generate
 */

import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SensorReading {
  id: number;
  sensorId: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  pressure: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns a random float between min and max, rounded to `decimals` places. */
function randomFloat(min: number, max: number, decimals = 2): number {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(decimals));
}

/** Returns an ISO-8601 timestamp offset by `offsetMs` milliseconds from `base`. */
function isoTimestamp(base: Date, offsetMs: number): string {
  return new Date(base.getTime() + offsetMs).toISOString();
}

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

const SENSOR_IDS = ['SENSOR-01', 'SENSOR-02', 'SENSOR-03', 'SENSOR-04', 'SENSOR-05'];
const TOTAL_ROWS = 1000;
const INTERVAL_MS = 60_000; // one reading per minute

/**
 * Generates an array of simulated sensor readings.
 * Readings are spread across 5 sensors over a rolling time window.
 */
function generateReadings(count: number): SensorReading[] {
  const base = new Date();
  const readings: SensorReading[] = [];

  for (let i = 0; i < count; i++) {
    const sensorId = SENSOR_IDS[i % SENSOR_IDS.length];
    const offsetMs = i * INTERVAL_MS;

    readings.push({
      id: i + 1,
      sensorId,
      timestamp: isoTimestamp(base, offsetMs),
      temperature: randomFloat(15, 45),     // °C
      humidity: randomFloat(20, 90),         // %
      pressure: randomFloat(980, 1025),      // hPa
    });
  }

  return readings;
}

/**
 * Serialises an array of readings to CSV format.
 */
function toCsv(readings: SensorReading[]): string {
  const header = 'id,sensorId,timestamp,temperature,humidity,pressure';

  const rows = readings.map(
    (r) =>
      `${r.id},${r.sensorId},${r.timestamp},${r.temperature},${r.humidity},${r.pressure}`,
  );

  return [header, ...rows].join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const outputDir = path.join(__dirname, 'data');
  const outputPath = path.join(outputDir, 'sensor_readings.csv');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Generating ${TOTAL_ROWS} sensor readings…`);

  const readings = generateReadings(TOTAL_ROWS);
  const csv = toCsv(readings);

  fs.writeFileSync(outputPath, csv, 'utf-8');

  console.log(`✓ CSV written to: ${outputPath}`);
  console.log(`  Rows   : ${readings.length}`);
  console.log(`  Sensors: ${SENSOR_IDS.join(', ')}`);
}

main();
