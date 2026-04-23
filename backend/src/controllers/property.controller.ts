import { Request, Response, NextFunction } from 'express';
import { propertyService } from '../services/property.service';
import { sendSuccess, sendCreated, sendPaginated, sendNoContent } from '../utils/response';

export class PropertyController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, pagination } = await propertyService.getAll(
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
      const property = await propertyService.getById(
        req.params.id,
        req.user!.organizationId
      );
      sendSuccess(res, property);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const property = await propertyService.create(
        req.body,
        req.user!.organizationId
      );
      sendCreated(res, property, 'Property created successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const property = await propertyService.update(
        req.params.id,
        req.user!.organizationId,
        req.body
      );
      sendSuccess(res, property, 'Property updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await propertyService.delete(req.params.id, req.user!.organizationId);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  async toggleAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const property = await propertyService.toggleAvailability(
        req.params.id,
        req.user!.organizationId
      );
      sendSuccess(res, property, 'Availability toggled');
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await propertyService.search(
        req.user!.organizationId,
        req.query.q as string || ''
      );
      sendSuccess(res, results);
    } catch (error) {
      next(error);
    }
  }
}

export const propertyController = new PropertyController();
