import { propertyRepository } from '../repositories/property.repository';
import { CreatePropertyInput, UpdatePropertyInput } from '../schemas/property.schema';
import { PaginationQuery } from '../types/api.types';
import { parsePagination } from '../utils/pagination';
import mongoose from 'mongoose';

class PropertyService {
  async getAll(organizationId: string, query: PaginationQuery) {
    const options = parsePagination(query);
    return propertyRepository.findPaginated(organizationId, options);
  }

  async getById(id: string, organizationId: string) {
    return propertyRepository.findById(id, organizationId);
  }

  async create(data: CreatePropertyInput, organizationId: string) {
    return propertyRepository.create({
      ...data,
      organizationId: new mongoose.Types.ObjectId(organizationId),
    });
  }

  async update(id: string, organizationId: string, data: UpdatePropertyInput) {
    return propertyRepository.update(id, organizationId, data);
  }

  async delete(id: string, organizationId: string) {
    return propertyRepository.delete(id, organizationId);
  }

  async toggleAvailability(id: string, organizationId: string) {
    const property = await propertyRepository.findById(id, organizationId);
    return propertyRepository.update(id, organizationId, {
      available: !property.available,
    });
  }

  async search(organizationId: string, searchTerm: string) {
    return propertyRepository.search(organizationId, searchTerm);
  }

  async getStats(organizationId: string) {
    return propertyRepository.getStats(organizationId);
  }
}

export const propertyService = new PropertyService();
