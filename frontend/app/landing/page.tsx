import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Play, 
  TrendingDown, 
  Zap, 
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Eye,
  BarChart3,
  Shield,
  Gauge,
  Key,
  Users,
  Building2
} from "lucide-react"

export default function LandingPage() {
  const features = [
    {
      icon: <Target className="w-6 h-6 text-blue-600" />,
      title: "Smart Model Selection",
      description: "See which model gives you the best quality-to-cost ratio for your specific use case"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-green-600" />,
      title: "Live Cost Tracking",
      description: "Watch real-time costs as you test. Know exactly what you're spending before you commit"
    },
    {
      icon: <Gauge className="w-6 h-6 text-purple-600" />,
      title: "Instant Comparisons",
      description: "Side-by-side results from GPT-4, Claude, Gemini, and more with quality scores"
    },
    {
      icon: <Key className="w-6 h-6 text-orange-600" />,
      title: "Bring Your Own Keys",
      description: "Use your existing API keys. We never charge for AI usage - only you control costs"
    }
  ]

  const howItWorks = [
    {
      step: "1",
      title: "Add Your API Keys",
      description: "Securely connect your OpenAI, Anthropic, or Google API keys"
    },
    {
      step: "2",
      title: "Enter Your Prompt",
      description: "Type your prompt once, and we'll test it across all models"
    },
    {
      step: "3",
      title: "Compare Results",
      description: "See quality scores, costs, and response times side-by-side"
    },
    {
      step: "4",
      title: "Save Money",
      description: "Pick the best model for each task and cut your AI costs by 60-90%"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO at TechStartup",
      content: "We were burning $5K/month on GPT-4 for everything. Prompt Optimizer showed us which tasks could use cheaper models. Now we spend $1.2K for the same output quality.",
      avatar: "SC",
      savings: "$3,800/month saved"
    },
    {
      name: "Mike Johnson",
      role: "AI Engineer",
      content: "The quality scoring is incredible. I always wondered if Claude or Gemini could handle our prompts. Now I know exactly when to use each model.",
      avatar: "MJ",
      savings: "70% cost reduction"
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Director",
      content: "Free forever with our own API keys? Perfect! No vendor lock-in, no surprise bills. Just pure value in helping us optimize our AI spending.",
      avatar: "ER",
      savings: "$2,100/month saved"
    }
  ]

  const freeModels = [
    { name: "Gemini 1.5 Flash", provider: "Google", description: "Fast, free tier available" },
    { name: "Groq Llama 3", provider: "Groq", description: "Ultra-fast inference" }
  ]

  const paidModels = [
    { name: "GPT-4", provider: "OpenAI" },
    { name: "Claude 3 Opus", provider: "Anthropic" },
    { name: "Gemini Pro", provider: "Google" },
    { name: "GPT-3.5 Turbo", provider: "OpenAI" },
    { name: "Claude 3 Haiku", provider: "Anthropic" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Prompt Optimizer</h1>
                <p className="text-xs text-gray-500">100% Free AI Comparison Tool</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-6">
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
                <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Success Stories</a>
              </nav>
              
              <div className="flex items-center space-x-3">
                <Link href="/sign-in">
                  <Button variant="ghost" className="text-gray-700">
                    Sign In
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Start Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-100">
            <Sparkles className="w-3 h-3 mr-1" />
            100% Free Forever - No Credit Card Required
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Stop Overpaying for AI
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Compare Models, Save Money
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Test your prompts across GPT-4, Claude, Gemini, and more - all in one place. 
            See real costs, quality scores, and response times. Most teams save 60-90% on AI costs.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all">
                <Play className="w-5 h-5 mr-2" />
                Start Comparing Models (Free)
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
              <Eye className="w-5 h-5 mr-2" />
              Watch 2-Min Demo
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-500 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>No payment required</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Use your own API keys</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Compare 10+ models</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Hidden Cost of Using the Wrong AI Model
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-red-50 border-red-200">
              <CardContent className="p-0">
                <DollarSign className="w-8 h-8 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Overpaying by 10-100x</h3>
                <p className="text-gray-700">Using GPT-4 for simple tasks that Gemini Flash could handle for free</p>
              </CardContent>
            </Card>
            <Card className="p-6 bg-orange-50 border-orange-200">
              <CardContent className="p-0">
                <Clock className="w-8 h-8 text-orange-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Wasting Developer Time</h3>
                <p className="text-gray-700">Manually testing each model takes hours of copy-pasting</p>
              </CardContent>
            </Card>
            <Card className="p-6 bg-yellow-50 border-yellow-200">
              <CardContent className="p-0">
                <Target className="w-8 h-8 text-yellow-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Guessing at Quality</h3>
                <p className="text-gray-700">No way to objectively compare which model performs best</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four simple steps to optimize your AI costs
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Optimize AI Costs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features that help you make data-driven decisions about AI model selection
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow bg-white">
                <CardContent className="p-0">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Compare All Major AI Models
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Test across multiple providers to find your perfect match
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Zap className="w-6 h-6 text-green-600 mr-2" />
                Free Tier Models
              </h3>
              <div className="space-y-4">
                {freeModels.map((model, index) => (
                  <Card key={index} className="p-4 bg-green-50 border-green-200">
                    <CardContent className="p-0">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900">{model.name}</h4>
                          <p className="text-sm text-gray-600">{model.provider}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          No API Key Needed
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{model.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Key className="w-6 h-6 text-blue-600 mr-2" />
                With Your API Keys
              </h3>
              <div className="space-y-3">
                {paidModels.map((model, index) => (
                  <Card key={index} className="p-4">
                    <CardContent className="p-0">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900">{model.name}</h4>
                          <p className="text-sm text-gray-600">{model.provider}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Teams Saving Thousands Every Month
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="mb-4">
                    <Badge className="bg-green-100 text-green-800">
                      {testimonial.savings}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Business Features Teaser */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Card className="p-12 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <div className="text-center">
              <Building2 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Need Business Features?
              </h2>
              <p className="text-xl text-gray-700 mb-6 max-w-3xl mx-auto">
                Looking for team management, API access, SSO, or enterprise features? 
                Let us know what you need and we'll build it.
              </p>
              <Button variant="outline" size="lg" className="border-purple-300 text-purple-700 hover:bg-purple-100">
                <Users className="w-5 h-5 mr-2" />
                Request Business Features
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Start Saving on AI Costs Today
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers and teams who've already optimized their AI spending. 
            100% free, forever.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg shadow-lg">
                Start Free Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          
          <p className="text-blue-200 mt-6 text-sm">
            No credit card • No hidden fees • Just bring your API keys
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-lg">Prompt Optimizer</span>
              </div>
              <p className="text-gray-400">
                Free AI model comparison tool. Save money on every API call.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Model Comparison</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Cost Calculator</Link></li>
                <li><Link href="/api-keys" className="hover:text-white transition-colors">API Key Setup</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Cost Optimization Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Model Comparison Chart</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Key Security</a></li>
                <li><a href="https://github.com/yourusername/prompt-optimizer" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/request-feature" className="hover:text-white transition-colors">Request Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Prompt Optimizer. Open source and free forever.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}