import mongoose, { Schema, Document } from 'mongoose';
import { ILease } from '../types/models.types';
import { daysBetween } from '../utils/helpers';

export interface LeaseDocument extends Omit<ILease, '_id'>, Document {
  isExpiringSoon(days?: number): boolean;
  isActive: boolean;
  durationMonths: number;
}

const leaseSchema = new Schema<LeaseDocument>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    monthlyRent: { type: Number, required: true, min: 0 },
    securityDeposit: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['active', 'expired', 'terminated'],
      default: 'active',
    },
    terms: { type: String, trim: true, maxlength: 5000 },
    documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Method: check if lease expires within N days
leaseSchema.methods.isExpiringSoon = function (days: number = 30): boolean {
  if (this.status !== 'active') return false;
  const daysLeft = daysBetween(new Date(), this.endDate);
  return daysLeft > 0 && daysLeft <= days;
};

// Virtual: active check
leaseSchema.virtual('isActive').get(function (this: LeaseDocument) {
  return this.status === 'active' && new Date() <= this.endDate;
});

// Virtual: duration in months
leaseSchema.virtual('durationMonths').get(function (this: LeaseDocument) {
  return Math.round(daysBetween(this.startDate, this.endDate) / 30);
});

// Virtual populate: payments
leaseSchema.virtual('payments', {
  ref: 'Payment',
  localField: '_id',
  foreignField: 'leaseId',
});

leaseSchema.index({ organizationId: 1 });
leaseSchema.index({ organizationId: 1, status: 1 });
leaseSchema.index({ organizationId: 1, propertyId: 1 });
leaseSchema.index({ organizationId: 1, tenantId: 1 });
leaseSchema.index({ organizationId: 1, endDate: 1 });

export const Lease = mongoose.model<LeaseDocument>('Lease', leaseSchema);
