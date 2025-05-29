
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MotionCard from '@/components/ui/MotionCard';
import { Button } from '@/components/ui/button';
import { Search, Filter, TrendingUp, AlertTriangle, Users, MessageSquare, Plus } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';

const trendingTopics = [
  { topic: 'AI Integration', mentions: 1240, sentiment: 'positive', growth: '+45%' },
  { topic: 'Product Launch', mentions: 890, sentiment: 'mixed', growth: '+23%' },
  { topic: 'Customer Support', mentions: 675, sentiment: 'negative', growth: '-12%' },
  { topic: 'Pricing Updates', mentions: 534, sentiment: 'negative', growth: '+8%' },
  { topic: 'New Features', mentions: 423, sentiment: 'positive', growth: '+67%' }
];

const emergingTrends = [
  { trend: 'Sustainability Focus', score: 92, description: 'Growing conversations about eco-friendly practices' },
  { trend: 'Mobile-First Design', score: 87, description: 'Increased emphasis on mobile user experience' },
  { trend: 'Voice Technology', score: 78, description: 'Rising interest in voice-activated features' },
  { trend: 'Data Privacy', score: 85, description: 'Heightened discussions about user data protection' }
];

const alertData = [
  { 
    id: 1, 
    type: 'spike', 
    title: 'Sudden Mention Spike', 
    description: 'Your brand mentions increased by 340% in the last 2 hours',
    severity: 'high',
    timestamp: '2 hours ago'
  },
  { 
    id: 2, 
    type: 'sentiment', 
    title: 'Sentiment Drop Alert', 
    description: 'Negative sentiment increased by 15% on Twitter',
    severity: 'medium',
    timestamp: '4 hours ago'
  },
  { 
    id: 3, 
    type: 'competitor', 
    title: 'Competitor Activity', 
    description: 'Competitor A launched a new campaign mentioning your brand',
    severity: 'low',
    timestamp: '6 hours ago'
  }
];

const sentimentData = [
  { name: 'Positive', value: 65, color: '#10B981' },
  { name: 'Neutral', value: 25, color: '#6B7280' },
  { name: 'Negative', value: 10, color: '#EF4444' }
];

const SocialListening = () => {
  const [selectedKeywords, setSelectedKeywords] = useState(['brandname', 'product launch']);
  const [alertFilter, setAlertFilter] = useState('all');

  const addKeyword = () => {
    // In a real app, this would open a modal to add keywords
    console.log('Add keyword functionality');
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      <main className="container pt-28 pb-16">
        <DashboardHeader 
          title="Social Listening" 
          description="Monitor conversations, trends, and emerging topics across social platforms"
          action={
            <Button onClick={addKeyword}>
              <Plus className="mr-2 h-4 w-4" /> Add Keywords
            </Button>
          }
        />

        {/* Keywords & Alerts */}
        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          {/* Monitored Keywords */}
          <MotionCard className="p-6">
            <h3 className="text-lg font-medium mb-4">Monitored Keywords</h3>
            <div className="space-y-2">
              {selectedKeywords.map((keyword, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="text-sm">{keyword}</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500">
                    ×
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2" onClick={addKeyword}>
                <Plus size={16} className="mr-1" /> Add Keyword
              </Button>
            </div>
          </MotionCard>

          {/* Real-time Alerts */}
          <MotionCard className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Real-time Alerts</h3>
              <div className="flex gap-2">
                {['all', 'high', 'medium', 'low'].map((filter) => (
                  <Button
                    key={filter}
                    variant={alertFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAlertFilter(filter)}
                    className={alertFilter === filter ? "bg-brand-blue hover:bg-brand-blue/90" : ""}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {alertData
                .filter(alert => alertFilter === 'all' || alert.severity === alertFilter)
                .map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={20} />
                      <div>
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <p className="text-xs mt-1">{alert.description}</p>
                      </div>
                    </div>
                    <span className="text-xs opacity-75">{alert.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </MotionCard>
        </div>

        {/* Trending Topics & Sentiment */}
        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          {/* Trending Topics */}
          <MotionCard className="lg:col-span-2 p-6">
            <h3 className="text-lg font-medium mb-4">Trending Topics</h3>
            <div className="space-y-4">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{topic.topic}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        topic.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                        topic.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {topic.sentiment}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">{topic.mentions} mentions</span>
                    <span className={`font-medium ${
                      topic.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {topic.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </MotionCard>

          {/* Sentiment Overview */}
          <MotionCard className="p-6">
            <h3 className="text-lg font-medium mb-4">Sentiment Overview</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {sentimentData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </MotionCard>
        </div>

        {/* Emerging Trends */}
        <MotionCard className="p-6">
          <h3 className="text-lg font-medium mb-6">Emerging Trends</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {emergingTrends.map((trend, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{trend.trend}</h4>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={16} className="text-blue-600" />
                    <span className="text-sm font-semibold text-blue-600">{trend.score}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{trend.description}</p>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${trend.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </MotionCard>
      </main>
    </div>
  );
};

export default SocialListening;
