import mongoose, { Schema, Document } from 'mongoose';
import { IPayment } from '../types/models.types';

export interface PaymentDocument extends Omit<IPayment, '_id'>, Document {
  isOverdue: boolean;
}

const paymentSchema = new Schema<PaymentDocument>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    leaseId: { type: Schema.Types.ObjectId, ref: 'Lease', required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    amount: { type: Number, required: true, min: 0 },
    lateFee: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    paidDate: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue', 'partial', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank_transfer', 'card', 'upi', 'cheque', 'other'],
    },
    transactionId: { type: String, trim: true },
    stripePaymentIntentId: { type: String, trim: true },
    notes: { type: String, trim: true, maxlength: 500 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: overdue check
paymentSchema.virtual('isOverdue').get(function (this: PaymentDocument) {
  if (this.status === 'paid' || this.status === 'cancelled') return false;
  return new Date() > this.dueDate;
});

// Pre-save: auto-calculate totalAmount
paymentSchema.pre('save', function (next) {
  this.totalAmount = this.amount + this.lateFee;

  // Auto-mark overdue
  if (this.status === 'pending' && new Date() > this.dueDate) {
    this.status = 'overdue';
  }
  next();
});

paymentSchema.index({ organizationId: 1 });
paymentSchema.index({ organizationId: 1, status: 1 });
paymentSchema.index({ organizationId: 1, tenantId: 1 });
paymentSchema.index({ organizationId: 1, leaseId: 1 });
paymentSchema.index({ organizationId: 1, dueDate: 1 });
paymentSchema.index({ organizationId: 1, dueDate: 1, status: 1 });

export const Payment = mongoose.model<PaymentDocument>('Payment', paymentSchema);
