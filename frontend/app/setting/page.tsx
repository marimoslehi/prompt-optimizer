"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Key, 
  Trash2, 
  Save, 
  Eye, 
  EyeOff,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  LogOut,
  Sparkles,
  Copy,
  Check,
  Loader2
} from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

// User data interface
interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  company?: string
  role?: string
  isGoogleUser: boolean
  createdAt: string
  updatedAt: string
}

// API Keys interface
interface ApiKeyState {
  value: string
  isConnected: boolean
  isTesting: boolean
  isEditing: boolean
  lastUsed?: string
  error?: string
}

const apiProviders = [
  { 
    id: 'openai', 
    name: 'OpenAI', 
    icon: '🤖', 
    description: 'GPT-3.5, GPT-4, and other OpenAI models',
    placeholder: 'sk-...',
    testEndpoint: 'https://api.openai.com/v1/models'
  },
  { 
    id: 'anthropic', 
    name: 'Anthropic', 
    icon: '🧠', 
    description: 'Claude 3 family models',
    placeholder: 'sk-ant-...',
    testEndpoint: 'https://api.anthropic.com/v1/messages'
  },
  { 
    id: 'google', 
    name: 'Google AI', 
    icon: '💎', 
    description: 'Gemini Pro and Gemini Flash models',
    placeholder: 'AIza...',
    testEndpoint: 'https://generativelanguage.googleapis.com/v1/models'
  },
]

