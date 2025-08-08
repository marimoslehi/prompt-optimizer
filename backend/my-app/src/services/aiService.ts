// backend/my-app/src/services/aiService.ts
import dotenv from 'dotenv';

// IMPORTANT: Load environment variables at the top
dotenv.config();

// Use built-in fetch (Node.js 18+) or uncomment the line below for older versions
// import fetch from 'node-fetch';

export interface AIModelResponse {
  model: string;
  content: string;
  tokens: number;
  cost: number;
  responseTime: number;
  quality: number;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ModelComparisonResult {
  id: string;
  model: string;
  conversation: ConversationMessage[];
  tokens: number;
  cost: number;
  responseTime: number;
  quality: number;
}

export class AIService {
  private apiKeys: any;
  
  constructor() {
    // Force reload environment variables
    dotenv.config();
    
    this.apiKeys = {
      openai: process.env.OPENAI_API_KEY || '',
      anthropic: process.env.ANTHROPIC_API_KEY || '',
      google: process.env.GOOGLE_AI_API_KEY || '',
      huggingface: process.env.HUGGINGFACE_API_TOKEN || '',
      groq: process.env.GROQ_API_TOKEN || ''
    };

    // Debug logging - REMOVE IN PRODUCTION
    console.log('🔑 Environment Variables Check:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- Current Working Dir:', process.cwd());
    console.log('- OpenAI Key:', this.apiKeys.openai ? `${this.apiKeys.openai.substring(0, 10)}...` : '❌ MISSING');
    console.log('- Google Key:', this.apiKeys.google ? `${this.apiKeys.google.substring(0, 10)}...` : '❌ MISSING');
    console.log('- Anthropic Key:', this.apiKeys.anthropic ? `${this.apiKeys.anthropic.substring(0, 10)}...` : '❌ MISSING');
    console.log('- Groq Key:', this.apiKeys.groq ? `${this.apiKeys.groq.substring(0, 10)}...` : '❌ MISSING');
    console.log('- Hugging Face Key:', this.apiKeys.huggingface ? `${this.apiKeys.huggingface.substring(0, 10)}...` : '❌ MISSING');
  }

  async runModelComparison(prompt: string, selectedModels: string[]): Promise<ModelComparisonResult[]> {
    const results: ModelComparisonResult[] = [];
    
    for (const modelId of selectedModels) {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const startTime = Date.now();
      
      try {
        console.log(`🚀 Attempting to call ${modelId}...`);
        const response = await this.callRealAPI(modelId, prompt);
        const responseTime = Date.now() - startTime;
        
        console.log(`✅ ${modelId} responded successfully`);
        
        results.push({
          id: `${modelId}-${Date.now()}`,
          model: modelId,
          conversation: [
            { role: 'user', content: prompt, timestamp },
            { role: 'assistant', content: response.content, timestamp }
          ],
          tokens: response.tokens,
          cost: response.cost,
          responseTime,
          quality: response.quality
        });
      } catch (error) {
        console.error(`❌ Error calling ${modelId}:`, error);
        
        // Check if API key is missing
        const missingKey = this.checkMissingApiKey(modelId);
        
        const errorContent = missingKey 
          ? `⚠️ **Missing API Key for ${modelId}**\n\nTo get real responses from ${modelId}:\n1. Get an API key from the provider\n2. Add it to your backend/.env file\n3. Restart your backend server\n\n**For now, here's a demo response:**\n\n${this.getMockResponse(modelId, prompt).content}`
          : `⚠️ **API Error - ${modelId}**\n\n${error instanceof Error ? error.message : 'Unknown error'}\n\n**Fallback demo response:**\n\n${this.getMockResponse(modelId, prompt).content}`;

        results.push({
          id: `${modelId}-${Date.now()}`,
          model: modelId,
          conversation: [
            { role: 'user', content: prompt, timestamp },
            { role: 'assistant', content: errorContent, timestamp }
          ],
          tokens: 0,
          cost: 0,
          responseTime: Date.now() - startTime,
          quality: 50
        });
      }
    }
    
    return results;
  }

  private checkMissingApiKey(modelId: string): boolean {
    switch (modelId) {
      case 'gpt-4':
      case 'gpt-3.5':
        return !this.apiKeys.openai;
      case 'claude-3':
      case 'claude-3-haiku':
        return !this.apiKeys.anthropic;
      case 'gemini-1.5-flash':
      case 'gemini-pro':
        return !this.apiKeys.google;
      case 'groq-llama':
        return !this.apiKeys.groq;
      case 'llama-7b':
      case 'mistral-7b':
        return !this.apiKeys.huggingface;
      default:
        return false;
    }
  }

