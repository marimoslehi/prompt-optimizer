"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Play, 
  Download, 
  Settings, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  BarChart3, 
  FileText, 
  Bell, 
  User, 
  Bot,
  Crown,
  Zap,
  AlertCircle,
  ArrowRight,
  CreditCard,
  Send
} from "lucide-react"
import { useDashboardOverview, useCostAnalytics, usePrompts } from "@/hooks/useApi"
import { useAIService } from "@/lib/ai-service"
import { SubscriptionStatus, SubscriptionBadge } from "@/components/SubscriptionStatus"

const models = [
  // FREE MODELS (Real AI Responses)
  { 
    id: "gemini-1.5-flash", 
    name: "Gemini 1.5 Flash", 
    provider: "Google", 
    cost: "FREE", 
    logo: "⚡", 
    isFree: true,
    description: "Fast, high-quality responses from Google"
  },
  // TEMPORARILY DISABLED - No access currently
  // { 
  //   id: "llama-7b", 
  //   name: "Llama 2 7B", 
  //   provider: "Meta", 
  //   cost: "FREE", 
  //   logo: "🦙", 
  //   isFree: true,
  //   description: "Open-source model via Hugging Face"
  // },
  // { 
  //   id: "mistral-7b", 
  //   name: "Mistral 7B", 
  //   provider: "Mistral", 
  //   cost: "FREE", 
  //   logo: "🌪️", 
  //   isFree: true,
  //   description: "Efficient French AI model"
  // },
  { 
    id: "groq-llama", 
    name: "Groq Llama 3", 
    provider: "Groq", 
    cost: "FREE", 
    logo: "🚀", 
    isFree: true,
    description: "Ultra-fast inference (sub-second)"
  },
  
  // PREMIUM MODELS (Demo Responses - until you add API keys)
  { 
    id: "gpt-4", 
    name: "GPT-4", 
    provider: "OpenAI", 
    cost: "$0.03/1K tokens", 
    logo: "🤖",
    description: "Premium model (demo responses)"
  },
  { 
    id: "gpt-3.5", 
    name: "GPT-3.5 Turbo", 
    provider: "OpenAI", 
    cost: "$0.002/1K tokens", 
    logo: "🤖",
    description: "Fast premium model (demo responses)"
  },
  { 
    id: "claude-3", 
    name: "Claude 3 Opus", 
    provider: "Anthropic", 
    cost: "$0.015/1K tokens", 
    logo: "🧠",
    description: "Premium model (demo responses)"
  },
  { 
    id: "claude-3-haiku", 
    name: "Claude 3 Haiku", 
    provider: "Anthropic", 
    cost: "$0.00025/1K tokens", 
    logo: "🧠",
    description: "Fast premium model (demo responses)"
  },
  { 
    id: "gemini-pro", 
    name: "Gemini Pro", 
    provider: "Google", 
    cost: "$0.0005/1K tokens", 
    logo: "💎",
    description: "Premium model (demo responses)"
  },
]

