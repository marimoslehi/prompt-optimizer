// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// Prompt Types
export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromptRequest {
  title: string;
  content: string;
  category: string;
}

// Test Types
export interface TestResult {
  id: string;
  model: string;
  response: string;
  tokens: number;
  cost: number;
  responseTime: number;
  quality: number;
}

export interface Test {
  id: string;
  promptId: string;
  models: string[];
  results: TestResult[];
  totalCost: number;
  createdAt: string;
}

export interface RunTestRequest {
  promptId: string;
  models: string[];
  parameters?: Record<string, any>;
}

// Analytics Types
export interface CostAnalytics {
  totalCost: number;
  costByModel: Record<string, number>;
  dailySpend: Array<{
    date: string;
    cost: number;
  }>;
  savings: {
    amount: number;
    percentage: number;
  };
}

export interface UsageStats {
  totalTests: number;
  totalTokens: number;
  averageResponseTime: number;
  modelUsage: Record<string, number>;
  successRate: number;
}

export interface DashboardOverview {
  thisMonth: {
    tests: number;
    cost: number;
    tokens: number;
  };
  lastMonth: {
    tests: number;
    cost: number;
    tokens: number;
  };
  topModels: Array<{
    name: string;
    usage: number;
    cost: number;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
    cost: number;
  }>;
}

// API Key Types
export interface ApiKey {
  id: string;
  provider: string;
  createdAt: string;
  lastUsed: string | null;
  valid: boolean;
}
