"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Play, Download, Settings, TrendingDown, DollarSign, Clock, BarChart3, FileText, Bell } from "lucide-react"

const models = [
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI", cost: "$0.03/1K tokens", logo: "🤖" },
  { id: "gpt-3.5", name: "GPT-3.5 Turbo", provider: "OpenAI", cost: "$0.002/1K tokens", logo: "🤖" },
  { id: "claude-3", name: "Claude 3 Opus", provider: "Anthropic", cost: "$0.015/1K tokens", logo: "🧠" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic", cost: "$0.00025/1K tokens", logo: "🧠" },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google", cost: "$0.0005/1K tokens", logo: "💎" },
]

const mockResponses = [
  {
    model: "GPT-4",
    response:
      "Here is a comprehensive analysis of your marketing strategy. The key areas for improvement include: 1) Enhanced customer segmentation, 2) Multi-channel approach, 3) Data-driven decision making...",
    tokens: 1247,
    cost: 0.037,
    latency: 2.3,
    quality: 94,
  },
  {
    model: "Claude 3 Haiku",
    response:
      "Your marketing strategy shows promise but needs refinement. Focus on: customer segmentation improvements, expanding channel diversity, and implementing analytics-driven decisions...",
    tokens: 892,
    cost: 0.0002,
    latency: 1.1,
    quality: 87,
  },
]

export default function DashboardPage() {
  const [selectedModels, setSelectedModels] = useState(["gpt-4", "claude-3-haiku"])
  const [prompt, setPrompt] = useState(
    "Analyze the following marketing strategy and provide actionable recommendations for improvement...",
  )
  const [isRunning, setIsRunning] = useState(false)

  const handleModelToggle = (modelId: string) => {
    setSelectedModels((prev) => (prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]))
  }

  const handleRunTest = () => {
    setIsRunning(true)
    setTimeout(() => setIsRunning(false), 3000)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">PO</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Prompt Optimizer</h1>
                <p className="text-sm text-gray-500">Enterprise AI Testing Platform</p>
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Pro Plan</Badge>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="text-gray-700 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="w-4 h-4 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Settings className="w-4 h-4 text-gray-600" />
            </Button>
            <div className="flex items-center space-x-2 pl-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-medium">JD</span>
              </div>
              <span className="text-sm font-medium text-gray-700">John Doe</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Prompt Editor & Model Selection */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Prompt Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Prompt Template</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
                placeholder="Enter your prompt template here..."
              />
            </div>

            <Separator />

            {/* Model Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Select Models</h3>
              <div className="space-y-3">
                {models.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                  >
                    <Checkbox
                      id={model.id}
                      checked={selectedModels.includes(model.id)}
                      onCheckedChange={() => handleModelToggle(model.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{model.logo}</span>
                        <label htmlFor={model.id} className="text-sm font-medium text-gray-900 cursor-pointer">
                          {model.name}
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">{model.provider}</p>
                      <p className="text-xs text-gray-600 font-mono">{model.cost}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Run Test Button */}
            <Button
              onClick={handleRunTest}
              disabled={isRunning || selectedModels.length === 0}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white"
              size="lg"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Running Test...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Test
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Center Area - Response Comparison */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Response Comparison</h2>
            <p className="text-sm text-gray-600">Compare model outputs side by side</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockResponses.map((response, index) => (
              <Card key={index} className="h-fit">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">{response.model}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        Quality: {response.quality}%
                      </Badge>
                      <Badge
                        variant={response.cost < 0.01 ? "default" : "destructive"}
                        className={response.cost < 0.01 ? "bg-emerald-100 text-emerald-800" : ""}
                      >
                        ${response.cost.toFixed(4)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 leading-relaxed">{response.response}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Tokens</p>
                        <p className="font-medium">{response.tokens.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Latency</p>
                        <p className="font-medium">{response.latency}s</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Cost</p>
                        <p className="font-medium">${response.cost.toFixed(4)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Panel - Metrics & Analytics */}
        <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Cost Savings Summary */}
            <Card className="bg-emerald-50 border-emerald-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-emerald-800 flex items-center">
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Cost Saved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-700 mb-1">$1,247</div>
                <p className="text-sm text-emerald-600">This month</p>
                <div className="mt-3">
                  <Badge className="bg-emerald-100 text-emerald-800">↓ 67% reduction</Badge>
                </div>
              </CardContent>
            </Card>

            {/* ROI Metrics */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  ROI Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monthly ROI</span>
                  <span className="font-semibold text-emerald-600">+340%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. Cost per Query</span>
                  <span className="font-semibold">$0.0089</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Queries</span>
                  <span className="font-semibold">24,891</span>
                </div>
              </CardContent>
            </Card>

            {/* Token Usage */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Token Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Input Tokens</span>
                    <span>1.2M / 2M</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Output Tokens</span>
                    <span>890K / 2M</span>
                  </div>
                  <Progress value={44} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. Latency</span>
                  <span className="font-semibold">1.7s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-semibold text-emerald-600">99.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Quality Score</span>
                  <span className="font-semibold">91/100</span>
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">GPT-4</span>
                  <span className="font-semibold text-red-600">$89.23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Claude 3</span>
                  <span className="font-semibold">$12.45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Gemini Pro</span>
                  <span className="font-semibold text-emerald-600">$2.18</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span>$103.86</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}