import jwt from 'jsonwebtoken';
import { env } from '../config/environment';
import { userRepository } from '../repositories/user.repository';
import { Organization } from '../models/Organization.model';
import { User } from '../models/User.model';
import { slugify } from '../utils/helpers';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors';
import { TokenPair, AuthPayload } from '../types/api.types';
import { RegisterInput, LoginInput, InviteUserInput } from '../schemas/auth.schema';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';

class AuthService {
  /**
   * Register a new user + create their organization.
   * Runs in a transaction so both succeed or both fail.
   */
  async register(input: RegisterInput): Promise<{ user: any; tokens: TokenPair }> {
    const exists = await userRepository.emailExists(input.email);
    if (exists) {
      throw new ConflictError('Email already registered');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create organization
      const org = new Organization({
        name: input.organizationName,
        slug: slugify(input.organizationName) + '-' + Date.now().toString(36),
        ownerId: new mongoose.Types.ObjectId(),
        plan: 'free',
      });

      // Create admin user
      const user = new User({
        email: input.email,
        password: input.password,
        firstName: input.firstName,
        lastName: input.lastName,
        role: 'admin',
        organizationId: org._id,
        phone: input.phone,
      });

      // Link org owner
      org.ownerId = user._id;

      await org.save({ session });
      await user.save({ session });
      await session.commitTransaction();

      const tokens = this.generateTokens(user);
      await userRepository.updateLastLogin(user._id.toString());

      logger.info('New user registered', { userId: user._id, email: user.email, org: org.name });

      return { user, tokens };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Login with email and password.
   */
  async login(input: LoginInput): Promise<{ user: any; tokens: TokenPair }> {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = this.generateTokens(user);
    await userRepository.updateLastLogin(user._id.toString());

    logger.info('User logged in', { userId: user._id, email: user.email });

    return { user, tokens };
  }

  /**
   * Invite a new user to the current organization.
   * Only admins can do this (enforced by RBAC middleware).
   */
  async inviteUser(
    input: InviteUserInput,
    organizationId: string,
    invitedByUserId: string
  ): Promise<any> {
    const exists = await userRepository.emailExists(input.email);
    if (exists) {
      throw new ConflictError('Email already registered');
    }

    // Generate a temporary password (user should reset on first login)
    const tempPassword = `Temp${Date.now().toString(36)}!`;

    const user = await userRepository.create({
      email: input.email,
      password: tempPassword,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      organizationId: new mongoose.Types.ObjectId(organizationId),
    });

    logger.info('User invited', {
      invitedUserId: user._id,
      invitedBy: invitedByUserId,
      role: input.role,
    });

    return user;
  }

  /**
   * Refresh access token using refresh token.
   */
  async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as AuthPayload;
      const user = await userRepository.findById(decoded.userId);

      if (!user || !user.isActive) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  /**
   * Get current user profile.
   */
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  }

  /**
   * Generate JWT access + refresh tokens.
   */
  private generateTokens(user: any): TokenPair {
    const payload: AuthPayload = {
      userId: user._id.toString(),
      organizationId: user.organizationId.toString(),
      role: user.role,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, env.JWT_SECRET as string, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET as string, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
    });

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
