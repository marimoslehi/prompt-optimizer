// frontend/lib/api.ts
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
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token =
        localStorage.getItem('auth_token') ??
        sessionStorage.getItem('auth_token');
    }
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
    
    // Debug logging
    console.log('🔍 API Request Details:');
    console.log('  URL:', url);
    console.log('  Method:', options.method || 'GET');
    console.log('  Headers:', this.getAuthHeaders());
    console.log('  Body:', options.body);
    
    try {
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
        ...options,
      });

      console.log('📡 Response Status:', response.status);
      console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));

      // Get response text first to handle both JSON and error responses
      const responseText = await response.text();
      console.log('📡 Raw Response:', responseText);

      if (!response.ok) {
        // Try to parse error as JSON, otherwise use text
        let errorMessage = `API Error: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = responseText || errorMessage;
        }
        console.error('❌ API Error:', errorMessage);
        throw new Error(errorMessage);
      }

      // Parse successful response
      const data = JSON.parse(responseText);
      console.log('✅ Parsed Response:', data);
      return data;

    } catch (error) {
      console.error('💥 Request Failed:', error);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running on port 3001.');
      }
      
      throw error;
    }
  }

  // Health check method for debugging
  async health(): Promise<ApiResponse<any>> {
    return this.request('/health');
  }

  // Auth API
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    console.log('🔐 Attempting login for:', credentials.email);
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    console.log('📝 Attempting registration for:', userData.email);
    console.log('📝 Registration data:', { ...userData, password: '[HIDDEN]' });
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // NEW: Google OAuth methods
  async loginWithGoogle(): Promise<void> {
    console.log('🔗 Initiating Google OAuth login...');
    // Redirect to backend Google OAuth endpoint
    const googleAuthUrl = `${API_BASE_URL}/auth/google`;
    window.location.href = googleAuthUrl;
  }

  // This method is called by the OAuth callback page
  async verifyOAuthToken(token: string): Promise<ApiResponse<{ user: User }>> {
    console.log('🔍 Verifying OAuth token...');
    
    // Temporarily set the token to make the profile request
    const tempHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: tempHeaders,
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        throw new Error('Invalid OAuth token');
      }

      const data = JSON.parse(responseText);
      console.log('✅ OAuth token verified:', data);
      return data;

    } catch (error) {
      console.error('❌ OAuth token verification failed:', error);
      throw error;
    }
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/profile');
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<any>> {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
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

  async getUserStats(): Promise<ApiResponse<any>> {
    return this.request('/user/stats');
  }

  // Utility methods
  logout(): void {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    console.log('🚪 User logged out, tokens cleared');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token') ?? sessionStorage.getItem('auth_token');
    return !!token;
  }
}

export const apiClient = new ApiClient();