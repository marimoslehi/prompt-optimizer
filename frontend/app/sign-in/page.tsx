"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, Eye, EyeOff, ArrowLeft, Mail, Lock, Chrome, Shield, AlertCircle } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Check for OAuth errors in URL
  useEffect(() => {
    const oauthError = searchParams.get('error')
    if (oauthError) {
      switch (oauthError) {
        case 'oauth_cancelled':
          setError('Google sign-in was cancelled')
          break
        case 'oauth_failed':
          setError('Google sign-in failed. Please try again.')
          break
        default:
          setError('Authentication failed. Please try again.')
      }
      // Clear error from URL
      router.replace('/sign-in', { scroll: false })
    }
  }, [searchParams, router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await apiClient.login({ email, password })

      if (res.success) {
        const token = res.data.token
        if (rememberMe) {
          localStorage.setItem("auth_token", token)
        } else {
          sessionStorage.setItem("auth_token", token)
        }
        toast({ title: "Signed in successfully" })
        router.push("/dashboard")
      } else {
        setError(res.message || "Login failed")
        toast({ title: "Login failed", description: res.message, variant: "destructive" })
      }
    } catch (err: any) {
      setError(err.message || "Login failed")
      toast({ title: "Login failed", description: err.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setError(null)

    try {
      // Redirect to backend Google OAuth endpoint
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      window.location.href = `${backendUrl}/auth/google`
    } catch (err: any) {
      setError('Failed to initiate Google sign-in')
      toast({ 
        title: "Google sign-in failed", 
        description: "Please try again or use email/password", 
        variant: "destructive" 
      })
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-900 p-0"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Prompt Optimizer</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-600">Sign in to your account to continue optimizing</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Google Sign In */}
        <div className="mb-6">
          <Button
            variant="outline"
            className="w-full h-12 border-slate-300 hover:bg-slate-50 bg-transparent"
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
          >
            {isGoogleLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-3" />
                Connecting to Google...
              </>
            ) : (
              <>
                <Chrome className="w-5 h-5 mr-3" />
                Continue with Google
              </>
            )}
          </Button>
        </div>

        <div className="relative mb-6">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-slate-50 px-3 text-sm text-slate-500">or continue with email</span>
          </div>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12"
                required
                disabled={isLoading || isGoogleLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12"
                required
                disabled={isLoading || isGoogleLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || isGoogleLoading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe} 
                onCheckedChange={(checked) => setRememberMe(!!checked)}
                disabled={isLoading || isGoogleLoading}
              />
              <Label htmlFor="remember" className="text-sm text-slate-600">
                Remember me
              </Label>
            </div>
            <Button 
              variant="link" 
              className="text-sm text-blue-600 hover:text-blue-700 p-0"
              disabled={isLoading || isGoogleLoading}
            >
              Forgot password?
            </Button>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white" 
            disabled={isLoading || isGoogleLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-slate-600">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="text-blue-600 hover:text-blue-700 p-0 font-semibold"
              onClick={() => router.push("/sign-up")}
              disabled={isLoading || isGoogleLoading}
            >
              Sign up for free
            </Button>
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-slate-100 rounded-lg">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-900 mb-1">Secure Sign In</p>
              <p className="text-xs text-slate-600">
                Your data is protected with enterprise-grade security and encryption.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}