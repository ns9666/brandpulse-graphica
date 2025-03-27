
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MotionCard from '@/components/ui/MotionCard';
import Chip from '@/components/ui/Chip';
import { Button } from '@/components/ui/button';
import { Filter, MessageSquare, Search, SlidersHorizontal, ThumbsDown, ThumbsUp, Share } from 'lucide-react';

interface Mention {
  id: number;
  platform: string;
  author: string;
  date: string;
  content: string;
  engagement: {
    likes: number;
    replies: number;
    shares: number;
  };
  sentiment: 'positive' | 'negative' | 'neutral';
}

const mentionsData: Mention[] = [
  {
    id: 1,
    platform: 'Twitter',
    author: '@techreporter',
    date: '2 hours ago',
    content: '"The new product from @brandname is absolutely game-changing. Best innovation I\'ve seen this year."',
    engagement: { likes: 325, replies: 42, shares: 87 },
    sentiment: 'positive'
  },
  {
    id: 2,
    platform: 'Reddit',
    author: 'u/productfan',
    date: '5 hours ago',
    content: 'Has anyone else experienced issues with the latest update? The UI feels clunky compared to before.',
    engagement: { likes: 128, replies: 36, shares: 12 },
    sentiment: 'negative'
  },
  {
    id: 3,
    platform: 'Instagram',
    author: '@influencer_tech',
    date: '8 hours ago',
    content: 'Testing out the new features from @brandname - pretty impressive so far! #tech #innovation',
    engagement: { likes: 1204, replies: 89, shares: 67 },
    sentiment: 'positive'
  },
  {
    id: 4,
    platform: 'Facebook',
    author: 'Tech Community Page',
    date: '12 hours ago',
    content: 'Our team has been using the new software for a week now. Performance is good but there\'s definitely room for improvement.',
    engagement: { likes: 78, replies: 23, shares: 5 },
    sentiment: 'neutral'
  },
  {
    id: 5,
    platform: 'Twitter',
    author: '@user438392',
    date: '1 day ago',
    content: 'Just got my hands on @brandname\'s latest product. Not sure it\'s worth the price tag tbh. #disappointed',
    engagement: { likes: 54, replies: 31, shares: 8 },
    sentiment: 'negative'
  },
  {
    id: 6,
    platform: 'LinkedIn',
    author: 'Sarah Johnson, Product Manager',
    date: '1 day ago',
    content: 'Excited to announce our company is now partnering with @brandname to bring new innovations to our customers!',
    engagement: { likes: 432, replies: 57, shares: 92 },
    sentiment: 'positive'
  },
  {
    id: 7,
    platform: 'YouTube',
    author: 'TechReviewsDaily',
    date: '2 days ago',
    content: 'We reviewed the new product and were impressed by the quality, but the price point might be too high for casual users.',
    engagement: { likes: 2546, replies: 342, shares: 178 },
    sentiment: 'neutral'
  }
];

const Mentions = () => {
  const [activeFilters, setActiveFilters] = useState({
    platforms: ['All'],
    sentiment: ['All']
  });
  
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      <main className="container pt-28 pb-16">
        <DashboardHeader 
          title="Mentions" 
          description="Monitor and analyze mentions across all social platforms."
        />
        
        <div className="mb-6">
          <MotionCard className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="text" 
                  placeholder="Search mentions..." 
                  className="glass-input w-full rounded-lg pl-10 pr-4 py-2 focus:outline-none" 
                />
              </div>
              
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                  <SlidersHorizontal size={16} />
                  <span>Advanced</span>
                </Button>
                <Button variant="default" size="sm" className="flex items-center gap-1.5 bg-brand-blue hover:bg-brand-blue/90">
                  <Filter size={16} />
                  <span>Filters</span>
                </Button>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">Platform:</span>
                {['All', 'Twitter', 'Instagram', 'Facebook', 'Reddit', 'LinkedIn'].map((platform) => (
                  <Button 
                    key={platform}
                    variant={activeFilters.platforms.includes(platform) ? "default" : "outline"} 
                    size="sm" 
                    className={activeFilters.platforms.includes(platform) ? "bg-brand-blue hover:bg-brand-blue/90" : ""}
                  >
                    {platform}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-2">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">Sentiment:</span>
                {['All', 'Positive', 'Neutral', 'Negative'].map((sentiment) => (
                  <Button 
                    key={sentiment}
                    variant={activeFilters.sentiment.includes(sentiment) ? "default" : "outline"} 
                    size="sm"
                    className={activeFilters.sentiment.includes(sentiment) ? "bg-brand-blue hover:bg-brand-blue/90" : ""}
                  >
                    {sentiment}
                  </Button>
                ))}
              </div>
            </div>
          </MotionCard>
        </div>
        
        <div className="space-y-4">
          {mentionsData.map((mention) => (
            <MotionCard key={mention.id} className="p-5">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Chip variant="default">{mention.platform}</Chip>
                    <span className="text-sm font-medium">{mention.author}</span>
                    <span className="text-xs text-muted-foreground">{mention.date}</span>
                  </div>
                  
                  <p className="text-sm md:text-base mb-4">{mention.content}</p>
                  
                  <div className="flex items-center gap-6 text-xs md:text-sm text-muted-foreground">
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
                
                <div className="flex flex-row md:flex-col items-center md:items-end gap-3 mt-2 md:mt-0">
                  {getSentimentChip(mention.sentiment)}
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Analyze</Button>
                    <Button variant="outline" size="sm">Respond</Button>
                  </div>
                </div>
              </div>
            </MotionCard>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Mentions;
