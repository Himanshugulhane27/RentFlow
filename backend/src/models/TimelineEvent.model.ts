import mongoose, { Schema, Document } from 'mongoose';

export interface ITimelineEvent extends Document {
  entityType: 'tenant' | 'lease' | 'property' | 'payment';
  entityId: mongoose.Types.ObjectId;
  type: 'payment' | 'lease' | 'document' | 'reminder' | 'tenant' | 'general';
  title: string;
  description?: string;
  amount?: number;
  organizationId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const TimelineEventSchema = new Schema({
  entityType: { 
    type: String, 
    required: true,
    enum: ['tenant','lease','property','payment']
  },
  entityId: { 
    type: Schema.Types.ObjectId, 
    required: true,
    index: true
  },
  type: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: String,
  amount: Number,
  organizationId: { 
    type: Schema.Types.ObjectId, 
    required: true,
    index: true
  },
}, { timestamps: true });

export const TimelineEvent = mongoose.model<ITimelineEvent>('TimelineEvent', TimelineEventSchema);
