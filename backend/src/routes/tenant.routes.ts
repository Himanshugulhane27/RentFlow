import { Router } from 'express';
import { tenantController } from '../controllers/tenant.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { managerAndAbove } from '../middleware/rbac.middleware';
import { createTenantSchema, updateTenantSchema } from '../schemas/tenant.schema';

const router = Router();

router.use(authenticate);

router.get('/', tenantController.getAll);
router.get('/high-risk', managerAndAbove, tenantController.getHighRisk);
router.get('/:id', tenantController.getById);
router.get('/:id/risk-score', managerAndAbove, tenantController.getRiskScore);
router.post('/', managerAndAbove, validate(createTenantSchema), tenantController.create);
router.put('/:id', managerAndAbove, validate(updateTenantSchema), tenantController.update);
router.delete('/:id', managerAndAbove, tenantController.delete);

export default router;
