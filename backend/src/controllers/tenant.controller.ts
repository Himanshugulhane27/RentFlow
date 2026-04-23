import { Request, Response, NextFunction } from 'express';
import { tenantService } from '../services/tenant.service';
import { sendSuccess, sendCreated, sendPaginated, sendNoContent } from '../utils/response';

export class TenantController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, pagination } = await tenantService.getAll(
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
      const tenant = await tenantService.getById(
        req.params.id,
        req.user!.organizationId
      );
      sendSuccess(res, tenant);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const tenant = await tenantService.create(
        req.body,
        req.user!.organizationId
      );
      sendCreated(res, tenant, 'Tenant created successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const tenant = await tenantService.update(
        req.params.id,
        req.user!.organizationId,
        req.body
      );
      sendSuccess(res, tenant, 'Tenant updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await tenantService.delete(req.params.id, req.user!.organizationId);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  async getRiskScore(req: Request, res: Response, next: NextFunction) {
    try {
      const score = await tenantService.calculateRiskScore(
        req.params.id,
        req.user!.organizationId
      );
      sendSuccess(res, score);
    } catch (error) {
      next(error);
    }
  }

  async getHighRisk(req: Request, res: Response, next: NextFunction) {
    try {
      const tenants = await tenantService.getHighRiskTenants(
        req.user!.organizationId
      );
      sendSuccess(res, tenants);
    } catch (error) {
      next(error);
    }
  }
}

export const tenantController = new TenantController();
