import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/payment.service';
import { sendSuccess, sendCreated, sendPaginated, sendNoContent } from '../utils/response';

export class PaymentController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, tenantId, leaseId, month } = req.query;
      const payments = await paymentService.getPayments({
        organizationId: req.user!.organizationId,
        status: status as string,
        tenantId: tenantId as string,
        leaseId: leaseId as string,
        month: month as string,
      });

      sendSuccess(res, payments);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await paymentService.getById(
        req.params.id,
        req.user!.organizationId
      );
      sendSuccess(res, payment);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await paymentService.create(
        req.body,
        req.user!.organizationId
      );
      sendCreated(res, payment, 'Payment created successfully');
    } catch (error) {
      next(error);
    }
  }

  async markPaid(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await paymentService.markPaid(
        req.params.id,
        req.user!.organizationId,
        req.body
      );
      sendSuccess(res, payment, 'Payment marked as paid');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await paymentService.delete(req.params.id, req.user!.organizationId);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  async getOverdue(req: Request, res: Response, next: NextFunction) {
    try {
      const payments = await paymentService.getOverdue(req.user!.organizationId);
      sendSuccess(res, payments);
    } catch (error) {
      next(error);
    }
  }

  async getByTenant(req: Request, res: Response, next: NextFunction) {
    try {
      const payments = await paymentService.getByTenant(
        req.user!.organizationId,
        req.params.tenantId
      );
      sendSuccess(res, payments);
    } catch (error) {
      next(error);
    }
  }

  async getRevenueTrend(req: Request, res: Response, next: NextFunction) {
    try {
      const months = Number(req.query.months) || 12;
      const trend = await paymentService.getRevenueTrend(
        req.user!.organizationId,
        months
      );
      sendSuccess(res, trend);
    } catch (error) {
      next(error);
    }
  }

  async generateMonthly(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await paymentService.generateMonthlyPayments(
        req.user!.organizationId
      );
      sendSuccess(res, { generated: count }, `${count} payments generated`);
    } catch (error) {
      next(error);
    }
  }
}

export const paymentController = new PaymentController();
