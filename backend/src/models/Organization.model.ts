import mongoose, { Schema, Document } from 'mongoose';
import { IOrganization, IOrganizationSettings } from '../types/models.types';

export interface OrganizationDocument extends Omit<IOrganization, '_id'>, Document {}

const settingsSchema = new Schema<IOrganizationSettings>(
  {
    currency: { type: String, default: 'INR' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    lateFeePercentage: { type: Number, default: 5, min: 0, max: 50 },
    gracePeriodDays: { type: Number, default: 5, min: 0, max: 30 },
    dateFormat: { type: String, default: 'DD/MM/YYYY' },
  },
  { _id: false }
);

const organizationSchema = new Schema<OrganizationDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    settings: { type: settingsSchema, default: () => ({}) },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

organizationSchema.index({ ownerId: 1 });

export const Organization = mongoose.model<OrganizationDocument>('Organization', organizationSchema);
