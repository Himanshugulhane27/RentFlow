import { Payment } from '../models/Payment.model';
import { Organization } from '../models/Organization.model';
import { logger } from '../utils/logger';
import { daysBetween } from '../utils/helpers';

interface ProcessingResult {
  processedAt: Date;
  totalScanned: number;
  markedOverdue: number;
  lateFeesApplied: number;
  notifications: string[];
  errors: string[];
}

class PaymentProcessorService {
  /**
   * Scan all organizations for overdue payments.
   * - Marks pending payments past due date as "overdue"
   * - Calculates and applies late fees based on org settings
   * - Logs tenant notifications
   *
   * Designed to be called on a schedule (e.g., daily via node-cron).
   */
  async processOverduePayments(): Promise<ProcessingResult> {
    const startTime = Date.now();
    const result: ProcessingResult = {
      processedAt: new Date(),
      totalScanned: 0,
      markedOverdue: 0,
      lateFeesApplied: 0,
      notifications: [],
      errors: [],
    };

    logger.info('[PaymentProcessor] Starting overdue payment scan...');

    try {
      // Find all pending payments past their due date (across all orgs)
      const overduePayments = await Payment.find({
        status: 'pending',
        dueDate: { $lt: new Date() },
      })
        .populate('tenantId', 'firstName lastName email')
        .populate('propertyId', 'address')
        .populate('organizationId', 'name settings')
        .exec();

      result.totalScanned = overduePayments.length;

      if (overduePayments.length === 0) {
        logger.info('[PaymentProcessor] No overdue payments found.');
        return result;
      }

      logger.info(`[PaymentProcessor] Found ${overduePayments.length} overdue payment(s).`);

      for (const payment of overduePayments) {
        try {
          // Get org settings for late fee calculation
          const org = await Organization.findById(payment.organizationId);
          const gracePeriodDays = org?.settings?.gracePeriodDays ?? 5;
          const lateFeePercentage = org?.settings?.lateFeePercentage ?? 5;

          const daysLate = daysBetween(payment.dueDate, new Date());
          const pastGracePeriod = daysLate > gracePeriodDays;

          // Mark as overdue
          payment.status = 'overdue';

          // Apply late fee if past grace period and no fee yet
          if (pastGracePeriod && payment.lateFee === 0) {
            const lateFee = Math.round(payment.amount * (lateFeePercentage / 100));
            payment.lateFee = lateFee;
            payment.totalAmount = payment.amount + lateFee;
            result.lateFeesApplied++;

            logger.info(
              `[PaymentProcessor] Late fee ₹${lateFee} applied to payment ${payment._id} (${daysLate} days late)`
            );
          }

          await payment.save();
          result.markedOverdue++;

          // Build notification message
          const tenant = payment.tenantId as unknown as {
            firstName: string;
            lastName: string;
            email: string;
          };
          const property = payment.propertyId as unknown as { address: string };

          const notification = `Tenant ${tenant.firstName} ${tenant.lastName} (${tenant.email}) has overdue payment of ₹${payment.totalAmount} for ${property.address} — ${daysLate} day(s) late`;

          result.notifications.push(notification);

          // Log the notification (mock — replace with email/SMS service later)
          logger.warn(`[PaymentProcessor] NOTIFICATION: ${notification}`);
        } catch (err) {
          const errorMsg = `Failed to process payment ${payment._id}: ${(err as Error).message}`;
          result.errors.push(errorMsg);
          logger.error(`[PaymentProcessor] ${errorMsg}`);
        }
      }
    } catch (err) {
      const errorMsg = `Payment processor failed: ${(err as Error).message}`;
      result.errors.push(errorMsg);
      logger.error(`[PaymentProcessor] ${errorMsg}`);
    }

    const elapsed = Date.now() - startTime;
    logger.info(
      `[PaymentProcessor] Complete. Scanned: ${result.totalScanned}, Marked overdue: ${result.markedOverdue}, Late fees: ${result.lateFeesApplied}, Errors: ${result.errors.length} (${elapsed}ms)`
    );

    return result;
  }

  /**
   * Check for payments approaching due date (2 days out).
   * Logs reminders — can be extended to send real notifications.
   */
  async sendPaymentReminders(): Promise<number> {
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    const upcoming = await Payment.find({
      status: 'pending',
      dueDate: {
        $gte: new Date(),
        $lte: twoDaysFromNow,
      },
    })
      .populate('tenantId', 'firstName lastName email')
      .populate('propertyId', 'address')
      .exec();

    for (const payment of upcoming) {
      const tenant = payment.tenantId as unknown as {
        firstName: string;
        lastName: string;
        email: string;
      };
      const property = payment.propertyId as unknown as { address: string };

      logger.info(
        `[PaymentProcessor] REMINDER: ${tenant.firstName} ${tenant.lastName} — ₹${payment.amount} due on ${payment.dueDate.toISOString().split('T')[0]} for ${property.address}`
      );
    }

    logger.info(`[PaymentProcessor] Sent ${upcoming.length} payment reminder(s).`);
    return upcoming.length;
  }
}

export const paymentProcessorService = new PaymentProcessorService();
