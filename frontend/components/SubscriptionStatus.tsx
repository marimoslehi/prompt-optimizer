"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Crown, 
  Zap, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  ArrowRight,
  CreditCard,
  Sparkles
} from "lucide-react"
import { useAIService, UserSubscription } from "@/lib/ai-service"

interface SubscriptionStatusProps {
  onUpgrade?: () => void;
}

export function SubscriptionStatus({ onUpgrade }: SubscriptionStatusProps) {
  const { getSubscription, upgradeToPro } = useAIService()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    loadSubscription()
  }, [])

  const loadSubscription = async () => {
    try {
      setLoading(true)
      const sub = await getSubscription()
      setSubscription(sub)
    } catch (error) {
      console.error('Error loading subscription:', error)
      // Default to free plan if error
      setSubscription({
        plan: 'free',
        creditsRemaining: 3,
        creditsTotal: 3,
        isActive: true
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    setUpgrading(true)
    try {
      await upgradeToPro()
      if (onUpgrade) onUpgrade()
    } catch (error) {
      console.error('Error upgrading:', error)
      alert('Upgrade failed. Please try again.')
    } finally {
      setUpgrading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600">Loading subscription...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) return null

  const creditPercentage = (subscription.creditsRemaining / subscription.creditsTotal) * 100
  const isLowCredits = subscription.creditsRemaining <= 1
  const isPro = subscription.plan === 'pro'

  return (
    <div className="space-y-4">
      {/* Main Subscription Card */}
      <Card className={`${isPro ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50' : 'border-blue-200 bg-blue-50'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              {isPro ? (
                <>
                  <Crown className="w-5 h-5 text-yellow-600" />
                  <span className="text-yellow-800">Pro Plan</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800">Free Trial</span>
                </>
              )}
            </CardTitle>
            <Badge 
              variant={subscription.isActive ? "default" : "secondary"}
              className={isPro ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}
            >
              {subscription.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Credits Display */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {isPro ? 'Monthly Credits' : 'Trial Credits'}
              </span>
              <span className="text-sm font-bold text-gray-900">
                {subscription.creditsRemaining.toLocaleString()} / {subscription.creditsTotal.toLocaleString()}
              </span>
            </div>
            <Progress 
              value={creditPercentage} 
              className={`h-2 ${isLowCredits ? 'bg-red-100' : ''}`}
            />
            {isLowCredits && subscription.plan === 'free' && (
              <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>Low credits remaining</span>
              </p>
            )}
          </div>

          {/* Renewal Date for Pro users */}
          {isPro && subscription.renewalDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Renews on:</span>
              <span className="font-medium">{new Date(subscription.renewalDate).toLocaleDateString()}</span>
            </div>
          )}

          {/* Upgrade CTA for Free users */}
          {!isPro && (
            <div className="pt-2 border-t border-blue-200">
              <Button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="sm"
              >
                {upgrading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Upgrading...
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Pro - $29/month
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Low Credits Alert */}
      {isLowCredits && (
        <Alert className={subscription.plan === 'free' ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"}>
          <AlertCircle className={`h-4 w-4 ${subscription.plan === 'free' ? 'text-red-600' : 'text-yellow-600'}`} />
          <AlertDescription className={subscription.plan === 'free' ? 'text-red-800' : 'text-yellow-800'}>
            {subscription.plan === 'free' ? (
              <>
                <strong>Almost out of free credits!</strong> Upgrade to Pro to get 1,000 monthly credits.
              </>
            ) : (
              <>
                <strong>Low credits remaining.</strong> Your credits will reset on your next billing cycle.
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Pro Plan Benefits */}
      {isPro && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Pro Benefits Active</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
              <div>✓ 1,000 monthly credits</div>
              <div>✓ All AI models</div>
              <div>✓ Advanced analytics</div>
              <div>✓ Priority support</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Compact version for header display
export function SubscriptionBadge() {
  const { getSubscription } = useAIService()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)

  useEffect(() => {
    getSubscription().then(setSubscription).catch(console.error)
  }, [])

  if (!subscription) return null

  const isPro = subscription.plan === 'pro'
  
  return (
    <div className="flex items-center space-x-3">
      <Badge 
        className={isPro ? "bg-yellow-100 text-yellow-800 border-yellow-200" : "bg-blue-100 text-blue-800 border-blue-200"}
      >
        {isPro ? (
          <>
            <Crown className="w-3 h-3 mr-1" />
            Pro Plan
          </>
        ) : (
          <>
            <Sparkles className="w-3 h-3 mr-1" />
            Free Trial
          </>
        )}
      </Badge>
      <span className="text-sm text-gray-600">
        {subscription.creditsRemaining} credits left
      </span>
    </div>
  )
}