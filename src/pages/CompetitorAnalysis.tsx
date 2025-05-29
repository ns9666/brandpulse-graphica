
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MotionCard from '@/components/ui/MotionCard';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown, Users, MessageSquare, Eye, Award, Target } from 'lucide-react';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

const competitorData = [
  {
    name: 'Competitor A',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop',
    mentions: 2450,
    sentiment: 72,
    engagement: 4.8,
    reach: 890000,
    trend: 'up',
    change: '+12.5%',
    marketShare: 18,
    growthRate: 8.5
  },
  {
    name: 'Competitor B',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=40&h=40&fit=crop',
    mentions: 1890,
    sentiment: 68,
    engagement: 3.9,
    reach: 650000,
    trend: 'down',
    change: '-3.2%',
    marketShare: 14,
    growthRate: -2.1
  },
  {
    name: 'Your Brand',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=40&h=40&fit=crop',
    mentions: 3842,
    sentiment: 76,
    engagement: 5.7,
    reach: 1250000,
    trend: 'up',
    change: '+18.3%',
    marketShare: 24,
    growthRate: 15.2,
    isUser: true
  },
  {
    name: 'Competitor C',
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
    mentions: 2100,
    sentiment: 70,
    engagement: 4.2,
    reach: 720000,
    trend: 'up',
    change: '+6.8%',
    marketShare: 16,
    growthRate: 5.3
  }
];

const radarData = [
  {
    metric: 'Mentions',
    'Your Brand': 95,
    'Competitor A': 65,
    'Competitor B': 45,
    'Competitor C': 55
  },
  {
    metric: 'Sentiment',
    'Your Brand': 76,
    'Competitor A': 72,
    'Competitor B': 68,
    'Competitor C': 70
  },
  {
    metric: 'Engagement',
    'Your Brand': 85,
    'Competitor A': 70,
    'Competitor B': 60,
    'Competitor C': 65
  },
  {
    metric: 'Reach',
    'Your Brand': 90,
    'Competitor A': 75,
    'Competitor B': 55,
    'Competitor C': 60
  },
  {
    metric: 'Growth',
    'Your Brand': 88,
    'Competitor A': 68,
    'Competitor B': 30,
    'Competitor C': 58
  }
];

