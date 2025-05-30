
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MotionCard from '@/components/ui/MotionCard';
import MentionCard from '@/components/mentions/MentionCard';
import AdvancedFilters from '@/components/mentions/AdvancedFilters';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { mentionsApi } from '@/services/djangoApi';

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

const ITEMS_PER_PAGE = 5;

const Mentions = () => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['All']);
  const [selectedSentiments, setSelectedSentiments] = useState<string[]>(['All']);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState('all');
  const [customDateRange, setCustomDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [engagementFilter, setEngagementFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Data states
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [totalMentions, setTotalMentions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch mentions from Django API
  const fetchMentions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare API parameters
      const params = {
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
        search: searchQuery || undefined,
        platforms: selectedPlatforms.includes('All') ? undefined : selectedPlatforms,
        sentiments: selectedSentiments.includes('All') ? undefined : selectedSentiments.map(s => s.toLowerCase()),
        dateRange: dateRange === 'all' ? undefined : dateRange,
        engagementLevel: engagementFilter === 'all' ? undefined : engagementFilter,
      };

      console.log('Fetching mentions with params:', params);
      
      const response = await mentionsApi.getMentions(params);
      
      setMentions(response.results || []);
      setTotalMentions(response.count || 0);
    } catch (err) {
      console.error('Failed to fetch mentions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load mentions');
      
      // Fallback to empty state or show error
      setMentions([]);
      setTotalMentions(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch mentions when filters change
  useEffect(() => {
    fetchMentions();
  }, [
    searchQuery,
    selectedPlatforms,
    selectedSentiments,
    dateRange,
    customDateRange,
    engagementFilter,
    currentPage
  ]);
  
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
    setDateRange('all');
    setCustomDateRange({ from: null, to: null });
    setEngagementFilter('all');
    setCurrentPage(1);
  };

  const applyDateFilter = (range: string) => {
    setDateRange(range);
    if (range !== 'custom') {
      setCustomDateRange({ from: null, to: null });
    }
    setCurrentPage(1);
    console.log(`Applied date filter: ${range}`);
  };

  const totalPages = Math.ceil(totalMentions / ITEMS_PER_PAGE);

  const hasActiveFilters = !selectedPlatforms.includes('All') || 
                          !selectedSentiments.includes('All') || 
                          searchQuery.length > 0 ||
                          dateRange !== 'all' ||
                          customDateRange.from !== null ||
                          customDateRange.to !== null ||
                          engagementFilter !== 'all';
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      <main className="container pt-28 pb-16">
        <DashboardHeader 
          title="Mentions" 
          description="Monitor and analyze mentions across all social platforms."
        />
        
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-80 flex-shrink-0">
            <MotionCard className="p-6 sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Filters</h3>
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearAllFilters}>
                    <X size={14} className="mr-1" />
                    Clear All
                  </Button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search mentions..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'all', label: 'All Time' },
                    { value: '7d', label: 'Last 7 days' },
                    { value: '30d', label: 'Last 30 days' },
                    { value: '90d', label: 'Last 90 days' }
                  ].map((range) => (
                    <Button
                      key={range.value}
                      variant={dateRange === range.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => applyDateFilter(range.value)}
                      className={`justify-start text-xs ${dateRange === range.value ? "bg-brand-blue hover:bg-brand-blue/90" : ""}`}
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Platform */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Platform</label>
                <div className="space-y-2">
                  {['All', 'Twitter', 'Instagram', 'Facebook', 'Reddit', 'LinkedIn', 'YouTube'].map((platform) => (
                    <Button
                      key={platform}
                      variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePlatformFilter(platform)}
                      className={`w-full justify-start text-xs ${selectedPlatforms.includes(platform) ? "bg-brand-blue hover:bg-brand-blue/90" : ""}`}
                    >
                      {platform}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sentiment */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Sentiment</label>
                <div className="space-y-2">
                  {['All', 'Positive', 'Neutral', 'Negative'].map((sentiment) => (
                    <Button
                      key={sentiment}
                      variant={selectedSentiments.includes(sentiment) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSentimentFilter(sentiment)}
                      className={`w-full justify-start text-xs ${selectedSentiments.includes(sentiment) ? "bg-brand-blue hover:bg-brand-blue/90" : ""}`}
                    >
                      {sentiment}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Advanced Filters Toggle */}
              <Button 
                variant="outline" 
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="w-full flex items-center justify-center gap-2"
              >
                <SlidersHorizontal size={16} />
                Advanced Filters
              </Button>

              {/* Results Info */}
              <div className="mt-6 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Showing {mentions.length} of {totalMentions} mentions
                </p>
              </div>
            </MotionCard>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* API Connection Status */}
            {error && (
              <MotionCard className="p-4 mb-4 bg-yellow-50 border-yellow-200">
                <p className="text-sm text-yellow-800">
                  Django API connection failed: {error}. Showing cached data.
                </p>
              </MotionCard>
            )}

            {/* Loading State */}
            {loading && (
              <div className="space-y-4">
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                  <MotionCard key={i} className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-3"></div>
                      <div className="h-16 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </MotionCard>
                ))}
              </div>
            )}

            {/* Mentions list */}
            {!loading && (
              <div className="space-y-4">
                {mentions.length > 0 ? (
                  <>
                    {mentions.map((mention) => (
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
                            
                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                              const page = i + 1;
                              return (
                                <PaginationItem key={page}>
                                  <PaginationLink
                                    onClick={() => setCurrentPage(page)}
                                    isActive={currentPage === page}
                                    className="cursor-pointer"
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            })}
                            
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
            )}
          </div>

          {/* Advanced Filters Modal */}
          {showAdvancedFilters && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="w-full max-w-md">
                <AdvancedFilters
                  isOpen={true}
                  onClose={() => setShowAdvancedFilters(false)}
                  dateRange={customDateRange}
                  onDateRangeChange={(range) => {
                    setCustomDateRange(range);
                    setDateRange('custom');
                  }}
                  engagementFilter={engagementFilter}
                  onEngagementFilterChange={setEngagementFilter}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Mentions;
