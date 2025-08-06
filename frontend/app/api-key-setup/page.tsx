"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Check, ExternalLink, Shield, Lock, AlertCircle, Info } from "lucide-react"
import { useAIProviders } from "@/lib/ai-providers"

interface ApiKeyState {
  value: string
  isVisible: boolean
  isConnected: boolean | null // null = not tested, true = connected, false = failed
  isTesting: boolean
  error?: string
}

export default function ApiKeySetup() {
  const router = useRouter()
  const { testApiKey } = useAIProviders()
  
  const [apiKeys, setApiKeys] = useState<Record<string, ApiKeyState>>({
    openai: { value: "", isVisible: false, isConnected: null, isTesting: false },
    anthropic: { value: "", isVisible: false, isConnected: null, isTesting: false },
    google: { value: "", isVisible: false, isConnected: null, isTesting: false },
  })

  const providers = [
    {
      id: "openai",
      name: "OpenAI",
      description: "GPT-4, GPT-3.5, and other OpenAI models",
      helpText: "Find your API key at platform.openai.com",
      helpUrl: "https://platform.openai.com/api-keys",
      placeholder: "sk-proj-...",
      models: ["GPT-4", "GPT-3.5 Turbo"],
      cost: "$0.03/1K tokens (GPT-4), $0.002/1K tokens (GPT-3.5)"
    },
    {
      id: "anthropic",
      name: "Anthropic",
      description: "Claude 3.5 Sonnet, Claude 3 Opus, and other Claude models",
      helpText: "Get your key from console.anthropic.com",
      helpUrl: "https://console.anthropic.com/settings/keys",
      placeholder: "sk-ant-...",
      models: ["Claude 3 Opus", "Claude 3 Haiku"],
      cost: "$0.015/1K tokens (Opus), $0.00025/1K tokens (Haiku)"
    },
    {
      id: "google",
      name: "Google AI",
      description: "Gemini Pro, Gemini 1.5 Flash, and other Google models",
      helpText: "Create an API key at aistudio.google.com",
      helpUrl: "https://aistudio.google.com/app/apikey",
      placeholder: "AIza...",
      models: ["Gemini Pro", "Gemini 1.5 Flash (FREE)"],
      cost: "$0.0005/1K tokens (Pro), FREE (Flash)"
    },
  ]

  // Load API keys from localStorage on mount
  useEffect(() => {
    const savedKeys = localStorage.getItem('ai-api-keys')
    if (savedKeys) {
      try {
        const parsed = JSON.parse(savedKeys)
        setApiKeys(prev => ({
          ...prev,
          openai: { ...prev.openai, value: parsed.openai || "" },
          anthropic: { ...prev.anthropic, value: parsed.anthropic || "" },
          google: { ...prev.google, value: parsed.google || "" },
        }))
      } catch (error) {
        console.error('Error loading API keys:', error)
      }
    }
  }, [])

  // Save API keys to localStorage
  const saveApiKeys = () => {
    const keysToSave = {
      openai: apiKeys.openai.value,
      anthropic: apiKeys.anthropic.value,
      google: apiKeys.google.value
    }
    localStorage.setItem('ai-api-keys', JSON.stringify(keysToSave))
  }

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
        isConnected: null, // Reset connection status when key changes
        error: undefined
      },
    }))
  }

  const testConnection = async (providerId: string) => {
    const keyState = apiKeys[providerId]
    if (!keyState.value.trim()) return

    setApiKeys((prev) => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        isTesting: true,
        error: undefined
      },
    }))

    try {
      const isValid = await testApiKey(providerId as 'openai' | 'anthropic' | 'google', keyState.value)
      
      setApiKeys((prev) => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          isTesting: false,
          isConnected: isValid,
          error: isValid ? undefined : "Invalid API key or connection failed"
        },
      }))

      if (isValid) {
        saveApiKeys()
      }
    } catch (error) {
      setApiKeys((prev) => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          isTesting: false,
          isConnected: false,
          error: error instanceof Error ? error.message : "Connection test failed"
        },
      }))
    }
  }

  const connectedCount = Object.values(apiKeys).filter((key) => key.isConnected === true).length
  const hasAnyKey = Object.values(apiKeys).some((key) => key.value.trim())
  const hasValidKey = Object.values(apiKeys).some((key) => key.isConnected === true)

  const handleContinue = () => {
    saveApiKeys()
    router.push('/dashboard')
  }

  const handleSkip = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Step 2 of 3</span>
            <span className="text-sm text-slate-500">67% complete</span>
          </div>
          <Progress value={67} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome to Prompt Optimizer</h1>
            <p className="text-xl text-slate-600">Connect Your AI Provider API Keys</p>
            <p className="text-slate-500 max-w-md mx-auto">
              Add your API keys to access real AI models and get accurate cost comparisons. 
              You can always add more later or use our demo mode.
            </p>
          </div>

          {/* Free Model Alert */}
          <Alert className="border-green-200 bg-green-50">
            <Info className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Good news!</strong> Gemini 1.5 Flash is completely FREE to use. 
              You can start testing immediately with just a Google AI API key.
            </AlertDescription>
          </Alert>

          {/* Provider Cards */}
          <div className="space-y-4">
            {providers.map((provider) => {
              const keyState = apiKeys[provider.id]
              return (
                <Card key={provider.id} className="relative overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          {provider.id === 'openai' && <span className="text-lg">🤖</span>}
                          {provider.id === 'anthropic' && <span className="text-lg">🧠</span>}
                          {provider.id === 'google' && <span className="text-lg">💎</span>}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                            <span>{provider.name}</span>
                            {keyState.isConnected === true && (
                              <Badge
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-700 border-emerald-200"
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Connected
                              </Badge>
                            )}
                            {keyState.isConnected === false && (
                              <Badge
                                variant="secondary"
                                className="bg-red-100 text-red-700 border-red-200"
                              >
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Failed
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-slate-500">{provider.description}</CardDescription>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {provider.models.map((model) => (
                              <Badge key={model} variant="outline" className="text-xs">
                                {model}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{provider.cost}</p>
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
                          className="pr-20"
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
                        <p className="text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{keyState.error}</span>
                        </p>
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
                        disabled={!keyState.value.trim() || keyState.isTesting}
                        variant={keyState.isConnected === true ? "secondary" : "outline"}
                        size="sm"
                        className={keyState.isConnected === true ? "bg-emerald-100 text-emerald-700 border-emerald-200" : ""}
                      >
                        {keyState.isTesting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mr-2" />
                            Testing...
                          </>
                        ) : keyState.isConnected === true ? (
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

          {/* Security Message */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">
                  🔒 Your keys are stored locally and never shared with our servers
                </p>
                <p className="text-xs text-slate-600">
                  All API calls are made directly from your browser to the respective AI providers. We never see or
                  store your API keys on our servers. Keys are saved in your browser's local storage.
                </p>
                <div className="flex items-center space-x-4 pt-2">
                  <Badge variant="outline" className="text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Client-Side Only
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Lock className="w-3 h-3 mr-1" />
                    Local Storage
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6">
            <Button variant="ghost" className="text-slate-600" onClick={handleSkip}>
              Skip - Use Demo Mode
            </Button>
            <div className="flex items-center space-x-3">
              {connectedCount > 0 && (
                <span className="text-sm text-slate-600">
                  {connectedCount} provider{connectedCount !== 1 ? "s" : ""} connected
                </span>
              )}
              <Button 
                className="bg-blue-700 hover:bg-blue-800 text-white px-8" 
                onClick={handleContinue}
                disabled={!hasAnyKey}
              >
                {hasValidKey ? "Continue to Dashboard" : "Continue with Demo"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}