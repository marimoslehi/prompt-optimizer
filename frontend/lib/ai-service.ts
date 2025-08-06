// lib/ai-service.ts
export interface ModelResponse {
  content: string;
  tokens: number;
  cost: number;
  latency: number;
  quality: number;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface TestResult {
  id: string;
  model: string;
  conversation: ConversationMessage[];
  tokens: number;
  cost: number;
  responseTime: number;
  quality: number;
}

export interface AIServiceResponse {
  id: string;
  promptId: string;
  models: string[];
  results: TestResult[];
  totalCost: number;
  creditsUsed: number;
  remainingCredits: number;
  createdAt: string;
}

export interface UserSubscription {
  plan: 'free' | 'pro';
  creditsRemaining: number;
  creditsTotal: number;
  renewalDate?: string;
  isActive: boolean;
}

// Centralized AI Service that uses your backend API
export class AIService {
  private baseUrl: string;
  private authToken: string | null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    this.authToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
    };
  }

  // Get user's subscription status and credits
  async getSubscriptionStatus(): Promise<UserSubscription> {
    try {
      const response = await fetch(`${this.baseUrl}/subscription/status`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        // Return free plan defaults if not authenticated or error
        return {
          plan: 'free',
          creditsRemaining: 3, // Free users get 3 tests
          creditsTotal: 3,
          isActive: true
        };
      }

      const data = await response.json();
      return data.subscription;
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return {
        plan: 'free',
        creditsRemaining: 3,
        creditsTotal: 3,
        isActive: true
      };
    }
  }

  // Run AI model comparison test
  async runModelComparison(
    selectedModels: string[], 
    prompt: string
  ): Promise<AIServiceResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/ai/compare`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          models: selectedModels,
          prompt: prompt,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 402) {
          throw new Error('Insufficient credits. Please upgrade to Pro plan.');
        }
        if (response.status === 401) {
          throw new Error('Please sign in to use AI model comparison.');
        }
        
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error running model comparison:', error);
      throw error;
    }
  }

  // Get pricing information
  async getPricingInfo() {
    return {
      free: {
        name: 'Free Trial',
        price: '$0',
        credits: 3,
        features: [
          '3 AI model comparisons',
          'Access to all models',
          'Basic analytics',
          'Community support'
        ]
      },
      pro: {
        name: 'Pro Plan',
        price: '$29',
        credits: 1000,
        features: [
          '1,000 comparisons/month',
          'All AI models included',
          'Advanced analytics',
          'Priority support',
          'Export results',
          'Usage history',
          'Custom prompts library'
        ]
      }
    };
  }

  // Upgrade to Pro subscription
  async upgradeToProPlan() {
    try {
      const response = await fetch(`${this.baseUrl}/subscription/upgrade`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          plan: 'pro',
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to upgrade subscription');
      }

      const data = await response.json();
      
      // Redirect to Stripe checkout if needed
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
      
      return data;
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription() {
    try {
      const response = await fetch(`${this.baseUrl}/subscription/cancel`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }
}

// React hook for using the AI service
export const useAIService = () => {
  const aiService = new AIService();

  const runTest = async (selectedModels: string[], prompt: string): Promise<AIServiceResponse> => {
    return await aiService.runModelComparison(selectedModels, prompt);
  };

  const getSubscription = async (): Promise<UserSubscription> => {
    return await aiService.getSubscriptionStatus();
  };

  const getPricing = async () => {
    return await aiService.getPricingInfo();
  };

  const upgradeToPro = async () => {
    return await aiService.upgradeToProPlan();
  };

  const cancelPlan = async () => {
    return await aiService.cancelSubscription();
  };

  return {
    runTest,
    getSubscription,
    getPricing,
    upgradeToPro,
    cancelPlan
  };
};