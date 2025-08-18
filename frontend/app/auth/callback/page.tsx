"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Sparkles, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function OAuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing your sign-in...')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get('token')
        const error = searchParams.get('error')

        // Handle OAuth error
        if (error) {
          console.error('OAuth error:', error)
          setStatus('error')
          setMessage('Sign-in failed. Please try again.')
          
          toast({
            title: "Sign-in failed",
            description: "There was an issue with Google authentication",
            variant: "destructive"
          })

          // Redirect to sign-in page after delay
          setTimeout(() => {
            router.push('/sign-in?error=oauth_failed')
          }, 3000)
          return
        }

        // Handle successful OAuth
        if (token) {
          console.log('✅ OAuth token received, storing and redirecting...')
          
          // Store token in localStorage
          localStorage.setItem('auth_token', token)
          
          // Check if this is a first login and store the flag
          const isFirstLogin = searchParams.get('firstLogin')
          console.log('🔍 First login check:', isFirstLogin)
          
          if (isFirstLogin === 'true') {
            console.log('🎉 First time user detected, setting welcome flag')
            localStorage.setItem('showWelcomeMessage', 'true')
          }
          
          setStatus('success')
          setMessage('Sign-in successful! Redirecting to dashboard...')
          
          // Show appropriate toast message
          if (isFirstLogin === 'true') {
            toast({
              title: "Welcome to Prompt Optimizer! 🎉",
              description: "Your account has been created successfully!",
              duration: 4000
            })
          } else {
            toast({
              title: "Signed in successfully",
              description: "Welcome back to Prompt Optimizer!"
            })
          }

          // Redirect to dashboard after short delay
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
          return
        }

        // No token or error - something went wrong
        throw new Error('No authentication token received')

      } catch (error) {
        console.error('OAuth callback error:', error)
        setStatus('error')
        setMessage('Authentication failed. Please try signing in again.')
        
        toast({
          title: "Authentication failed",
          description: "Please try signing in again",
          variant: "destructive"
        })

        // Redirect to sign-in page after delay
        setTimeout(() => {
          router.push('/sign-in')
        }, 3000)
      }
    }

    handleOAuthCallback()
  }, [searchParams, router, toast])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Prompt Optimizer</span>
          </div>
        </div>

        {/* Status Display */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
          {status === 'loading' && (
            <div className="space-y-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <h2 className="text-xl font-semibold text-slate-900">Processing Sign-In</h2>
              <p className="text-slate-600">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-emerald-900">Sign-In Successful!</h2>
              <p className="text-emerald-700">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-red-900">Sign-In Failed</h2>
              <p className="text-red-700">{message}</p>
              <p className="text-sm text-slate-500">You will be redirected to the sign-in page shortly.</p>
            </div>
          )}
        </div>

        {/* Manual redirect options */}
        {status === 'error' && (
          <div className="mt-6 space-y-2">
            <button
              onClick={() => router.push('/sign-in')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Try signing in again
            </button>
            <br />
            <button
              onClick={() => router.push('/')}
              className="text-slate-600 hover:text-slate-700 text-sm"
            >
              Go to homepage
            </button>
          </div>
        )}
      </div>
    </div>
  )
}