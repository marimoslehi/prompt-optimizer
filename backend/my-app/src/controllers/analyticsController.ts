import { Request, Response } from 'express';

export class AnalyticsController {
  getCostAnalytics = async (req: Request, res: Response) => {
    try {
      const analytics = {
        totalCost: 245.67,
        costByModel: {
          'gpt-4': 150.23,
          'claude-3': 95.44
        },
        dailySpend: [
          { date: '2025-08-01', cost: 12.34 },
          { date: '2025-08-02', cost: 15.67 }
        ],
        savings: {
          amount: 78.45,
          percentage: 24
        }
      };

      res.status(200).json({
        success: true,
        data: analytics
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  getUsageStats = async (req: Request, res: Response) => {
    try {
      const stats = {
        totalTests: 156,
        totalTokens: 45890,
        averageResponseTime: 2.3,
        modelUsage: {
          'gpt-4': 45,
          'claude-3': 38,
          'gemini-pro': 27
        },
        successRate: 98.5
      };

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  getDashboardOverview = async (req: Request, res: Response) => {
    try {
      const overview = {
        thisMonth: {
          tests: 45,
          cost: 89.45,
          tokens: 12450
        },
        lastMonth: {
          tests: 38,
          cost: 76.23,
          tokens: 10890
        },
        topModels: [
          { name: 'gpt-4', usage: 45, cost: 45.67 },
          { name: 'claude-3', usage: 38, cost: 28.90 }
        ],
        recentActivity: [
          {
            type: 'test',
            description: 'Ran test with GPT-4',
            timestamp: new Date(),
            cost: 0.045
          }
        ]
      };

      res.status(200).json({
        success: true,
        data: overview
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
}
