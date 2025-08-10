"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Play,
  Download,
  TrendingDown,
  DollarSign,
  User,
  Bot,
  Zap,
  AlertCircle,
  ArrowRight,
  Lock,
  Sparkles,
  CheckCircle
} from "lucide-react"

// Models available for guests (only free ones)
const guestModels = [
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    provider: "Google",
    cost: "FREE",
    logo: "⚡",
    isFree: true,
    description: "Fast, high-quality responses",
    available: true
  },
  {
    id: "groq-llama",
    name: "Groq Llama 3",
    provider: "Groq",
    cost: "FREE",
    logo: "🚀",
    isFree: true,
    description: "Ultra-fast inference",
    available: true
  }
]

// Premium models (locked for guests)
const premiumModels = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    cost: "$0.03/1K tokens",
    logo: "🤖",
    description: "Most capable model",
    available: false,
    requiresAuth: true
  },
  {
    id: "gpt-3.5",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    cost: "$0.002/1K tokens",
    logo: "🤖",
    description: "Fast and capable",
    available: false,
    requiresAuth: true
  },
  {
    id: "claude-3",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    cost: "$0.015/1K tokens",
    logo: "🧠",
    description: "Advanced reasoning",
    available: false,
    requiresAuth: true
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    cost: "$0.00025/1K tokens",
    logo: "🧠",
    description: "Fast and affordable",
    available: false,
    requiresAuth: true
  }
]

// Combine all models
const allModels = [...guestModels, ...premiumModels]