const CompetitorAnalysis = () => {
  const [selectedCompetitors, setSelectedCompetitors] = useState(['Your Brand', 'Competitor A']);
  const [timeRange, setTimeRange] = useState('3months');

  const toggleCompetitor = (name: string) => {
    if (name === 'Your Brand') return; // Always keep user's brand selected
    
    setSelectedCompetitors(prev => 
      prev.includes(name) 
        ? prev.filter(c => c !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      <main className="container pt-28 pb-16">
        <DashboardHeader 
          title="Competitor Analysis" 
          description="Compare your brand performance with competitors across key metrics"
          action={
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Competitor
            </Button>
          }
        />

        {/* Time Range Selector */}
        <div className="mb-6">
          <MotionCard className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Analysis Period</h3>
              <div className="flex gap-2">
                {['1month', '3months', '6months', '1year'].map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    className={timeRange === range ? "bg-brand-blue hover:bg-brand-blue/90" : ""}
                  >
                    {range === '1month' ? '1M' : 
                     range === '3months' ? '3M' : 
                     range === '6months' ? '6M' : '1Y'}
                  </Button>
                ))}
              </div>
            </div>
          </MotionCard>
        </div>

        {/* Competitor Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {competitorData.map((competitor, index) => (
            <MotionCard
              key={index}
              className={`p-6 cursor-pointer border-2 transition-all ${
                selectedCompetitors.includes(competitor.name)
                  ? 'border-brand-blue bg-brand-blue/5'
                  : 'border-transparent hover:border-slate-300'
              } ${competitor.isUser ? 'ring-2 ring-brand-blue/30' : ''}`}
              onClick={() => toggleCompetitor(competitor.name)}
            >
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={competitor.logo} 
                  alt={competitor.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className={`font-medium ${competitor.isUser ? 'text-brand-blue' : ''}`}>
                    {competitor.name}
                  </h4>
                  {competitor.isUser && (
                    <span className="text-xs text-brand-blue">Your Brand</span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Market Share</span>
                  <span className="font-semibold">{competitor.marketShare}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Growth Rate</span>
                  <div className="flex items-center gap-1">
                    {competitor.trend === 'up' ? (
                      <TrendingUp size={14} className="text-emerald-600" />
                    ) : (
                      <TrendingDown size={14} className="text-rose-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      competitor.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {competitor.change}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Mentions</span>
                  <span className="font-semibold">{competitor.mentions.toLocaleString()}</span>
                </div>
              </div>
            </MotionCard>
          ))}
        </div>

        {/* Comparison Charts */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {/* Radar Chart Comparison */}
          <MotionCard className="p-6">
            <h3 className="text-lg font-medium mb-4">Performance Radar</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="Your Brand"
                    dataKey="Your Brand"
                    stroke="#0A84FF"
                    fill="#0A84FF"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  {selectedCompetitors.filter(name => name !== 'Your Brand').map((name, index) => (
                    <Radar
                      key={name}
                      name={name}
                      dataKey={name}
                      stroke={index === 0 ? '#FF6B6B' : index === 1 ? '#4ECDC4' : '#45B7D1'}
                      fill="none"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  ))}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </MotionCard>

          {/* Mentions Comparison */}
          <MotionCard className="p-6">
            <h3 className="text-lg font-medium mb-4">Mentions Comparison</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={competitorData.filter(c => selectedCompetitors.includes(c.name))}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar 
                    dataKey="mentions" 
                    fill="#0A84FF"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </MotionCard>
        </div>

        {/* Detailed Metrics */}
        <MotionCard className="p-6">
          <h3 className="text-lg font-medium mb-6">Detailed Metrics Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4">Brand</th>
                  <th className="text-center py-3 px-4">Mentions</th>
                  <th className="text-center py-3 px-4">Sentiment</th>
                  <th className="text-center py-3 px-4">Engagement</th>
                  <th className="text-center py-3 px-4">Reach</th>
                  <th className="text-center py-3 px-4">Growth</th>
                  <th className="text-center py-3 px-4">Market Share</th>
                </tr>
              </thead>
              <tbody>
                {competitorData
                  .filter(c => selectedCompetitors.includes(c.name))
                  .sort((a, b) => b.mentions - a.mentions)
                  .map((competitor, index) => (
                  <tr 
                    key={competitor.name} 
                    className={`border-b border-slate-100 dark:border-slate-800 ${
                      competitor.isUser ? 'bg-brand-blue/5' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={competitor.logo} 
                          alt={competitor.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <span className={`font-medium ${competitor.isUser ? 'text-brand-blue' : ''}`}>
                            {competitor.name}
                          </span>
                          {index === 0 && (
                            <Award className="inline-block ml-2 text-yellow-500" size={16} />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4 font-medium">
                      {competitor.mentions.toLocaleString()}
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        competitor.sentiment >= 75 ? 'bg-green-100 text-green-800' :
                        competitor.sentiment >= 65 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {competitor.sentiment}/100
                      </span>
                    </td>
                    <td className="text-center py-4 px-4 font-medium">
                      {competitor.engagement}%
                    </td>
                    <td className="text-center py-4 px-4 font-medium">
                      {(competitor.reach / 1000000).toFixed(1)}M
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="flex items-center justify-center gap-1">
                        {competitor.trend === 'up' ? (
                          <TrendingUp size={14} className="text-emerald-600" />
                        ) : (
                          <TrendingDown size={14} className="text-rose-600" />
                        )}
                        <span className={`font-medium ${
                          competitor.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {competitor.change}
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4 font-medium">
                      {competitor.marketShare}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MotionCard>
      </main>
    </div>
  );
};

export default CompetitorAnalysis;
