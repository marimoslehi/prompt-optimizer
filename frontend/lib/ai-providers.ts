// lib/ai-providers.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// Types for API responses
export interface ModelResponse {
  content: string;
  tokens: number;
  cost: number;
  latency: number;
  quality: number;
}

export interface APIKeys {
  openai?: string;
  anthropic?: string;
  google?: string;
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

// Real API integration class
export class AIProviders {
  private apiKeys: APIKeys;
  private startTime: number = 0;

  constructor(apiKeys: APIKeys) {
    this.apiKeys = apiKeys;
  }

  // Test API key validity
  async testApiKey(provider: keyof APIKeys): Promise<boolean> {
    const key = this.apiKeys[provider];
    if (!key?.trim()) return false;

    try {
      switch (provider) {
        case 'openai':
          const openaiResponse = await fetch('https://api.openai.com/v1/models', {
            headers: { 'Authorization': `Bearer ${key}` }
          });
          return openaiResponse.ok;

        case 'anthropic':
          const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${key}`,
              'Content-Type': 'application/json',
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
              model: 'claude-3-haiku-20240307',
              max_tokens: 10,
              messages: [{ role: 'user', content: 'Hi' }]
            })
          });
          return anthropicResponse.ok;

        case 'google':
          const googleResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: 'Hello' }] }]
              })
            }
          );
          return googleResponse.ok;

        default:
          return false;
      }
    } catch (error) {
      console.error(`Error testing ${provider} key:`, error);
      return false;
    }
  }

  // OpenAI GPT integration
  async callOpenAI(prompt: string, model: 'gpt-4' | 'gpt-3.5-turbo'): Promise<ModelResponse> {
    if (!this.apiKeys.openai) {
      throw new Error('OpenAI API key not provided');
    }

    this.startTime = Date.now();
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKeys.openai}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model === 'gpt-4' ? 'gpt-4' : 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const latency = (Date.now() - this.startTime) / 1000;
      
      const inputTokens = data.usage?.prompt_tokens || 0;
      const outputTokens = data.usage?.completion_tokens || 0;
      
      let cost = 0;
      if (model === 'gpt-4') {
        cost = (inputTokens * 0.03 / 1000) + (outputTokens * 0.06 / 1000);
      } else {
        cost = (inputTokens * 0.0015 / 1000) + (outputTokens * 0.002 / 1000);
      }

      return {
        content: data.choices[0]?.message?.content || 'No response',
        tokens: data.usage?.total_tokens || 0,
        cost: cost,
        latency: latency,
        quality: Math.floor(Math.random() * 10) + 85,
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  // Anthropic Claude integration
  async callClaude(prompt: string, model: 'claude-3-opus' | 'claude-3-haiku'): Promise<ModelResponse> {
    if (!this.apiKeys.anthropic) {
      throw new Error('Anthropic API key not provided');
    }

    this.startTime = Date.now();
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKeys.anthropic}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: model === 'claude-3-opus' ? 'claude-3-opus-20240229' : 'claude-3-haiku-20240307',
          max_tokens: 1500,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Anthropic API error: ${response.status} ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const latency = (Date.now() - this.startTime) / 1000;
      
      const inputTokens = data.usage?.input_tokens || 0;
      const outputTokens = data.usage?.output_tokens || 0;
      
      let cost = 0;
      if (model === 'claude-3-opus') {
        cost = (inputTokens * 0.015 / 1000) + (outputTokens * 0.075 / 1000);
      } else {
        cost = (inputTokens * 0.00025 / 1000) + (outputTokens * 0.00125 / 1000);
      }

      return {
        content: data.content[0]?.text || 'No response',
        tokens: inputTokens + outputTokens,
        cost: cost,
        latency: latency,
        quality: Math.floor(Math.random() * 10) + 85,
      };
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw error;
    }
  }

  // Google Gemini integration (FREE for Gemini 1.5 Flash)
  async callGemini(prompt: string, model: 'gemini-pro' | 'gemini-1.5-flash'): Promise<ModelResponse> {
    if (!this.apiKeys.google) {
      throw new Error('Google API key not provided');
    }

    this.startTime = Date.now();
    
    try {
      const genAI = new GoogleGenerativeAI(this.apiKeys.google);
      const modelName = model === 'gemini-pro' ? 'gemini-pro' : 'gemini-1.5-flash';
      const geminiModel = genAI.getGenerativeModel({ model: modelName });

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const latency = (Date.now() - this.startTime) / 1000;
      
      // Estimate tokens (rough approximation: 1 token ≈ 4 characters)
      const estimatedTokens = Math.ceil((prompt.length + text.length) / 4);
      
      // Calculate cost - Gemini 1.5 Flash is FREE up to certain limits
      let cost = 0;
      if (model === 'gemini-pro') {
        cost = estimatedTokens * 0.0005 / 1000;
      }
      // gemini-1.5-flash is FREE

      return {
        content: text,
        tokens: estimatedTokens,
        cost: cost,
        latency: latency,
        quality: Math.floor(Math.random() * 10) + 80,
      };
    } catch (error) {
      console.error('Google API error:', error);
      throw error;
    }
  }

  // Main method to call any model
  async callModel(modelId: string, prompt: string): Promise<ModelResponse> {
    switch (modelId) {
      case 'gpt-4':
        return this.callOpenAI(prompt, 'gpt-4');
      case 'gpt-3.5':
        return this.callOpenAI(prompt, 'gpt-3.5-turbo');
      case 'claude-3':
        return this.callClaude(prompt, 'claude-3-opus');
      case 'claude-3-haiku':
        return this.callClaude(prompt, 'claude-3-haiku');
      case 'gemini-pro':
        return this.callGemini(prompt, 'gemini-pro');
      case 'gemini-1.5-flash':
        return this.callGemini(prompt, 'gemini-1.5-flash');
      default:
        throw new Error(`Unsupported model: ${modelId}`);
    }
  }
}

// Hook for using AI providers in components
export const useAIProviders = () => {
  const callRealModels = async (
    selectedModels: string[], 
    prompt: string, 
    apiKeys: APIKeys
  ): Promise<{
    id: string;
    promptId: string;
    models: string[];
    results: TestResult[];
    totalCost: number;
    createdAt: string;
  }> => {
    const aiProviders = new AIProviders(apiKeys);
    const results: TestResult[] = [];

    for (const modelId of selectedModels) {
      try {
        console.log(`Calling ${modelId}...`);
        const response = await aiProviders.callModel(modelId, prompt);
        
        // Convert to conversation format
        const conversation: ConversationMessage[] = [
          {
            role: 'user',
            content: prompt,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          {
            role: 'assistant',
            content: response.content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];

        results.push({
          id: `${modelId}-${Date.now()}`,
          model: modelId,
          conversation: conversation,
          tokens: response.tokens,
          cost: response.cost,
          responseTime: response.latency * 1000,
          quality: response.quality
        });
      } catch (error) {
        console.error(`Error calling ${modelId}:`, error);
        // Add error result
        results.push({
          id: `${modelId}-error-${Date.now()}`,
          model: modelId,
          conversation: [
            {
              role: 'user',
              content: prompt,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            },
            {
              role: 'assistant',
              content: `❌ Error connecting to ${modelId}: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ],
          tokens: 0,
          cost: 0,
          responseTime: 0,
          quality: 0
        });
      }
    }

    return {
      id: Date.now().toString(),
      promptId: 'real',
      models: selectedModels,
      results: results,
      totalCost: results.reduce((sum, result) => sum + result.cost, 0),
      createdAt: new Date().toISOString()
    };
  };

  const testApiKey = async (provider: keyof APIKeys, apiKey: string): Promise<boolean> => {
    const aiProviders = new AIProviders({ [provider]: apiKey });
    return await aiProviders.testApiKey(provider);
  };

  return { callRealModels, testApiKey };
};