// Mock responses for demo
const mockResponses: Record<string, { response: string; quality: number; tokens: number; latency: number }> = {
  "gemini-1.5-flash": {
    response:
      "Based on my analysis of your marketing strategy:\n\n**Strengths:**\n✓ Strong brand identity\n✓ Good customer retention rate\n\n**Key Improvements:**\n\n1. **Audience Segmentation**\n   - Create 3-4 distinct buyer personas\n   - Tailor messaging for each segment\n\n2. **Channel Diversification**\n   - Current focus too heavy on email\n   - Add: LinkedIn (B2B), TikTok (Gen Z)\n\n3. **Metrics & Analytics**\n   - Implement conversion tracking\n   - Set up A/B testing framework\n\n**Quick Wins:**\n- Optimize email subject lines (test emojis)\n- Add social proof to landing pages\n- Create urgency with limited-time offers\n\n💡 Start with email optimization - easiest ROI!",
    quality: 85,
    tokens: 287,
    latency: 0.8
  },
  "groq-llama": {
    response:
      "Let me analyze your marketing strategy:\n\n**Current Assessment:**\nYour strategy has a solid foundation but needs refinement in targeting and measurement.\n\n**Recommended Actions:**\n\n1. **Customer Segmentation** - You're treating all customers the same. Divide them into:\n   • High-value repeat buyers\n   • First-time purchasers\n   • Window shoppers\n\n2. **Content Strategy** - Your content is too product-focused. Add:\n   • Educational blog posts\n   • Customer success stories\n   • Behind-the-scenes content\n\n3. **Performance Tracking** - You're missing key metrics:\n   • Customer acquisition cost (CAC)\n   • Lifetime value (LTV)\n   • Channel-specific ROI\n\n**30-Day Action Plan:**\nWeek 1: Set up Google Analytics goals\nWeek 2: Create customer segments\nWeek 3: Launch A/B test on homepage\nWeek 4: Review and optimize\n\nExpected improvement: 20-30% conversion boost",
    quality: 82,
    tokens: 245,
    latency: 0.6
  },
  "gpt-4": {
    response:
      "I've conducted a comprehensive analysis of your marketing strategy. Here's my detailed assessment:\n\n**Executive Summary:**\nYour current strategy shows promise but lacks the sophistication needed for scalable growth. Key issues include undefined target segments, single-channel dependency, and absence of data-driven decision making.\n\n**Strategic Recommendations:**\n\n1. **Customer Intelligence Framework**\n   - Implement RFM (Recency, Frequency, Monetary) segmentation\n   - Deploy predictive analytics for customer lifetime value\n   - Create dynamic personas based on behavioral data\n\n2. **Omnichannel Orchestration**\n   - Email → Social → Retargeting workflow\n   - Implement marketing automation with trigger-based campaigns\n   - Unified messaging across all touchpoints\n\n3. **Performance Architecture**\n   - Install comprehensive tracking (GA4, GTM, heat mapping)\n   - Create custom attribution models\n   - Build real-time performance dashboards\n\n4. **Content Ecosystem**\n   - Develop pillar content strategy\n   - Create content for each stage of buyer journey\n   - Implement SEO-first approach\n\n**Financial Projections:**\n- Month 1-3: 15% improvement in conversion rate\n- Month 4-6: 40% reduction in CAC\n- Month 7-12: 250% ROI on marketing spend\n\n**Implementation Roadmap:**\n\nPhase 1 (Weeks 1-2): Foundation\n- Analytics setup and baseline metrics\n- Customer data audit and segmentation\n\nPhase 2 (Weeks 3-6): Optimization\n- A/B testing framework launch\n- Email automation sequences\n- Landing page optimization\n\nPhase 3 (Weeks 7-12): Expansion\n- New channel testing\n- Advanced personalization\n- Scale successful campaigns\n\n**Risk Mitigation:**\n- Budget constraints: Start with low-cost, high-impact changes\n- Resource limitations: Prioritize automation\n- Market changes: Build agile testing framework\n\nThis transformation will position you for sustainable, profitable growth.",
    quality: 96,
    tokens: 1547,
    latency: 3.2
  },
  "claude-3-haiku": {
    response:
      "Here's my analysis of your marketing strategy with practical improvements:\n\n**Quick Assessment:**\nYour foundation is decent, but you're missing opportunities for growth.\n\n**Top 3 Priorities:**\n\n1. **Fix Your Targeting**\n   - Current: Spraying and praying\n   - Better: Define 2-3 core customer profiles\n   - Action: Survey your best customers this week\n\n2. **Diversify Channels**\n   - Current: 80% email dependent\n   - Better: Email + Social + Content + Paid\n   - Action: Start with one new channel, test for 30 days\n\n3. **Track Everything**\n   - Current: Vanity metrics only\n   - Better: Revenue-focused metrics\n   - Action: Set up conversion tracking today\n\n**Low-Hanging Fruit:**\n• Add testimonials to homepage → 15% conversion boost\n• Send abandoned cart emails → Recover 10% of lost sales\n• Optimize for mobile → 25% more mobile conversions\n\n**Monthly Budget Reallocation:**\n- Reduce: Brand awareness ads (-30%)\n- Increase: Retargeting (+20%), Email tools (+10%)\n\n**Success Metrics:**\nTrack these weekly:\n- Cost per acquisition\n- Email open rates\n- Conversion by source\n- Customer lifetime value\n\nStart with the testimonials - easiest win with immediate impact.",
    quality: 88,
    tokens: 456,
    latency: 0.9
  }
}

