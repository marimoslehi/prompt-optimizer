"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  User, 
  Sparkles, 
  Settings, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Zap, 
  Target,
  BarChart3,
  Activity,
  DollarSign,
  Users,
  PlayCircle,
  ChevronRight,
  Calendar,
  Globe
} from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface UserData {
  firstName: string
  lastName: string
  email: string
  company: string
  role: string
  useCase: string
  teamSize: string
}

interface OnboardingData {
  userData: UserData
  preferences: any
  completedAt: string
  version: string
}

export default function AnalyticsDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [workspaceName, setWorkspaceName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadUserData()
  }, [])

  // Welcome message effect for first-time users - runs only once
  useEffect(() => {
    const shouldShowWelcome = localStorage.getItem('showWelcomeMessage')
    console.log('🔍 Checking for welcome message flag:', shouldShowWelcome)
    
    if (shouldShowWelcome === 'true') {
      console.log('🎉 Showing welcome message for first-time user')
      
      // Remove the flag immediately to prevent multiple triggers
      localStorage.removeItem('showWelcomeMessage')
      
      // Show welcome message after userData is loaded
      const showWelcomeToast = () => {
        if (userData) {
          toast({
            title: "Welcome to Prompt Optimizer! 🎉",
            description: `Hi ${userData.firstName || 'there'}! Your account has been successfully created. Let's start optimizing your AI prompts!`,
            duration: 6000,
          })
          console.log('🎉 Welcome toast shown!')
        } else {
          // If userData not loaded yet, try again in 500ms
          setTimeout(showWelcomeToast, 500)
        }
      }
      
      setTimeout(showWelcomeToast, 1000)
    }
  }, [userData, toast]) // userData as dependency to show toast when data loads

  const loadUserData = async () => {
    setIsLoading(true)
    try {
      // First try to get user data from backend using the auth token
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
                email: user.email || '',
                company: user.company || '',
                role: user.role || '',
                useCase: '',
                teamSize: ''
              })
              console.log('✅ User data loaded from backend:', user.firstName, user.lastName)
              setIsLoading(false)
              return
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
        }
      }

      // Fallback to localStorage (existing code for onboarding users)
      const onboardingStr = localStorage.getItem('prompt_optimizer_onboarding')
      if (onboardingStr) {
        const onboardingData: OnboardingData = JSON.parse(onboardingStr)
        setUserData(onboardingData.userData)
        setWorkspaceName(onboardingData.preferences?.workspaceName || 'My Workspace')
      } else {
        // Final fallback: try individual stored values
        const name = localStorage.getItem('user_name')
        const email = localStorage.getItem('user_email')
        const workspace = localStorage.getItem('workspace_name')
        
        if (name && email) {
          const [firstName, ...lastNameParts] = name.split(' ')
          setUserData({
            firstName,
            lastName: lastNameParts.join(' '),
            email,
            company: '',
            role: '',
            useCase: '',
            teamSize: ''
          })
          setWorkspaceName(workspace || 'My Workspace')
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToPromptOptimizer = () => {
    window.location.href = '/prompt-optimizer'
  }

  const navigateToSettings = () => {
    window.location.href = '/setting'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const userName = userData ? `${userData.firstName} ${userData.lastName}`.trim() : 'there'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Welcome, {userData?.firstName || 'there'}!</h1>
                <p className="text-slate-600">Ready to optimize your prompts?</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={navigateToPromptOptimizer}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Start Optimizing
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={navigateToSettings}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Start Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Ready to optimize your first prompt?</h2>
                  <p className="text-blue-100 mb-4">
                    Transform your AI prompts into high-performing, cost-effective solutions
                  </p>
                  <Button 
                    onClick={navigateToPromptOptimizer}
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <div className="hidden md:block">
                  <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                    <Zap className="w-16 h-16 text-white/80" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Prompts Optimized</p>
                  <p className="text-2xl font-bold text-slate-900">0</p>
                  <p className="text-xs text-emerald-600 mt-1">+0% this week</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Cost Savings</p>
                  <p className="text-2xl font-bold text-slate-900">$0</p>
                  <p className="text-xs text-emerald-600 mt-1">Ready to save!</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Performance Boost</p>
                  <p className="text-2xl font-bold text-slate-900">0%</p>
                  <p className="text-xs text-blue-600 mt-1">Avg improvement</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Time Saved</p>
                  <p className="text-2xl font-bold text-slate-900">0h</p>
                  <p className="text-xs text-purple-600 mt-1">This month</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Your Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {userData?.firstName?.[0] || 'U'}{userData?.lastName?.[0] || ''}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{userName}</p>
                    <p className="text-sm text-gray-600">{userData?.email}</p>
                  </div>
                </div>

                {workspaceName && (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-slate-900 mb-1">Workspace</p>
                    <p className="text-sm text-slate-700">{workspaceName}</p>
                  </div>
                )}

                {userData && (
                  <div className="space-y-3">
                    {userData.company && (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Company</span>
                        <span className="text-sm font-medium text-slate-900">{userData.company}</span>
                      </div>
                    )}
                    {userData.role && (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Role</span>
                        <Badge variant="outline" className="text-xs">{userData.role}</Badge>
                      </div>
                    )}
                    {userData.teamSize && (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Team Size</span>
                        <span className="text-sm font-medium text-slate-900">{userData.teamSize}</span>
                      </div>
                    )}
                  </div>
                )}

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={navigateToSettings}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Getting Started */}
          <div className="lg:col-span-2 space-y-6">
            {/* Getting Started */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PlayCircle className="w-5 h-5 text-blue-600" />
                  <span>Getting Started</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">Optimize your first prompt</p>
                        <p className="text-sm text-blue-700">Start with the prompt optimizer tool</p>
                      </div>
                    </div>
                    <Button 
                      onClick={navigateToPromptOptimizer}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Start Now
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 opacity-60">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">Review your analytics</p>
                        <p className="text-sm text-slate-600">Track performance improvements</p>
                      </div>
                    </div>
                    <Button variant="outline" disabled>
                      Coming Soon
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 opacity-60">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">Share with your team</p>
                        <p className="text-sm text-slate-600">Collaborate on prompt optimization</p>
                      </div>
                    </div>
                    <Button variant="outline" disabled>
                      Coming Soon
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Quick Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Account Setup</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={100} className="w-24" />
                      <span className="text-sm font-medium">100%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">First Optimization</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={0} className="w-24" />
                      <span className="text-sm font-medium">0%</span>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-amber-900">Ready to get started?</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          Your account is all set up! Click "Start Optimizing" to begin improving your prompts.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}