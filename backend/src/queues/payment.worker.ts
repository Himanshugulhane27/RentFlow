import { createWorker } from '../config/queue';
import { paymentProcessorService } from '../services/paymentProcessor.service';
import { logger } from '../utils/logger';
import type { PaymentJobData } from './payment.queue';

/**
 * Payment worker — processes jobs from the payment-processing queue.
 *
 * Job types:
 *   - scan-overdue:    Batch scan all orgs for overdue payments
 *   - send-reminders:  Send upcoming payment reminders
 *   - process-single:  Process one specific payment (e.g., triggered by webhook)
 */
export const initPaymentWorker = (): void => {
  // Worker reference kept alive by BullMQ internally via event listeners
  createWorker<PaymentJobData>(
    'payment-processing',
    async (job) => {
      const { data } = job;

      logger.info(
        `[PaymentWorker] Processing job ${job.id} (type: ${data.type}, attempt: ${job.attemptsMade + 1})`
      );

      switch (data.type) {
        case 'scan-overdue': {
          const result = await paymentProcessorService.processOverduePayments();
          logger.info(
            `[PaymentWorker] Overdue scan complete — ${result.markedOverdue} marked, ${result.lateFeesApplied} fees, ${result.errors.length} errors`
          );
          break;
        }

        case 'send-reminders': {
          const count = await paymentProcessorService.sendPaymentReminders();
          logger.info(`[PaymentWorker] Sent ${count} reminder(s)`);
          break;
        }

        case 'process-single': {
          // For future use: process a single payment by ID
          logger.info(
            `[PaymentWorker] Processing single payment ${data.paymentId} for org ${data.organizationId}`
          );
          // Can call paymentProcessorService with specific payment logic here
          break;
        }

        default:
          logger.warn(`[PaymentWorker] Unknown job type: ${(data as { type: string }).type}`);
      }
    }
  );

  logger.info('[PaymentWorker] Worker initialized and listening for jobs');
};
