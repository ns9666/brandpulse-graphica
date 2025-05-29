
import React from 'react';
import { TrendingDown, TrendingUp, Users, MessageSquare } from 'lucide-react';
import MotionCard from '@/components/ui/MotionCard';

const competitorData = [
  {
    name: 'Competitor A',
    mentions: 2450,
    sentiment: 72,
    engagement: 4.8,
    trend: 'up',
    change: '+12.5%'
  },
  {
    name: 'Competitor B',
    mentions: 1890,
    sentiment: 68,
    engagement: 3.9,
    trend: 'down',
    change: '-3.2%'
  },
  {
    name: 'Your Brand',
    mentions: 3842,
    sentiment: 76,
    engagement: 5.7,
    trend: 'up',
    change: '+18.3%',
    isUser: true
  }
];

const CompetitorAnalysis = () => {
  return (
    <MotionCard className="p-6 h-[400px]">
      <div className="mb-6">
        <h3 className="text-lg font-medium">Competitor Analysis</h3>
        <p className="text-muted-foreground text-sm">Compare your brand performance with competitors</p>
      </div>

      <div className="space-y-4">
        {competitorData.map((competitor, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              competitor.isUser 
                ? 'bg-brand-blue/5 border-brand-blue/20' 
                : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h4 className={`font-medium ${competitor.isUser ? 'text-brand-blue' : ''}`}>
                  {competitor.name}
                </h4>
                {competitor.isUser && (
                  <span className="px-2 py-1 bg-brand-blue text-white text-xs rounded-full">You</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm">
                {competitor.trend === 'up' ? (
                  <TrendingUp size={16} className="text-emerald-600" />
                ) : (
                  <TrendingDown size={16} className="text-rose-600" />
                )}
                <span className={competitor.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}>
                  {competitor.change}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <MessageSquare size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Mentions</span>
                </div>
                <p className="font-semibold">{competitor.mentions.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Sentiment</span>
                </div>
                <p className="font-semibold">{competitor.sentiment}/100</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Engagement</span>
                </div>
                <p className="font-semibold">{competitor.engagement}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MotionCard>
  );
};

export default CompetitorAnalysis;
