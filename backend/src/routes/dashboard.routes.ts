import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/stats', dashboardController.getStats);
router.get('/revenue-trend', dashboardController.getRevenueTrend);
router.get('/high-risk-tenants', dashboardController.getHighRiskTenants);
router.get('/alerts', dashboardController.getAlerts);

export default router;
