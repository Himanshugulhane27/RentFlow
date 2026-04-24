import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/environment';
import { connectDatabase } from './config/database';
import { corsOptions } from './config/cors';
import { rateLimiter } from './middleware/rateLimiter.middleware';
import { requestLogger } from './middleware/requestLogger.middleware';
import { errorHandler } from './middleware/errorHandler.middleware';
import routes from './routes';
import { logger } from './utils/logger';
import { initScheduler } from './config/scheduler';
import { closeQueues } from './config/queue';

const app = express();

// ─── Security ───────────────────────────────────────────────
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet());
app.use(rateLimiter);

// ─── Body parsing ───────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ────────────────────────────────────────────────
app.use(requestLogger);

// ─── Routes ─────────────────────────────────────────────────
app.use('/api/v1', routes);

// ─── 404 handler ────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ─── Error handler (must be last) ───────────────────────────
app.use(errorHandler);

// ─── Start server ───────────────────────────────────────────
const startServer = async () => {
  await connectDatabase();

  // Start background jobs (overdue payments, reminders)
  initScheduler();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    logger.info(`📡 API: http://localhost:${env.PORT}/api/v1/health`);
  });

  // ─── Graceful Shutdown ──────────────────────────────────
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await closeQueues();
      logger.info('Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((err) => {
  logger.error('Failed to start server', { error: err.message });
  process.exit(1);
});

export default app;