export default function MockDashboardPage() {
  const [selectedModels, setSelectedModels] = useState<string[]>(["gemini-1.5-flash", "groq-llama"])
  const [prompt, setPrompt] = useState(
    "Analyze the following marketing strategy and provide actionable recommendations for improvement..."
  )
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)
  const [attemptedPremiumModel, setAttemptedPremiumModel] = useState("")

  const handleModelToggle = (modelId: string, checked: boolean | string) => {
    const model = allModels.find((m) => m.id === modelId)
    if (model?.requiresAuth && checked) {
      setAttemptedPremiumModel(model.name)
      setShowSignInPrompt(true)
      return
    }
    const isChecked = checked === true || checked === "indeterminate"
    setSelectedModels((prev) =>
      isChecked ? [...new Set([...prev, modelId])] : prev.filter((id) => id !== modelId)
    )
  }

  const handleRunTest = async () => {
    setIsRunning(true)
    setTestResults(null)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const results = selectedModels.map((modelId, index) => {
      const modelData = mockResponses[modelId]
      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      return {
        id: `result-${index}`,
        model: modelId,
        conversation: [
          {
            role: "user",
            content: prompt,
            timestamp
          },
          {
            role: "assistant",
            content: modelData.response,
            timestamp: new Date(Date.now() + 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })
          }
        ],
        tokens: modelData.tokens,
        cost: modelId.includes("gemini") || modelId.includes("groq") ? 0 : modelData.tokens * 0.00003,
        responseTime: modelData.latency * 1000,
        quality: modelData.quality
      }
    })

    setTestResults({
      id: Date.now().toString(),
      results,
      totalCost: results.reduce((sum, r) => sum + r.cost, 0),
      isDemoMode: true,
      createdAt: new Date().toISOString()
    })

    setIsRunning(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Prompt Optimizer</h1>
                <p className="text-sm text-gray-500">Guest Mode - Try Before You Sign Up</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" disabled className="text-gray-400">
              <Download className="w-4 h-4 mr-2" />
              Export (Sign In Required)
            </Button>
            <Link href="/sign-in">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Sign In for Full Access
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Guest Mode Notice */}
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Guest Mode</strong>
                <br />
                Try with free models now. Sign in to unlock GPT-4, Claude, and save your results!
              </AlertDescription>
            </Alert>

            {/* Prompt Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Your Prompt</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
                placeholder="Enter your prompt here..."
              />
            </div>

            <Separator />

            {/* Model Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Select Models to Compare</h3>

              {/* Free Models */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Free Models</p>
                {guestModels.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 mb-2"
                  >
                    <Checkbox
                      id={model.id}
                      checked={selectedModels.includes(model.id)}
                      onCheckedChange={(checked) => handleModelToggle(model.id, checked)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{model.logo}</span>
                        <label htmlFor={model.id} className="text-sm font-medium text-gray-900 cursor-pointer">
                          {model.name}
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">{model.provider}</p>
                      <p className="text-xs text-gray-600">{model.description}</p>
                      <Badge className="mt-1 bg-green-100 text-green-800 text-xs">FREE</Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Premium Models */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Premium Models (Sign In Required)</p>
                {premiumModels.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 opacity-60 mb-2"
                  >
                    <Checkbox
                      id={model.id}
                      checked={false}
                      disabled={!model.available}
                      onCheckedChange={(checked) => handleModelToggle(model.id, checked)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{model.logo}</span>
                        <label htmlFor={model.id} className="text-sm font-medium text-gray-700 cursor-pointer">
                          {model.name}
                        </label>
                        <Lock className="w-3 h-3 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500">
                        {model.provider} • {model.cost}
                      </p>
                      <p className="text-xs text-gray-500">{model.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sign In Prompt */}
            {showSignInPrompt && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Want to test {attemptedPremiumModel}?</h3>
                  <p className="text-sm text-blue-800 mb-3">
                    Sign in (free) to compare premium models with your own API keys.
                  </p>
                  <Link href="/sign-in">
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                      Sign In to Unlock
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Run Test Button */}
            <Button
              onClick={handleRunTest}
              disabled={isRunning || selectedModels.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              size="lg"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Running Demo...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Compare Models ({selectedModels.length})
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center">Free models work without sign-in</p>
          </div>
        </div>

        {/* Center Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Model Comparison Results</h2>
            <p className="text-sm text-gray-600">See how different models respond to your prompt</p>
          </div>

          {testResults ? (
            <div>
              {/* Demo Mode Banner */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">🎉 Like what you see?</p>
                    <p className="text-sm text-blue-100">Sign in to test GPT-4, Claude, and save your comparisons</p>
                  </div>
                  <Link href="/sign-in">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white text-blue-600 border-white hover:bg-blue-50"
                    >
                      Sign In Free
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {testResults.results.map((result: any, index: number) => {
                  const model = allModels.find((m) => m.id === result.model)
                  return (
                    <Card key={index} className="h-fit">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-medium flex items-center space-x-2">
                            <span>{model?.logo}</span>
                            <span>{model?.name}</span>
                            <Badge variant="outline" className="text-xs">
                              Quality: {result.quality}%
                            </Badge>
                          </CardTitle>
                          <Badge
                            className={
                              result.cost === 0
                                ? "bg-green-100 text-green-800"
                                : "bg-emerald-100 text-emerald-800"
                            }
                          >
                            {result.cost === 0 ? "FREE" : `$${result.cost.toFixed(4)}`}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto space-y-4">
                            {result.conversation.map((message: any, msgIndex: number) => (
                              <div
                                key={msgIndex}
                                className={`flex space-x-3 ${
                                  message.role === "user" ? "justify-end" : "justify-start"
                                }`}
                              >
                                <div
                                  className={`flex space-x-3 max-w-[85%] ${
                                    message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                                  }`}
                                >
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      message.role === "user" ? "bg-blue-500" : "bg-gray-300"
                                    }`}
                                  >
                                    {message.role === "user" ? (
                                      <User className="w-4 h-4 text-white" />
                                    ) : (
                                      <Bot className="w-4 h-4 text-gray-600" />
                                    )}
                                  </div>
                                  <div
                                    className={`rounded-lg px-4 py-2 ${
                                      message.role === "user"
                                        ? "bg-blue-500 text-white"
                                        : "bg-white border border-gray-200"
                                    }`}
                                  >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                      {message.content}
                                    </p>
                                    <p
                                      className={`text-xs mt-2 ${
                                        message.role === "user" ? "text-blue-100" : "text-gray-500"
                                      }`}
                                    >
                                      {message.timestamp}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Follow-up disabled */}
                          <div className="border-t border-gray-200 pt-4">
                            <Alert className="border-gray-200 bg-gray-50">
                              <Lock className="h-4 w-4 text-gray-600" />
                              <AlertDescription className="text-gray-700">
                                <Link href="/sign-in" className="underline font-semibold">
                                  Sign in
                                </Link>{" "}
                                to ask follow-up questions
                              </AlertDescription>
                            </Alert>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Tokens</p>
                              <p className="font-medium">{result.tokens.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Latency</p>
                              <p className="font-medium">{(result.responseTime / 1000).toFixed(1)}s</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Cost</p>
                              <p className="font-medium">
                                {result.cost === 0 ? "FREE" : `$${result.cost.toFixed(4)}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Want More Models? */}
              <Card className="mt-8 p-8 text-center border-2 border-dashed border-purple-300 bg-purple-50">
                <Lock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Want to Compare GPT-4 and Claude?
                </h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  Sign in to unlock all premium models, save your comparisons, and track your AI cost savings over time.
                </p>
                <Link href="/sign-in">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Unlock All Models (Free)
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8">
                <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to compare AI models?
                </h3>
                <p className="text-gray-600 mb-4">
                  Select models and click "Compare Models" to see how they respond
                </p>
                <Button
                  onClick={() => {
                    if (selectedModels.length === 0) {
                      setSelectedModels(["gemini-1.5-flash", "groq-llama"])
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Try Example Comparison
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Guest Mode Features */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center text-purple-800">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Guest Mode Active
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-700 mb-3">
                  You're trying Prompt Optimizer as a guest
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-green-700">
                    <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Free models available</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Lock className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Premium models locked</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Lock className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Save results locked</span>
                  </div>
                </div>
                <Link href="/sign-in">
                  <Button size="sm" className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                    Sign In for Full Access
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Sample Analytics (Locked) */}
            <Card className="opacity-60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Cost Savings
                  </span>
                  <Lock className="w-4 h-4 text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="blur-sm">
                  <div className="text-2xl font-bold text-emerald-700 mb-1">$847</div>
                  <p className="text-sm text-emerald-600">Saved this month</p>
                </div>
                <p className="text-xs text-gray-500 mt-3">Sign in to track your savings</p>
              </CardContent>
            </Card>

            {/* Model Recommendations */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Model Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">💡 Try This First</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Gemini 1.5 Flash is free and perfect for most tasks
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900">⚡ Speed Matters?</p>
                  <p className="text-xs text-green-700 mt-1">
                    Groq Llama 3 is incredibly fast - under 1 second responses
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Why Sign In */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Why Create a Free Account?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Test Premium Models</p>
                    <p className="text-xs text-gray-600">GPT-4, Claude 3, and more</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Save Comparisons</p>
                    <p className="text-xs text-gray-600">Access your history anytime</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Track Savings</p>
                    <p className="text-xs text-gray-600">See how much you save</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">API Key Storage</p>
                    <p className="text-xs text-gray-600">Secure and encrypted</p>
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

