
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, MessageSquare, TrendingUp, Users, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MotionCard from '@/components/ui/MotionCard';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageSquare,
      title: 'Social Media Monitoring',
      description: 'Track mentions across all major social platforms in real-time'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Get detailed insights with sentiment analysis and engagement metrics'
    },
    {
      icon: TrendingUp,
      title: 'Predictive Insights',
      description: 'AI-powered predictions to stay ahead of trends'
    },
    {
      icon: Users,
      title: 'Competitor Analysis',
      description: 'Compare your brand performance with competitors'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for small businesses',
      features: [
        'Up to 1,000 mentions/month',
        'Basic sentiment analysis',
        '3 social platforms',
        'Email support',
        'Basic reporting'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$79',
      period: '/month',
      description: 'Best for growing companies',
      features: [
        'Up to 10,000 mentions/month',
        'Advanced sentiment analysis',
        'All social platforms',
        'Priority support',
        'Advanced reporting',
        'Competitor analysis',
        'API access'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      description: 'For large organizations',
      features: [
        'Unlimited mentions',
        'AI-powered insights',
        'All platforms + custom sources',
        'Dedicated support',
        'Custom reporting',
        'Advanced competitor analysis',
        'Full API access',
        'Custom integrations'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">SocialSense</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/register')} className="bg-brand-blue hover:bg-brand-blue/90">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Monitor Your Brand's
            <span className="text-brand-blue"> Social Presence</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Track mentions, analyze sentiment, and gain insights across all social media platforms 
            with our AI-powered monitoring solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/register')} className="bg-brand-blue hover:bg-brand-blue/90">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              View Demo
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-600" />
              14-day free trial
            </div>
            <div className="flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-600" />
              No credit card required
            </div>
            <div className="flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-600" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Features for Your Brand</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to monitor, analyze, and improve your social media presence
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <MotionCard key={index} className="p-6 text-center">
              <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-brand-blue" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </MotionCard>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <MotionCard 
              key={index} 
              className={`p-8 relative ${plan.popular ? 'ring-2 ring-brand-blue' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-brand-blue text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${plan.popular ? 'bg-brand-blue hover:bg-brand-blue/90' : ''}`}
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            </MotionCard>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <MotionCard className="p-12 bg-gradient-to-r from-brand-blue to-blue-600 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Monitor Your Brand?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of brands already using SocialSense to track their social media presence.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={() => navigate('/register')}
            className="bg-white text-brand-blue hover:bg-slate-100"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </MotionCard>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2024 SocialSense. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
