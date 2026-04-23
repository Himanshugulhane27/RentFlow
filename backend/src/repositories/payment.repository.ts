import { Payment, PaymentDocument } from '../models/Payment.model';
import { BaseRepository } from './base.repository';
import { FilterQuery } from 'mongoose';

export class PaymentRepository extends BaseRepository<PaymentDocument> {
  constructor() {
    super(Payment);
  }

  async findByTenant(
    organizationId: string,
    tenantId: string
  ): Promise<PaymentDocument[]> {
    return this.model
      .find({ organizationId, tenantId })
      .populate('propertyId', 'address')
      .sort({ dueDate: -1 })
      .exec();
  }

  async findByLease(
    organizationId: string,
    leaseId: string
  ): Promise<PaymentDocument[]> {
    return this.model
      .find({ organizationId, leaseId })
      .sort({ dueDate: -1 })
      .exec();
  }

  async findOverdue(organizationId: string): Promise<PaymentDocument[]> {
    return this.model
      .find({
        organizationId,
        status: { $in: ['pending', 'overdue'] },
        dueDate: { $lt: new Date() },
      })
      .populate('tenantId', 'firstName lastName email')
      .populate('propertyId', 'address')
      .sort({ dueDate: 1 })
      .exec();
  }

  async findPending(organizationId: string): Promise<PaymentDocument[]> {
    return this.findAll(organizationId, {
      status: { $in: ['pending', 'overdue'] },
    } as FilterQuery<PaymentDocument>);
  }

  async getTotalRevenue(
    organizationId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<number> {
    const match: Record<string, unknown> = {
      organizationId,
      status: 'paid',
    };

    if (startDate || endDate) {
      match.paidDate = {};
      if (startDate) (match.paidDate as Record<string, Date>).$gte = startDate;
      if (endDate) (match.paidDate as Record<string, Date>).$lte = endDate;
    }

    const result = await this.model.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    return result[0]?.total || 0;
  }

  async getMonthlyRevenueTrend(
    organizationId: string,
    months: number = 12
  ): Promise<{ month: string; revenue: number }[]> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const result = await this.model.aggregate([
      {
        $match: {
          organizationId,
          status: 'paid',
          paidDate: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$paidDate' },
            month: { $month: '$paidDate' },
          },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return result.map((r: { _id: { year: number; month: number }; revenue: number }) => ({
      month: `${r._id.year}-${String(r._id.month).padStart(2, '0')}`,
      revenue: r.revenue,
    }));
  }

  async getPaymentStatsForTenant(
    organizationId: string,
    tenantId: string
  ): Promise<{
    total: number;
    paid: number;
    onTime: number;
    late: number;
    missed: number;
    avgDaysLate: number;
  }> {
    const payments = await this.model.find({
      organizationId,
      tenantId,
    });

    const total = payments.length;
    const paid = payments.filter(p => p.status === 'paid').length;
    const onTime = payments.filter(
      p => p.status === 'paid' && p.paidDate && p.paidDate <= p.dueDate
    ).length;
    const late = payments.filter(
      p => p.status === 'paid' && p.paidDate && p.paidDate > p.dueDate
    ).length;
    const missed = payments.filter(
      p => p.status === 'overdue' || (p.status === 'pending' && new Date() > p.dueDate)
    ).length;

    const lateDays = payments
      .filter(p => p.status === 'paid' && p.paidDate && p.paidDate > p.dueDate)
      .map(p => Math.ceil((p.paidDate!.getTime() - p.dueDate.getTime()) / (1000 * 60 * 60 * 24)));
    const avgDaysLate = lateDays.length > 0
      ? Math.round(lateDays.reduce((a, b) => a + b, 0) / lateDays.length)
      : 0;

    return { total, paid, onTime, late, missed, avgDaysLate };
  }
}

export const paymentRepository = new PaymentRepository();
