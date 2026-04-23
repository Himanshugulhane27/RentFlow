import mongoose, { Schema, Document } from 'mongoose';
import { IDocument } from '../types/models.types';

export interface FileDocument extends Omit<IDocument, '_id'>, Document {}

const documentSchema = new Schema<FileDocument>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    fileName: { type: String, required: true, trim: true },
    originalName: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true, min: 0 },
    documentType: {
      type: String,
      enum: ['lease_agreement', 'id_proof', 'receipt', 'other'],
      default: 'other',
    },
    linkedTo: {
      model: { type: String, enum: ['Property', 'Tenant', 'Lease'], required: true },
      id: { type: Schema.Types.ObjectId, required: true },
    },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

documentSchema.index({ organizationId: 1 });
documentSchema.index({ 'linkedTo.model': 1, 'linkedTo.id': 1 });

export const FileDoc = mongoose.model<FileDocument>('Document', documentSchema);
