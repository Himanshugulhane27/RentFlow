import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/models.types';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

/**
 * Role-based access control middleware.
 * Usage: router.delete('/:id', authenticate, rbac('admin'), controller.delete)
 */
export const rbac = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError());
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new ForbiddenError(`Role '${req.user.role}' does not have access to this resource`));
      return;
    }

    next();
  };
};

/**
 * Shorthand: only admins
 */
export const adminOnly = rbac('admin');

/**
 * Shorthand: admins and managers
 */
export const managerAndAbove = rbac('admin', 'manager');
