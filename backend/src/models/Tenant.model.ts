import mongoose, { Schema, Document } from 'mongoose';
import { ITenant } from '../types/models.types';

export interface TenantDocument extends Omit<ITenant, '_id'>, Document {
  fullName: string;
}

const tenantSchema = new Schema<TenantDocument>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, maxlength: 50 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    idNumber: { type: String, trim: true },
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      relationship: { type: String, trim: true },
    },
    avatar: { type: String },
    notes: { type: String, trim: true, maxlength: 2000 },
    riskScore: { type: Number, min: 0, max: 100, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tenantSchema.virtual('fullName').get(function (this: TenantDocument) {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual populate: leases for this tenant
tenantSchema.virtual('leases', {
  ref: 'Lease',
  localField: '_id',
  foreignField: 'tenantId',
});

// Virtual populate: payments for this tenant
tenantSchema.virtual('payments', {
  ref: 'Payment',
  localField: '_id',
  foreignField: 'tenantId',
});

tenantSchema.index({ organizationId: 1 });
tenantSchema.index({ organizationId: 1, email: 1 }, { unique: true });
tenantSchema.index({ organizationId: 1, riskScore: -1 });

export const Tenant = mongoose.model<TenantDocument>('Tenant', tenantSchema);
