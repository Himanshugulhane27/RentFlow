import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { logger } from '../utils/logger';

/**
 * Structured request logging — assigns a unique request ID and logs
 * method, path, status code, and duration for every request.
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = crypto.randomUUID();
  const start = Date.now();

  // Attach request ID to headers for tracing
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-Id', requestId);

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: duration,
      userAgent: req.get('user-agent'),
      ip: req.ip,
      userId: req.user?.userId,
    };

    if (res.statusCode >= 500) {
      logger.error('Request failed', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Client error', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });

  next();
};
