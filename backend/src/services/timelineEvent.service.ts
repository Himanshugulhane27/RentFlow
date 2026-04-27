import { TimelineEvent } from '../models/TimelineEvent.model';

interface WriteEventParams {
  entityType: string;
  entityId: string;
  type: string;
  title: string;
  description?: string;
  amount?: number;
  organizationId: string;
}

export class TimelineEventService {
  static async write(params: WriteEventParams): Promise<void> {
    try {
      await TimelineEvent.create(params);
    } catch (err) {
      console.error('Timeline write failed:', err);
    }
  }

  static async getForEntity(entityType: string, entityId: string, organizationId: string) {
    return TimelineEvent.find({ entityType, entityId, organizationId })
      .sort({ createdAt: -1 })
      .limit(50);
  }
}
