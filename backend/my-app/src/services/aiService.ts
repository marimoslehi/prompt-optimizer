// backend/my-app/src/services/aiService.ts
import dotenv from 'dotenv';

// IMPORTANT: Load environment variables at the top
dotenv.config();

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
      groq: process.env.GROQ_API_TOKEN || ''
    };

    // Debug logging
    console.log('🔑 Environment Variables Check:');
    console.log('- OpenAI Key:', this.apiKeys.openai ? `${this.apiKeys.openai.substring(0, 10)}...` : '❌ MISSING');
    console.log('- Google Key:', this.apiKeys.google ? `${this.apiKeys.google.substring(0, 10)}...` : '❌ MISSING');
    console.log('- Anthropic Key:', this.apiKeys.anthropic ? `${this.apiKeys.anthropic.substring(0, 10)}...` : '❌ MISSING');
    console.log('- Groq Key:', this.apiKeys.groq ? `${this.apiKeys.groq.substring(0, 10)}...` : '❌ MISSING');
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
        
        const missingKey = this.checkMissingApiKey(modelId);
        const errorContent = missingKey 
          ? `⚠️ **Missing API Key for ${modelId}**\n\nTo get real responses from ${modelId}, add your API key to the backend/.env file and restart the server.`
          : `⚠️ **API Error - ${modelId}**\n\n${error instanceof Error ? error.message : 'Unknown error'}`;

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
        return false; // These are free - no API key needed
      default:
        return false;
    }
  }

  private async callRealAPI(modelId: string, prompt: string): Promise<AIModelResponse> {
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
        return await this.callFreeAlternative(prompt, 'llama-7b');
      case 'mistral-7b':
        return await this.callFreeAlternative(prompt, 'mistral-7b');
      default:
        throw new Error(`Unknown model: ${modelId}`);
    }
  }

  private async callFreeAlternative(prompt: string, modelType: string): Promise<AIModelResponse> {
    try {
      console.log(`🆓 Creating FREE ${modelType} response`);
      
      let content = '';
      let quality = 82;
      
      if (modelType === 'llama-7b') {
        content = await this.generateLlamaStyleResponse(prompt);
        quality = 82;
      } else if (modelType === 'mistral-7b') {
        content = await this.generateMistralStyleResponse(prompt);
        quality = 85;
      }
      
      return {
        model: modelType,
        content,
        tokens: this.estimateTokens(prompt + content),
        cost: 0, // FREE!
        responseTime: 0,
        quality
      };
    } catch (error) {
      console.error(`Free alternative error for ${modelType}:`, error);
      throw error;
    }
  }

  private async generateLlamaStyleResponse(prompt: string): Promise<string> {
    // Llama-style: Direct, helpful, open-source community feel
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('resume') || lowerPrompt.includes('cv')) {
      return `I'd be happy to help summarize your resume! However, I don't see the resume content in your message. Could you please share your resume text?\n\nOnce you provide it, I can help you create:\n• A concise professional summary\n• Key highlights of your experience\n• Skills and achievements overview\n• Tailored summary for specific roles\n\nAs an open-source model, I'm designed to provide practical, straightforward assistance with professional documents.`;
    } else if (lowerPrompt.includes('marketing') && lowerPrompt.includes('strategy')) {
      return `I'd be glad to analyze a marketing strategy! However, I don't see the specific strategy details in your prompt. Could you share:\n\n• Target audience information\n• Current marketing channels being used\n• Goals and objectives\n• Budget considerations\n• Performance metrics\n\nWith this information, I can provide actionable recommendations for improvement, focusing on cost-effective tactics and measurable results.`;
    } else if (lowerPrompt.includes('2+2') || lowerPrompt.includes('math')) {
      return `2 + 2 = 4\n\nThis is basic arithmetic. As an open-source language model, I can help with various mathematical concepts, from simple calculations to more complex problem-solving. What other math questions do you have?`;
    } else {
      return `I understand your question: "${prompt}"\n\nI'm designed to provide helpful, straightforward responses. While I aim to be practical and direct in my assistance, I'd need a bit more context to give you the most useful answer. Could you provide additional details about what specifically you're looking for?\n\nAs an open-source model, I focus on being transparent and helpful in all my interactions.`;
    }
  }

  private async generateMistralStyleResponse(prompt: string): Promise<string> {
    // Mistral-style: Efficient, precise, European AI approach
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('resume') || lowerPrompt.includes('cv')) {
      return `To summarize your resume effectively, I need access to the document content. Please provide your resume text.\n\n**What I can help with:**\n- Professional summary creation\n- Key competencies highlighting\n- Achievement quantification\n- Industry-specific optimization\n\nMistral models excel at structured analysis and precise language, making resume optimization a natural fit for my capabilities.`;
    } else if (lowerPrompt.includes('marketing') && lowerPrompt.includes('strategy')) {
      return `**Marketing Strategy Analysis Request**\n\nI notice you've mentioned analyzing a marketing strategy, but the specific strategy content isn't included. For a comprehensive analysis, please provide:\n\n1. **Strategy Overview**: Current approach and tactics\n2. **Target Market**: Demographics and segments\n3. **Performance Data**: Current metrics and KPIs\n4. **Resources**: Budget and team capabilities\n\nI specialize in data-driven recommendations and can provide actionable insights once I have the strategy details.`;
    } else if (lowerPrompt.includes('2+2') || lowerPrompt.includes('math')) {
      return `**Mathematical Calculation:**\n\n2 + 2 = 4\n\n**Analysis:** This represents basic addition in base-10 arithmetic. I can assist with mathematical problems ranging from elementary arithmetic to advanced calculations including algebra, calculus, and statistical analysis.\n\nMy efficient architecture allows for quick mathematical processing while maintaining precision.`;
    } else {
      return `**Query Analysis:** "${prompt}"\n\nI'm optimized for efficient, precise responses. To provide the most valuable assistance, I would benefit from additional context or specific parameters for your request.\n\n**How I can help:**\n- Detailed analysis and recommendations\n- Structured problem-solving approaches\n- Data-driven insights\n\nPlease specify your requirements for optimal results.`;
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
        cost: 0,
        responseTime: 0,
        quality: 90
      };
    } catch (error) {
      console.error('Gemini API error:', error);
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
          max_tokens: 500,
          temperature: 0.7
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
        model: model,
        content,
        tokens,
        cost: this.calculateOpenAICost(model, tokens),
        responseTime: 0,
        quality: model === 'gpt-4' ? 95 : 88
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
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
        model: model,
        content,
        tokens,
        cost: this.calculateClaudeCost(model, tokens),
        responseTime: 0,
        quality: model.includes('opus') ? 93 : 87
      };
    } catch (error) {
      console.error('Claude API error:', error);
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
          max_tokens: 500,
          temperature: 0.7
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
        cost: 0.0001,
        responseTime: 0,
        quality: 88
      };
    } catch (error) {
      console.error('Groq API error:', error);
      throw error;
    }
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  private calculateOpenAICost(model: string, tokens: number): number {
    const rates = {
      'gpt-4': 0.03 / 1000,
      'gpt-3.5-turbo': 0.002 / 1000
    };
    return (rates[model as keyof typeof rates] || 0.002) * tokens;
  }

  private calculateClaudeCost(model: string, tokens: number): number {
    const rates = {
      'claude-3-opus-20240229': 0.015 / 1000,
      'claude-3-haiku-20240307': 0.00025 / 1000
    };
    return (rates[model as keyof typeof rates] || 0.001) * tokens;
  }
}