import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  Crown,
  Zap,
  BarChart3,
  FileText,
  Headphones,
  TrendingDown,
  ArrowLeft
} from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Free Trial",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out AI model optimization",
      features: [
        "3 AI model comparisons",
        "Access to GPT-4, Claude, and Gemini",
        "Real-time cost analysis",
        "Basic comparison reports",
        "Community support"
      ],
      cta: "Start Free Trial",
      ctaVariant: "outline" as const,
      icon: <Sparkles className="w-8 h-8 text-blue-600" />,
      popular: false
    },
    {
      name: "Pro Plan",
      price: "$29",
      period: "per month",
      description: "Everything you need for serious AI cost optimization",
      features: [
        "1,000 model comparisons/month",
        "All premium AI models included",
        "Advanced analytics & insights",
        "Export detailed reports",
        "Prompt library & templates",
        "Complete usage history",
        "Priority email support",
        "Custom model configurations"
      ],
      cta: "Upgrade to Pro",
      ctaVariant: "default" as const,
      icon: <Crown className="w-8 h-8 text-yellow-600" />,
      popular: true,
      savings: "Typically saves $200+ monthly on AI costs"
    }
  ]

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
      title: "Real-Time Cost Analysis",
      description: "See exact costs for each AI model before and after running your prompts"
    },
    {
      icon: <Zap className="w-6 h-6 text-green-600" />,
      title: "Multi-Model Testing",
      description: "Compare GPT-4, Claude 3, Gemini Pro, and more side-by-side instantly"
    },
    {
      icon: <FileText className="w-6 h-6 text-purple-600" />,
      title: "Detailed Reports",
      description: "Export comprehensive analysis reports with cost breakdowns and recommendations"
    },
    {
      icon: <TrendingDown className="w-6 h-6 text-emerald-600" />,
      title: "Cost Optimization",
      description: "Automatically identifies the best value model for each specific use case"
    }
  ]

  const faqs = [
    {
      question: "How do credits work?",
      answer: "Each comparison test uses 1 credit. Free users get 3 credits total. Pro users get 1,000 credits that reset monthly."
    },
    {
      question: "Do I need my own API keys?",
      answer: "No! We handle all the API integrations. You just run tests and see results. No setup required."
    },
    {
      question: "Which AI models are included?",
      answer: "All plans include access to GPT-4, GPT-3.5, Claude 3 Opus, Claude 3 Haiku, Gemini Pro, and Gemini 1.5 Flash."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes! Cancel your Pro subscription anytime. You'll keep access until the end of your billing period."
    },
    {
      question: "How much can I actually save?",
      answer: "Most users save $200-500 monthly by switching from expensive models like GPT-4 to more cost-effective options for routine tasks."
    },
    {
      question: "Is there a setup process?",
      answer: "None! Just sign up and start comparing models immediately. No API keys, no configuration, no technical setup required."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to home</span>
            </Link>
            <div className="flex items-center space-x-3">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-gray-700">
                  Sign In
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            Start free, upgrade when ready. No hidden fees, no surprise charges.
          </p>
          <p className="text-lg text-blue-600 font-medium">
            Most users save their subscription cost within the first week
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                  {plan.savings && (
                    <Badge className="mt-2 bg-green-100 text-green-800">
                      {plan.savings}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/onboarding" className="block">
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                      variant={plan.ctaVariant}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to optimize AI costs
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features to help you make smarter AI model decisions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="p-0">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing and features
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
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
            Ready to start saving on AI costs?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of smart teams already optimizing their AI spending
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/onboarding">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
              Contact Sales
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-blue-100">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>3 free tests</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">Prompt Optimizer</span>
          </div>
          <p className="text-gray-400 mb-6">
            Smart AI model selection for cost-conscious teams.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8">
            <p className="text-gray-400">
              © 2025 Prompt Optimizer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}