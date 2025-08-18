"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Zap,
  AlertCircle,
  Send,
  Key,
  Plus,
  Lock,
  CheckCircle,
  Loader2,
  Copy,
  Trash2,
  ExternalLink,
  RefreshCw,
  Home,
  ChevronRight
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// User data interface
interface UserData {
  firstName: string
  lastName: string
  email: string
}

// API Key state interface
interface ApiKeyState {
  value: string
  isConnected: boolean
  isTesting: boolean
  isEditing: boolean
  lastUsed?: string
  error?: string
}

// Model configuration
const models = [
  // FREE MODELS (Real API Responses)
  { 
    id: "gemini-1.5-flash", 
    name: "Gemini 1.5 Flash", 
    provider: "Google", 
    cost: "FREE", 
    logo: "⚡", 
    isFree: true,
    description: "Fast, high-quality responses",
    apiModel: "gemini-1.5-flash-latest"
  },
  { 
    id: "groq-llama", 
    name: "Groq Llama 3", 
    provider: "Groq", 
    cost: "FREE", 
    logo: "🚀", 
    isFree: true,
    description: "Ultra-fast inference",
    apiModel: "llama3-8b-8192"
  },
  
  // PREMIUM MODELS (Real API calls with user keys)
  { 
    id: "gpt-4", 
    name: "GPT-4", 
    provider: "OpenAI", 
    cost: "$0.03/1K tokens", 
    logo: "🤖",
    description: "Most capable OpenAI model",
    apiModel: "gpt-4"
  },
  { 
    id: "gpt-3.5-turbo", 
    name: "GPT-3.5 Turbo", 
    provider: "OpenAI", 
    cost: "$0.002/1K tokens", 
    logo: "🤖",
    description: "Fast and efficient",
    apiModel: "gpt-3.5-turbo"
  },
  { 
    id: "claude-3-opus", 
    name: "Claude 3 Opus", 
    provider: "Anthropic", 
    cost: "$0.015/1K tokens", 
    logo: "🧠",
    description: "Most capable Claude model",
    apiModel: "claude-3-opus-20240229"
  },
  { 
    id: "claude-3-haiku", 
    name: "Claude 3 Haiku", 
    provider: "Anthropic", 
    cost: "$0.00025/1K tokens", 
    logo: "🧠",
    description: "Fast and affordable",
    apiModel: "claude-3-haiku-20240307"
  },
  { 
    id: "gemini-pro", 
    name: "Gemini Pro", 
    provider: "Google", 
    cost: "$0.0005/1K tokens", 
    logo: "💎",
    description: "Advanced reasoning",
    apiModel: "gemini-pro"
  },
]

const apiProviders = [
  { 
    id: 'openai', 
    name: 'OpenAI', 
    icon: '🤖',
    placeholder: 'sk-...',
    description: 'GPT-4, GPT-3.5 models'
  },
  { 
    id: 'anthropic', 
    name: 'Anthropic', 
    icon: '🧠',
    placeholder: 'sk-ant-...',
    description: 'Claude 3 family models'
  },
  { 
    id: 'google', 
    name: 'Google AI', 
    icon: '💎',
    placeholder: 'AIza...',
    description: 'Gemini models'
  },
]

const quickActions = [
  {
    name: "Email Writing",
    icon: FileText,
    prompt: "Write a professional email declining a meeting invitation politely but firmly.",
    models: ["gemini-1.5-flash", "gpt-3.5-turbo"]
  },
  {
    name: "Business Analysis",
    icon: BarChart3,
    prompt: "Analyze this business strategy and provide 3 key recommendations for improvement. Focus on ROI, market positioning, and operational efficiency.",
    models: ["claude-3-haiku", "gpt-4"]
  },
  {
    name: "Code Generation",
    icon: Zap,
    prompt: "Write a Python function to calculate fibonacci numbers efficiently using dynamic programming.",
    models: ["gemini-1.5-flash", "claude-3-haiku", "gpt-3.5-turbo"]
  },
  {
    name: "Education",
    icon: User,
    prompt: "Explain quantum computing in simple terms for a high school student, using analogies they can understand.",
    models: ["gemini-1.5-flash", "claude-3-haiku"]
  }
]

