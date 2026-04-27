import { Router } from 'express';
import authRoutes from './auth.routes';
import propertyRoutes from './property.routes';
import tenantRoutes from './tenant.routes';
import leaseRoutes from './lease.routes';
import paymentRoutes from './payment.routes';
import dashboardRoutes from './dashboard.routes';
import timelineRoutes from './timeline.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/tenants', tenantRoutes);
router.use('/leases', leaseRoutes);
router.use('/payments', paymentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/timeline', timelineRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Rental Management API is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
  });
});

export default router;
