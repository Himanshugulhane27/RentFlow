/**
 * Standardized API response builders.
 *
 * Every response goes through here so we never accidentally forget
 * CORS headers or return an inconsistent JSON shape. The frontend
 * relies on { success, data } and { success, error } — if we break
 * that contract, the whole UI blows up.
 */

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

const success = (data, statusCode = 200) => ({
  statusCode,
  headers: CORS_HEADERS,
  body: JSON.stringify({ success: true, data })
});

const created = (data) => success(data, 201);

const error = (message, statusCode = 400) => ({
  statusCode,
  headers: CORS_HEADERS,
  body: JSON.stringify({ success: false, error: message })
});

const notFound = (resource = 'Resource') =>
  error(`${resource} not found`, 404);

const noContent = () => ({
  statusCode: 204,
  headers: CORS_HEADERS,
  body: ''
});

module.exports = { success, created, error, notFound, noContent, CORS_HEADERS };