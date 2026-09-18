/**
 * config/errors.ts
 *
 * AppError — operational error class with an HTTP status code.
 * Throw this anywhere in the app and the global errorHandler will
 * format it correctly.
 *
 * Example:
 *   throw new AppError('Reading not found', 404);
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}
