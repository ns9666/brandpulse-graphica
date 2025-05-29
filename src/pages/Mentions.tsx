import React, { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MotionCard from '@/components/ui/MotionCard';
import MentionCard from '@/components/mentions/MentionCard';
import { Button } from '@/components/ui/button';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['All']);
  const [selectedSentiments, setSelectedSentiments] = useState<string[]>(['All']);
  
  const handlePlatformFilter = (platform: string) => {
    if (platform === 'All') {
      setSelectedPlatforms(['All']);
    } else {
      const newPlatforms = selectedPlatforms.includes('All') 
        ? [platform]
        : selectedPlatforms.includes(platform)
          ? selectedPlatforms.filter(p => p !== platform)
          : [...selectedPlatforms, platform];
      
      setSelectedPlatforms(newPlatforms.length === 0 ? ['All'] : newPlatforms);
    }
  };

  const handleSentimentFilter = (sentiment: string) => {
    if (sentiment === 'All') {
      setSelectedSentiments(['All']);
    } else {
      const newSentiments = selectedSentiments.includes('All')
        ? [sentiment]
        : selectedSentiments.includes(sentiment)
          ? selectedSentiments.filter(s => s !== sentiment)
          : [...selectedSentiments, sentiment];
      
      setSelectedSentiments(newSentiments.length === 0 ? ['All'] : newSentiments);
    }
  };

  const clearAllFilters = () => {
    setSelectedPlatforms(['All']);
    setSelectedSentiments(['All']);
    setSearchQuery('');
  };

  const filteredMentions = useMemo(() => {
    return mentionsData.filter(mention => {
      const matchesSearch = mention.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          mention.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPlatform = selectedPlatforms.includes('All') || 
                            selectedPlatforms.includes(mention.platform);
      
      const matchesSentiment = selectedSentiments.includes('All') || 
                             selectedSentiments.map(s => s.toLowerCase()).includes(mention.sentiment);
      
      return matchesSearch && matchesPlatform && matchesSentiment;
    });
  }, [searchQuery, selectedPlatforms, selectedSentiments]);

  const hasActiveFilters = !selectedPlatforms.includes('All') || 
                          !selectedSentiments.includes('All') || 
                          searchQuery.length > 0;
  
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
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search mentions..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="glass-input w-full rounded-lg pl-10 pr-4 py-2 focus:outline-none" 
                  />
                </div>
                
                <div className="flex gap-2">
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={clearAllFilters} className="flex items-center gap-1.5">
                      <X size={16} />
                      Clear All
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                    <SlidersHorizontal size={16} />
                    Advanced
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-muted-foreground">Platform:</span>
                  {['All', 'Twitter', 'Instagram', 'Facebook', 'Reddit', 'LinkedIn'].map((platform) => (
                    <Button 
                      key={platform}
                      variant={selectedPlatforms.includes(platform) ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handlePlatformFilter(platform)}
                      className={selectedPlatforms.includes(platform) ? "bg-brand-blue hover:bg-brand-blue/90" : ""}
                    >
                      {platform}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-muted-foreground">Sentiment:</span>
                  {['All', 'Positive', 'Neutral', 'Negative'].map((sentiment) => (
                    <Button 
                      key={sentiment}
                      variant={selectedSentiments.includes(sentiment) ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handleSentimentFilter(sentiment)}
                      className={selectedSentiments.includes(sentiment) ? "bg-brand-blue hover:bg-brand-blue/90" : ""}
                    >
                      {sentiment}
                    </Button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <div className="text-sm text-muted-foreground">
                  Showing {filteredMentions.length} of {mentionsData.length} mentions
                </div>
              )}
            </div>
          </MotionCard>
        </div>
        
        <div className="space-y-4">
          {filteredMentions.length > 0 ? (
            filteredMentions.map((mention) => (
              <MentionCard key={mention.id} mention={mention} />
            ))
          ) : (
            <MotionCard className="p-8 text-center">
              <p className="text-muted-foreground">No mentions found matching your filters.</p>
              <Button variant="outline" onClick={clearAllFilters} className="mt-4">
                Clear Filters
              </Button>
            </MotionCard>
          )}
        </div>
      </main>
    </div>
  );
};

export default Mentions;
