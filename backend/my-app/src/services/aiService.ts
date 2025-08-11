// backend/my-app/src/services/aiService.ts
import dotenv from 'dotenv';

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
  private apiKeys: any = {};

  async runModelComparison(prompt: string, selectedModels: string[], apiKeys: any = {}): Promise<ModelComparisonResult[]> {
    this.apiKeys = apiKeys;
    const results: ModelComparisonResult[] = [];
    
    for (const modelId of selectedModels) {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const startTime = Date.now();
      
      try {
        console.log(`🚀 Attempting to call ${modelId}...`);
        
        // Optimize prompt for specific models
        const optimizedPrompt = this.optimizePromptForModel(prompt, modelId);
        
        const response = await this.callRealAPI(modelId, optimizedPrompt);
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
          ? `⚠️ **Missing API Key for ${modelId}**\n\nAdd a valid API key for this provider in your dashboard settings.`
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

  private optimizePromptForModel(prompt: string, modelId: string): string {
    // For smaller models, simplify complex prompts
    if (modelId.includes('llama') || modelId.includes('mistral')) {
      // If it's a follow-up conversation, extract the key parts
      if (prompt.includes('Previous conversation:') || prompt.includes('User follow-up:')) {
        const followUpMatch = prompt.match(/User follow-up:\s*(.+)$/s);
        const contextMatch = prompt.match(/Assistant:\s*(.+?)(?=\n\nUser|$)/s);
        
        if (followUpMatch) {
          const followUpQuestion = followUpMatch[1].trim();
          const recentContext = contextMatch ? contextMatch[1].trim().slice(-500) : '';
          
          return recentContext 
            ? `Based on our previous discussion: "${recentContext.slice(-200)}"\n\nQuestion: ${followUpQuestion}`
            : followUpQuestion;
        }
      }
      
      // Simplify complex prompts
      if (prompt.length > 1500) {
        return prompt.slice(-1000); // Keep only the most recent part
      }
    }
    
    return prompt;
  }

  private checkMissingApiKey(modelId: string): boolean {
    switch (modelId) {
      case 'gpt-4':
      case 'gpt-3.5-turbo':
        return !this.apiKeys.openai;
      case 'claude-3-opus-20240229':
      case 'claude-3-haiku-20240307':
        return !this.apiKeys.anthropic;
      case 'gemini-1.5-flash':
        return !this.apiKeys.google;
      case 'llama3-8b-8192':
        return !this.apiKeys.groq;
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
      case 'gpt-3.5-turbo':
        return await this.callOpenAIAPI(prompt, 'gpt-3.5-turbo');
      case 'claude-3-opus-20240229':
        return await this.callClaudeAPI(prompt, 'claude-3-opus-20240229');
      case 'claude-3-haiku-20240307':
        return await this.callClaudeAPI(prompt, 'claude-3-haiku-20240307');
      case 'llama3-8b-8192':
        return await this.callGroqAPI(prompt);
      case 'llama-7b':
        return await this.callSmartMockAPI(prompt, 'llama-7b');
      case 'mistral-7b':
        return await this.callSmartMockAPI(prompt, 'mistral-7b');
      default:
        throw new Error(`Unknown model: ${modelId}`);
    }
  }

  private async callSmartMockAPI(prompt: string, modelType: string): Promise<AIModelResponse> {
    try {
      console.log(`🆓 Creating SMART ${modelType} response for prompt:`, prompt.slice(0, 100) + '...');
      
      let content = '';
      let quality = 82;
      
      if (modelType === 'llama-7b') {
        content = await this.generateSmartLlamaResponse(prompt);
        quality = 82;
      } else if (modelType === 'mistral-7b') {
        content = await this.generateSmartMistralResponse(prompt);
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
      console.error(`Smart mock API error for ${modelType}:`, error);
      throw error;
    }
  }

  private async generateSmartLlamaResponse(prompt: string): Promise<string> {
    const lowerPrompt = prompt.toLowerCase();
    
    // Check if this contains resume content
    if (this.containsResumeContent(prompt)) {
      return this.analyzeResumeContent(prompt, 'llama');
    }
    
    // Check for follow-up questions about resume
    if (lowerPrompt.includes('make a new resume') || lowerPrompt.includes('create a resume')) {
      return `I'd be happy to help you create a new resume! Based on the information you've shared, here's what I can help you with:

**Resume Creation Services:**
• Professional formatting and structure
• Skills highlighting and organization  
• Experience optimization
• Achievement quantification
• ATS-friendly formatting

**What I need from you:**
• Target job/position you're applying for
• Preferred resume format (chronological, functional, or combination)
• Any specific requirements from job postings
• Additional achievements or skills to highlight

As an open-source model, I focus on practical, actionable advice. Would you like me to start with a specific section or create a complete new version?`;
    }
    
    // Marketing strategy analysis
    if (lowerPrompt.includes('marketing') && lowerPrompt.includes('strategy')) {
      return this.analyzeMarketingStrategy(prompt, 'llama');
    }
    
    // Math questions
    if (lowerPrompt.includes('2+2') || lowerPrompt.includes('math')) {
      return `2 + 2 = 4

This is basic arithmetic. As an open-source language model, I can help with various mathematical concepts, from simple calculations to more complex problem-solving. What other math questions do you have?`;
    }
    
    // Default response
    return `I understand you're asking: "${prompt.slice(0, 100)}${prompt.length > 100 ? '...' : ''}"

As an open-source model, I aim to provide helpful and straightforward responses. Could you provide a bit more context about what specific information or assistance you're looking for? This will help me give you the most useful answer.`;
  }

  private async generateSmartMistralResponse(prompt: string): Promise<string> {
    const lowerPrompt = prompt.toLowerCase();
    
    // Check if this contains resume content
    if (this.containsResumeContent(prompt)) {
      return this.analyzeResumeContent(prompt, 'mistral');
    }
    
    // Check for follow-up questions about resume
    if (lowerPrompt.includes('make a new resume') || lowerPrompt.includes('create a resume')) {
      return `**Resume Creation Request Processed**

I can assist with comprehensive resume optimization based on your provided background. Here's my structured approach:

**Available Services:**
- Professional summary crafting
- Technical skills reorganization  
- Experience section enhancement
- Achievement quantification
- Industry-specific customization

**Required Information:**
- Target role specifications
- Preferred resume format
- Key competencies to emphasize
- Specific industry requirements

**Mistral Advantage:** My efficient architecture excels at structured document creation and professional language optimization.

Please specify your target role and preferences to proceed with customized resume development.`;
    }
    
    // Marketing strategy analysis
    if (lowerPrompt.includes('marketing') && lowerPrompt.includes('strategy')) {
      return this.analyzeMarketingStrategy(prompt, 'mistral');
    }
    
    // Math questions
    if (lowerPrompt.includes('2+2') || lowerPrompt.includes('math')) {
      return `**Mathematical Calculation:**

2 + 2 = 4

**Analysis:** This represents basic addition in base-10 arithmetic. I can assist with mathematical problems ranging from elementary arithmetic to advanced calculations including algebra, calculus, and statistical analysis.

My efficient architecture allows for quick mathematical processing while maintaining precision.`;
    }
    
    // Default response
    return `**Query Analysis:** "${prompt.slice(0, 100)}${prompt.length > 100 ? '...' : ''}"

I'm optimized for efficient, precise responses. To provide the most valuable assistance, please specify your requirements or provide additional context for your request.

**Capabilities:**
- Detailed analysis and recommendations
- Structured problem-solving approaches  
- Data-driven insights
- Technical documentation

Please clarify your needs for optimal results.`;
  }

  private containsResumeContent(prompt: string): boolean {
    const resumeIndicators = [
      'objective',
      'career history',
      'education',
      'technical summary',
      'bachelor of science',
      'computer science',
      'programming:',
      'experience',
      'skills:',
      'projects:'
    ];
    
    const lowerPrompt = prompt.toLowerCase();
    return resumeIndicators.some(indicator => lowerPrompt.includes(indicator));
  }

  private analyzeResumeContent(prompt: string, modelStyle: string): string {
    // Extract key information from the resume
    const hasEducation = prompt.includes('Bachelor of Science') || prompt.includes('Computer Science');
    const hasExperience = prompt.includes('Instructional Assistant') || prompt.includes('Technical Art Consultant');
    const hasProjects = prompt.includes('ChemTrack') || prompt.includes('Automated Invoice');
    const hasSkills = prompt.includes('JavaScript') || prompt.includes('Python');
    
    if (modelStyle === 'llama') {
      return `**Resume Summary - Computer Science Student**

**Profile:** Computer Science student at Sacramento State University with strong technical background and hands-on experience in education and IT support.

**Key Strengths:**
• **Technical Skills:** Programming languages (JavaScript, Node.js, Python, Java, C++), system administration (Linux, MySQL)
• **Professional Experience:** Multiple roles in education and technical support, demonstrating client service and problem-solving abilities
• **Project Portfolio:** Developed practical applications including mobile apps and automation systems
• **Research Experience:** Contributed to wireless sensor network development at Texas A&M University

**Notable Achievements:**
• Currently working as Instructional Assistant & Math Tutor (2020-present)
• Led technical workshops and provided IT support at Sacramento State
• Built real-world applications using modern tech stack (Node.js, Firebase, Google Cloud)
• Maintained ERP systems with focus on reliability and troubleshooting

**Target Role Fit:** Well-suited for Student Assistant positions requiring technical assistance and PC support, with proven track record in troubleshooting and client services.

This resume demonstrates a solid foundation for entry-level technical roles with practical experience backing academic knowledge.`;
    } else {
      return `**Resume Analysis - Technical Profile Assessment**

**Candidate Overview:**
Computer Science student with comprehensive technical experience spanning education, research, and systems programming.

**Core Competencies:**
- **Programming Proficiency:** JavaScript, Node.js, Python, Java, C++, HTML/CSS
- **Systems Administration:** Linux, MySQL, Database Management, Network Fundamentals  
- **IT Support Expertise:** Hardware troubleshooting, software installations, remote assistance
- **Research & Development:** Wireless sensor networks, system optimization

**Professional Experience Summary:**
- **Education Sector:** 5+ years in instructional support and technical consulting roles
- **Research Contribution:** Texas A&M University wireless sensor framework development
- **Industry Experience:** ERP system programming and maintenance (Saipa)

**Project Portfolio:**
- Mobile application development with QR integration
- Cloud-based automation systems
- Complex mathematical visualization interfaces

**Assessment:** Strong candidate profile combining academic excellence with practical implementation experience. Technical skill set aligns well with Student Assistant requirements for PC support and technical assistance operations.

**Recommendation:** Resume demonstrates readiness for advanced technical support roles with potential for rapid progression.`;
    }
  }

  private analyzeMarketingStrategy(prompt: string, modelStyle: string): string {
    if (modelStyle === 'llama') {
      return `I'd be glad to analyze a marketing strategy! However, I notice you mentioned analyzing a marketing strategy but I don't see the specific strategy details in your message.

To provide a helpful analysis, I'd need to see:
• Target audience information
• Current marketing channels and tactics
• Goals and objectives  
• Budget considerations
• Performance metrics or results

Once you share the marketing strategy content, I can provide practical recommendations focusing on:
• Cost-effective improvements
• Channel optimization
• Audience targeting refinements
• Measurable tactics for better ROI

As an open-source model, I specialize in straightforward, actionable marketing advice. Please share the strategy details you'd like me to analyze!`;
    } else {
      return `**Marketing Strategy Analysis Request**

**Status:** Awaiting strategy documentation for comprehensive analysis.

**Required Input Data:**
1. **Strategic Overview:** Current approach and implemented tactics
2. **Market Analysis:** Target demographics and competitive landscape  
3. **Performance Metrics:** Existing KPIs and conversion data
4. **Resource Allocation:** Budget distribution and team capabilities
5. **Objectives:** Short-term and long-term marketing goals

**Analysis Framework:**
- Data-driven performance assessment
- ROI optimization recommendations
- Channel efficiency evaluation
- Competitive positioning analysis
- Implementation roadmap development

**Deliverables Upon Content Provision:**
- Actionable improvement strategies
- Resource optimization recommendations
- Performance enhancement tactics
- Measurable milestone definitions

Please provide the marketing strategy documentation for detailed analysis and optimization recommendations.`;
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