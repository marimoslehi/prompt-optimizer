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
  Gauge
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
      description: "Side-by-side results from GPT-4, Claude, and Gemini with quality scores and pricing"
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-600" />,
      title: "Zero Setup Required",
      description: "No API keys needed. Start comparing models in 30 seconds, not 30 minutes"
    }
  ]

  const pricing = [
    {
      name: "Free Demo",
      price: "$0",
      description: "See how it works",
      features: [
        "Pre-recorded demos",
        "4 sample scenarios",
        "Full UI preview",
        "No signup required"
      ],
      cta: "Try Demo",
      popular: false,
      href: "/demo"
    },
    {
      name: "$1 Trial",
      price: "$1",
      description: "Test your prompts",
      features: [
        "10 real AI comparisons",
        "All 3 models available",
        "7-day access",
        "$1 credited to plan"
      ],
      cta: "Start Trial",
      popular: true,
      href: "/onboarding"
    },
    {
      name: "Starter Plan",
      price: "$29",
      description: "Full access",
      features: [
        "10,000 tokens included",
        "All models available",
        "Usage analytics",
        "$0.01 per extra 100 tokens"
      ],
      cta: "Subscribe",
      popular: false,
      href: "/onboarding"
    }
  ]

  const testimonials = [
    {
      name: "Jake Morrison",
      role: "Marketing Director",
      content: "I was spending $300/month on GPT-4 for content creation. Prompt Optimizer showed me Claude could do the same quality for $15/month. Saved me $285 the first month alone!",
      avatar: "JM"
    },
    {
      name: "Lisa Kim",
      role: "Product Manager",
      content: "Instead of guessing which model to use, now I test once and know exactly which gives the best results for each type of prompt. No more expensive mistakes.",
      avatar: "LK"
    },
    {
      name: "David Rodriguez",
      role: "Founder, AI Startup",
      content: "The $1 trial convinced me immediately. Seeing my actual prompts compared across 3 models was eye-opening. Now I never use expensive models for simple tasks.",
      avatar: "DR"
    }
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
                <p className="text-xs text-gray-500">AI Cost Intelligence Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-6">
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
                <a href="#demo" className="text-gray-600 hover:text-gray-900 transition-colors">Demo</a>
              </nav>
              
              <div className="flex items-center space-x-3">
                <Link href="/sign-in">
                  <Button variant="ghost" className="text-gray-700">
                    Sign In
                  </Button>
                </Link>
                <Link href="/onboarding">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Start Free Demo
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
          <Badge className="mb-6 bg-red-100 text-red-800 hover:bg-red-100">
            <Sparkles className="w-3 h-3 mr-1" />
            New: Test 3 AI Models with $1 Trial
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Stop Overpaying for AI - Find Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Perfect Model Match</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Compare GPT-4, Claude, and Gemini responses instantly. Discover which model delivers the best value for YOUR specific prompts. Most users save 60-90% on AI costs.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg">
              <Eye className="w-5 h-5 mr-2" />
              Watch Demo (Free)
            </Button>
            <Link href="/onboarding">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                Start $1 Trial
                <Play className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-500 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>See 3 model comparison instantly</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Real responses for just $1</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>$1 credited to first month</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-gray-600">Average Savings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">10 Seconds</div>
              <div className="text-gray-600">To Compare Models</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
              <div className="text-gray-600">AI Models Ready</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">$0.01</div>
              <div className="text-gray-600">Cost Per Comparison</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">99%</div>
              <div className="text-gray-600">User Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect AI Model in Seconds
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stop guessing which AI model to use. Our platform tests your exact prompts across multiple models and shows you real cost/quality comparisons.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
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

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple pricing that protects your budget
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start with our demo, then pay only for what you use. No surprises, no huge commitments.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <Card key={index} className={`relative p-8 ${plan.popular ? 'ring-2 ring-blue-500 bg-white transform scale-105' : 'bg-white/80'}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-0">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {plan.price}
                      {plan.name === "Starter Plan" && <span className="text-lg text-gray-500">/month</span>}
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href={plan.href}>
                    <Button className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'}`}>
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              See why smart teams choose us over direct API access
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-0">
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

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to stop overpaying for AI?
          </h2>
          <p className="text-xl text-blue-100 mb-2 max-w-2xl mx-auto">
            Join hundreds of smart teams who've already optimized their AI spending.
          </p>
          <p className="text-lg text-blue-200 mb-8 font-medium">
            Most users save $200+ in their first month
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg">
              <Eye className="w-5 h-5 mr-2" />
              Start Free Demo
            </Button>
            <Link href="/onboarding">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                $1 Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
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
                Smart AI model selection for cost-conscious teams.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Free Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">$1 Trial</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Model Comparison</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cost Calculator</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Demo Library</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cost Savings Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Model Comparison Chart</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Setup Guide</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Email Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Feature Requests</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status Page</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Prompt Optimizer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}