// Enhanced mock responses with conversation-style interactions for fallback
const mockConversations = [
  {
    model: "GPT-4",
    messages: [
      {
        role: "user",
        content: "Analyze the following marketing strategy and provide actionable recommendations for improvement...",
        timestamp: "2:30 PM"
      },
      {
        role: "assistant",
        content: "I'd be happy to analyze your marketing strategy! Here's my comprehensive assessment:\n\n**Key Strengths Identified:**\n- Strong brand positioning in your target market\n- Good customer retention metrics\n\n**Priority Improvements:**\n\n1. **Enhanced Customer Segmentation**\n   - Implement behavioral segmentation\n   - Create personalized messaging for each segment\n\n2. **Multi-Channel Approach**\n   - Expand beyond current channels\n   - Integrate social media with email campaigns\n\n3. **Data-Driven Decision Making**\n   - Set up proper analytics tracking\n   - A/B test all major campaigns\n\n**Expected Impact:** These changes could increase conversion rates by 25-40% within 3 months.\n\nWould you like me to elaborate on any specific area?",
        timestamp: "2:31 PM"
      }
    ],
    tokens: 1247,
    cost: 0.037,
    latency: 2.3,
    quality: 94,
  },
  {
    model: "Claude 3 Haiku",
    messages: [
      {
        role: "user",
        content: "Analyze the following marketing strategy and provide actionable recommendations for improvement...",
        timestamp: "2:30 PM"
      },
      {
        role: "assistant",
        content: "Your marketing strategy shows solid fundamentals but has room for optimization. Let me break this down:\n\n**Current State Assessment:**\nYour strategy demonstrates good market understanding, though execution could be more targeted.\n\n**Actionable Recommendations:**\n\n• **Customer Segmentation Improvements**\n  Focus on creating distinct buyer personas with specific pain points\n\n• **Channel Diversity Expansion**\n  Consider adding video content and influencer partnerships\n\n• **Analytics-Driven Decisions**\n  Implement tracking for customer journey mapping\n\n**Quick Wins:**\n- Optimize email subject lines (potential 15% open rate increase)\n- Retarget website visitors with specific offers\n- Create urgency in CTAs\n\n**Timeline:** Start with email optimization this week, then roll out segmentation over next month.\n\nNeed specific tactics for any of these areas?",
        timestamp: "2:30 PM"
      }
    ],
    tokens: 892,
    cost: 0.0002,
    latency: 1.1,
    quality: 87,
  },
  {
    model: "Gemini 1.5 Flash",
    messages: [
      {
        role: "user",
        content: "Analyze the following marketing strategy and provide actionable recommendations for improvement...",
        timestamp: "2:30 PM"
      },
      {
        role: "assistant",
        content: "Quick marketing strategy analysis:\n\n**What's Working:**\n✓ Brand awareness seems solid\n✓ Customer base exists\n\n**What Needs Work:**\n\n🎯 **Targeting Issues**\nYour messaging is too broad. Narrow down to 2-3 specific customer types.\n\n📊 **Measurement Gaps**\nYou're flying blind without proper tracking. Start with Google Analytics goals.\n\n🔄 **Channel Mix**\nToo dependent on one channel. Diversify now.\n\n**3 Quick Fixes:**\n1. Create simple buyer personas this week\n2. Set up conversion tracking today\n3. Test one new channel next month\n\n**Budget Impact:** These fixes cost almost nothing but could boost results 20-30%.\n\n**Timeline:** All changes doable within 2 weeks.\n\nNeed help with any specific implementation?",
        timestamp: "2:30 PM"
      }
    ],
    tokens: 567,
    cost: 0,
    latency: 0.8,
    quality: 83,
  }
]

