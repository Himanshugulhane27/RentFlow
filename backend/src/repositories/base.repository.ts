import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { PaginationOptions, buildPaginationMeta } from '../utils/pagination';
import { PaginationMeta } from '../types/api.types';
import { NotFoundError } from '../utils/errors';

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Generic repository with CRUD + pagination.
 * Every query is scoped by organizationId for multi-tenant isolation.
 */
export class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findById(id: string, organizationId: string): Promise<T> {
    const doc = await this.model.findOne({
      _id: id,
      organizationId,
    } as FilterQuery<T>);

    if (!doc) {
      throw new NotFoundError(this.model.modelName);
    }
    return doc;
  }

  async findAll(organizationId: string, filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.model
      .find({ ...filter, organizationId } as FilterQuery<T>)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findPaginated(
    organizationId: string,
    options: PaginationOptions,
    filter: FilterQuery<T> = {}
  ): Promise<PaginatedResult<T>> {
    const query = { ...filter, organizationId } as FilterQuery<T>;

    const [data, total] = await Promise.all([
      this.model
        .find(query)
        .sort(options.sort)
        .skip(options.skip)
        .limit(options.limit)
        .exec(),
      this.model.countDocuments(query),
    ]);

    const pagination = buildPaginationMeta(options.page, options.limit, total);

    return { data, pagination };
  }

  async create(data: Partial<T>): Promise<T> {
    const doc = new this.model(data);
    return doc.save();
  }

  async update(
    id: string,
    organizationId: string,
    data: UpdateQuery<T>
  ): Promise<T> {
    const doc = await this.model.findOneAndUpdate(
      { _id: id, organizationId } as FilterQuery<T>,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!doc) {
      throw new NotFoundError(this.model.modelName);
    }
    return doc;
  }

  async delete(id: string, organizationId: string): Promise<void> {
    const result = await this.model.findOneAndDelete({
      _id: id,
      organizationId,
    } as FilterQuery<T>);

    if (!result) {
      throw new NotFoundError(this.model.modelName);
    }
  }

  async count(organizationId: string, filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments({
      ...filter,
      organizationId,
    } as FilterQuery<T>);
  }

  async exists(id: string, organizationId: string): Promise<boolean> {
    const count = await this.model.countDocuments({
      _id: id,
      organizationId,
    } as FilterQuery<T>);
    return count > 0;
  }
}