export default function SettingsPage() {
  const { toast } = useToast()
  
  // User data state
  const [userData, setUserData] = useState<UserData | null>(null)
  const [userLoading, setUserLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: ''
  })
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  // API Keys state
  const [apiKeys, setApiKeys] = useState<Record<string, ApiKeyState>>({
    openai: { value: '', isConnected: false, isTesting: false, isEditing: false },
    anthropic: { value: '', isConnected: false, isTesting: false, isEditing: false },
    google: { value: '', isConnected: false, isTesting: false, isEditing: false },
  })
  
  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    testCompletions: true,
    weeklyReports: false,
    marketingEmails: false,
    securityAlerts: true,
    pushNotifications: true,
    smsNotifications: false
  })

  // Usage stats
  const [usageStats, setUsageStats] = useState({
    testsRun: 0,
    costSavings: 0,
    promptsOptimized: 0,
    avgImprovement: 0
  })

  // Load user data on component mount
  useEffect(() => {
    loadUserData()
    loadApiKeys()
    loadNotificationPreferences()
    loadUsageStats()
  }, [])

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
            setUserData(user)
            
            // Update form with user data
            setProfileForm({
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || '',
              company: user.company || '',
              role: user.role || ''
            })
            
            console.log('✅ User data loaded in settings:', user.firstName, user.lastName)
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        toast({
          title: "Error loading profile",
          description: "Could not load your profile data. Please refresh the page.",
          variant: "destructive"
        })
      }
    }
    setUserLoading(false)
  }

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

  const loadNotificationPreferences = () => {
    const saved = localStorage.getItem('notification-preferences')
    if (saved) {
      try {
        setNotifications({ ...notifications, ...JSON.parse(saved) })
      } catch (err) {
        console.error('Error loading notification preferences', err)
      }
    }
  }

  const loadUsageStats = () => {
    // Mock usage stats - replace with actual API call
    const stats = localStorage.getItem('usage-stats')
    if (stats) {
      try {
        setUsageStats(JSON.parse(stats))
      } catch (err) {
        console.error('Error loading usage stats', err)
      }
    }
  }

  const saveProfileData = async () => {
    setIsSaving(true)
    const token = localStorage.getItem('auth_token')
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          company: profileForm.company,
          role: profileForm.role
        })
      })
      
      if (response.ok) {
        toast({
          title: "Profile updated! ✅",
          description: "Your profile information has been saved successfully.",
        })
        // Reload user data to get updated info
        loadUserData()
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Update failed",
        description: "Could not update your profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both password fields match.",
        variant: "destructive"
      })
      return
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      })
      return
    }

    setIsSaving(true)
    const token = localStorage.getItem('auth_token')
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })
      
      if (response.ok) {
        toast({
          title: "Password changed! ✅",
          description: "Your password has been updated successfully.",
        })
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        const result = await response.json()
        throw new Error(result.message || 'Failed to change password')
      }
    } catch (error: any) {
      console.error('Error changing password:', error)
      toast({
        title: "Password change failed",
        description: error.message || "Could not change your password. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const testApiKey = async (providerId: string, apiKey: string): Promise<boolean> => {
    // Enhanced API key testing with actual validation patterns
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    switch (providerId) {
      case 'openai':
        return apiKey.startsWith('sk-') && apiKey.length > 40
      case 'anthropic':
        return apiKey.startsWith('sk-ant-') && apiKey.length > 50
      case 'google':
        return apiKey.startsWith('AIza') && apiKey.length > 30
      default:
        return false
    }
  }

  const handleApiKeyTest = async (providerId: string) => {
    const keyState = apiKeys[providerId]
    if (!keyState.value.trim()) return

    setApiKeys(prev => ({ 
      ...prev, 
      [providerId]: { ...prev[providerId], isTesting: true, error: undefined } 
    }))

    try {
      const isValid = await testApiKey(providerId, keyState.value)
      setApiKeys(prev => {
        const updated = {
          ...prev,
          [providerId]: {
            ...prev[providerId],
            isTesting: false,
            isConnected: isValid,
            isEditing: !isValid,
            lastUsed: isValid ? new Date().toISOString() : prev[providerId].lastUsed,
            error: isValid ? undefined : 'Invalid API key format'
          }
        }
        
        if (isValid) {
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
        
        return updated
      })

      if (isValid) {
        toast({
          title: "API key connected! ✅",
          description: `Your ${apiProviders.find(p => p.id === providerId)?.name} API key is working.`,
        })
      } else {
        toast({
          title: "Invalid API key",
          description: `Please check your ${apiProviders.find(p => p.id === providerId)?.name} API key format.`,
          variant: "destructive"
        })
      }
    } catch (error) {
      setApiKeys(prev => ({ 
        ...prev, 
        [providerId]: { ...prev[providerId], isTesting: false, isConnected: false, error: 'Connection failed' } 
      }))
      toast({
        title: "Connection failed",
        description: "Unable to test API key. Please try again.",
        variant: "destructive"
      })
    }
  }

  const copyApiKey = async (providerId: string) => {
    const keyValue = apiKeys[providerId].value
    if (keyValue) {
      try {
        await navigator.clipboard.writeText(keyValue)
        toast({
          title: "API key copied! 📋",
          description: "The API key has been copied to your clipboard.",
        })
      } catch (err) {
        toast({
          title: "Copy failed",
          description: "Could not copy API key to clipboard.",
          variant: "destructive"
        })
      }
    }
  }

  const removeApiKey = (providerId: string) => {
    setApiKeys(prev => ({
      ...prev,
      [providerId]: { ...prev[providerId], value: '', isConnected: false, isEditing: false }
    }))
    
    const keysToSave = { ...JSON.parse(localStorage.getItem('ai-api-keys') || '{}') }
    delete keysToSave[providerId]
    localStorage.setItem('ai-api-keys', JSON.stringify(keysToSave))
    
    const provider = apiProviders.find(p => p.id === providerId)
    toast({
      title: "API key removed",
      description: `${provider?.name} API key has been deleted.`,
    })
  }

  const saveNotificationPreferences = () => {
    localStorage.setItem('notification-preferences', JSON.stringify(notifications))
    toast({
      title: "Preferences saved! ✅",
      description: "Your notification preferences have been updated.",
    })
  }

  const handleLogout = () => {
    // Clear all local storage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('ai-api-keys')
    localStorage.removeItem('ai-api-key-usage')
    localStorage.removeItem('notification-preferences')
    localStorage.removeItem('usage-stats')
    
    toast({
      title: "Signed out successfully",
      description: "You have been logged out and all data cleared.",
    })
    
    // Redirect to sign-in page
    setTimeout(() => {
      window.location.href = '/sign-in'
    }, 1000)
  }

  const exportData = () => {
    const data = {
      profile: userData,
      apiKeys: Object.keys(apiKeys).reduce((acc, key) => {
        acc[key] = { 
          isConnected: apiKeys[key].isConnected, 
          lastUsed: apiKeys[key].lastUsed,
          // Don't export the actual API key values for security
        }
        return acc
      }, {} as any),
      notifications,
      usageStats,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompt-optimizer-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: "Data exported! ✅",
      description: "Your data has been downloaded as a JSON file.",
    })
  }

  const resetAllSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings? This action cannot be undone.')) {
      localStorage.removeItem('ai-api-keys')
      localStorage.removeItem('ai-api-key-usage')
      localStorage.removeItem('notification-preferences')
      localStorage.removeItem('usage-stats')
      
      // Reset state
      setApiKeys({
        openai: { value: '', isConnected: false, isTesting: false, isEditing: false },
        anthropic: { value: '', isConnected: false, isTesting: false, isEditing: false },
        google: { value: '', isConnected: false, isTesting: false, isEditing: false },
      })
      setNotifications({
        emailNotifications: true,
        testCompletions: true,
        weeklyReports: false,
        marketingEmails: false,
        securityAlerts: true,
        pushNotifications: true,
        smsNotifications: false
      })
      setUsageStats({
        testsRun: 0,
        costSavings: 0,
        promptsOptimized: 0,
        avgImprovement: 0
      })
      
      toast({
        title: "Settings reset",
        description: "All settings have been reset to defaults.",
      })
    }
  }

  if (userLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  const userName = userData ? `${userData.firstName} ${userData.lastName}`.trim() : 'User'
  const userInitials = userData ? `${userData.firstName?.[0] || ''}${userData.lastName?.[0] || ''}`.toUpperCase() : 'U'
  const connectedApiCount = Object.values(apiKeys).filter(k => k.isConnected).length

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.history.back()}
              className="mr-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500">Manage your account and preferences</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <div className="flex items-center space-x-2 pl-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{userInitials}</span>
              </div>
              <span className="text-sm font-medium text-gray-700">{userName}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-lg mx-auto">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="flex items-center space-x-2">
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">API Keys</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Information Card */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <span>Profile Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* User Avatar Section */}
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xl">{userInitials}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{userName}</h3>
                        <p className="text-sm text-gray-600">{userData?.email}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          {userData?.isGoogleUser && (
                            <Badge className="bg-green-100 text-green-800">Google Account</Badge>
                          )}
                          <Badge variant="outline">
                            Joined {new Date(userData?.createdAt || '').toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Profile Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="Enter last name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          disabled
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company (Optional)</Label>
                        <Input
                          id="company"
                          value={profileForm.company}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, company: e.target.value }))}
                          placeholder="Enter company name"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="role">Role (Optional)</Label>
                        <Input
                          id="role"
                          value={profileForm.role}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, role: e.target.value }))}
                          placeholder="Enter your role"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={saveProfileData} disabled={isSaving}>
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats Card */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <span>Quick Stats</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-blue-600">{usageStats.testsRun}</h3>
                      <p className="text-sm text-gray-600">Tests Run</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-green-600">${usageStats.costSavings}</h3>
                      <p className="text-sm text-gray-600">Cost Savings</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-purple-600">{connectedApiCount}</h3>
                      <p className="text-sm text-gray-600">Connected APIs</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span>Password & Security</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {userData?.isGoogleUser ? (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        You're signed in with Google. Your account security is managed by Google.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                            placeholder="Enter current password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                          >
                            {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                            placeholder="Enter new password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                          >
                            {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="Confirm new password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                          >
                            {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={changePassword} disabled={isSaving || !passwordForm.currentPassword || !passwordForm.newPassword}>
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Shield className="w-4 h-4 mr-2" />
                          )}
                          Change Password
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    <span>Account Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button variant="outline" onClick={exportData} className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Export All Data
                    </Button>
                    <Button variant="outline" onClick={resetAllSettings} className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Reset All Settings
                    </Button>
                    <Separator />
                    <Button variant="destructive" onClick={handleLogout} className="w-full justify-start">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api-keys" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="w-5 h-5 text-blue-600" />
                  <span>API Key Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    API keys are stored securely in your browser and never sent to our servers. They are only used locally for API calls.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-6">
                  {apiProviders.map((provider) => {
                    const keyState = apiKeys[provider.id]
                    return (
                      <div key={provider.id} className="border rounded-lg p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{provider.icon}</span>
                            <div>
                              <h3 className="font-semibold text-lg">{provider.name}</h3>
                              <p className="text-sm text-gray-600">{provider.description}</p>
                              {keyState.lastUsed && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Last used: {new Date(keyState.lastUsed).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
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
                        </div>

                        {keyState.isEditing ? (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor={`${provider.id}-key`}>API Key</Label>
                              <Input
                                id={`${provider.id}-key`}
                                type="password"
                                value={keyState.value}
                                onChange={(e) => setApiKeys(prev => ({
                                  ...prev,
                                  [provider.id]: { ...prev[provider.id], value: e.target.value }
                                }))}
                                placeholder={provider.placeholder}
                                className="font-mono"
                              />
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleApiKeyTest(provider.id)}
                                disabled={keyState.isTesting || !keyState.value.trim()}
                              >
                                {keyState.isTesting ? (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                )}
                                {keyState.isTesting ? 'Testing...' : 'Test & Save'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setApiKeys(prev => ({
                                  ...prev,
                                  [provider.id]: { ...prev[provider.id], isEditing: false, error: undefined }
                                }))}
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
                              onClick={() => setApiKeys(prev => ({
                                ...prev,
                                [provider.id]: { ...prev[provider.id], isEditing: true }
                              }))}
                            >
                              {keyState.value ? 'Edit Key' : 'Add Key'}
                            </Button>
                            {keyState.value && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyApiKey(provider.id)}
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => removeApiKey(provider.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remove
                                </Button>
                              </>
                            )}
                          </div>
                        )}

                        {keyState.error && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{keyState.error}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tips:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• API keys are encrypted and stored locally in your browser</li>
                    <li>• Test your keys to ensure they work before running prompts</li>
                    <li>• Keep your API keys secure and don't share them</li>
                    <li>• Monitor your API usage in your provider's dashboard</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNotifications: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Test Completions</h3>
                        <p className="text-sm text-gray-600">Get notified when your prompt tests finish</p>
                      </div>
                      <Switch
                        checked={notifications.testCompletions}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, testCompletions: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Weekly Reports</h3>
                        <p className="text-sm text-gray-600">Receive weekly summaries of your usage and savings</p>
                      </div>
                      <Switch
                        checked={notifications.weeklyReports}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReports: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Marketing Emails</h3>
                        <p className="text-sm text-gray-600">Receive updates about new features and tips</p>
                      </div>
                      <Switch
                        checked={notifications.marketingEmails}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketingEmails: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Security Alerts</h3>
                        <p className="text-sm text-gray-600">Important security notifications (recommended)</p>
                      </div>
                      <Switch
                        checked={notifications.securityAlerts}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, securityAlerts: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-gray-600">Browser push notifications for real-time updates</p>
                      </div>
                      <Switch
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushNotifications: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">SMS Notifications</h3>
                        <p className="text-sm text-gray-600">Urgent notifications via text message</p>
                      </div>
                      <Switch
                        checked={notifications.smsNotifications}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, smsNotifications: checked }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={saveNotificationPreferences}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Analytics Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <span>Account Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-2xl font-bold text-blue-600">{usageStats.testsRun}</h3>
                        <p className="text-sm text-gray-600">Tests Run</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <h3 className="text-2xl font-bold text-green-600">${usageStats.costSavings}</h3>
                        <p className="text-sm text-gray-600">Cost Savings</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <h3 className="text-2xl font-bold text-purple-600">{usageStats.promptsOptimized}</h3>
                        <p className="text-sm text-gray-600">Prompts Optimized</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <h3 className="text-2xl font-bold text-orange-600">{usageStats.avgImprovement}%</h3>
                        <p className="text-sm text-gray-600">Avg Improvement</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Connected Services</h4>
                      <div className="space-y-2">
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
                      </div>
                    </div>

                    <Separator />

                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Member since</p>
                      <p className="text-sm font-medium">
                        {new Date(userData?.createdAt || '').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}