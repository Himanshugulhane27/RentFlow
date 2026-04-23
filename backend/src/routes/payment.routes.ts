import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { managerAndAbove, adminOnly } from '../middleware/rbac.middleware';
import { createPaymentSchema, markPaidSchema } from '../schemas/payment.schema';

const router = Router();

router.use(authenticate);

router.get('/', paymentController.getAll);
router.get('/overdue', paymentController.getOverdue);
router.get('/revenue-trend', paymentController.getRevenueTrend);
router.get('/tenant/:tenantId', paymentController.getByTenant);
router.get('/:id', paymentController.getById);
router.post('/', managerAndAbove, validate(createPaymentSchema), paymentController.create);
router.patch('/:id/pay', managerAndAbove, validate(markPaidSchema), paymentController.markPaid);
router.post('/generate-monthly', adminOnly, paymentController.generateMonthly);
router.delete('/:id', managerAndAbove, paymentController.delete);

export default router;
