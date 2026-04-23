import { Request, Response, NextFunction } from 'express';
import { leaseService } from '../services/lease.service';
import { sendSuccess, sendCreated, sendPaginated, sendNoContent } from '../utils/response';

export class LeaseController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, pagination } = await leaseService.getAll(
        req.user!.organizationId,
        req.query
      );
      sendPaginated(res, data, pagination);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const lease = await leaseService.getById(
        req.params.id,
        req.user!.organizationId
      );
      sendSuccess(res, lease);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const lease = await leaseService.create(
        req.body,
        req.user!.organizationId
      );
      sendCreated(res, lease, 'Lease created successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const lease = await leaseService.update(
        req.params.id,
        req.user!.organizationId,
        req.body
      );
      sendSuccess(res, lease, 'Lease updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async terminate(req: Request, res: Response, next: NextFunction) {
    try {
      const lease = await leaseService.terminate(
        req.params.id,
        req.user!.organizationId
      );
      sendSuccess(res, lease, 'Lease terminated');
    } catch (error) {
      next(error);
    }
  }

  async renew(req: Request, res: Response, next: NextFunction) {
    try {
      const lease = await leaseService.renew(
        req.params.id,
        req.user!.organizationId,
        req.body.newEndDate
      );
      sendSuccess(res, lease, 'Lease renewed');
    } catch (error) {
      next(error);
    }
  }

  async getExpiringSoon(req: Request, res: Response, next: NextFunction) {
    try {
      const days = Number(req.query.days) || 30;
      const leases = await leaseService.getExpiringSoon(
        req.user!.organizationId,
        days
      );
      sendSuccess(res, leases);
    } catch (error) {
      next(error);
    }
  }
}

export const leaseController = new LeaseController();
