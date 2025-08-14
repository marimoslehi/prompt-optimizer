// backend/my-app/src/services/analyticsService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnalyticsService {
  // Get real dashboard overview data
  async getDashboardOverview(userId: string) {
    try {
      // For now, return empty data since Prisma isn't set up yet
      console.log('getDashboardOverview called for user:', userId);
      
      return {
        thisMonth: {
          tests: 0,
          cost: 0,
          tokens: 0
        },
        lastMonth: {
          tests: 0,
          cost: 0,
          tokens: 0
        },
        topModels: [], // Empty array to prevent map errors
        recentActivity: []
      };

      // TODO: Uncomment this after Prisma is set up
      /*
      const prisma = new PrismaClient();
      
      // Get this month's data
      const startOfThisMonth = new Date();
      startOfThisMonth.setDate(1);
      startOfThisMonth.setHours(0, 0, 0, 0);

      // Get last month's data
      const startOfLastMonth = new Date();
      startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
      startOfLastMonth.setDate(1);
      startOfLastMonth.setHours(0, 0, 0, 0);

      const endOfLastMonth = new Date(startOfThisMonth);
      endOfLastMonth.setMilliseconds(-1);

      // This month stats
      const thisMonthStats = await prisma.promptTest.aggregate({
        where: {
          userId,
          createdAt: { gte: startOfThisMonth }
        },
        _count: { id: true },
        _sum: { 
          totalCost: true,
          totalTokens: true 
        }
      });

      // Last month stats
      const lastMonthStats = await prisma.promptTest.aggregate({
        where: {
          userId,
          createdAt: { 
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        },
        _count: { id: true },
        _sum: { 
          totalCost: true,
          totalTokens: true 
        }
      });

      // Top models this month
      const topModels = await prisma.modelResult.groupBy({
        by: ['modelName'],
        where: {
          promptTest: {
            userId,
            createdAt: { gte: startOfThisMonth }
          }
        },
        _count: { id: true },
        _sum: { cost: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5
      });

      // Recent activity
      const recentActivity = await prisma.promptTest.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          modelResults: {
            select: { modelName: true, cost: true }
          }
        }
      });

      return {
        thisMonth: {
          tests: thisMonthStats._count.id || 0,
          cost: thisMonthStats._sum.totalCost || 0,
          tokens: thisMonthStats._sum.totalTokens || 0
        },
        lastMonth: {
          tests: lastMonthStats._count.id || 0,
          cost: lastMonthStats._sum.totalCost || 0,
          tokens: lastMonthStats._sum.totalTokens || 0
        },
        topModels: topModels.map(model => ({
          name: model.modelName.toLowerCase().replace(' ', '-'),
          usage: model._count.id,
          cost: model._sum.cost || 0
        })),
        recentActivity: recentActivity.map(test => ({
          type: 'test',
          description: `Ran test with ${test.modelResults.map(r => r.modelName).join(', ')}`,
          timestamp: test.createdAt,
          cost: test.totalCost
        }))
      };
      */
    } catch (error) {
      console.error('Error getting dashboard overview:', error);
      // Return empty data structure to prevent crashes
      return {
        thisMonth: { tests: 0, cost: 0, tokens: 0 },
        lastMonth: { tests: 0, cost: 0, tokens: 0 },
        topModels: [],
        recentActivity: []
      };
    }
  }

  // Get real cost analytics
  async getCostAnalytics(userId: string, period: string = '30d') {
    try {
      console.log('getCostAnalytics called for user:', userId, 'period:', period);
      
      // For now, return empty data
      return {
        totalCost: 0,
        costByModel: {},
        dailySpend: [],
        savings: { amount: 0, percentage: 0 }
      };

      // TODO: Uncomment after Prisma is set up
      /*
      const daysAgo = period === '7d' ? 7 : 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Your real implementation here...
      */
    } catch (error) {
      console.error('Error getting cost analytics:', error);
      return {
        totalCost: 0,
        costByModel: {},
        dailySpend: [],
        savings: { amount: 0, percentage: 0 }
      };
    }
  }

  // Get usage statistics
  async getUsageStats(userId: string) {
    try {
      console.log('getUsageStats called for user:', userId);
      
      // For now, return empty data
      return {
        totalTests: 0,
        totalTokens: 0,
        averageResponseTime: 0,
        modelUsage: {},
        successRate: 0
      };

      // TODO: Uncomment after Prisma is set up
    } catch (error) {
      console.error('Error getting usage stats:', error);
      return {
        totalTests: 0,
        totalTokens: 0,
        averageResponseTime: 0,
        modelUsage: {},
        successRate: 0
      };
    }
  }

  // Save prompt test results
  async savePromptTest(data: {
    userId: string;
    promptText: string;
    modelsSelected: string[];
    results: Array<{
      modelId: string;
      modelName: string;
      responseText: string;
      tokensUsed: number;
      cost: number;
      responseTimeMs: number;
      qualityScore: number;
    }>;
  }) {
    try {
      console.log('savePromptTest called with:', {
        userId: data.userId,
        promptLength: data.promptText.length,
        modelsCount: data.modelsSelected.length,
        resultsCount: data.results.length
      });

      // For now, just log the data - don't save to database
      console.log('Test data received:', JSON.stringify(data, null, 2));
      
      // Return mock success response
      return {
        id: 'mock-test-id',
        userId: data.userId,
        promptText: data.promptText,
        modelsSelected: data.modelsSelected,
        createdAt: new Date()
      };

      // TODO: Uncomment after Prisma is set up
      /*
      const totalCost = data.results.reduce((sum, r) => sum + r.cost, 0);
      const totalTokens = data.results.reduce((sum, r) => sum + r.tokensUsed, 0);
      const totalResponseTime = data.results.reduce((sum, r) => sum + r.responseTimeMs, 0);

      const promptTest = await prisma.promptTest.create({
        data: {
          userId: data.userId,
          promptText: data.promptText,
          modelsSelected: data.modelsSelected,
          totalCost,
          totalTokens,
          responseTimeMs: totalResponseTime,
          modelResults: {
            create: data.results.map(result => ({
              modelId: result.modelId,
              modelName: result.modelName,
              responseText: result.responseText,
              tokensUsed: result.tokensUsed,
              cost: result.cost,
              responseTimeMs: result.responseTimeMs,
              qualityScore: result.qualityScore
            }))
          }
        },
        include: {
          modelResults: true
        }
      });

      return promptTest;
      */
    } catch (error) {
      console.error('Error saving prompt test:', error);
      throw error;
    }
  }
}