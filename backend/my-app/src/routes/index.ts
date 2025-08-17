// backend/my-app/src/routes/index.ts
import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { PromptController } from '../controllers/promptController';
import { TestController } from '../controllers/testController';
import { AnalyticsController } from '../controllers/analyticsController';
import { AIController } from '../controllers/aiController';
import { ApiKeyController } from '../controllers/apiKeyController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Initialize controllers
const authController = new AuthController();
const promptController = new PromptController();
const testController = new TestController();
const analyticsController = new AnalyticsController();
const aiController = new AIController();
const apiKeyController = new ApiKeyController();

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

// 🆕 NEW: Google OAuth routes
router.get('/auth/google', authController.googleAuth);
router.get('/auth/google/callback', authController.googleCallback);

// Auth routes (protected)
router.get('/auth/profile', authMiddleware, authController.getProfile);
router.post('/auth/change-password', authMiddleware, authController.changePassword);

// AI routes
router.post('/ai/compare', authMiddleware, aiController.compareModels);
router.get('/ai/models', authMiddleware, apiKeyController.getAvailableModels);
router.get('/ai/subscription/status', authMiddleware, aiController.getSubscriptionStatus);
router.post('/ai/subscription/upgrade', authMiddleware, aiController.upgradeSubscription);
router.post('/ai/subscription/cancel', authMiddleware, aiController.cancelSubscription);

// API key management routes
router.post('/keys', authMiddleware, apiKeyController.addOrUpdateKey);
router.delete('/keys/:provider', authMiddleware, apiKeyController.deleteKey);
router.get('/keys/status', authMiddleware, apiKeyController.getKeyStatus);
router.get('/keys/models', authMiddleware, apiKeyController.getAvailableModels);

// Prompt routes
router.post('/prompts', authMiddleware, promptController.createPrompt);
router.get('/prompts', authMiddleware, promptController.getPrompts);
router.get('/prompts/:id', authMiddleware, promptController.getPrompt);
router.put('/prompts/:id', authMiddleware, promptController.updatePrompt);
router.delete('/prompts/:id', authMiddleware, promptController.deletePrompt);

// Test routes
router.post('/tests/run', authMiddleware, testController.runTest);
router.get('/tests/:id', authMiddleware, testController.getTestResults);
router.get('/tests/history', authMiddleware, testController.getTestHistory);
router.post('/tests', authMiddleware, analyticsController.savePromptTest);

// Analytics routes
router.get('/analytics/costs', authMiddleware, analyticsController.getCostAnalytics);
router.get('/analytics/usage', authMiddleware, analyticsController.getUsageStats);
router.get('/analytics/dashboard', authMiddleware, analyticsController.getDashboardOverview);
router.get('/user/stats', authMiddleware, analyticsController.getUserStats);

// Subscription routes
router.get('/subscription/status', authMiddleware, aiController.getSubscriptionStatus);
router.post('/subscription/upgrade', authMiddleware, aiController.upgradeSubscription);
router.post('/subscription/cancel', authMiddleware, aiController.cancelSubscription);

export { router as apiRoutes };