  private async callRealAPI(modelId: string, prompt: string): Promise<AIModelResponse> {
    // Check if API key exists first
    if (this.checkMissingApiKey(modelId)) {
      throw new Error(`API key missing for ${modelId}`);
    }

    switch (modelId) {
      case 'gemini-1.5-flash':
        return await this.callGeminiAPI(prompt);
      case 'gpt-4':
        return await this.callOpenAIAPI(prompt, 'gpt-4');
      case 'gpt-3.5':
        return await this.callOpenAIAPI(prompt, 'gpt-3.5-turbo');
      case 'claude-3':
        return await this.callClaudeAPI(prompt, 'claude-3-opus-20240229');
      case 'claude-3-haiku':
        return await this.callClaudeAPI(prompt, 'claude-3-haiku-20240307');
      case 'groq-llama':
        return await this.callGroqAPI(prompt);
      case 'llama-7b':
        return await this.callHuggingFaceAPI(prompt, 'meta-llama/Llama-2-7b-chat-hf');
      case 'mistral-7b':
        return await this.callHuggingFaceAPI(prompt, 'mistralai/Mistral-7B-Instruct-v0.1');
      default:
        throw new Error(`Unknown model: ${modelId}`);
    }
  }

  private async callGeminiAPI(prompt: string): Promise<AIModelResponse> {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKeys.google}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
      
