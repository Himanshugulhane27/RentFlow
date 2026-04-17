/**
 * Lightweight request logger for Lambda functions.
 * Logs incoming method, path, and execution time so we can
 * debug issues in CloudWatch without adding a heavy dependency.
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL] || LOG_LEVELS.INFO;

const formatTimestamp = () => new Date().toISOString();

const log = (level, message, meta = {}) => {
  if (LOG_LEVELS[level] < currentLevel) return;

  const entry = {
    timestamp: formatTimestamp(),
    level,
    message,
    ...meta
  };

  const output = JSON.stringify(entry);

  switch (level) {
    case 'ERROR':
      console.error(output);
      break;
    case 'WARN':
      console.warn(output);
      break;
    default:
      console.log(output);
  }
};

const logger = {
  debug: (msg, meta) => log('DEBUG', msg, meta),
  info: (msg, meta) => log('INFO', msg, meta),
  warn: (msg, meta) => log('WARN', msg, meta),
  error: (msg, meta) => log('ERROR', msg, meta),

  /**
   * Wraps a Lambda handler to automatically log request/response info
   * and measure execution duration.
   */
  withRequestLogging: (handler) => async (event, context) => {
    const start = Date.now();
    const { httpMethod, path, pathParameters } = event;

    logger.info('Incoming request', {
      method: httpMethod,
      path,
      pathParameters,
      requestId: context?.awsRequestId
    });

    try {
      const response = await handler(event, context);

      logger.info('Request completed', {
        method: httpMethod,
        path,
        statusCode: response.statusCode,
        durationMs: Date.now() - start
      });

      return response;
    } catch (err) {
      logger.error('Unhandled error in handler', {
        method: httpMethod,
        path,
        error: err.message,
        stack: err.stack,
        durationMs: Date.now() - start
      });
      throw err;
    }
  }
};

module.exports = logger;
