import React, { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MotionCard from '@/components/ui/MotionCard';
import MentionCard from '@/components/mentions/MentionCard';
import AdvancedFilters from '@/components/mentions/AdvancedFilters';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';

interface Mention {
  id: number;
  platform: string;
  author: string;
  authorImage?: string;
  date: string;
  content: string;
  postImage?: string;
  postUrl?: string;
  engagement: {
    likes: number;
    replies: number;
    shares: number;
    views?: number;
  };
  sentiment: 'positive' | 'negative' | 'neutral';
}

const mentionsData: Mention[] = [
  {
    id: 1,
    platform: 'Twitter',
    author: '@techreporter',
    authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    date: '2 hours ago',
    content: '"The new product from @brandname is absolutely game-changing. Best innovation I\'ve seen this year."',
    postImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
    postUrl: 'https://twitter.com/techreporter/status/123',
    engagement: { likes: 325, replies: 42, shares: 87, views: 15400 },
    sentiment: 'positive'
  },
  {
    id: 2,
    platform: 'Reddit',
    author: 'u/productfan',
    authorImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
    date: '5 hours ago',
    content: 'Has anyone else experienced issues with the latest update? The UI feels clunky compared to before.',
    postUrl: 'https://reddit.com/r/technology/comments/abc123',
    engagement: { likes: 128, replies: 36, shares: 12, views: 3200 },
    sentiment: 'negative'
  },
  {
    id: 3,
    platform: 'Instagram',
    author: '@influencer_tech',
    authorImage: 'https://images.unsplash.com/photo-1494790108755-2616b09a4f8a?w=40&h=40&fit=crop&crop=face',
    date: '8 hours ago',
    content: 'Testing out the new features from @brandname - pretty impressive so far! #tech #innovation',
    postImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop',
    postUrl: 'https://instagram.com/p/abc123',
    engagement: { likes: 1204, replies: 89, shares: 67, views: 25600 },
    sentiment: 'positive'
  },
  {
    id: 4,
    platform: 'Facebook',
    author: 'Tech Community Page',
    authorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face',
    date: '12 hours ago',
    content: 'Our team has been using the new software for a week now. Performance is good but there\'s definitely room for improvement.',
    postUrl: 'https://facebook.com/techcommunity/posts/123',
    engagement: { likes: 78, replies: 23, shares: 5, views: 1800 },
    sentiment: 'neutral'
  },
  {
    id: 5,
    platform: 'Twitter',
    author: '@user438392',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    date: '1 day ago',
    content: 'Just got my hands on @brandname\'s latest product. Not sure it\'s worth the price tag tbh. #disappointed',
    postUrl: 'https://twitter.com/user438392/status/456',
    engagement: { likes: 54, replies: 31, shares: 8, views: 4200 },
    sentiment: 'negative'
  },
  {
    id: 6,
    platform: 'LinkedIn',
    author: 'Sarah Johnson, Product Manager',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    date: '1 day ago',
    content: 'Excited to announce our company is now partnering with @brandname to bring new innovations to our customers!',
    postUrl: 'https://linkedin.com/in/sarahjohnson/posts/123',
    engagement: { likes: 432, replies: 57, shares: 92, views: 8900 },
    sentiment: 'positive'
  },
  {
    id: 7,
    platform: 'YouTube',
    author: 'TechReviewsDaily',
    authorImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=40&h=40&fit=crop&crop=face',
    date: '2 days ago',
    content: 'We reviewed the new product and were impressed by the quality, but the price point might be too high for casual users.',
    postImage: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=225&fit=crop',
    postUrl: 'https://youtube.com/watch?v=abc123',
    engagement: { likes: 2546, replies: 342, shares: 178, views: 45600 },
    sentiment: 'neutral'
  }
];

const ITEMS_PER_PAGE = 5;

const Mentions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['All']);
  const [selectedSentiments, setSelectedSentiments] = useState<string[]>(['All']);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ 
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date() 
  });
  const [engagementFilter, setEngagementFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
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
    setCurrentPage(1);
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
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedPlatforms(['All']);
    setSelectedSentiments(['All']);
    setSearchQuery('');
    setDateRange({ from: null, to: null });
    setEngagementFilter('all');
    setCurrentPage(1);
  };

  const getEngagementLevel = (engagement: { likes: number; replies: number; shares: number }) => {
    const total = engagement.likes + engagement.replies + engagement.shares;
    if (total > 1000) return 'high';
    if (total > 100) return 'medium';
    return 'low';
  };

  const isDateInRange = (dateString: string) => {
    if (!dateRange.from && !dateRange.to) return true;
    
    const mentionDate = new Date();
    const now = new Date();
    
    // Parse relative date strings
    if (dateString.includes('hour')) {
      const hours = parseInt(dateString.match(/\d+/)?.[0] || '0');
      mentionDate.setHours(now.getHours() - hours);
    } else if (dateString.includes('day')) {
      const days = parseInt(dateString.match(/\d+/)?.[0] || '0');
      mentionDate.setDate(now.getDate() - days);
    } else {
      mentionDate.setDate(now.getDate() - 1); // Default to 1 day ago
    }
    
    if (dateRange.from && mentionDate < dateRange.from) return false;
    if (dateRange.to && mentionDate > dateRange.to) return false;
    
    return true;
  };

  const filteredMentions = useMemo(() => {
    return mentionsData.filter(mention => {
      const matchesSearch = mention.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          mention.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPlatform = selectedPlatforms.includes('All') || 
                            selectedPlatforms.includes(mention.platform);
      
      const matchesSentiment = selectedSentiments.includes('All') || 
                             selectedSentiments.map(s => s.toLowerCase()).includes(mention.sentiment);
      
      const matchesDate = isDateInRange(mention.date);
      
      const matchesEngagement = engagementFilter === 'all' || 
                              getEngagementLevel(mention.engagement) === engagementFilter;
      
      return matchesSearch && matchesPlatform && matchesSentiment && matchesDate && matchesEngagement;
    });
  }, [searchQuery, selectedPlatforms, selectedSentiments, dateRange, engagementFilter]);

  const totalPages = Math.ceil(filteredMentions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMentions = filteredMentions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const hasActiveFilters = !selectedPlatforms.includes('All') || 
                          !selectedSentiments.includes('All') || 
                          searchQuery.length > 0 ||
                          dateRange.from !== null ||
                          dateRange.to !== null ||
                          engagementFilter !== 'all';
  
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
                    className="w-full rounded-lg pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                  />
                </div>
                
                <div className="flex gap-2">
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={clearAllFilters} className="flex items-center gap-1.5">
                      <X size={16} />
                      Clear All
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAdvancedFilters(true)}
                    className="flex items-center gap-1.5"
                  >
                    <SlidersHorizontal size={16} />
                    Advanced
                  </Button>
                </div>
              </div>
              
              {/* Platform filters */}
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
              
              {/* Sentiment filters */}
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

              {/* Results info */}
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Showing {filteredMentions.length} of {mentionsData.length} mentions</span>
                {dateRange.from && dateRange.to && (
                  <span>
                    Filtered: {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </MotionCard>
        </div>
        
        {/* Mentions list */}
        <div className="space-y-4">
          {paginatedMentions.length > 0 ? (
            <>
              {paginatedMentions.map((mention) => (
                <MentionCard key={mention.id} mention={mention} />
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i + 1}>
                          <PaginationLink
                            onClick={() => setCurrentPage(i + 1)}
                            isActive={currentPage === i + 1}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
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

      <AdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        engagementFilter={engagementFilter}
        onEngagementFilterChange={setEngagementFilter}
      />
    </div>
  );
};

export default Mentions;