      return {
        model: 'gemini-1.5-flash',
        content,
        tokens: this.estimateTokens(prompt + content),
        cost: 0, // Free tier
        responseTime: 0,
        quality: 90
      };
    } catch (error) {
      console.error('Gemini API detailed error:', error);
      throw error;
    }
  }

  private async callOpenAIAPI(prompt: string, model: string): Promise<AIModelResponse> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKeys.openai}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || 'No response generated';
      const tokens = data.usage?.total_tokens || this.estimateTokens(prompt + content);
      
      return {
        model,
        content,
        tokens,
        cost: this.calculateOpenAICost(model, tokens),
        responseTime: 0,
        quality: model === 'gpt-4' ? 95 : 88
      };
    } catch (error) {
      console.error('OpenAI API detailed error:', error);
      throw error;
    }
  }

  private async callClaudeAPI(prompt: string, model: string): Promise<AIModelResponse> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKeys.anthropic,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          max_tokens: 500,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Claude API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text || 'No response generated';
      const tokens = data.usage?.input_tokens + data.usage?.output_tokens || this.estimateTokens(prompt + content);
      
      return {
        model,
        content,
        tokens,
        cost: this.calculateClaudeCost(model, tokens),
        responseTime: 0,
        quality: model.includes('opus') ? 93 : 87
      };
    } catch (error) {
      console.error('Claude API detailed error:', error);
      throw error;
    }
  }

  private async callGroqAPI(prompt: string): Promise<AIModelResponse> {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKeys.groq}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || 'No response generated';
      const tokens = data.usage?.total_tokens || this.estimateTokens(prompt + content);
      
      return {
        model: 'groq-llama',
        content,
        tokens,
        cost: 0.0001, // Very cheap
        responseTime: 0,
        quality: 88
      };
    } catch (error) {
      console.error('Groq API detailed error:', error);
      throw error;
    }
  }

  private async callHuggingFaceAPI(prompt: string, modelName?: string): Promise<AIModelResponse> {
    const model = modelName || 'meta-llama/Llama-2-7b-chat-hf';
    
    try {
      console.log(`🤗 Calling HuggingFace model: ${model}`);
      
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKeys.huggingface}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { 
            max_new_tokens: 150, 
            temperature: 0.7,
            return_full_text: false,
            do_sample: true
          },
          options: {
            wait_for_model: true,
            use_cache: false
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HuggingFace API Error Details:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          model: model
        });
        
        // Specific error handling
        if (response.status === 403) {
          throw new Error(`HuggingFace permission error: Your token needs "Inference Providers" permission. Please create a new token with Read access and Inference permissions.`);
        } else if (response.status === 503) {
          throw new Error(`HuggingFace model loading: ${model} is currently loading. Please try again in 30 seconds.`);
        } else {
          throw new Error(`HuggingFace API error: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      console.log(`✅ HuggingFace ${model} response:`, data);
      
      let content = '';
      
      // Handle different response formats
      if (Array.isArray(data) && data.length > 0) {
        if (data[0].generated_text) {
          content = data[0].generated_text.trim();
        } else if (data[0].text) {
          content = data[0].text.trim();
        }
      } else if (data.generated_text) {
        content = data.generated_text.trim();
      } else if (data.error) {
        throw new Error(`HuggingFace model error: ${data.error}`);
      }
      
      // Clean up content (remove prompt if it's repeated)
      if (content.startsWith(prompt)) {
        content = content.substring(prompt.length).trim();
      }
      
      if (!content) {
        content = 'No response generated from HuggingFace model';
      }
      
      const modelId = model.includes('mistral') ? 'mistral-7b' : 'llama-7b';
      
      return {
        model: modelId,
        content,
        tokens: this.estimateTokens(prompt + content),
        cost: 0, // Free tier
        responseTime: 0,
        quality: model.includes('mistral') ? 85 : 82
      };
    } catch (error) {
      console.error('HuggingFace API detailed error:', error);
      throw error;
    }
  }

  private getMockResponse(modelId: string, prompt: string): AIModelResponse {
    let content = '';
    let quality = 85;
    
    if (modelId === 'gemini-1.5-flash') {
      content = `**Gemini 1.5 Flash Response**\n\nFor your question: "${prompt}"\n\nThis is a fast, high-quality response from Google's Gemini 1.5 Flash model. The response would analyze your prompt and provide detailed insights here.\n\n**Key Points:**\n- Fast processing speed\n- High-quality analysis\n- Cost-effective solution\n\n*Note: This is a demo response. Add your Google AI API key to get real responses.*`;
      quality = 90;
    } else if (modelId === 'llama-7b') {
      content = `**Llama 2 7B Response**\n\nAnalyzing: "${prompt}"\n\nAs an open-source model, I can provide helpful insights and detailed analysis of your request. Here's my comprehensive response:\n\n**Analysis:**\n- Thorough examination of your prompt\n- Balanced perspective on the topic\n- Practical recommendations\n\n*Note: This is a demo response. Add your Hugging Face API token to get real responses.*`;
      quality = 82;
    } else if (modelId === 'groq-llama') {
      content = `**⚡ Groq Llama 3 - Ultra Fast Response**\n\nPrompt: "${prompt}"\n\n🚀 **Lightning Speed Analysis:**\nProcessed in milliseconds with high-quality results!\n\n**Key Features:**\n- Sub-second response times\n- High-quality output\n- Cost-effective processing\n- Optimized for speed\n\n*Note: This is a demo response. Add your Groq API token to get real responses.*`;
      quality = 88;
    } else if (modelId === 'gpt-4') {
      content = `**GPT-4 Response**\n\nThank you for your question: "${prompt}"\n\nAs GPT-4, I would provide a comprehensive, high-quality analysis of your prompt with detailed insights and recommendations.\n\n**Response Features:**\n- Advanced reasoning capabilities\n- Detailed explanations\n- Creative problem-solving\n- High accuracy\n\n*Note: This is a demo response. Add your OpenAI API key to get real responses.*`;
      quality = 95;
    } else if (modelId === 'gpt-3.5') {
      content = `**GPT-3.5 Turbo Response**\n\nRegarding: "${prompt}"\n\nI would provide a fast, efficient response with good quality analysis and practical insights.\n\n**Key Strengths:**\n- Quick response times\n- Cost-effective\n- Reliable performance\n- Good for most tasks\n\n*Note: This is a demo response. Add your OpenAI API key to get real responses.*`;
      quality = 88;
    } else if (modelId === 'claude-3') {
      content = `**Claude 3 Opus Response**\n\nIn response to: "${prompt}"\n\nI would offer thoughtful, nuanced analysis with careful attention to detail and ethical considerations.\n\n**Response Characteristics:**\n- Thoughtful analysis\n- Ethical considerations\n- Detailed explanations\n- High-quality reasoning\n\n*Note: This is a demo response. Add your Anthropic API key to get real responses.*`;
      quality = 93;
    } else if (modelId === 'claude-3-haiku') {
      content = `**Claude 3 Haiku Response**\n\nFor your prompt: "${prompt}"\n\nI would provide concise, efficient responses while maintaining high quality and helpfulness.\n\n**Features:**\n- Fast response times\n- Cost-effective\n- High quality\n- Concise but complete\n\n*Note: This is a demo response. Add your Anthropic API key to get real responses.*`;
      quality = 87;
    } else {
      content = `**${modelId.toUpperCase()} Response**\n\nThank you for your question: "${prompt}"\n\nThis is a demonstration response showing how ${modelId} would typically respond to your prompt with relevant analysis and insights.\n\n*Note: This is a demo response. Configure your API keys to get real responses.*`;
      quality = 85;
    }
    
    return {
      model: modelId,
      content,
      tokens: this.estimateTokens(prompt + content),
      cost: 0.001,
      responseTime: 0,
      quality
    };
  }

  private estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  private calculateOpenAICost(model: string, tokens: number): number {
    const rates = {
      'gpt-4': 0.03 / 1000, // $0.03 per 1K tokens
      'gpt-3.5-turbo': 0.002 / 1000 // $0.002 per 1K tokens
    };
    return (rates[model as keyof typeof rates] || 0.002) * tokens;
  }

  private calculateClaudeCost(model: string, tokens: number): number {
    const rates = {
      'claude-3-opus-20240229': 0.015 / 1000, // $0.015 per 1K tokens
      'claude-3-haiku-20240307': 0.00025 / 1000 // $0.00025 per 1K tokens
    };
    return (rates[model as keyof typeof rates] || 0.001) * tokens;
  }
}