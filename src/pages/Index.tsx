
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricsOverview from '@/components/dashboard/MetricsOverview';
import MentionsChart from '@/components/dashboard/MentionsChart';
import SentimentAnalysis from '@/components/dashboard/SentimentAnalysis';
import PredictiveInsights from '@/components/dashboard/PredictiveInsights';
import MotionCard from '@/components/ui/MotionCard';
import Chip from '@/components/ui/Chip';
import { MessageSquare, ThumbsUp, ThumbsDown, Share } from 'lucide-react';

const TopMentions = () => {
  const mentions = [
    {
      platform: 'Twitter',
      author: '@techreporter',
      content: '"The new product from @brandname is absolutely game-changing. Best innovation I\'ve seen this year."',
      engagement: { likes: 325, replies: 42, shares: 87 },
      sentiment: 'positive'
    },
    {
      platform: 'Reddit',
      author: 'u/productfan',
      content: 'Has anyone else experienced issues with the latest update? The UI feels clunky compared to before.',
      engagement: { likes: 128, replies: 36, shares: 12 },
      sentiment: 'negative'
    },
    {
      platform: 'Instagram',
      author: '@influencer_tech',
      content: 'Testing out the new features from @brandname - pretty impressive so far! #tech #innovation',
      engagement: { likes: 1204, replies: 89, shares: 67 },
      sentiment: 'positive'
    }
  ];
  
  const getSentimentChip = (sentiment: string) => {
    switch(sentiment) {
      case 'positive':
        return <Chip variant="success">Positive</Chip>;
      case 'negative':
        return <Chip variant="danger">Negative</Chip>;
      default:
        return <Chip variant="neutral">Neutral</Chip>;
    }
  };
  
  return (
    <MotionCard className="col-span-1 lg:col-span-2">
      <h3 className="text-lg font-medium mb-4">Top Mentions</h3>
      <div className="space-y-4">
        {mentions.map((mention, index) => (
          <div key={index} className="border border-slate-100 dark:border-slate-800 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <Chip variant="default">{mention.platform}</Chip>
                <span className="text-sm font-medium">{mention.author}</span>
              </div>
              {getSentimentChip(mention.sentiment)}
            </div>
            <p className="text-sm mb-3">{mention.content}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <ThumbsUp size={14} />
                <span>{mention.engagement.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare size={14} />
                <span>{mention.engagement.replies}</span>
              </div>
              <div className="flex items-center gap-1">
                <Share size={14} />
                <span>{mention.engagement.shares}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MotionCard>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      <main className="container pt-28 pb-16">
        <DashboardHeader title="Brand Analytics" />
        
        <div className="space-y-6">
          <MetricsOverview />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <MentionsChart />
            <SentimentAnalysis />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <TopMentions />
            <PredictiveInsights />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
