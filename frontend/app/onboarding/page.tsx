"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from "lucide-react"

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
  workspaceName: string
  optimizationGoals: string[]
  defaultModel: string
  optimizationLevel: string
  notifications: {
    email: boolean
    browser: boolean
  }
  autoSave: boolean
}

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
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

  // Step 2 data
  const [preferences, setPreferences] = useState<PreferencesData>({
    workspaceName: "",
    optimizationGoals: [],
    defaultModel: "gpt-4",
    optimizationLevel: "balanced",
    notifications: {
      email: true,
      browser: true,
    },
    autoSave: true,
  })

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

  const getStepProgress = () => {
    return currentStep === 1 ? 50 : 100
  }

  const canProceedFromStep1 = () => {
    return userData.firstName && userData.lastName && userData.email && userData.role
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
    if (currentStep === 1) {
      // Auto-generate workspace name
      const workspaceName = userData.company || `${userData.firstName}'s Workspace`
      setPreferences(prev => ({ ...prev, workspaceName }))
      setCurrentStep(2)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setIsLoading(true)
    
    console.log('🚀 Completing onboarding...')
    console.log('📝 User data:', userData)
    console.log('⚙️ Preferences:', preferences)
    
    try {
      // Save to localStorage like sign-up does
      const onboardingData = {
        userData,
        preferences,
        completedAt: new Date().toISOString(),
        version: '1.0'
      }
      
      localStorage.setItem('prompt_optimizer_onboarding', JSON.stringify(onboardingData))
      console.log('✅ Onboarding data saved to localStorage')
      
      toast({
        title: "Welcome to Prompt Optimizer! 🎉",
        description: "Your workspace is ready. Let's start optimizing!",
      })
      
    } catch (error) {
      console.error("Error saving onboarding data:", error)
      toast({
        title: "Welcome to Prompt Optimizer!",
        description: "Let's get started!",
      })
    }
    
    // Redirect after short delay
    setTimeout(() => {
      console.log('🎯 Redirecting to dashboard...')
      router.push("/dashboard")
    }, 1000)
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
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <Sparkles className="w-4 h-4 inline mr-1" />
            Join 10,000+ developers optimizing their AI prompts
          </p>
        </div>
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

  const renderStep2 = () => (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">You're Almost Ready!</h1>
        <p className="text-xl text-slate-600">Let's customize your workspace</p>
        <p className="text-slate-500 max-w-md mx-auto">
          Set up your preferences to get the most out of Prompt Optimizer.
        </p>
        
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <p className="text-sm text-emerald-800">
            <Target className="w-4 h-4 inline mr-1" />
            Users see 40% better prompt performance on average
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Workspace Setup</span>
            </CardTitle>
            <CardDescription>Your personalized workspace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspaceName">Workspace Name</Label>
              <Input
                id="workspaceName"
                value={preferences.workspaceName}
                onChange={(e) => setPreferences((prev) => ({ ...prev, workspaceName: e.target.value }))}
                placeholder={userData.company || `${userData.firstName}'s Workspace`}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Optimization Goals</span>
            </CardTitle>
            <CardDescription>What aspects would you like to focus on improving?</CardDescription>
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
                      <Checkbox 
                        checked={isSelected} 
                        onCheckedChange={() => handleOptimizationGoalToggle(option.id)} 
                      />
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Preferences</span>
            </CardTitle>
            <CardDescription>Configure your default settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultModel">Preferred Model</Label>
                <Select
                  value={preferences.defaultModel}
                  onValueChange={(value) => setPreferences((prev) => ({ ...prev, defaultModel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4 (OpenAI)</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (OpenAI)</SelectItem>
                    <SelectItem value="claude-3-sonnet">Claude 3.5 Sonnet (Anthropic)</SelectItem>
                    <SelectItem value="gemini-pro">Gemini Pro (Google)</SelectItem>
                    <SelectItem value="auto">Auto-select best model</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="optimizationLevel">Optimization Level</Label>
                <Select
                  value={preferences.optimizationLevel}
                  onValueChange={(value) => setPreferences((prev) => ({ ...prev, optimizationLevel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose level" />
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
                    <p className="text-xs text-slate-500">Automatically save your work</p>
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
                    <Label className="text-sm font-medium">Email notifications</Label>
                    <p className="text-xs text-slate-500">Weekly reports and updates</p>
                  </div>
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
            </div>
          </CardContent>
        </Card>

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
                Your workspace "{preferences.workspaceName}" is ready! You now have access to powerful AI prompt optimization tools.
              </p>

              <div className="grid grid-cols-2 gap-4">
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
            <span className="text-sm font-medium text-slate-600">Step {currentStep} of 2</span>
            <span className="text-sm text-slate-500">{getStepProgress()}% complete</span>
          </div>
          <Progress value={getStepProgress()} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
      </div>

      {/* Navigation */}
      <div className="w-full bg-white border-t border-slate-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={prevStep} disabled={currentStep === 1} className="text-slate-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center space-x-3">
            {currentStep === 1 ? (
              <Button
                onClick={nextStep}
                disabled={!canProceedFromStep1()}
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
    </div>
  )
}