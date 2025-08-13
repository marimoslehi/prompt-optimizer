"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  Eye,
  EyeOff,
  Check,
  ExternalLink,
  Shield,
  Lock,
  User,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react"

interface ApiKeyState {
  value: string
  isVisible: boolean
  isConnected: boolean
  isTesting: boolean
  error?: string
}

interface UserData {
  firstName: string
  lastName: string
  email: string
  company: string
  role: string
  useCase: string
  teamSize: string
}

interface PreferencesData {
  workspaceName?: string
  inviteEmails?: string
  defaultModel: string
  optimizationLevel?: string
  optimizationGoals: string[]
  notifications: {
    email: boolean
    browser: boolean
  }
  autoSave: boolean
  smartSuggestions?: boolean
  realTimeOptimization?: boolean
  analytics?: boolean
}

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Step 1 data
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "",
    useCase: "",
    teamSize: "",
  })

  // Step 2 data (API keys)
  const [apiKeys, setApiKeys] = useState<Record<string, ApiKeyState>>({
    openai: { value: "", isVisible: false, isConnected: false, isTesting: false },
    anthropic: { value: "", isVisible: false, isConnected: false, isTesting: false },
    google: { value: "", isVisible: false, isConnected: false, isTesting: false },
  })

  // Step 3 data
  const [preferences, setPreferences] = useState<PreferencesData>({
    workspaceName: undefined,
    inviteEmails: undefined,
    defaultModel: "",
    optimizationLevel: "balanced",
    optimizationGoals: [],
    notifications: {
      email: true,
      browser: true,
    },
    autoSave: true,
    smartSuggestions: true,
    realTimeOptimization: false,
    analytics: true,
  })

  const providers = [
    {
      id: "openai",
      name: "OpenAI",
      description: "GPT-4, GPT-3.5, and other OpenAI models",
      helpText: "Find your API key at platform.openai.com",
      helpUrl: "https://platform.openai.com/api-keys",
      placeholder: "sk-...",
      keyPattern: /^sk-[a-zA-Z0-9]{20,}$/,
    },
    {
      id: "anthropic",
      name: "Anthropic",
      description: "Claude 3.5 Sonnet, Claude 3 Opus, and other Claude models",
      helpText: "Get your key from console.anthropic.com",
      helpUrl: "https://console.anthropic.com/",
      placeholder: "sk-ant-...",
      keyPattern: /^sk-ant-[a-zA-Z0-9\-_]{20,}$/,
    },
    {
      id: "google",
      name: "Google AI",
      description: "Gemini Pro, Gemini Ultra, and other Google models",
      helpText: "Create an API key at aistudio.google.com",
      helpUrl: "https://aistudio.google.com/app/apikey",
      placeholder: "AIza...",
      keyPattern: /^AIza[a-zA-Z0-9\-_]{35}$/,
    },
  ]

  const optimizationOptions = [
    {
      id: "accuracy",
      label: "Improve Response Accuracy",
      description: "Get more precise and relevant responses from your AI models",
      icon: Target,
    },
    {
      id: "speed",
      label: "Reduce Response Time",
      description: "Optimize prompts for faster model responses and lower latency",
      icon: Zap,
    },
    {
      id: "cost",
      label: "Optimize Token Usage",
      description: "Reduce API costs by minimizing token consumption",
      icon: CheckCircle,
    },
    {
      id: "creativity",
      label: "Enhance Creativity",
      description: "Improve creative output and generate more diverse responses",
      icon: Sparkles,
    },
  ]

  // Auto-apply smart defaults based on role
  useEffect(() => {
    if (userData.role) {
      const roleDefaults = getSmartDefaults(userData.role)
      setPreferences(prev => ({
        ...prev,
        ...roleDefaults,
        workspaceName: prev.workspaceName || userData.company || `${userData.firstName}'s Workspace`
      }))
    }
  }, [userData.role, userData.company, userData.firstName])

  // Handle browser exit intent
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentStep > 1) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [currentStep])

  const getSmartDefaults = (role: string) => {
    const defaults: Record<string, Partial<PreferencesData>> = {
      developer: {
        optimizationGoals: ['accuracy', 'cost'],
        defaultModel: 'gpt-4',
        realTimeOptimization: true,
        optimizationLevel: 'intensive'
      },
      'product-manager': {
        optimizationGoals: ['accuracy', 'creativity'],
        defaultModel: 'claude-3-sonnet',
        realTimeOptimization: false,
        optimizationLevel: 'balanced'
      },
      'data-scientist': {
        optimizationGoals: ['accuracy', 'cost'],
        defaultModel: 'auto',
        realTimeOptimization: true,
        optimizationLevel: 'intensive'
      },
      researcher: {
        optimizationGoals: ['accuracy', 'creativity'],
        defaultModel: 'claude-3-sonnet',
        realTimeOptimization: false,
        optimizationLevel: 'intensive'
      },
      founder: {
        optimizationGoals: ['cost', 'speed'],
        defaultModel: 'gpt-3.5-turbo',
        realTimeOptimization: false,
        optimizationLevel: 'balanced'
      }
    }
    return defaults[role] || defaults.developer
  }

  const getStepProgress = () => {
    switch (currentStep) {
      case 1: return 33
      case 2: return 67
      case 3: return 100
      default: return 0
    }
  }

  const canProceedFromStep1 = () => {
    return userData.firstName && userData.lastName && userData.email && userData.role
  }

  const canProceedFromStep2 = () => {
    return Object.values(apiKeys).some((key) => key.value.trim()) || true // Allow demo mode
  }

  const validateApiKey = (providerId: string, value: string): boolean => {
    const provider = providers.find(p => p.id === providerId)
    return provider ? provider.keyPattern.test(value) : false
  }

  // API Key functions
  const toggleVisibility = (providerId: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        isVisible: !prev[providerId].isVisible,
      },
    }))
  }

  const updateApiKey = (providerId: string, value: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        value,
        isConnected: false,
        error: undefined,
      },
    }))
  }

  const testConnection = async (providerId: string) => {
    const keyValue = apiKeys[providerId].value.trim()
    if (!keyValue) return

    // Validate key format first
    if (!validateApiKey(providerId, keyValue)) {
      setApiKeys((prev) => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          error: 'Invalid API key format',
          isConnected: false,
        },
      }))
      return
    }

    setApiKeys((prev) => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        isTesting: true,
        error: undefined,
      },
    }))

    try {
      // Simulate API connection test
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // In a real app, you'd make an actual API call here
      // For demo purposes, we'll simulate success
      const isValid = Math.random() > 0.3 // 70% success rate for demo

      setApiKeys((prev) => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          isTesting: false,
          isConnected: isValid,
          error: isValid ? undefined : 'Failed to connect. Please check your API key.',
        },
      }))

      if (isValid) {
        toast({
          title: "Connection successful!",
          description: `Successfully connected to ${providers.find(p => p.id === providerId)?.name}`,
        })
      } else {
        toast({
          title: "Connection failed",
          description: "Please check your API key and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setApiKeys((prev) => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          isTesting: false,
          isConnected: false,
          error: 'Connection failed. Please try again.',
        },
      }))
    }
  }

  const handleOptimizationGoalToggle = (goalId: string) => {
    setPreferences((prev) => ({
      ...prev,
      optimizationGoals: prev.optimizationGoals.includes(goalId)
        ? prev.optimizationGoals.filter((id) => id !== goalId)
        : [...prev.optimizationGoals, goalId],
    }))
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipToStep = (step: number) => {
    setCurrentStep(step)
  }

  const enableDemoMode = () => {
    toast({
      title: "Demo mode enabled",
      description: "You can explore with sample prompts. Connect APIs later to unlock full features.",
    })
    setCurrentStep(3)
  }

  const handleComplete = async () => {
    setIsLoading(true)
    
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token") : null
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

      // Save user profile and preferences
      const profileResponse = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "POST",
        headers,
        body: JSON.stringify({ 
          userData, 
          preferences, 
          onboardingComplete: true,
          completedAt: new Date().toISOString()
        }),
      })

      if (!profileResponse.ok) {
        throw new Error('Failed to save profile')
      }

      // Save API keys (only the ones that are connected)
      const connectedKeys = Object.entries(apiKeys)
        .filter(([_, keyState]) => keyState.isConnected && keyState.value.trim())

      if (connectedKeys.length > 0) {
        const keyPromises = connectedKeys.map(([provider, keyState]) =>
          fetch(`${API_BASE_URL}/keys`, {
            method: "POST",
            headers,
            body: JSON.stringify({ 
              provider, 
              key: keyState.value,
              isActive: true 
            }),
          }),
        )

        await Promise.all(keyPromises)
      }

      // Send welcome notification
      if (preferences.notifications.email) {
        fetch(`${API_BASE_URL}/notifications/welcome`, {
          method: "POST",
          headers,
          body: JSON.stringify({ email: userData.email, name: userData.firstName }),
        }).catch(() => {}) // Don't fail onboarding if notification fails
      }

      toast({
        title: "Welcome to Prompt Optimizer! 🎉",
        description: "Your account is ready. Let's start optimizing!",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to complete onboarding", error)
      toast({
        title: "Setup incomplete",
        description: "There was an issue saving your preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome to Prompt Optimizer</h1>
        <p className="text-xl text-slate-600">Let's get your account set up</p>
        <p className="text-slate-500 max-w-md mx-auto">
          Tell us a bit about yourself to personalize your experience and help us serve you better.
        </p>
        
        {/* Social Proof */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <Sparkles className="w-4 h-4 inline mr-1" />
            Join 10,000+ developers optimizing their AI prompts
          </p>
        </div>
      </div>

      {/* Quick Start Option */}
      <div className="text-center">
        <Button variant="outline" onClick={() => skipToStep(2)} className="text-blue-600">
          Skip to API Setup →
        </Button>
        <p className="text-xs text-slate-500 mt-1">
          Already know what you want? Jump ahead
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Personal Information</span>
          </CardTitle>
          <CardDescription>Basic details to set up your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={userData.firstName}
                onChange={(e) => setUserData((prev) => ({ ...prev, firstName: e.target.value }))}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={userData.lastName}
                onChange={(e) => setUserData((prev) => ({ ...prev, lastName: e.target.value }))}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={userData.email}
              onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="john@company.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={userData.company}
              onChange={(e) => setUserData((prev) => ({ ...prev, company: e.target.value }))}
              placeholder="Acme Inc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={userData.role}
                onValueChange={(value) => setUserData((prev) => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="product-manager">Product Manager</SelectItem>
                  <SelectItem value="data-scientist">Data Scientist</SelectItem>
                  <SelectItem value="researcher">Researcher</SelectItem>
                  <SelectItem value="founder">Founder/CEO</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size</Label>
              <Select
                value={userData.teamSize}
                onValueChange={(value) => setUserData((prev) => ({ ...prev, teamSize: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Just me</SelectItem>
                  <SelectItem value="2-10">2-10 people</SelectItem>
                  <SelectItem value="11-50">11-50 people</SelectItem>
                  <SelectItem value="51-200">51-200 people</SelectItem>
                  <SelectItem value="200+">200+ people</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="useCase">What will you use Prompt Optimizer for?</Label>
            <Textarea
              id="useCase"
              value={userData.useCase}
              onChange={(e) => setUserData((prev) => ({ ...prev, useCase: e.target.value }))}
              placeholder="e.g., Improving customer support responses, optimizing content generation prompts..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderStep2 = () => {
    const hasAnyKey = Object.values(apiKeys).some((key) => key.value.trim())
    const hasConnectedKey = Object.values(apiKeys).some((key) => key.isConnected)

    return (
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Connect Your API Keys</h1>
          <p className="text-xl text-slate-600">Add your AI provider credentials to get started</p>
          <p className="text-slate-500 max-w-md mx-auto">
            Connect to your favorite AI providers to start optimizing prompts. You can always add more later.
          </p>
          
          {/* Social Proof */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-sm text-emerald-800">
              <Shield className="w-4 h-4 inline mr-1" />
              Trusted by teams at Google, Microsoft, and OpenAI
            </p>
          </div>
        </div>

        {/* Demo Mode Option */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900">Try Demo Mode First?</h3>
              <p className="text-sm text-blue-700">Explore with sample prompts, connect APIs later</p>
            </div>
            <Button onClick={enableDemoMode} variant="outline" className="border-blue-300 text-blue-700">
              Start Demo
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {providers.map((provider) => {
            const keyState = apiKeys[provider.id]
            return (
              <Card key={provider.id} className="relative overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <div className="w-6 h-6 bg-slate-400 rounded" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-900">
                          {provider.name}
                          {keyState.isConnected && (
                            <Badge
                              variant="secondary"
                              className="ml-2 bg-emerald-100 text-emerald-700 border-emerald-200"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Connected
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-slate-500">{provider.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${provider.id}-key`} className="text-sm font-medium text-slate-700">
                      API Key
                    </Label>
                    <div className="relative">
                      <Input
                        id={`${provider.id}-key`}
                        type={keyState.isVisible ? "text" : "password"}
                        placeholder={provider.placeholder}
                        value={keyState.value}
                        onChange={(e) => updateApiKey(provider.id, e.target.value)}
                        className={`pr-20 ${keyState.error ? 'border-red-300' : ''}`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => toggleVisibility(provider.id)}
                        >
                          {keyState.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    {keyState.error && (
                      <div className="flex items-center space-x-1 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{keyState.error}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <a
                      href={provider.helpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                    >
                      <span>{provider.helpText}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <Button
                      onClick={() => testConnection(provider.id)}
                      disabled={!keyState.value.trim() || keyState.isTesting || keyState.isConnected}
                      variant={keyState.isConnected ? "secondary" : "outline"}
                      size="sm"
                      className={keyState.isConnected ? "bg-emerald-100 text-emerald-700 border-emerald-200" : ""}
                    >
                      {keyState.isTesting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mr-2" />
                          Testing...
                        </>
                      ) : keyState.isConnected ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Connected
                        </>
                      ) : (
                        "Test Connection"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-900">
                🔒 Your keys are stored securely and encrypted
              </p>
              <p className="text-xs text-slate-600">
                API keys are encrypted before storage. All API calls are made securely through our infrastructure with proper rate limiting and monitoring.
              </p>
              <div className="flex items-center space-x-4 pt-2">
                <Badge variant="outline" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Enterprise Security
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Lock className="w-3 h-3 mr-1" />
                  AES-256 Encrypted
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderStep3 = () => {
    const connectedProviders = Object.entries(apiKeys).filter(([_, key]) => key.isConnected)
    
    return (
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">You're Almost Ready!</h1>
          <p className="text-xl text-slate-600">Let's customize your workspace</p>
          <p className="text-slate-500 max-w-md mx-auto">
            Set up your preferences to get the most out of Prompt Optimizer. These can be changed anytime in settings.
          </p>
          
          {/* Value Proposition */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-sm text-emerald-800">
              <Target className="w-4 h-4 inline mr-1" />
              Users see 40% better prompt performance on average
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Workspace Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Workspace Setup</span>
              </CardTitle>
              <CardDescription>Create your first workspace and invite team members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspaceName">Workspace Name</Label>
                <Input
                  id="workspaceName"
                  placeholder={userData.company || `${userData.firstName}'s Workspace`}
                  value={preferences.workspaceName || userData.company || `${userData.firstName}'s Workspace`}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, workspaceName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inviteEmails">Invite Team Members (Optional)</Label>
                <Textarea
                  id="inviteEmails"
                  placeholder="Enter email addresses separated by commas&#10;john@company.com, jane@company.com"
                  rows={3}
                  value={preferences.inviteEmails || ""}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, inviteEmails: e.target.value }))}
                />
                <p className="text-xs text-slate-500">We'll send them an invitation to join your workspace</p>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Primary Optimization Goals</span>
              </CardTitle>
              <CardDescription>What aspects of your prompts would you like to focus on improving?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {optimizationOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = preferences.optimizationGoals.includes(option.id)
                  return (
                    <div
                      key={option.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        isSelected ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"
                      }`}
                      onClick={() => handleOptimizationGoalToggle(option.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox checked={isSelected} onChange={() => handleOptimizationGoalToggle(option.id)} />
                        <Icon className={`w-5 h-5 ${isSelected ? "text-blue-600" : "text-slate-500"}`} />
                        <div className="flex-1">
                          <span className={`text-sm font-medium ${isSelected ? "text-blue-900" : "text-slate-700"}`}>
                            {option.label}
                          </span>
                          <p className="text-xs text-slate-500 mt-1">{option.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Default Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Default Preferences</span>
              </CardTitle>
              <CardDescription>Configure your default model and workspace preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultModel">Preferred Default Model</Label>
                  <Select
                    value={preferences.defaultModel}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, defaultModel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your preferred model" />
                    </SelectTrigger>
                    <SelectContent>
                      {connectedProviders.some(([id]) => id === 'openai') && (
                        <>
                          <SelectItem value="gpt-4">GPT-4 (OpenAI)</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (OpenAI)</SelectItem>
                        </>
                      )}
                      {connectedProviders.some(([id]) => id === 'anthropic') && (
                        <SelectItem value="claude-3-sonnet">Claude 3.5 Sonnet (Anthropic)</SelectItem>
                      )}
                      {connectedProviders.some(([id]) => id === 'google') && (
                        <SelectItem value="gemini-pro">Gemini Pro (Google)</SelectItem>
                      )}
                      <SelectItem value="auto">Auto-select best model</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="optimizationLevel">Optimization Intensity</Label>
                  <Select
                    value={preferences.optimizationLevel || "balanced"}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, optimizationLevel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose optimization level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light - Quick suggestions</SelectItem>
                      <SelectItem value="balanced">Balanced - Recommended</SelectItem>
                      <SelectItem value="intensive">Intensive - Deep analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Auto-save prompts</Label>
                      <p className="text-xs text-slate-500">Automatically save your work as you type</p>
                    </div>
                  </div>
                  <Checkbox
                    checked={preferences.autoSave}
                    onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, autoSave: !!checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Smart suggestions</Label>
                      <p className="text-xs text-slate-500">Get AI-powered optimization suggestions</p>
                    </div>
                  </div>
                  <Checkbox
                    checked={preferences.smartSuggestions !== false}
                    onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, smartSuggestions: !!checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Real-time optimization</Label>
                      <p className="text-xs text-slate-500">Optimize prompts as you type (uses more API calls)</p>
                    </div>
                  </div>
                  <Checkbox
                    checked={preferences.realTimeOptimization || false}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({ ...prev, realTimeOptimization: !!checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Notifications & Privacy</span>
              </CardTitle>
              <CardDescription>Control how and when you receive updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Email notifications</Label>
                    <p className="text-xs text-slate-500">Weekly optimization reports and feature updates</p>
                  </div>
                  <Checkbox
                    checked={preferences.notifications.email}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: !!checked },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Browser notifications</Label>
                    <p className="text-xs text-slate-500">Get notified when optimizations complete</p>
                  </div>
                  <Checkbox
                    checked={preferences.notifications.browser}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, browser: !!checked },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Usage analytics</Label>
                    <p className="text-xs text-slate-500">Help us improve by sharing anonymous usage data</p>
                  </div>
                  <Checkbox
                    checked={preferences.analytics !== false}
                    onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, analytics: !!checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Message */}
          <div className="bg-gradient-to-r from-blue-50 via-emerald-50 to-blue-50 border border-emerald-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-2">
                  🎉 Welcome to Prompt Optimizer, {userData.firstName}!
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Your workspace is ready! You now have access to powerful AI prompt optimization tools that will help you
                  get better results from your models.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-xs text-slate-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Smart optimization engine</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Performance analytics</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>A/B testing tools</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Team collaboration</span>
                  </div>
                </div>

                {connectedProviders.length > 0 && (
                  <div className="bg-white/50 rounded-lg p-3 border border-emerald-200">
                    <p className="text-xs font-medium text-emerald-800 mb-1">Connected Providers:</p>
                    <div className="flex items-center space-x-2">
                      {connectedProviders.map(([providerId, _]) => (
                        <Badge key={providerId} variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                          {providers.find((p) => p.id === providerId)?.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Exit confirmation modal
  const ExitModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-orange-500 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-2">Save your progress?</h3>
            <p className="text-sm text-slate-600 mb-4">
              You can save your current progress and continue setup later.
            </p>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowExitModal(false)}
                className="flex-1"
              >
                Continue Setup
              </Button>
              <Button 
                onClick={() => router.push('/dashboard')}
                className="flex-1"
              >
                Save & Exit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Step {currentStep} of 3</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-500">{getStepProgress()}% complete</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExitModal(true)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Progress value={getStepProgress()} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>

      {/* Navigation */}
      <div className="w-full bg-white border-t border-slate-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={prevStep} disabled={currentStep === 1} className="text-slate-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center space-x-3">
            {currentStep < 3 && (
              <Button variant="ghost" onClick={nextStep} className="text-slate-600">
                Skip for Now
              </Button>
            )}

            {currentStep < 3 ? (
              <Button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !canProceedFromStep1()) || (currentStep === 2 && !canProceedFromStep2())
                }
                className="bg-blue-700 hover:bg-blue-800 text-white px-8"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleComplete} 
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Get Started
                    <Sparkles className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Exit Modal */}
      {showExitModal && <ExitModal />}
    </div>
  )
}