"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Sparkles, Eye, EyeOff, ArrowLeft, Mail, Lock, Github, Chrome, Shield } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

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
        toast({ title: "Signed in" })
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

  const handleSocialSignIn = async (provider: string) => {
    setIsLoading(true)

    // Simulate social sign in
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    // Handle social sign in logic here
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

        {/* Social Sign In */}
        <div className="space-y-3 mb-6">
          <Button
            variant="outline"
            className="w-full h-12 border-slate-300 hover:bg-slate-50 bg-transparent"
            onClick={() => handleSocialSignIn("google")}
            disabled={isLoading}
          >
            <Chrome className="w-5 h-5 mr-3" />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 border-slate-300 hover:bg-slate-50 bg-transparent"
            onClick={() => handleSocialSignIn("github")}
            disabled={isLoading}
          >
            <Github className="w-5 h-5 mr-3" />
            Continue with GitHub
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
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(!!checked)} />
              <Label htmlFor="remember" className="text-sm text-slate-600">
                Remember me
              </Label>
            </div>
            <Button variant="link" className="text-sm text-blue-600 hover:text-blue-700 p-0">
              Forgot password?
            </Button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white" disabled={isLoading}>
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