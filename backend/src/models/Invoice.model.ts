import mongoose, { Schema, Document } from 'mongoose';
import { IInvoice } from '../types/models.types';

export interface InvoiceDocument extends Omit<IInvoice, '_id'>, Document {}

const invoiceItemSchema = new Schema(
  {
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const invoiceSchema = new Schema<InvoiceDocument>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    leaseId: { type: Schema.Types.ObjectId, ref: 'Lease', required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    items: [invoiceItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    lateFee: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    paidDate: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue', 'partial', 'cancelled'],
      default: 'pending',
    },
    pdfUrl: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

invoiceSchema.index({ organizationId: 1 });
invoiceSchema.index({ organizationId: 1, invoiceNumber: 1 });
invoiceSchema.index({ organizationId: 1, tenantId: 1 });

export const Invoice = mongoose.model<InvoiceDocument>('Invoice', invoiceSchema);
