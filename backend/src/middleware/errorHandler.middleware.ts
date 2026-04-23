import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import { env } from '../config/environment';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Mongoose validation error
  if (err.name === 'ValidationError' && 'errors' in err) {
    const mongooseErr = err as { errors: Record<string, { message: string }> };
    const fieldErrors: Record<string, string[]> = {};
    for (const [field, detail] of Object.entries(mongooseErr.errors)) {
      fieldErrors[field] = [detail.message];
    }
    res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: fieldErrors,
    });
    return;
  }

  // Mongoose duplicate key
  if (err.name === 'MongoServerError' && 'code' in err && (err as { code: number }).code === 11000) {
    res.status(409).json({
      success: false,
      message: 'A record with this value already exists',
    });
    return;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
    return;
  }

  // Our custom operational errors
  if (err instanceof AppError) {
    const response: Record<string, unknown> = {
      success: false,
      message: err.message,
      code: err.code,
    };

    if (err instanceof ValidationError && err.errors) {
      response.errors = err.errors;
    }

    logger.warn('Operational error', {
      code: err.code,
      message: err.message,
      statusCode: err.statusCode,
    });

    res.status(err.statusCode).json(response);
    return;
  }

  // Unexpected errors — log full details, mask response
  logger.error('Unexpected error', {
    message: err.message,
    stack: err.stack,
    name: err.name,
  });

  res.status(500).json({
    success: false,
    message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    code: 'INTERNAL_ERROR',
  });
};
