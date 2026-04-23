import { Router } from 'express';
import { leaseController } from '../controllers/lease.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { managerAndAbove } from '../middleware/rbac.middleware';
import { createLeaseSchema, updateLeaseSchema } from '../schemas/lease.schema';

const router = Router();

router.use(authenticate);

router.get('/', leaseController.getAll);
router.get('/expiring', leaseController.getExpiringSoon);
router.get('/:id', leaseController.getById);
router.post('/', managerAndAbove, validate(createLeaseSchema), leaseController.create);
router.put('/:id', managerAndAbove, validate(updateLeaseSchema), leaseController.update);
router.patch('/:id/terminate', managerAndAbove, leaseController.terminate);
router.patch('/:id/renew', managerAndAbove, leaseController.renew);

export default router;
