"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowRight, Sparkles, Zap, Target, BarChart3, Users, Shield, Star, Play, Check } from "lucide-react"

export default function LandingPage() {
  const [email, setEmail] = useState("")

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Optimization",
      description: "Advanced algorithms analyze and improve your prompts for better AI model performance.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Target,
      title: "Precision Targeting",
      description: "Fine-tune prompts for specific use cases and get more accurate, relevant responses.",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimize prompts in seconds, not hours. Get instant feedback and suggestions.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track prompt performance with detailed metrics and A/B testing capabilities.",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share prompts, collaborate with team members, and maintain consistency across projects.",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Your API keys and data stay secure with end-to-end encryption and local storage.",
      color: "bg-slate-100 text-slate-600",
    },
  ]

  const benefits = [
    {
      stat: "3x",
      label: "Faster prompt development",
      description: "Reduce time spent on prompt engineering",
    },
    {
      stat: "40%",
      label: "Better response quality",
      description: "Measurably improved AI model outputs",
    },
    {
      stat: "60%",
      label: "Cost reduction",
      description: "Optimize token usage and API costs",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "AI Product Manager",
      company: "TechCorp",
      content:
        "Prompt Optimizer transformed how our team works with AI. We've seen dramatic improvements in response quality and consistency.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Data Scientist",
      company: "InnovateLabs",
      content:
        "The analytics features are incredible. Being able to A/B test prompts and see performance metrics has been game-changing.",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Developer",
      company: "StartupXYZ",
      content:
        "Finally, a tool that makes prompt engineering systematic rather than guesswork. The collaboration features are fantastic too.",
      rating: 5,
    },
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for individuals getting started",
      features: ["Up to 100 optimizations/month", "Basic analytics", "3 AI provider integrations", "Community support"],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "For teams and growing businesses",
      features: [
        "Unlimited optimizations",
        "Advanced analytics & A/B testing",
        "All AI provider integrations",
        "Team collaboration",
        "Priority support",
        "Custom templates",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "SSO & advanced security",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantees",
        "On-premise deployment",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Prompt Optimizer</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors">
                Reviews
              </a>
              <Button variant="ghost" className="text-slate-600">
                Sign In
              </Button>
              <Button className="bg-blue-700 hover:bg-blue-800 text-white">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200">
              <Sparkles className="w-3 h-3 mr-1" />
              Now supporting GPT-4, Claude 3.5, and Gemini Pro
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Optimize Your AI Prompts for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
                {" "}
                Better Results
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your AI interactions with intelligent prompt optimization. Get more accurate responses, reduce
              costs, and accelerate your AI development workflow.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 text-lg">
                Start Optimizing Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-slate-300 bg-transparent">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-700 mb-1">{benefit.stat}</div>
                  <div className="text-sm font-semibold text-slate-900 mb-1">{benefit.label}</div>
                  <div className="text-xs text-slate-500">{benefit.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-emerald-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything you need to optimize AI prompts</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful tools and insights to help you get the most out of your AI models
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-slate-200 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-slate-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600 leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How it works</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Connect Your APIs</h3>
              <p className="text-slate-600">
                Securely connect your OpenAI, Anthropic, and Google AI accounts. Your keys stay local and encrypted.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Optimize Your Prompts</h3>
              <p className="text-slate-600">
                Use our AI-powered tools to analyze, improve, and test your prompts for better performance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Track & Improve</h3>
              <p className="text-slate-600">
                Monitor performance with detailed analytics and continuously improve your AI interactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Loved by developers and teams worldwide</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              See what our users are saying about Prompt Optimizer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-slate-200">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-slate-200 rounded-full mr-3"></div>
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choose the plan that's right for you. Start free, upgrade when you need more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.popular ? "border-blue-500 shadow-lg scale-105" : "border-slate-200"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-slate-900">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    {plan.period && <span className="text-slate-500">{plan.period}</span>}
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-4 h-4 text-emerald-600 mr-3 flex-shrink-0" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? "bg-blue-700 hover:bg-blue-800 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-900"}`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-emerald-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to optimize your AI prompts?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers and teams who are already getting better results from their AI models.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-white"
            />
            <Button size="lg" className="bg-white text-blue-700 hover:bg-slate-100 px-8 whitespace-nowrap">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <p className="text-sm text-blue-200 mt-4">No credit card required • Free forever plan available</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Prompt Optimizer</span>
              </div>
              <p className="text-slate-400 mb-4">
                The ultimate platform for optimizing AI prompts and improving model performance.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-slate-800 rounded-full"></div>
                <div className="w-8 h-8 bg-slate-800 rounded-full"></div>
                <div className="w-8 h-8 bg-slate-800 rounded-full"></div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-slate-400">© 2024 Prompt Optimizer. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
