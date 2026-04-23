import mongoose, { Schema, Document } from 'mongoose';
import { IProperty } from '../types/models.types';

export interface PropertyDocument extends Omit<IProperty, '_id'>, Document {}

const propertySchema = new Schema<PropertyDocument>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    address: { type: String, required: true, trim: true, maxlength: 200 },
    unit: { type: String, trim: true, maxlength: 20 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    state: { type: String, required: true, trim: true, maxlength: 50 },
    zipCode: { type: String, required: true, trim: true, maxlength: 10 },
    propertyType: {
      type: String,
      enum: ['apartment', 'house', 'condo', 'commercial', 'other'],
      default: 'apartment',
    },
    bedrooms: { type: Number, required: true, min: 0, max: 20 },
    bathrooms: { type: Number, required: true, min: 0, max: 20 },
    squareFeet: { type: Number, min: 0 },
    rent: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true, maxlength: 2000 },
    amenities: [{ type: String, trim: true }],
    images: [{ type: String }],
    available: { type: Boolean, default: true },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Full address virtual
propertySchema.virtual('fullAddress').get(function (this: PropertyDocument) {
  const parts = [this.address];
  if (this.unit) parts.push(`Unit ${this.unit}`);
  parts.push(this.city, this.state, this.zipCode);
  return parts.join(', ');
});

// Virtual populate: active leases
propertySchema.virtual('leases', {
  ref: 'Lease',
  localField: '_id',
  foreignField: 'propertyId',
});

propertySchema.index({ organizationId: 1 });
propertySchema.index({ organizationId: 1, available: 1 });
propertySchema.index({ organizationId: 1, rent: 1 });
propertySchema.index({ organizationId: 1, city: 1 });

export const Property = mongoose.model<PropertyDocument>('Property', propertySchema);
