
import React, { useState } from 'react';
import { Calendar, Filter, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

export interface DashboardFiltersData {
  dateRange: string;
  platforms: string[];
  sentiments: string[];
  keywords: string[];
  minEngagement: number;
  maxEngagement: number;
}

interface DashboardFiltersProps {
  onFiltersChange: (filters: DashboardFiltersData) => void;
  currentFilters: DashboardFiltersData;
}

const DashboardFilters = ({ onFiltersChange, currentFilters }: DashboardFiltersProps) => {
  const [tempFilters, setTempFilters] = useState<DashboardFiltersData>(currentFilters);
  const [isOpen, setIsOpen] = useState(false);

  const platforms = [
    { id: 'twitter', label: 'Twitter' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'reddit', label: 'Reddit' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'news', label: 'News' },
  ];

  const sentiments = [
    { id: 'positive', label: 'Positive' },
    { id: 'neutral', label: 'Neutral' },
    { id: 'negative', label: 'Negative' },
  ];

  const dateRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '6m', label: 'Last 6 months' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom range' },
  ];

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    const newPlatforms = checked
      ? [...tempFilters.platforms, platformId]
      : tempFilters.platforms.filter(p => p !== platformId);
    
    setTempFilters({ ...tempFilters, platforms: newPlatforms });
  };

  const handleSentimentChange = (sentimentId: string, checked: boolean) => {
    const newSentiments = checked
      ? [...tempFilters.sentiments, sentimentId]
      : tempFilters.sentiments.filter(s => s !== sentimentId);
    
    setTempFilters({ ...tempFilters, sentiments: newSentiments });
  };

  const applyFilters = () => {
    onFiltersChange(tempFilters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const defaultFilters: DashboardFiltersData = {
      dateRange: '30d',
      platforms: [],
      sentiments: [],
      keywords: [],
      minEngagement: 0,
      maxEngagement: 10000,
    };
    setTempFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (currentFilters.platforms.length > 0) count++;
    if (currentFilters.sentiments.length > 0) count++;
    if (currentFilters.keywords.length > 0) count++;
    if (currentFilters.dateRange !== '30d') count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1.5 relative">
          <Filter size={16} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs h-4 min-w-4">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Dashboard Filters</SheetTitle>
          <SheetDescription>
            Customize your dashboard data by applying filters below.
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Select
              value={tempFilters.dateRange}
              onValueChange={(value) => setTempFilters({ ...tempFilters, dateRange: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
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
            <div className="grid grid-cols-2 gap-3">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform.id}
                    checked={tempFilters.platforms.includes(platform.id)}
                    onCheckedChange={(checked) => 
                      handlePlatformChange(platform.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={platform.id} className="text-sm">
                    {platform.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Sentiments */}
          <div className="space-y-3">
            <Label>Sentiment</Label>
            <div className="flex gap-3">
              {sentiments.map((sentiment) => (
                <div key={sentiment.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={sentiment.id}
                    checked={tempFilters.sentiments.includes(sentiment.id)}
                    onCheckedChange={(checked) => 
                      handleSentimentChange(sentiment.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={sentiment.id} className="text-sm">
                    {sentiment.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label>Additional Keywords</Label>
            <Input
              placeholder="Enter keywords separated by commas"
              value={tempFilters.keywords.join(', ')}
              onChange={(e) => 
                setTempFilters({ 
                  ...tempFilters, 
                  keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                })
              }
            />
          </div>

          {/* Engagement Range */}
          <div className="space-y-3">
            <Label>Engagement Range</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="min-engagement" className="text-xs text-muted-foreground">
                  Minimum
                </Label>
                <Input
                  id="min-engagement"
                  type="number"
                  value={tempFilters.minEngagement}
                  onChange={(e) => 
                    setTempFilters({ 
                      ...tempFilters, 
                      minEngagement: parseInt(e.target.value) || 0 
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="max-engagement" className="text-xs text-muted-foreground">
                  Maximum
                </Label>
                <Input
                  id="max-engagement"
                  type="number"
                  value={tempFilters.maxEngagement}
                  onChange={(e) => 
                    setTempFilters({ 
                      ...tempFilters, 
                      maxEngagement: parseInt(e.target.value) || 10000 
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Applied Filters */}
          {activeFiltersCount > 0 && (
            <div className="space-y-2">
              <Label>Applied Filters</Label>
              <div className="flex flex-wrap gap-2">
                {currentFilters.platforms.map((platform) => (
                  <Badge key={platform} variant="secondary">
                    {platforms.find(p => p.id === platform)?.label}
                  </Badge>
                ))}
                {currentFilters.sentiments.map((sentiment) => (
                  <Badge key={sentiment} variant="secondary">
                    {sentiments.find(s => s.id === sentiment)?.label}
                  </Badge>
                ))}
                {currentFilters.dateRange !== '30d' && (
                  <Badge variant="secondary">
                    {dateRanges.find(d => d.value === currentFilters.dateRange)?.label}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <Button onClick={applyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DashboardFilters;