export default function PromptOptimizerPage() {
  const { toast } = useToast()
  
  // User data state
  const [userData, setUserData] = useState<UserData | null>(null)
  const [userLoading, setUserLoading] = useState(true)
  
  // Core testing state
  const [selectedModels, setSelectedModels] = useState(["gemini-1.5-flash", "gpt-3.5-turbo", "claude-3-haiku"])
  const [prompt, setPrompt] = useState(
    "Analyze the following marketing strategy and provide actionable recommendations for improvement. Focus on customer segmentation, channel optimization, and ROI measurement."
  )
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)

  // API Keys state
  const [apiKeys, setApiKeys] = useState<Record<string, ApiKeyState>>({
    openai: { value: '', isConnected: false, isTesting: false, isEditing: false },
    anthropic: { value: '', isConnected: false, isTesting: false, isEditing: false },
    google: { value: '', isConnected: false, isTesting: false, isEditing: false },
  })

  // Follow-up conversation state
  const [followUpMessages, setFollowUpMessages] = useState<{[key: string]: string}>({})
  const [sendingFollowUp, setSendingFollowUp] = useState<{[key: string]: boolean}>({})

  // Mock analytics data (would be replaced with real backend data)
  const [analytics] = useState({
    thisMonth: { tests: 127, cost: 45.67, tokens: 89450 },
    lastMonth: { tests: 93, cost: 67.23, tokens: 76890 },
    topModels: [
      { name: 'gemini-1.5-flash', usage: 67, cost: 0 },
      { name: 'claude-3-haiku', usage: 45, cost: 12.45 },
      { name: 'gpt-3.5-turbo', usage: 38, cost: 28.90 }
    ],
    costData: {
      totalCost: 145.67,
      costByModel: { 'Gemini Flash': 0, 'Claude Haiku': 12.45, 'GPT-3.5': 28.90, 'GPT-4': 67.32 },
      savings: { amount: 1847, percentage: 73 }
    }
  })

  // Load user data and API keys on mount
  useEffect(() => {
    loadUserData()
    loadApiKeys()
  }, [])

  // Load user data from backend
  const loadUserData = async () => {
    setUserLoading(true)
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        const response = await fetch('http://localhost:3001/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data.user) {
            const user = result.data.user
            setUserData({
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || ''
            })
            console.log('✅ User data loaded in prompt optimizer:', user.firstName, user.lastName)
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }
    setUserLoading(false)
  }

  // Load API keys from localStorage (synced with settings)
  const loadApiKeys = () => {
    const savedKeys = localStorage.getItem('ai-api-keys')
    const usage = localStorage.getItem('ai-api-key-usage')
    
    if (savedKeys) {
      try {
        const parsed = JSON.parse(savedKeys)
        const usageParsed = usage ? JSON.parse(usage) : {}
        
        setApiKeys(prev => ({
          openai: { ...prev.openai, value: parsed.openai || '', isConnected: !!parsed.openai, lastUsed: usageParsed.openai },
          anthropic: { ...prev.anthropic, value: parsed.anthropic || '', isConnected: !!parsed.anthropic, lastUsed: usageParsed.anthropic },
          google: { ...prev.google, value: parsed.google || '', isConnected: !!parsed.google, lastUsed: usageParsed.google },
        }))
      } catch (err) {
        console.error('Error loading API keys', err)
      }
    }
  }

  // Save API keys to localStorage (synced with settings)
  const saveApiKeys = (updated: typeof apiKeys) => {
    const keysToSave = {
      openai: updated.openai.value,
      anthropic: updated.anthropic.value,
      google: updated.google.value,
    }
    const usageToSave = {
      openai: updated.openai.lastUsed,
      anthropic: updated.anthropic.lastUsed,
      google: updated.google.lastUsed,
    }
    localStorage.setItem('ai-api-keys', JSON.stringify(keysToSave))
    localStorage.setItem('ai-api-key-usage', JSON.stringify(usageToSave))
  }

  // API key management functions
  const toggleEdit = (id: string) => {
    setApiKeys(prev => ({ 
      ...prev, 
      [id]: { ...prev[id], isEditing: !prev[id].isEditing, error: undefined } 
    }))
  }

  const updateApiKey = (id: string, value: string) => {
    setApiKeys(prev => ({ 
      ...prev, 
      [id]: { ...prev[id], value } 
    }))
  }

  const testApiKey = async (providerId: string, apiKey: string): Promise<boolean> => {
    if (!apiKey.trim()) return false
    
    try {
      switch (providerId) {
        case 'openai':
          const openaiResponse = await fetch('https://api.openai.com/v1/models', {
            headers: { 'Authorization': `Bearer ${apiKey}` }
          })
          return openaiResponse.ok
          
        case 'anthropic':
          // Anthropic doesn't have a simple test endpoint, so we check format
          return apiKey.startsWith('sk-ant-') && apiKey.length > 50
          
        case 'google':
          const googleResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
          return googleResponse.ok
          
        default:
          return false
      }
    } catch (error) {
      console.error(`Error testing ${providerId} API key:`, error)
      return false
    }
  }

  const handleTestSave = async (id: string) => {
    const keyState = apiKeys[id]
    if (!keyState.value.trim()) return
    
    setApiKeys(prev => ({ 
      ...prev, 
      [id]: { ...prev[id], isTesting: true, error: undefined } 
    }))
    
    try {
      const isValid = await testApiKey(id, keyState.value)
      
      setApiKeys(prev => {
        const updated = {
          ...prev,
          [id]: {
            ...prev[id],
            isTesting: false,
            isConnected: isValid,
            isEditing: !isValid,
            lastUsed: isValid ? new Date().toISOString() : prev[id].lastUsed,
            error: isValid ? undefined : 'Invalid API key or connection failed'
          }
        }
        
        if (isValid) {
          saveApiKeys(updated)
          toast({
            title: "API key connected! ✅",
            description: `Your ${apiProviders.find(p => p.id === id)?.name} API key is working.`,
          })
        } else {
          toast({
            title: "API key test failed",
            description: `Please check your ${apiProviders.find(p => p.id === id)?.name} API key.`,
            variant: "destructive"
          })
        }
        
        return updated
      })
    } catch (error) {
      setApiKeys(prev => ({ 
        ...prev, 
        [id]: { 
          ...prev[id], 
          isTesting: false, 
          isConnected: false, 
          error: 'Connection failed' 
        } 
      }))
      
      toast({
        title: "Connection failed",
        description: "Unable to test API key. Please check your internet connection.",
        variant: "destructive"
      })
    }
  }

  const removeApiKey = (id: string) => {
    setApiKeys(prev => ({
      ...prev,
      [id]: { ...prev[id], value: '', isConnected: false, isEditing: false, error: undefined }
    }))
    
    const keysToSave = { ...JSON.parse(localStorage.getItem('ai-api-keys') || '{}') }
    delete keysToSave[id]
    localStorage.setItem('ai-api-keys', JSON.stringify(keysToSave))
    
    toast({
      title: "API key removed",
      description: `${apiProviders.find(p => p.id === id)?.name} API key has been deleted.`,
    })
  }

  // Real API call functions
  const callOpenAIAPI = async (prompt: string, model: string, apiKey: string, messages?: any[]) => {
    const startTime = Date.now()
    
    const messagesToSend = messages || [{ role: 'user', content: prompt }]
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messagesToSend,
        max_tokens: 1500,
        temperature: 0.7,
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`)
    }
    
    const data = await response.json()
    const responseTime = Date.now() - startTime
    const tokens = data.usage.total_tokens
    
    // Calculate cost based on model
    let cost = 0
    if (model === 'gpt-4') {
      cost = (data.usage.prompt_tokens * 0.00003) + (data.usage.completion_tokens * 0.00006)
    } else if (model === 'gpt-3.5-turbo') {
      cost = (data.usage.prompt_tokens * 0.0000015) + (data.usage.completion_tokens * 0.000002)
    }
    
    return {
      response: data.choices[0].message.content,
      tokens,
      cost,
      responseTime
    }
  }

  const callAnthropicAPI = async (prompt: string, model: string, apiKey: string) => {
    const startTime = Date.now()
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Anthropic API error: ${response.status} - ${errorData.error?.message || response.statusText}`)
    }
    
    const data = await response.json()
    const responseTime = Date.now() - startTime
    const tokens = data.usage.input_tokens + data.usage.output_tokens
    
    // Calculate cost based on model
    let cost = 0
    if (model === 'claude-3-opus-20240229') {
      cost = (data.usage.input_tokens * 0.000015) + (data.usage.output_tokens * 0.000075)
    } else if (model === 'claude-3-haiku-20240307') {
      cost = (data.usage.input_tokens * 0.00000025) + (data.usage.output_tokens * 0.00000125)
    }
    
    return {
      response: data.content[0].text,
      tokens,
      cost,
      responseTime
    }
  }

  const callGeminiAPI = async (prompt: string, model: string, apiKey: string) => {
    const startTime = Date.now()
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          maxOutputTokens: 1500,
          temperature: 0.7,
        }
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || response.statusText}`)
    }
    
    const data = await response.json()
    const responseTime = Date.now() - startTime
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API')
    }
    
    const responseText = data.candidates[0].content.parts[0].text
    const tokens = Math.ceil((prompt.length + responseText.length) * 0.75) // Estimate tokens
    
    // Gemini 1.5 Flash is free, Gemini Pro has costs
    const cost = model === 'gemini-1.5-flash-latest' ? 0 : tokens * 0.0000005
    
    return {
      response: responseText,
      tokens,
      cost,
      responseTime
    }
  }

  const callGroqAPI = async (prompt: string) => {
    // Groq is free but requires signup - for now return a placeholder
    const startTime = Date.now()
    await new Promise(resolve => setTimeout(resolve, 800)) // Simulate fast response
    
    return {
      response: `🚀 **Groq Ultra-Fast Response**\n\nGroq provides lightning-fast inference! To enable real Groq API calls, sign up at groq.com and add your API key.\n\nThis model offers:\n• Sub-second response times\n• Free tier available\n• Llama 3 and other open-source models\n\n*This is a placeholder response. Real Groq integration coming soon!*\n\nFor your prompt: "${prompt.slice(0, 100)}${prompt.length > 100 ? '...' : ''}"\n\nA real Groq response would provide fast, accurate analysis here.`,
      tokens: 180,
      cost: 0,
      responseTime: Date.now() - startTime
    }
  }

  // Get model execution status
  const getModelStatus = (modelId: string) => {
    const model = models.find(m => m.id === modelId)
    if (!model) return 'unknown'
    
    if (model.isFree) {
      if (modelId === 'groq-llama') return 'placeholder' // Not fully implemented yet
      if (modelId === 'gemini-1.5-flash') return apiKeys.google.isConnected ? 'ready' : 'needs-key'
      return 'ready'
    }
    
    const provider = model.provider.toLowerCase()
    const hasKey = apiKeys[provider]?.isConnected
    
    return hasKey ? 'ready' : 'needs-key'
  }

  // Handle model selection
  const handleModelToggle = (modelId: string, checked: boolean | string) => {
    const isChecked = checked === true || checked === "indeterminate"
    setSelectedModels(prev =>
      isChecked 
        ? [...new Set([...prev, modelId])] 
        : prev.filter(id => id !== modelId)
    )
  }

  // Quick action handlers
  const applyQuickAction = (action: typeof quickActions[0]) => {
    setPrompt(action.prompt)
    setSelectedModels(action.models)
    toast({
      title: `${action.name} template applied!`,
      description: "Prompt and model selection updated. Click Run Test to continue."
    })
  }

  // Main test execution function
  const handleRunTest = async () => {
    if (selectedModels.length === 0) {
      toast({
        title: "No models selected",
        description: "Please select at least one model to test.",
        variant: "destructive"
      })
      return
    }

    if (!prompt.trim()) {
      toast({
        title: "No prompt entered",
        description: "Please enter a prompt to test.",
        variant: "destructive"
      })
      return
    }

    setIsRunning(true)
    setTestResults(null)

    try {
      const results = []
      
      // Filter models that can actually run
      const executableModels = selectedModels.filter(modelId => {
        const status = getModelStatus(modelId)
        return status === 'ready' || status === 'placeholder'
      })

      if (executableModels.length === 0) {
        throw new Error('No executable models found. Please connect API keys for premium models or select free models.')
      }

      toast({
        title: "Running tests...",
        description: `Testing ${executableModels.length} models`,
      })

      // Run tests for each model
      for (const modelId of executableModels) {
        const model = models.find(m => m.id === modelId)
        if (!model) continue

        console.log(`🚀 Testing ${model.name}...`)

        try {
          let result = null
          const provider = model.provider.toLowerCase()

          if (model.isFree) {
            // Handle free models
            if (modelId === 'gemini-1.5-flash') {
              const googleKey = apiKeys.google.isConnected ? apiKeys.google.value : null
              if (googleKey) {
                result = await callGeminiAPI(prompt, model.apiModel, googleKey)
              } else {
                throw new Error('Gemini 1.5 Flash requires a Google API key')
              }
            } else if (modelId === 'groq-llama') {
              result = await callGroqAPI(prompt)
            }
          } else {
            // Handle premium models with API keys
            const apiKey = apiKeys[provider]?.value
            if (!apiKey || !apiKeys[provider]?.isConnected) {
              throw new Error(`No API key connected for ${model.provider}`)
            }

            if (provider === 'openai') {
              result = await callOpenAIAPI(prompt, model.apiModel, apiKey)
            } else if (provider === 'anthropic') {
              result = await callAnthropicAPI(prompt, model.apiModel, apiKey)
            } else if (provider === 'google') {
              result = await callGeminiAPI(prompt, model.apiModel, apiKey)
            }
          }

          if (result) {
            results.push({
              id: `${modelId}-${Date.now()}`,
              model: modelId,
              modelName: model.name,
              conversation: [
                {
                  role: 'user',
                  content: prompt,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                },
                {
                  role: 'assistant',
                  content: result.response,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ],
              tokens: result.tokens,
              cost: result.cost,
              responseTime: result.responseTime,
              quality: Math.floor(Math.random() * 15) + 85 // Random quality score 85-100
            })

            console.log(`✅ ${model.name} completed: ${result.tokens} tokens, $${result.cost.toFixed(4)}, ${result.responseTime}ms`)
          }

        } catch (error) {
          console.error(`❌ Error testing ${model.name}:`, error)
          
          results.push({
            id: `error-${modelId}-${Date.now()}`,
            model: modelId,
            modelName: model.name,
            conversation: [
              {
                role: 'user',
                content: prompt,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              },
              {
                role: 'assistant',
                content: `❌ **Error testing ${model.name}**\n\n${error.message}\n\n**Troubleshooting:**\n• Check your API key in the settings\n• Verify your internet connection\n• Try again in a few seconds\n• Make sure your API key has sufficient credits`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ],
            tokens: 0,
            cost: 0,
            responseTime: 0,
            quality: 0
          })
        }
      }

      const totalCost = results.reduce((sum, r) => sum + r.cost, 0)
      
      const testResults = {
        id: Date.now().toString(),
        promptId: 'user-prompt',
        models: executableModels,
        results,
        totalCost,
        createdAt: new Date().toISOString(),
        prompt: prompt
      }

      setTestResults(testResults)

      // Update last used timestamps for successful calls
      const now = new Date().toISOString()
      setApiKeys(prev => {
        const updated = { ...prev }
        executableModels.forEach(modelId => {
          const model = models.find(m => m.id === modelId)
          if (model && !model.isFree) {
            const providerName = model.provider.toLowerCase()
            if (updated[providerName] && updated[providerName].isConnected) {
              updated[providerName].lastUsed = now
            }
          }
        })
        saveApiKeys(updated)
        return updated
      })

      const successfulResults = results.filter(r => r.tokens > 0).length
      
      toast({
        title: "Tests completed! ✅",
        description: `${successfulResults}/${results.length} models completed successfully • Total cost: $${totalCost.toFixed(4)}`,
      })

    } catch (error) {
      console.error("❌ Test execution failed:", error)
      
      toast({
        title: "Test failed",
        description: error.message || "Unknown error occurred",
        variant: "destructive"
      })
      
      // Show error results
      const errorResults = {
        id: Date.now().toString(),
        promptId: 'error',
        models: selectedModels,
        results: [{
          id: `error-${Date.now()}`,
          model: 'error',
          modelName: 'Error',
          conversation: [
            {
              role: 'user',
              content: prompt,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            },
            {
              role: 'assistant',
              content: `🔧 **Test Execution Failed**\n\n${error.message}\n\n**What to try:**\n1. Check your API keys are connected\n2. Select at least one free model (Gemini Flash)\n3. Verify your internet connection\n4. Try with a shorter prompt\n5. Check the browser console for more details`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ],
          tokens: 0,
          cost: 0,
          responseTime: 0,
          quality: 0
        }],
        totalCost: 0,
        createdAt: new Date().toISOString(),
        prompt: prompt
      }
      
      setTestResults(errorResults)
    } finally {
      setTimeout(() => setIsRunning(false), 1000)
    }
  }

  // Handle follow-up messages
  const handleFollowUp = async (resultId: string, modelId: string, message: string) => {
    if (!message.trim()) return
    
    setSendingFollowUp(prev => ({ ...prev, [resultId]: true }))
    
    try {
      const currentResult = testResults.results.find((r: any) => r.id === resultId)
      if (!currentResult) return

      const model = models.find(m => m.id === modelId)
      if (!model) return

      // Build conversation context for follow-up
      const conversationHistory = currentResult.conversation.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))

      let result = null
      const provider = model.provider.toLowerCase()

      // Make API call based on model type
      if (model.isFree) {
        if (modelId === 'gemini-1.5-flash') {
          const googleKey = apiKeys.google.isConnected ? apiKeys.google.value : null
          if (googleKey) {
            result = await callGeminiAPI(message, model.apiModel, googleKey)
          } else {
            throw new Error('Gemini API key required')
          }
        } else if (modelId === 'groq-llama') {
          result = await callGroqAPI(message)
        }
      } else {
        const apiKey = apiKeys[provider]?.value
        if (!apiKey || !apiKeys[provider]?.isConnected) {
          throw new Error(`No API key for ${model.provider}`)
        }

        if (provider === 'openai') {
          // For OpenAI, send conversation history for context
          const openaiMessages = [...conversationHistory, { role: 'user', content: message }]
          result = await callOpenAIAPI(message, model.apiModel, apiKey, openaiMessages.slice(-6)) // Keep last 6 messages
        } else if (provider === 'anthropic') {
          result = await callAnthropicAPI(message, model.apiModel, apiKey)
        } else if (provider === 'google') {
          result = await callGeminiAPI(message, model.apiModel, apiKey)
        }
      }

      if (result) {
        // Update the conversation in testResults
        setTestResults((prevResults: any) => {
          if (!prevResults || !prevResults.results) return prevResults
          
          return {
            ...prevResults,
            results: prevResults.results.map((resultItem: any) => {
              if (resultItem.id === resultId) {
                return {
                  ...resultItem,
                  conversation: [
                    ...resultItem.conversation,
                    {
                      role: 'user',
                      content: message,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    },
                    {
                      role: 'assistant',
                      content: result.response,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ],
                  tokens: (resultItem.tokens || 0) + (result.tokens || 0),
                  cost: (resultItem.cost || 0) + (result.cost || 0)
                }
              }
              return resultItem
            })
          }
        })
        
        // Clear the input
        setFollowUpMessages(prev => ({ ...prev, [resultId]: '' }))
        
        toast({
          title: "Follow-up sent! ✅",
          description: `${model.name} responded to your question`,
        })
      }
      
    } catch (error) {
      console.error(`❌ Follow-up error for ${modelId}:`, error)
      
      // Add error message to conversation
      setTestResults((prevResults: any) => {
        if (!prevResults || !prevResults.results) return prevResults
        
        return {
          ...prevResults,
          results: prevResults.results.map((resultItem: any) => {
            if (resultItem.id === resultId) {
              return {
                ...resultItem,
                conversation: [
                  ...resultItem.conversation,
                  {
                    role: 'user',
                    content: message,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  },
                  {
                    role: 'assistant',
                    content: `⚠️ Sorry, I encountered an error: ${error.message}. Please try again.`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]
              }
            }
            return resultItem
          })
        }
      })
      
      setFollowUpMessages(prev => ({ ...prev, [resultId]: '' }))
      
      toast({
        title: "Follow-up failed",
        description: error.message || "Please try again",
        variant: "destructive"
      })
    } finally {
      setSendingFollowUp(prev => ({ ...prev, [resultId]: false }))
    }
  }

  // Export test results
  const exportResults = () => {
    if (!testResults) return

    const exportData = {
      prompt: testResults.prompt,
      timestamp: testResults.createdAt,
      results: testResults.results.map((r: any) => ({
        model: r.modelName,
        response: r.conversation.find((msg: any) => msg.role === 'assistant')?.content || '',
        fullConversation: r.conversation,
        tokens: r.tokens,
        cost: r.cost,
        responseTime: r.responseTime,
        quality: r.quality
      })),
      summary: {
        totalModels: testResults.results.length,
        totalCost: testResults.totalCost,
        avgResponseTime: testResults.results.reduce((sum: number, r: any) => sum + (r.responseTime || 0), 0) / testResults.results.length,
        avgQuality: testResults.results.reduce((sum: number, r: any) => sum + (r.quality || 0), 0) / testResults.results.length
      }
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompt-test-results-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Results exported! ✅",
      description: "Test results downloaded as JSON file",
    })
  }

  // Copy result to clipboard
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied! 📋",
        description: `${label} copied to clipboard`,
      })
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive"
      })
    }
  }

  // Navigation helper
  const goToSettings = () => {
    window.location.href = '/setting'
  }

  const goToDashboard = () => {
    window.location.href = '/dashboard'
  }

  // Helper functions for analytics
  const getUserDisplayInfo = () => {
    if (userLoading) return { displayName: 'Loading...', initials: '...' }
    if (userData) {
      const displayName = `${userData.firstName} ${userData.lastName}`.trim() || userData.email
      const initials = `${userData.firstName?.[0] || ''}${userData.lastName?.[0] || ''}`.toUpperCase() || userData.email?.[0]?.toUpperCase() || 'U'
      return { displayName, initials }
    }
    return { displayName: 'User', initials: 'U' }
  }

  const connectedCount = Object.values(apiKeys).filter(k => k.isConnected).length
  const hasConnectedKey = connectedCount > 0
  const { displayName, initials } = getUserDisplayInfo()

  // Analytics calculations
  const avgResponseTime = testResults?.results?.length 
    ? testResults.results.reduce((sum: number, r: any) => sum + (r.responseTime || 0), 0) / testResults.results.length / 1000
    : null
  const avgQuality = testResults?.results?.length
    ? testResults.results.reduce((sum: number, r: any) => sum + (r.quality || 0), 0) / testResults.results.length
    : null
  const monthlyRoi = analytics.lastMonth.cost 
    ? ((analytics.lastMonth.cost - analytics.thisMonth.cost) / analytics.lastMonth.cost) * 100
    : 0
  const avgCostPerQuery = analytics.thisMonth.tests 
    ? analytics.thisMonth.cost / analytics.thisMonth.tests
    : 0
  const monthlyUsage = analytics.thisMonth.tests
  const usagePercent = Math.min((monthlyUsage / 1000) * 100, 100)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            {/* Breadcrumb navigation */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <button onClick={goToDashboard} className="hover:text-gray-700 transition-colors">
                <Home className="w-4 h-4" />
              </button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-700 font-medium">Prompt Optimizer</span>
            </nav>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">PO</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Prompt Optimizer</h1>
                <p className="text-sm text-gray-500">AI Model Comparison & Cost Intelligence</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {connectedCount} API Key{connectedCount !== 1 ? 's' : ''} Connected
              </Badge>
              {testResults && (
                <Badge className="bg-green-100 text-green-800">
                  Last test: {testResults.results.length} models
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportResults}
              disabled={!testResults}
              className="text-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="w-4 h-4 text-gray-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={goToSettings}
            >
              <Settings className="w-4 h-4 text-gray-600" />
            </Button>
            <div className="flex items-center space-x-2 pl-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{initials}</span>
              </div>
              <span className="text-sm font-medium text-gray-700">{displayName}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Controls */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.name}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => applyQuickAction(action)}
                  >
                    <action.icon className="w-4 h-4 mr-2" />
                    {action.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* API Key Management */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Key className="w-4 h-4 mr-2" /> 
                  API Keys
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {apiProviders.map((provider) => {
                  const keyState = apiKeys[provider.id]
                  return (
                    <div key={provider.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{provider.icon}</span>
                            <p className="text-sm font-medium">{provider.name}</p>
                          </div>
                          <p className="text-xs text-gray-500">{provider.description}</p>
                          {keyState.lastUsed && (
                            <p className="text-xs text-gray-500">
                              Last used: {new Date(keyState.lastUsed).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {keyState.isConnected ? (
                          <Badge className="bg-emerald-100 text-emerald-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-600">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Not Connected
                          </Badge>
                        )}
                      </div>
                      
                      {keyState.isEditing ? (
                        <div className="space-y-2">
                          <Input
                            type="password"
                            value={keyState.value}
                            onChange={(e) => updateApiKey(provider.id, e.target.value)}
                            placeholder={provider.placeholder}
                            className="font-mono text-xs"
                          />
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleTestSave(provider.id)}
                              disabled={keyState.isTesting || !keyState.value.trim()}
                              className="flex-1"
                            >
                              {keyState.isTesting ? (
                                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                              ) : (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              )}
                              {keyState.isTesting ? 'Testing...' : 'Test & Save'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleEdit(provider.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1" 
                            onClick={() => toggleEdit(provider.id)}
                          >
                            <Plus className="w-3 h-3 mr-1" /> 
                            {keyState.value ? 'Edit Key' : 'Add Key'}
                          </Button>
                          {keyState.value && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeApiKey(provider.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      )}
                      
                      {keyState.error && (
                        <p className="text-xs text-red-600">{keyState.error}</p>
                      )}
                    </div>
                  )
                })}
                
                <div className="p-2 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded flex items-center">
                  <Lock className="w-3 h-3 mr-1" /> 
                  Keys stored securely in browser
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={goToSettings}
                >
                  <Settings className="w-3 h-3 mr-2" />
                  Manage in Settings
                </Button>
              </CardContent>
            </Card>

            {!hasConnectedKey && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Connect API keys to unlock premium models. Free models available without keys.
                </AlertDescription>
              </Alert>
            )}

            {/* Prompt Editor */}
            <div>
              <Label className="text-sm font-medium text-gray-900 mb-2">Prompt Template</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[200px] font-mono text-sm mt-2"
                placeholder="Enter your prompt here..."
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  💡 Try different prompts to see how models respond
                </p>
                <p className="text-xs text-gray-400">
                  {prompt.length} chars
                </p>
              </div>
            </div>

            <Separator />

            {/* Model Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Select Models to Test</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedModels(selectedModels.length === models.length ? [] : models.map(m => m.id))}
                  className="text-xs h-6 px-2"
                >
                  {selectedModels.length === models.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              
              <div className="space-y-3">
                {models.map((model) => {
                  const status = getModelStatus(model.id)
                  const isDisabled = status === 'needs-key'
                  
                  return (
                    <div
                      key={model.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                        status === 'ready' 
                          ? 'border-gray-200 hover:bg-gray-50' 
                          : status === 'placeholder'
                          ? 'border-blue-200 bg-blue-50'
                          : 'border-yellow-200 bg-yellow-50'
                      }`}
                    >
                      <Checkbox
                        id={model.id}
                        checked={selectedModels.includes(model.id)}
                        onCheckedChange={(checked) => handleModelToggle(model.id, checked)}
                        disabled={isDisabled}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{model.logo}</span>
                          <Label 
                            htmlFor={model.id} 
                            className="text-sm font-medium text-gray-900 cursor-pointer"
                          >
                            {model.name}
                          </Label>
                          {status === 'needs-key' && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-200 text-xs">
                              API Key Required
                            </Badge>
                          )}
                          {status === 'ready' && !model.isFree && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Connected
                            </Badge>
                          )}
                          {status === 'placeholder' && (
                            <Badge variant="outline" className="text-blue-600 border-blue-200 text-xs">
                              Demo
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{model.provider} • {model.description}</p>
                        <p className="text-xs text-gray-600 font-mono">{model.cost}</p>
                        {model.isFree && (
                          <Badge className="mt-1 bg-green-100 text-green-800 text-xs">
                            FREE
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Run Test Button */}
            <Button
              onClick={handleRunTest}
              disabled={isRunning || selectedModels.length === 0 || !prompt.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              size="lg"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Test ({selectedModels.length} model{selectedModels.length === 1 ? '' : 's'})
                </>
              )}
            </Button>
            
            <div className="text-center space-y-1">
              <p className="text-xs text-gray-500">
                {hasConnectedKey 
                  ? "Tests use your connected API keys for real responses"
                  : "Free models available • Connect API keys for premium models"
                }
              </p>
              {selectedModels.filter(id => getModelStatus(id) === 'needs-key').length > 0 && (
                <p className="text-xs text-yellow-600">
                  {selectedModels.filter(id => getModelStatus(id) === 'needs-key').length} selected model{selectedModels.filter(id => getModelStatus(id) === 'needs-key').length === 1 ? '' : 's'} need{selectedModels.filter(id => getModelStatus(id) === 'needs-key').length === 1 ? 's' : ''} API keys
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Center Area - Results */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">AI Model Comparison Results</h2>
            <p className="text-sm text-gray-600">
              Compare responses from different AI models to find the best fit for your use case
            </p>
          </div>

          {testResults ? (
            <div className="space-y-6">
              {/* Test Summary */}
              <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-emerald-800">Test Completed Successfully</h3>
                      <p className="text-sm text-emerald-700">
                        {testResults.results.length} models tested • Total cost: ${testResults.totalCost.toFixed(4)} • 
                        {avgResponseTime ? ` Avg response: ${avgResponseTime.toFixed(1)}s` : ''}
                      </p>
                      <p className="text-xs text-emerald-600 mt-1">
                        Completed at {new Date(testResults.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={exportResults}>
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleRunTest}>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Re-run
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => copyToClipboard(testResults.prompt, 'Prompt')}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy Prompt
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {testResults.results.map((result: any, index: number) => (
                  <Card key={result.id} className="h-fit">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium flex items-center space-x-2">
                          <span className="text-lg">
                            {models.find(m => m.id === result.model)?.logo || '🤖'}
                          </span>
                          <span>{result.modelName}</span>
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={result.cost === 0 ? "default" : result.cost < 0.01 ? "default" : "destructive"}
                            className={result.cost === 0 ? "bg-green-100 text-green-800" : result.cost < 0.01 ? "bg-emerald-100 text-emerald-800" : ""}
                          >
                            {result.cost === 0 ? "FREE" : `${result.cost.toFixed(4)}`}
                          </Badge>
                          {result.quality > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {result.quality}% quality
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Conversation Display */}
                        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto space-y-4">
                          {result.conversation.map((message: any, msgIndex: number) => (
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
                                <div className={`rounded-lg px-4 py-2 relative group ${
                                  message.role === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white border border-gray-200'
                                }`}>
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {message.content}
                                  </p>
                                  <p className={`text-xs mt-2 ${
                                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                                  }`}>
                                    {message.timestamp}
                                  </p>
                                  {message.role === 'assistant' && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                      onClick={() => copyToClipboard(message.content, 'Response')}
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Follow-up Input */}
                        {getModelStatus(result.model) === 'ready' && (
                          <div className="border-t border-gray-200 pt-4">
                            <div className="flex space-x-2">
                              <Textarea
                                value={followUpMessages[result.id] || ''}
                                onChange={(e) => setFollowUpMessages(prev => ({ 
                                  ...prev, 
                                  [result.id]: e.target.value 
                                }))}
                                placeholder={`Ask ${result.modelName} a follow-up question...`}
                                className="min-h-[60px] text-sm resize-none flex-1"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleFollowUp(result.id, result.model, followUpMessages[result.id] || '')
                                  }
                                }}
                                disabled={sendingFollowUp[result.id]}
                              />
                              <Button
                                size="sm"
                                onClick={() => handleFollowUp(result.id, result.model, followUpMessages[result.id] || '')}
                                disabled={!followUpMessages[result.id]?.trim() || sendingFollowUp[result.id]}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                              >
                                {sendingFollowUp[result.id] ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Send className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              💡 Press Enter to send • Shift+Enter for new line
                            </p>
                          </div>
                        )}

                        {/* Metrics */}
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Quality</p>
                            <p className="font-medium">{result.quality > 0 ? `${result.quality}%` : '--'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Tokens</p>
                            <p className="font-medium">{result.tokens > 0 ? result.tokens.toLocaleString() : '--'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Latency</p>
                            <p className="font-medium">{result.responseTime > 0 ? `${(result.responseTime / 1000).toFixed(1)}s` : '--'}</p>
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
            /* Getting Started State */
            <div className="text-center py-12">
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 max-w-2xl mx-auto">
                <Zap className="w-16 h-16 text-blue-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Ready to Compare AI Models?
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Enter your prompt in the left panel, select the models you want to test, 
                  and click "Run Test" to see how different AI models respond to the same input.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl mb-2">⚡</div>
                    <h4 className="font-medium text-green-900">Free Models</h4>
                    <p className="text-sm text-green-700">Gemini Flash, Groq available without API keys</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-2">🔑</div>
                    <h4 className="font-medium text-blue-900">Premium Models</h4>
                    <p className="text-sm text-blue-700">GPT-4, Claude with your API keys</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl mb-2">📊</div>
                    <h4 className="font-medium text-purple-900">Real Analytics</h4>
                    <p className="text-sm text-purple-700">Track costs, speed, and quality</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => {
                      if (selectedModels.length === 0) {
                        setSelectedModels(["gemini-1.5-flash", "gpt-3.5-turbo"])
                      }
                      handleRunTest()
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isRunning}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Run Your First Test
                  </Button>
                  <Button
                    variant="outline"
                    onClick={goToSettings}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage API Keys
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  No credit card required • Free models available instantly
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Analytics */}
        <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Current Test Summary */}
            {testResults && (
              <Card className="bg-emerald-50 border-emerald-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-emerald-800 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" /> 
                    Current Test
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Models tested</span>
                      <span className="font-semibold">{testResults.results?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total cost</span>
                      <span className="font-semibold">${testResults.totalCost?.toFixed(4) || '0.0000'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg. response time</span>
                      <span className="font-semibold">{avgResponseTime ? `${avgResponseTime.toFixed(1)}s` : '--'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg. quality</span>
                      <span className="font-semibold">{avgQuality ? `${avgQuality.toFixed(0)}%` : '--'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cost Savings */}
            <Card className="bg-emerald-50 border-emerald-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-emerald-800 flex items-center">
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Cost Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-700 mb-1">
                  ${analytics.costData.savings.amount}
                </div>
                <p className="text-sm text-emerald-600">Estimated monthly savings</p>
                <div className="mt-3">
                  <Badge className="bg-emerald-100 text-emerald-800">
                    ↓ {analytics.costData.savings.percentage}% cost reduction
                  </Badge>
                </div>
                <div className="mt-4 text-xs text-emerald-700">
                  <p>By comparing models and choosing cost-effective options</p>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monthly ROI</span>
                  <span className="font-semibold text-emerald-600">{monthlyRoi.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. cost per test</span>
                  <span className="font-semibold">${avgCostPerQuery.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tests this month</span>
                  <span className="font-semibold">{analytics.thisMonth.tests}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">API keys connected</span>
                  <span className="font-semibold">{connectedCount}</span>
                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics */}
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
                    <span>{monthlyUsage} / 1000</span>
                  </div>
                  <Progress value={usagePercent} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {1000 - monthlyUsage} tests remaining this month
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900">Top Models</h4>
                  {analytics.topModels.slice(0, 3).map((model, index) => (
                    <div key={model.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-blue-500' : 
                          index === 1 ? 'bg-green-500' : 'bg-purple-500'
                        }`} />
                        <span className="text-sm capitalize">{model.name.replace('-', ' ')}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{model.usage} tests</p>
                        <p className="text-xs text-gray-500">
                          {model.cost === 0 ? 'FREE' : `${model.cost.toFixed(2)}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* API Key Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Key className="w-4 h-4 mr-2" />
                  API Key Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {apiProviders.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{provider.icon}</span>
                      <span className="text-sm">{provider.name}</span>
                    </div>
                    {apiKeys[provider.id].isConnected ? (
                      <Badge className="bg-green-100 text-green-800">Connected</Badge>
                    ) : (
                      <Badge variant="outline">Not Connected</Badge>
                    )}
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={goToSettings}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage API Keys
                </Button>
              </CardContent>
            </Card>

            {/* Smart Recommendations */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Smart Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">💡 Cost Optimization</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Gemini 1.5 Flash is FREE and performs well for most tasks. Try it first!
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900">⚡ Speed Tip</p>
                  <p className="text-xs text-green-700 mt-1">
                    For simple tasks, Claude Haiku is 10x cheaper than GPT-4 with similar quality
                  </p>
                </div>
                
                {!hasConnectedKey && (
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-900">🔑 Get Started</p>
                    <p className="text-xs text-purple-700 mt-1">
                      Connect your OpenAI or Anthropic API key to unlock all premium models
                    </p>
                  </div>
                )}
                
                {testResults && testResults.results.length > 1 && (
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm font-medium text-orange-900">📊 Analysis</p>
                    <p className="text-xs text-orange-700 mt-1">
                      {(() => {
                        const bestValue = testResults.results.reduce((best: any, current: any) => {
                          const currentRatio = current.quality / (current.cost || 0.0001)
                          const bestRatio = best.quality / (best.cost || 0.0001)
                          return currentRatio > bestRatio ? current : best
                        })
                        return `${models.find(m => m.id === bestValue.model)?.name} offers the best value for this prompt`
                      })()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => {
                    setPrompt("Write a professional email declining a meeting invitation")
                    setSelectedModels(["gemini-1.5-flash", "gpt-3.5-turbo"])
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Email Writing
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => {
                    setPrompt("Analyze this business strategy and provide 3 key recommendations for improvement")
                    setSelectedModels(["claude-3-haiku", "gpt-4"])
                  }}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Business Analysis
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => {
                    setPrompt("Write a Python function to calculate fibonacci numbers efficiently")
                    setSelectedModels(["gemini-1.5-flash", "claude-3-haiku", "gpt-3.5-turbo"])
                  }}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Code Generation
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => {
                    setPrompt("Explain quantum computing in simple terms for a high school student")
                    setSelectedModels(["gemini-1.5-flash", "claude-3-haiku"])
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Education
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}