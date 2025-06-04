
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, X, Calendar, Hash, TrendingUp } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface DashboardFiltersData {
  dateRange: string;
  platforms: string[];
  sentiments: string[];
  keywords: string[];
  minEngagement: number;
  maxEngagement: number;
}

interface DashboardFiltersProps {
  filters: DashboardFiltersData;
  onFiltersChange: (filters: DashboardFiltersData) => void;
}

const DashboardFilters = ({ filters, onFiltersChange }: DashboardFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<DashboardFiltersData>(filters);
  const [keywordInput, setKeywordInput] = useState('');

  // Update temp filters when props change
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const platforms = ['twitter', 'instagram', 'facebook', 'linkedin', 'reddit', 'youtube'];
  const sentiments = ['positive', 'neutral', 'negative'];
  const dateRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '180d', label: 'Last 6 months' }
  ];

  // Calculate total applied filters
  const getAppliedFiltersCount = () => {
    let count = 0;
    if (tempFilters.platforms.length > 0) count += tempFilters.platforms.length;
    if (tempFilters.sentiments.length > 0) count += tempFilters.sentiments.length;
    if (tempFilters.keywords.length > 0) count += tempFilters.keywords.length;
    if (tempFilters.dateRange !== '30d') count += 1; // Default is 30d, so count if different
    return count;
  };

  const handlePlatformChange = (platform: string, checked: boolean) => {
    setTempFilters(prev => ({
      ...prev,
      platforms: checked 
        ? [...prev.platforms, platform]
        : prev.platforms.filter(p => p !== platform)
    }));
  };

  const handleSentimentChange = (sentiment: string, checked: boolean) => {
    setTempFilters(prev => ({
      ...prev,
      sentiments: checked 
        ? [...prev.sentiments, sentiment]
        : prev.sentiments.filter(s => s !== sentiment)
    }));
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !tempFilters.keywords.includes(keywordInput.trim())) {
      setTempFilters(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setTempFilters(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', tempFilters);
    onFiltersChange(tempFilters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters: DashboardFiltersData = {
      dateRange: '30d',
      platforms: [],
      sentiments: [],
      keywords: [],
      minEngagement: 0,
      maxEngagement: 10000,
    };
    setTempFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const appliedCount = getAppliedFiltersCount();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {appliedCount > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-2 bg-brand-blue text-white text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5"
            >
              {appliedCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-6" align="end">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Filters</h3>
            <Button variant="ghost" size="sm" onClick={handleResetFilters}>
              Reset
            </Button>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </Label>
            <Select 
              value={tempFilters.dateRange} 
              onValueChange={(value) => setTempFilters(prev => ({ ...prev, dateRange: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Platforms */}
          <div className="space-y-3">
            <Label>Platforms</Label>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map((platform) => (
                <div key={platform} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform}
                    checked={tempFilters.platforms.includes(platform)}
                    onCheckedChange={(checked) => handlePlatformChange(platform, checked as boolean)}
                  />
                  <Label 
                    htmlFor={platform} 
                    className="text-sm font-normal capitalize cursor-pointer"
                  >
                    {platform}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Sentiments */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Sentiment
            </Label>
            <div className="flex gap-2">
              {sentiments.map((sentiment) => (
                <div key={sentiment} className="flex items-center space-x-2">
                  <Checkbox
                    id={sentiment}
                    checked={tempFilters.sentiments.includes(sentiment)}
                    onCheckedChange={(checked) => handleSentimentChange(sentiment, checked as boolean)}
                  />
                  <Label 
                    htmlFor={sentiment} 
                    className="text-sm font-normal capitalize cursor-pointer"
                  >
                    {sentiment}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Keywords
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add keyword..."
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                className="flex-1"
              />
              <Button size="sm" onClick={handleAddKeyword}>
                Add
              </Button>
            </div>
            {tempFilters.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tempFilters.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                    {keyword}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleRemoveKeyword(keyword)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Apply Button */}
          <Button onClick={handleApplyFilters} className="w-full bg-brand-blue hover:bg-brand-blue/90">
            Apply Filters ({appliedCount})
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DashboardFilters;
