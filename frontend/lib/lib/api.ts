import { 
  ApiResponse, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  User,
  Prompt,
  CreatePromptRequest,
  Test,
  RunTestRequest,
  CostAnalytics,
  UsageStats,
  DashboardOverview
} from './types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Auth API
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/profile');
  }

  // Prompts API
  async getPrompts(): Promise<ApiResponse<{ prompts: Prompt[] }>> {
    return this.request<{ prompts: Prompt[] }>('/prompts');
  }

  async getPrompt(id: string): Promise<ApiResponse<{ prompt: Prompt }>> {
    return this.request<{ prompt: Prompt }>(`/prompts/${id}`);
  }

  async createPrompt(prompt: CreatePromptRequest): Promise<ApiResponse<{ prompt: Prompt }>> {
    return this.request<{ prompt: Prompt }>('/prompts', {
      method: 'POST',
      body: JSON.stringify(prompt),
    });
  }

  async updatePrompt(id: string, prompt: Partial<CreatePromptRequest>): Promise<ApiResponse<{ prompt: Prompt }>> {
    return this.request<{ prompt: Prompt }>(`/prompts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(prompt),
    });
  }

  async deletePrompt(id: string): Promise<ApiResponse<{}>> {
    return this.request<{}>(`/prompts/${id}`, {
      method: 'DELETE',
    });
  }

  // Tests API
  async runTest(testData: RunTestRequest): Promise<ApiResponse<Test>> {
    return this.request<Test>('/tests/run', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  }

  async getTestResults(id: string): Promise<ApiResponse<Test>> {
    return this.request<Test>(`/tests/${id}`);
  }

  async getTestHistory(): Promise<ApiResponse<{ history: Test[] }>> {
    return this.request<{ history: Test[] }>('/tests/history');
  }

  // Analytics API
  async getCostAnalytics(period: string = '30d'): Promise<ApiResponse<CostAnalytics>> {
    return this.request<CostAnalytics>(`/analytics/costs?period=${period}`);
  }

  async getUsageStats(period: string = '30d'): Promise<ApiResponse<UsageStats>> {
    return this.request<UsageStats>(`/analytics/usage?period=${period}`);
  }

  async getDashboardOverview(): Promise<ApiResponse<DashboardOverview>> {
    return this.request<DashboardOverview>('/analytics/dashboard');
  }
}

export const apiClient = new ApiClient();
