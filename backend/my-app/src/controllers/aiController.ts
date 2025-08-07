import { Request, Response } from 'express';
import { AIService } from '../services/aiService';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export class AIController {
  private aiService = new AIService();

  compareModels = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { prompt, models, options } = req.body;

      if (!prompt || !models || !Array.isArray(models)) {
        return res.status(400).json({
          success: false,
          message: 'Prompt and models array are required'
        });
      }

      const results = await this.aiService.runModelComparison(prompt, models);

      res.json({
        success: true,
        data: {
          results,
          summary: {
            totalModels: results.length,
            totalTokens: results.reduce((sum, r) => sum + r.tokens, 0),
            totalCost: results.reduce((sum, r) => sum + r.cost, 0),
            avgResponseTime: results.reduce((sum, r) => sum + r.responseTime, 0) / results.length,
            recommendedModel: results.sort((a, b) => b.quality - a.quality)[0]?.model || 'unknown'
          }
        }
      });
    } catch (error) {
      console.error('Model comparison error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to compare models'
      });
    }
  };

  getAvailableModels = async (req: Request, res: Response) => {
    try {
      const models = [
        {
          id: 'gemini-1.5-flash',
          name: 'Gemini 1.5 Flash',
          provider: 'Google',
          cost: 0,
          description: 'Fast, high-quality responses. Free to use.'
        },
        {
          id: 'llama-7b',
          name: 'Llama 2 7B',
          provider: 'Meta',
          cost: 0.001,
          description: 'Open-source model with balanced performance.'
        }
      ];

      res.json({ success: true, data: models });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to get models' });
    }
  };

  getSubscriptionStatus = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const subscriptionData = {
        id: 'sub_mock_123',
        status: 'active',
        plan: 'Pro',
        usage: {
          requests_made: 150,
          requests_limit: 1000
        }
      };

      res.json({ success: true, data: subscriptionData });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to get subscription' });
    }
  };

  upgradeSubscription = async (req: AuthenticatedRequest, res: Response) => {
    try {
      res.json({ success: true, data: { message: 'Upgrade successful' } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to upgrade' });
    }
  };

  cancelSubscription = async (req: AuthenticatedRequest, res: Response) => {
    try {
      res.json({ success: true, data: { message: 'Cancellation successful' } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to cancel' });
    }
  };
}
