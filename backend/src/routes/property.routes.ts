import { Router } from 'express';
import { propertyController } from '../controllers/property.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { managerAndAbove } from '../middleware/rbac.middleware';
import { createPropertySchema, updatePropertySchema } from '../schemas/property.schema';

const router = Router();

// All property routes require authentication
router.use(authenticate);

router.get('/', propertyController.getAll);
router.get('/search', propertyController.search);
router.get('/:id', propertyController.getById);
router.post('/', managerAndAbove, validate(createPropertySchema), propertyController.create);
router.put('/:id', managerAndAbove, validate(updatePropertySchema), propertyController.update);
router.patch('/:id/toggle', managerAndAbove, propertyController.toggleAvailability);
router.delete('/:id', managerAndAbove, propertyController.delete);

export default router;
