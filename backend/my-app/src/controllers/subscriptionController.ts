import { Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export class SubscriptionController {
  getStatus = async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Mock subscription data
      const subscriptionData = {
        id: 'sub_mock_123',
        status: 'active',
        plan: 'Pro',
        billing_period: 'monthly',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        usage: {
          requests_made: 150,
          requests_limit: 1000,
          tokens_used: 25000,
          tokens_limit: 100000
        },
        features: {
          model_comparisons: true,
          advanced_analytics: true,
          priority_support: true,
          custom_models: false
        }
      };

      res.json({
        success: true,
        data: subscriptionData
      });
    } catch (error) {
      console.error('Subscription status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get subscription status'
      });
    }
  };

  upgrade = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { plan } = req.body;
      
      res.json({
        success: true,
        data: { message: `Upgraded to ${plan} plan successfully` }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to upgrade subscription'
      });
    }
  };

  cancel = async (req: AuthenticatedRequest, res: Response) => {
    try {
      res.json({
        success: true,
        data: { message: 'Subscription cancelled successfully' }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to cancel subscription'
      });
    }
  };
}