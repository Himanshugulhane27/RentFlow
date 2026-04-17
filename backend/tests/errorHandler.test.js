const { AppError, NotFoundError, ValidationError, handleError } = require('../src/utils/errorHandler');

// Mock the logger so tests don't spam console output
jest.mock('../src/utils/logger', () => ({
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
}));

describe('Error Handler', () => {
  describe('AppError', () => {
    test('creates an operational error with custom status code', () => {
      const err = new AppError('Something went wrong', 400);
      expect(err.message).toBe('Something went wrong');
      expect(err.statusCode).toBe(400);
      expect(err.isOperational).toBe(true);
      expect(err.name).toBe('AppError');
    });

    test('defaults to 400 status code when not specified', () => {
      const err = new AppError('Bad input');
      expect(err.statusCode).toBe(400);
    });

    test('is an instance of Error', () => {
      const err = new AppError('test');
      expect(err).toBeInstanceOf(Error);
    });
  });

  describe('NotFoundError', () => {
    test('creates a 404 error with resource name', () => {
      const err = new NotFoundError('Property');
      expect(err.message).toBe('Property not found');
      expect(err.statusCode).toBe(404);
      expect(err.name).toBe('NotFoundError');
      expect(err.isOperational).toBe(true);
    });

    test('defaults to "Resource" when no name given', () => {
      const err = new NotFoundError();
      expect(err.message).toBe('Resource not found');
    });
  });

  describe('ValidationError', () => {
    test('creates a 422 error for validation failures', () => {
      const err = new ValidationError('Email is invalid');
      expect(err.message).toBe('Email is invalid');
      expect(err.statusCode).toBe(422);
      expect(err.name).toBe('ValidationError');
    });
  });

  describe('handleError', () => {
    test('returns structured response for operational errors', () => {
      const err = new AppError('Invalid rent value', 400);
      const response = handleError(err);

      expect(response.statusCode).toBe(400);
      expect(response.headers['Access-Control-Allow-Origin']).toBe('*');

      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Invalid rent value');
      expect(body.code).toBe('AppError');
    });

    test('returns 500 with masked message for unexpected errors', () => {
      const err = new Error('Database connection pool exhausted');
      const response = handleError(err);

      expect(response.statusCode).toBe(500);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Internal server error');
      expect(body.code).toBe('INTERNAL_ERROR');
      // Should NOT leak the real error message to the client
      expect(body.error).not.toContain('Database');
    });

    test('includes CORS headers in error responses', () => {
      const err = new AppError('test', 400);
      const response = handleError(err);

      expect(response.headers['Content-Type']).toBe('application/json');
      expect(response.headers['Access-Control-Allow-Origin']).toBe('*');
      expect(response.headers['Access-Control-Allow-Methods']).toContain('GET');
    });
  });
});
