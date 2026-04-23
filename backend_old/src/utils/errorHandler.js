/**
 * Error handling utilities.
 *
 * AppError is for errors we expect and want to show to the user
 * (validation failures, not-found, etc). Everything else gets logged
 * and masked as "Internal server error" so we don't leak stack traces
 * or database details to the client.
 */

const logger = require('./logger');

class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.name = 'AppError';
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 422);
    this.name = 'ValidationError';
  }
}

const handleError = (error) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  };

  if (error.isOperational) {
    logger.warn('Operational error', {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode
    });

    return {
      statusCode: error.statusCode,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        code: error.name
      })
    };
  }

  // Unexpected errors — log full details but mask the response
  logger.error('Unexpected error', {
    message: error.message,
    stack: error.stack
  });

  return {
    statusCode: 500,
    headers,
    body: JSON.stringify({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  };
};

module.exports = { AppError, NotFoundError, ValidationError, handleError };