export default function DashboardPage() {
  const [selectedModels, setSelectedModels] = useState(["gpt-4", "claude-3-haiku", "gemini-1.5-flash"])
  const [prompt, setPrompt] = useState(
    "Analyze the following marketing strategy and provide actionable recommendations for improvement...",
  )
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  
  // Follow-up conversation state
  const [followUpMessages, setFollowUpMessages] = useState<{[key: string]: string}>({})
  const [sendingFollowUp, setSendingFollowUp] = useState<{[key: string]: boolean}>({})

  // API Data Hooks
  const { data: overview, loading: overviewLoading, error: overviewError } = useDashboardOverview()
  const { data: costAnalytics, loading: costLoading } = useCostAnalytics('30d')
  const { data: promptsData, loading: promptsLoading } = usePrompts()

  const handleModelToggle = (modelId: string, checked: boolean | string) => {
    const isChecked = checked === true || checked === "indeterminate";
    setSelectedModels((prev) =>
      isChecked ? [...new Set([...prev, modelId])] : prev.filter((id) => id !== modelId)
    );
  };

  const ensureUserMessage = (messages: { role: string; content: string }[]) => {
    if (!messages || !Array.isArray(messages)) return [];

    const hasUser = messages.some(msg => msg.role === "user");

    if (!hasUser) {
      return [
        { role: "user", content: "Hello! Can you answer this question?" },
        ...messages
      ];
    }

    return messages;
  };

  // FIXED: Follow-up message handler with better context processing
  const handleFollowUp = async (resultId: string, modelId: string, message: string) => {
    if (!message.trim()) return;
    
    setSendingFollowUp(prev => ({ ...prev, [resultId]: true }));
    
    try {
      const { runTest } = useAIService();
      
      // Get the conversation history for this model
      const currentResult = testResults.results.find((r: any) => r.id === resultId);
      if (!currentResult) return;
      
      // Check if this is a completely new request (like asking for a cooking resume)
      const isNewRequest = message.toLowerCase().includes('cooking') || 
                           message.toLowerCase().includes('culinary') ||
                           message.toLowerCase().includes('different') ||
                           message.toLowerCase().includes('another') ||
                           message.toLowerCase().includes('new');
      
      let contextualPrompt = '';
      
      if (isNewRequest) {
        // For completely new requests, provide minimal context
        // Removed llama and mistral specific handling since they're not available
        contextualPrompt = `New request (different from previous): ${message}`;
      } else {
        // For related follow-ups, build context based on model type
        // Removed llama and mistral specific handling since they're not available
        // For all models, use full context
        const conversationHistory = currentResult.conversation.map((msg: any) => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n\n');
        contextualPrompt = `Previous conversation:\n\n${conversationHistory}\n\nUser follow-up: ${message}`;
      }
      
      console.log(`🔄 Sending follow-up to ${modelId}:`, {
        modelId,
        isNewRequest,
        promptLength: contextualPrompt.length,
        message: message.slice(0, 50) + '...'
      });
      
      // Call just this one model with optimized context
      const results = await runTest([modelId], contextualPrompt);
      
      // Handle different possible response structures
      let apiResponse = null;
      if (results?.data?.results && Array.isArray(results.data.results) && results.data.results[0]) {
        apiResponse = results.data.results[0];
      } else if (results?.results && Array.isArray(results.results) && results.results[0]) {
        apiResponse = results.results[0];
      } else if (results && results.conversation) {
        // Direct response structure
        apiResponse = results;
      }
      
      if (apiResponse) {
        // Extract the actual response content
        let responseContent = '';
        if (apiResponse.conversation && Array.isArray(apiResponse.conversation) && apiResponse.conversation.length > 0) {
          // Find the assistant's response in the returned conversation
          const assistantMessage = apiResponse.conversation.find((msg: any) => msg.role === 'assistant');
          responseContent = assistantMessage?.content || apiResponse.conversation[apiResponse.conversation.length - 1]?.content || 'No response received';
        } else if (apiResponse.response) {
          // Direct response content
          responseContent = apiResponse.response;
        } else {
          responseContent = 'Error: No response content found';
        }
        
        // Update the conversation in testResults - with proper null checking
        setTestResults((prevResults: any) => {
          if (!prevResults || !prevResults.results || !Array.isArray(prevResults.results)) {
            return prevResults;
          }
          
          return {
            ...prevResults,
            results: prevResults.results.map((result: any) => {
              if (result.id === resultId) {
                return {
                  ...result,
                  conversation: [
                    ...(result.conversation || []),
                    {
                      role: 'user',
                      content: message,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    },
                    {
                      role: 'assistant',
                      content: responseContent,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ],
                  tokens: (result.tokens || 0) + (apiResponse.tokens || 0),
                  cost: (result.cost || 0) + (apiResponse.cost || 0)
                };
              }
              return result;
            })
          };
        });
        
        // Clear the input after successful response
        setFollowUpMessages(prev => ({ ...prev, [resultId]: '' }));
        
      } else {
        throw new Error('Invalid response structure from API - no valid data found');
      }
      
    } catch (error) {
      console.error(`❌ Follow-up error for ${modelId}:`, error);
      
      // Provide general error handling (removed model-specific handling for llama/mistral)
      let errorMessage = `⚠️ Sorry, I encountered an error processing your follow-up question. Please try again.`;
      
      // Add error message to conversation - with proper null checking
      setTestResults((prevResults: any) => {
        if (!prevResults || !prevResults.results || !Array.isArray(prevResults.results)) {
          return prevResults;
        }
        
        return {
          ...prevResults,
          results: prevResults.results.map((result: any) => {
            if (result.id === resultId) {
              return {
                ...result,
                conversation: [
                  ...(result.conversation || []),
                  {
                    role: 'user',
                    content: message,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  },
                  {
                    role: 'assistant',
                    content: errorMessage,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]
              };
            }
            return result;
          })
        };
      });
      
      setFollowUpMessages(prev => ({ ...prev, [resultId]: '' }));
    } finally {
      setSendingFollowUp(prev => ({ ...prev, [resultId]: false }));
    }
  };

  const handleRunTest = async () => {
    setIsRunning(true);
    setTestResults(null);

    try {
      const { runTest } = useAIService();
      
      console.log('🚀 Running test with models:', selectedModels);
      
      const results = await runTest(selectedModels, prompt);
      
      console.log('✅ Got results from backend:', results);
      
      // Handle different possible response structures safely
      let processedResults = null;
      
      if (results && typeof results === 'object') {
        if (results.data && typeof results.data === 'object') {
          console.log('✅ Using results.data structure');
          processedResults = results.data;
        } else if (results.results && Array.isArray(results.results)) {
          console.log('✅ Using results.results directly');
          processedResults = results;
        } else if (results.id || results.models) {
          // Direct results object
          console.log('✅ Using direct results object');
          processedResults = results;
        } else {
          console.log('⚠️ Unknown structure, using as-is');
          processedResults = results;
        }
      } else {
        throw new Error('Invalid response: expected object but got ' + typeof results);
      }
      
      if (processedResults) {
        setTestResults(processedResults);
      } else {
        throw new Error('No valid results found in API response');
      }
      
    } catch (error) {
      console.error("❌ API call failed:", error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.log('Error message:', errorMessage);
      
      // Create proper error results structure
      const errorResults = {
        id: Date.now().toString(),
        promptId: 'error',
        models: selectedModels,
        results: selectedModels.map((modelId, index) => ({
          id: `error-${index}`,
          model: modelId,
          conversation: [
            {
              role: 'user',
              content: prompt,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            },
            {
              role: 'assistant',
              content: `🔧 **Backend Test Error**\n\n${errorMessage}\n\n**Debug Info:**\n- Backend URL: ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}\n- Models: ${selectedModels.join(', ')}\n- Check browser Network tab and backend logs!`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ],
          tokens: 0,
          cost: 0,
          responseTime: 0,
          quality: 0
        })),
        totalCost: 0,
        creditsUsed: 0,
        remainingCredits: 0,
        createdAt: new Date().toISOString(),
        isDemoMode: false
      };
      
      setTestResults(errorResults);
    } finally {
      setTimeout(() => setIsRunning(false), 1500);
    }
  };

  // Show loading state
  if (overviewLoading || costLoading || promptsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Use API data with fallbacks
  const dashboardData = overview || {
    thisMonth: { tests: 45, cost: 89.45, tokens: 12450 },
    lastMonth: { tests: 38, cost: 76.23, tokens: 10890 },
    topModels: [
      { name: 'gpt-4', usage: 45, cost: 45.67 },
      { name: 'claude-3', usage: 38, cost: 28.90 }
    ]
  }

  const costData = costAnalytics || {
    totalCost: 245.67,
    costByModel: { 'GPT-4': 89.23, 'Claude 3': 12.45, 'Gemini Pro': 2.18 },
    savings: { amount: 1247, percentage: 67 }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">PO</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Prompt Optimizer</h1>
                <p className="text-sm text-gray-500">AI Cost Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <SubscriptionBadge />
              {overviewError && (
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  Mock Analytics
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="text-gray-700 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="w-4 h-4 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Settings className="w-4 h-4 text-gray-600" />
            </Button>
            <div className="flex items-center space-x-2 pl-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-medium">JD</span>
              </div>
              <span className="text-sm font-medium text-gray-700">John Doe</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Prompt Editor & Model Selection */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Subscription Status */}
            <SubscriptionStatus onUpgrade={() => {
              // Refresh page after successful upgrade
              window.location.reload();
            }} />

            {/* Demo Mode Alert */}
            {testResults?.isDemoMode && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Demo Mode:</strong> Showing sample responses. Sign in or upgrade for real AI results!
                </AlertDescription>
              </Alert>
            )}

            {/* Analytics Status */}
            {overviewError && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-orange-800">Dashboard using mock analytics data</span>
                </div>
              </div>
            )}

            {/* Prompt Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Prompt Template</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
                placeholder="Enter your prompt template here..."
              />
            </div>

            <Separator />

            {/* Model Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Select Models</h3>
              <div className="space-y-3">
                {models.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                  >
                    <Checkbox
                      id={model.id}
                      checked={selectedModels.includes(model.id)}
                      onCheckedChange={(checked) => handleModelToggle(model.id, checked)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{model.logo}</span>
                        <label htmlFor={model.id} className="text-sm font-medium text-gray-900 cursor-pointer">
                          {model.name}
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">{model.provider}</p>
                      <p className="text-xs text-gray-600 font-mono">{model.cost}</p>
                      {model.isFree && (
                        <Badge className="mt-1 bg-green-100 text-green-800 text-xs">
                          FREE
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Run Test Button */}
            <Button
              onClick={handleRunTest}
              disabled={isRunning || selectedModels.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              size="lg"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Running Test...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Test ({selectedModels.length} {selectedModels.length === 1 ? 'model' : 'models'})
                </>
              )}
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              Each test uses 1 credit per model selected
            </p>
          </div>
        </div>

        {/* Center Area - Conversation Comparison */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Model Conversation Comparison</h2>
            <p className="text-sm text-gray-600">Compare how different AI models respond to your prompts</p>
          </div>

          {testResults ? (
            <div>
              {/* Credits Usage Summary */}
              {testResults.creditsUsed > 0 && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        💳 Credits used: {testResults.creditsUsed}
                      </p>
                      <p className="text-xs text-blue-700">
                        Remaining: {testResults.remainingCredits}
                      </p>
                    </div>
                    {testResults.remainingCredits <= 5 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-200"
                        onClick={() => window.location.href = '/pricing'}
                      >
                        <Crown className="w-4 h-4 mr-1" />
                        Upgrade
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Demo Mode Banner */}
              {testResults.isDemoMode && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">🎉 Demo Mode - Sample Responses</p>
                      <p className="text-sm text-blue-100">Sign in to get real AI responses</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white text-blue-600 border-white hover:bg-blue-50"
                      onClick={() => window.location.href = '/sign-in'}
                    >
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Results Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(testResults?.results || []).map((result: any, index: number) => (
                  <Card key={index} className={`h-fit ${testResults.isDemoMode ? 'border-blue-200' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium capitalize flex items-center space-x-2">
                          <span>{result.model.replace('-', ' ')}</span>
                          <Badge variant="outline" className="text-xs">
                            Quality: {result.quality}%
                          </Badge>
                          {testResults.isDemoMode && (
                            <Badge className="text-xs bg-blue-100 text-blue-800">
                              Demo
                            </Badge>
                          )}
                        </CardTitle>
                        <Badge
                          variant={result.cost === 0 ? "default" : result.cost < 0.01 ? "default" : "destructive"}
                          className={result.cost === 0 ? "bg-green-100 text-green-800" : result.cost < 0.01 ? "bg-emerald-100 text-emerald-800" : ""}
                        >
                          {result.cost === 0 ? "FREE" : `${result.cost.toFixed(4)}`}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Chat-like conversation display */}
                        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto space-y-4">
                          {(result.conversation || []).map((message: any, msgIndex: number) => (
                            <div key={msgIndex} className={`flex space-x-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`flex space-x-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  message.role === 'user' 
                                    ? 'bg-blue-500' 
                                    : 'bg-gray-300'
                                }`}>
                                  {message.role === 'user' ? 
                                    <User className="w-4 h-4 text-white" /> : 
                                    <Bot className="w-4 h-4 text-gray-600" />
                                  }
                                </div>
                                <div className={`rounded-lg px-4 py-2 ${
                                  message.role === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white border border-gray-200'
                                }`}>
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                  <p className={`text-xs mt-2 ${
                                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                                  }`}>
                                    {message.timestamp}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Follow-up Message Input */}
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex space-x-2">
                            <div className="flex-1">
                              <Textarea
                                value={followUpMessages[result.id] || ''}
                                onChange={(e) => setFollowUpMessages(prev => ({ 
                                  ...prev, 
                                  [result.id]: e.target.value 
                                }))}
                                placeholder={`Ask ${result.model.replace('-', ' ')} a follow-up question...`}
                                className="min-h-[60px] text-sm resize-none"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleFollowUp(result.id, result.model, followUpMessages[result.id] || '');
                                  }
                                }}
                                disabled={sendingFollowUp[result.id]}
                              />
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleFollowUp(result.id, result.model, followUpMessages[result.id] || '')}
                              disabled={!followUpMessages[result.id]?.trim() || sendingFollowUp[result.id]}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                            >
                              {sendingFollowUp[result.id] ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            💡 Press Enter to send • Shift+Enter for new line
                          </p>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Tokens</p>
                            <p className="font-medium">{result.tokens.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Latency</p>
                            <p className="font-medium">{(result.responseTime / 1000).toFixed(1)}s</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Cost</p>
                            <p className="font-medium">{result.cost === 0 ? "FREE" : `${result.cost.toFixed(4)}`}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockConversations.slice(0, 2).map((conversation, index) => (
                <Card key={index} className="h-fit opacity-60 border-dashed border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium flex items-center space-x-2">
                        <span>{conversation.model}</span>
                        <Badge variant="outline" className="text-xs">
                          Quality: {conversation.quality}%
                        </Badge>
                      </CardTitle>
                      <Badge className="bg-gray-100 text-gray-800">
                        {conversation.cost === 0 ? "FREE" : `${conversation.cost.toFixed(4)}`}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                        {conversation.messages.map((message, msgIndex) => (
                          <div key={msgIndex} className={`flex space-x-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                message.role === 'user' 
                                  ? 'bg-blue-500' 
                                  : 'bg-gray-300'
                              }`}>
                                {message.role === 'user' ? 
                                  <User className="w-4 h-4 text-white" /> : 
                                  <Bot className="w-4 h-4 text-gray-600" />
                                }
                              </div>
                              <div className={`rounded-lg px-4 py-2 ${
                                message.role === 'user'
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white border border-gray-200'
                              }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                  {message.content.length > 200 ? message.content.substring(0, 200) + '...' : message.content}
                                </p>
                                <p className={`text-xs mt-2 ${
                                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                  {message.timestamp}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Tokens</p>
                          <p className="font-medium">{conversation.tokens.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Latency</p>
                          <p className="font-medium">{conversation.latency}s</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Cost</p>
                          <p className="font-medium">{conversation.cost === 0 ? "FREE" : `${conversation.cost.toFixed(4)}`}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Call to Action Overlay */}
              <div className="lg:col-span-2 text-center py-8">
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8">
                  <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ready to compare AI models?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Enter your prompt above and click "Run Test" to see real responses from multiple AI models
                  </p>
                  <Button
                    onClick={() => {
                      if (selectedModels.length === 0) {
                        setSelectedModels(["gpt-4", "gemini-1.5-flash"])
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Run Your First Test
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Metrics & Analytics */}
        <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Test Summary */}
            {testResults && (
              <Card className={testResults.isDemoMode ? "bg-blue-50 border-blue-200" : "bg-emerald-50 border-emerald-200"}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-base flex items-center ${testResults.isDemoMode ? 'text-blue-800' : 'text-emerald-800'}`}>
                    {testResults.isDemoMode ? <AlertCircle className="w-4 h-4 mr-2" /> : <TrendingDown className="w-4 h-4 mr-2" />}
                    {testResults.isDemoMode ? 'Demo Results' : 'Test Results'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Models tested</span>
                      <span className="font-semibold">{testResults?.results?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Credits used</span>
                      <span className="font-semibold">
                        {testResults.isDemoMode ? '0 (Demo)' : testResults.creditsUsed || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total cost</span>
                      <span className="font-semibold">
                        {testResults.isDemoMode ? 'Free' : `${(testResults.totalCost || 0).toFixed(4)}`}
                      </span>
                    </div>
                  </div>
                  {testResults.isDemoMode && (
                    <div className="mt-4 pt-3 border-t border-blue-200">
                      <Button
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => window.location.href = '/sign-in'}
                      >
                        Sign In for Real Results
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Cost Savings Summary */}
            <Card className="bg-emerald-50 border-emerald-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-emerald-800 flex items-center">
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Estimated Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-700 mb-1">
                  ${costData.savings?.amount || 1247}
                </div>
                <p className="text-sm text-emerald-600">This month (estimated)</p>
                <div className="mt-3">
                  <Badge className="bg-emerald-100 text-emerald-800">
                    ↓ {costData.savings?.percentage || 67}% reduction
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* ROI Metrics */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  ROI Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monthly ROI</span>
                  <span className="font-semibold text-emerald-600">+340%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. Cost per Query</span>
                  <span className="font-semibold">$0.0089</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Comparisons</span>
                  <span className="font-semibold">1,247</span>
                </div>
              </CardContent>
            </Card>

            {/* Model Performance */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Model Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. Response Time</span>
                  <span className="font-semibold">1.4s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-semibold text-emerald-600">99.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. Quality Score</span>
                  <span className="font-semibold">89/100</span>
                </div>
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Monthly Usage</span>
                    <span>247 / 1000</span>
                  </div>
                  <Progress value={24.7} className="h-2" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Most used model</span>
                    <span className="font-medium">GPT-4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best value model</span>
                    <span className="font-medium">Claude Haiku</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Model Recommendations */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Smart Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">💡 Cost Optimization Tip</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Try Claude Haiku for simple tasks - 99% similar quality to GPT-4 but 100x cheaper
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900">⚡ Speed Tip</p>
                  <p className="text-xs text-green-700 mt-1">
                    Gemini 1.5 Flash is FREE and 2x faster than GPT-4 for most queries
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}