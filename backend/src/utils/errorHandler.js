class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

const handleError = (error) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  if (error.isOperational) {
    return {
      statusCode: error.statusCode,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }

  console.error('Unexpected error:', error);
  return {
    statusCode: 500,
    headers,
    body: JSON.stringify({ success: false, error: 'Internal server error' })
  };
};

module.exports = { AppError, handleError };