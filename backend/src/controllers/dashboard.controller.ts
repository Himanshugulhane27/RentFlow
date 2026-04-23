import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { sendSuccess } from '../utils/response';

export class DashboardController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await dashboardService.getStats(req.user!.organizationId);
      sendSuccess(res, stats);
    } catch (error) {
      next(error);
    }
  }

  async getRevenueTrend(req: Request, res: Response, next: NextFunction) {
    try {
      const months = Number(req.query.months) || 12;
      const trend = await dashboardService.getRevenueTrend(
        req.user!.organizationId,
        months
      );
      sendSuccess(res, trend);
    } catch (error) {
      next(error);
    }
  }

  async getHighRiskTenants(req: Request, res: Response, next: NextFunction) {
    try {
      const tenants = await dashboardService.getHighRiskTenants(
        req.user!.organizationId
      );
      sendSuccess(res, tenants);
    } catch (error) {
      next(error);
    }
  }

  async getAlerts(req: Request, res: Response, next: NextFunction) {
    try {
      const [expiringLeases, overduePayments] = await Promise.all([
        dashboardService.getExpiringLeases(req.user!.organizationId),
        dashboardService.getOverduePayments(req.user!.organizationId),
      ]);

      sendSuccess(res, {
        expiringLeases,
        overduePayments,
        totalAlerts: expiringLeases.length + overduePayments.length,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
