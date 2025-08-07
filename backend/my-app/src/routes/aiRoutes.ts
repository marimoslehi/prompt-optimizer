// backend/my-app/src/routes/aiRoutes.ts
import { Router } from 'express';
import { AIController } from '../controllers/aiController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const aiController = new AIController();

// AI comparison routes (protected)
router.post('/compare', authMiddleware, aiController.compareModels);
router.get('/models', aiController.getAvailableModels);

// Subscription routes (protected)
router.get('/subscription/status', authMiddleware, aiController.getSubscriptionStatus);
router.post('/subscription/upgrade', authMiddleware, aiController.upgradeSubscription);
router.post('/subscription/cancel', authMiddleware, aiController.cancelSubscription);

export { router as aiRoutes };