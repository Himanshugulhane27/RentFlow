/**
 * Application configuration.
 *
 * Centralizes all environment-dependent values so we don't have
 * process.env scattered across dozens of files. Also makes it easy
 * to see at a glance what env vars the backend requires.
 */

module.exports = {
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    stage: process.env.STAGE || 'dev'
  },
  tables: {
    properties: process.env.PROPERTIES_TABLE,
    tenants: process.env.TENANTS_TABLE,
    leases: process.env.LEASES_TABLE,
    payments: process.env.PAYMENTS_TABLE
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    headers: ['Content-Type', 'Authorization', 'X-Request-Id'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  },
  pagination: {
    defaultLimit: Number(process.env.PAGE_SIZE) || 20,
    maxLimit: 100
  }
};