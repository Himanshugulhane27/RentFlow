import { Router } from 'express';
import { TimelineEventService } from '../services/timelineEvent.service';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/:entityType/:entityId', async (req, res) => {
  const { entityType, entityId } = req.params;
  const { organizationId } = req.user!;
  
  const events = await TimelineEventService.getForEntity(
    entityType, 
    entityId, 
    organizationId
  );
  
  return res.json({ 
    success: true, 
    data: events 
  });
});

export default router;
