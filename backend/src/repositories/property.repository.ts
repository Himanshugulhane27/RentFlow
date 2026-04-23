import { Property, PropertyDocument } from '../models/Property.model';
import { BaseRepository } from './base.repository';
import { FilterQuery } from 'mongoose';

export class PropertyRepository extends BaseRepository<PropertyDocument> {
  constructor() {
    super(Property);
  }

  async findByAvailability(
    organizationId: string,
    available: boolean
  ): Promise<PropertyDocument[]> {
    return this.findAll(organizationId, { available } as FilterQuery<PropertyDocument>);
  }

  async search(
    organizationId: string,
    searchTerm: string
  ): Promise<PropertyDocument[]> {
    const regex = new RegExp(searchTerm, 'i');
    return this.model
      .find({
        organizationId,
        $or: [
          { address: regex },
          { city: regex },
          { state: regex },
          { description: regex },
        ],
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getStats(organizationId: string) {
    const [total, available, occupied] = await Promise.all([
      this.count(organizationId),
      this.count(organizationId, { available: true } as FilterQuery<PropertyDocument>),
      this.count(organizationId, { available: false } as FilterQuery<PropertyDocument>),
    ]);

    return { total, available, occupied };
  }
}

export const propertyRepository = new PropertyRepository();
