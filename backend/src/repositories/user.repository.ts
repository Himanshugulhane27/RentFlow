import { User, UserDocument } from '../models/User.model';
import { FilterQuery } from 'mongoose';

export class UserRepository {
  async findById(id: string): Promise<UserDocument | null> {
    return User.findById(id);
  }

  async findByIdWithPassword(id: string): Promise<UserDocument | null> {
    return User.findById(id).select('+password');
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return User.findOne({ email: email.toLowerCase() }).select('+password');
  }

  async findByOrganization(organizationId: string): Promise<UserDocument[]> {
    return User.find({ organizationId, isActive: true }).sort({ createdAt: -1 });
  }

  async create(data: Partial<UserDocument>): Promise<UserDocument> {
    const user = new User(data);
    return user.save();
  }

  async update(
    id: string,
    data: Partial<UserDocument>
  ): Promise<UserDocument | null> {
    return User.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  }

  async updateLastLogin(id: string): Promise<void> {
    await User.updateOne(
      { _id: id },
      { $set: { lastLoginAt: new Date() } }
    );
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await User.countDocuments({ email: email.toLowerCase() });
    return count > 0;
  }

  async countByOrganization(
    organizationId: string,
    filter: FilterQuery<UserDocument> = {}
  ): Promise<number> {
    return User.countDocuments({ organizationId, ...filter });
  }
}

export const userRepository = new UserRepository();
