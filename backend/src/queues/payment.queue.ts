import { createQueue } from '../config/queue';

// ─── Job Data Types ─────────────────────────────────────────
export interface OverduePaymentJobData {
  type: 'scan-overdue';
}

export interface PaymentReminderJobData {
  type: 'send-reminders';
}

export interface SinglePaymentJobData {
  type: 'process-single';
  paymentId: string;
  organizationId: string;
}

export type PaymentJobData =
  | OverduePaymentJobData
  | PaymentReminderJobData
  | SinglePaymentJobData;

import { Queue } from 'bullmq';

// ─── Queue Instance ─────────────────────────────────────────
let paymentQueue: Queue<PaymentJobData> | null = null;

export const getPaymentQueue = (): Queue<PaymentJobData> => {
  if (!paymentQueue) {
    paymentQueue = createQueue<PaymentJobData>('payment-processing');
  }
  return paymentQueue;
};

// ─── Helper: Schedule Jobs ──────────────────────────────────

/**
 * Queue the daily overdue payment scan.
 */
export const queueOverdueScan = async (): Promise<void> => {
  await getPaymentQueue().add(
    'scan-overdue',
    { type: 'scan-overdue' },
    {
      jobId: `overdue-scan-${new Date().toISOString().split('T')[0]}`,
      // Deduplicate: only one scan per day
    }
  );
};

/**
 * Queue payment reminders.
 */
export const queuePaymentReminders = async (): Promise<void> => {
  await getPaymentQueue().add(
    'send-reminders',
    { type: 'send-reminders' },
    {
      jobId: `reminders-${new Date().toISOString().split('T')[0]}`,
    }
  );
};

/**
 * Queue processing for a single specific payment.
 */
export const queueSinglePayment = async (
  paymentId: string,
  organizationId: string
): Promise<void> => {
  await getPaymentQueue().add(
    'process-single',
    { type: 'process-single', paymentId, organizationId },
    { priority: 1 } // Higher priority than batch scans
  );
};
