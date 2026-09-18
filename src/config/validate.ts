/**
 * config/validate.ts
 *
 * Validates that all required environment variables are present at startup.
 * Logs a warning for missing optional vars and throws for required ones.
 */

import logger from './logger';

interface EnvSpec {
  name: string;
  required: boolean;
  default?: string;
}

const ENV_SPEC: EnvSpec[] = [
  { name: 'PORT', required: false, default: '3000' },
  { name: 'NODE_ENV', required: false, default: 'development' },
  { name: 'API_KEY', required: true },
  { name: 'LOG_LEVEL', required: false, default: 'info' },
];

export function validateEnv(): void {
  const missing: string[] = [];

  for (const spec of ENV_SPEC) {
    if (!process.env[spec.name]) {
      if (spec.required) {
        missing.push(spec.name);
      } else if (spec.default) {
        process.env[spec.name] = spec.default;
        logger.debug(`${spec.name} not set — using default: ${spec.default}`);
      }
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}