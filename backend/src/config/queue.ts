import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { env } from './environment';
import { logger } from '../utils/logger';

// ─── Redis Connection ───────────────────────────────────────
let redisConnection: IORedis | null = null;

export const getRedisConnection = (): IORedis => {
  if (!redisConnection) {
    redisConnection = new IORedis(env.REDIS_URL, {
      maxRetriesPerRequest: null, // Required by BullMQ
      enableReadyCheck: false,
      retryStrategy: (times) => {
        if (times > 3) return null; // Stop retrying after 3 attempts
        return Math.min(times * 50, 2000);
      },
    });

    redisConnection.on('connect', () => {
      logger.info('[Redis] Connected successfully');
    });

    let errorLogged = false;
    redisConnection.on('error', (err) => {
      if (!errorLogged) {
        logger.error(`[Redis] Connection error: ${err.message}`);
        errorLogged = true;
      }
    });
  }
  return redisConnection;
};

// ─── Queue Factory ──────────────────────────────────────────
export const createQueue = <T>(name: string): Queue<T> => {
  return new Queue<T>(name, {
    connection: getRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000, // 5s, 10s, 20s
      },
      removeOnComplete: {
        count: 100, // Keep last 100 completed jobs
      },
      removeOnFail: {
        count: 500, // Keep last 500 failed jobs for debugging
      },
    },
  });
};

// ─── Worker Factory ─────────────────────────────────────────
export const createWorker = <T>(
  name: string,
  processor: (job: { id?: string; name: string; data: T; attemptsMade: number }) => Promise<void>
): Worker<T> => {
  const worker = new Worker<T>(name, processor, {
    connection: getRedisConnection(),
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 1000, // Max 10 jobs per second
    },
  });

  worker.on('completed', (job) => {
    logger.debug(`[Queue:${name}] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    logger.error(
      `[Queue:${name}] Job ${job?.id} failed (attempt ${job?.attemptsMade}): ${err.message}`
    );
  });

  worker.on('error', (err) => {
    logger.error(`[Queue:${name}] Worker error: ${err.message}`);
  });

  return worker;
};

// ─── Graceful Shutdown ──────────────────────────────────────
export const closeQueues = async (): Promise<void> => {
  if (redisConnection) {
    await redisConnection.quit();
    redisConnection = null;
    logger.info('[Redis] Connection closed');
  }
};
