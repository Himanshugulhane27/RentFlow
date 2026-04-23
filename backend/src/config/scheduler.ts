import cron from 'node-cron';
import { logger } from '../utils/logger';
import { paymentProcessorService } from '../services/paymentProcessor.service';

let useQueue = false;

/**
 * Try to initialize the BullMQ queue system.
 * If Redis is unavailable, fall back to direct cron processing.
 */
const tryInitQueue = async (): Promise<void> => {
  try {
    const { getRedisConnection } = await import('./queue');
    const redis = getRedisConnection();

    // Test connection with a 3-second timeout
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Redis connection timeout')), 3000);

      if (redis.status === 'ready') {
        clearTimeout(timeout);
        resolve();
        return;
      }

      redis.once('ready', () => {
        clearTimeout(timeout);
        resolve();
      });

      redis.once('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    // Redis connected — start worker
    const { initPaymentWorker } = await import('../queues/payment.worker');
    initPaymentWorker();
    useQueue = true;
    logger.info('[Scheduler] BullMQ queue system initialized (Redis connected)');
  } catch {
    useQueue = false;
    logger.warn('[Scheduler] Redis unavailable — falling back to direct cron processing');
  }
};

/**
 * Initialize all scheduled background jobs.
 * Call this once after the database connection is established.
 */
export const initScheduler = async (): Promise<void> => {
  logger.info('[Scheduler] Initializing background jobs...');

  // Try queue-based processing first
  await tryInitQueue();

  // ─── Daily: Process overdue payments (8:00 AM) ────────
  cron.schedule('0 8 * * *', async () => {
    logger.info('[Scheduler] Running daily overdue payment scan...');
    try {
      if (useQueue) {
        const { queueOverdueScan } = await import('../queues/payment.queue');
        await queueOverdueScan();
        logger.info('[Scheduler] Overdue scan job queued');
      } else {
        // Direct processing fallback
        const result = await paymentProcessorService.processOverduePayments();
        logger.info(`[Scheduler] Overdue scan done — ${result.markedOverdue} marked`);
      }
    } catch (err) {
      logger.error(`[Scheduler] Overdue scan failed: ${(err as Error).message}`);
    }
  });

  // ─── Daily: Payment reminders (9:00 AM) ───────────────
  cron.schedule('0 9 * * *', async () => {
    logger.info('[Scheduler] Running payment reminders...');
    try {
      if (useQueue) {
        const { queuePaymentReminders } = await import('../queues/payment.queue');
        await queuePaymentReminders();
        logger.info('[Scheduler] Reminder job queued');
      } else {
        const count = await paymentProcessorService.sendPaymentReminders();
        logger.info(`[Scheduler] Sent ${count} reminder(s) directly`);
      }
    } catch (err) {
      logger.error(`[Scheduler] Reminders failed: ${(err as Error).message}`);
    }
  });

  logger.info(`[Scheduler] Background jobs initialized (mode: ${useQueue ? 'queue' : 'direct'})`);
};
