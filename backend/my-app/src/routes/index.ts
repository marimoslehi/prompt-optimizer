import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { PromptController } from '../controllers/promptController';
import { TestController } from '../controllers/testController';
import { AnalyticsController } from '../controllers/analyticsController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Initialize controllers
const authController = new AuthController();
const promptController = new PromptController();
const testController = new TestController();
const analyticsController = new AnalyticsController();

// Health check route
router.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Prompt Optimizer API'
    });
});

// Auth routes (public)
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh', authController.refreshToken);

// Auth routes (protected)
router.get('/auth/profile', authMiddleware, authController.getProfile);

// Prompt routes (all protected)
router.post('/prompts', authMiddleware, promptController.createPrompt);
router.get('/prompts', authMiddleware, promptController.getPrompts);
router.get('/prompts/:id', authMiddleware, promptController.getPrompt);
router.put('/prompts/:id', authMiddleware, promptController.updatePrompt);
router.delete('/prompts/:id', authMiddleware, promptController.deletePrompt);

// Test routes (all protected)
router.post('/tests/run', authMiddleware, testController.runTest);
router.get('/tests/:id', authMiddleware, testController.getTestResults);
router.get('/tests/history', authMiddleware, testController.getTestHistory);

// Analytics routes (all protected)
router.get('/analytics/costs', authMiddleware, analyticsController.getCostAnalytics);
router.get('/analytics/usage', authMiddleware, analyticsController.getUsageStats);
router.get('/analytics/dashboard', authMiddleware, analyticsController.getDashboardOverview);

export { router as apiRoutes };
