
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface AdvancedFiltersProps {
  onFiltersChange: (filters: any) => void;
  onClose: () => void;
}

const AdvancedFilters = ({ onFiltersChange, onClose }: AdvancedFiltersProps) => {
  const [dateRange, setDateRange] = useState('30d');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [sentiments, setSentiments] = useState<string[]>([]);
  const [minEngagement, setMinEngagement] = useState(0);
  const [maxEngagement, setMaxEngagement] = useState(10000);
  const [keywords, setKeywords] = useState('');

  const handlePlatformChange = (platform: string, checked: boolean) => {
    if (checked) {
      setPlatforms([...platforms, platform]);
    } else {
      setPlatforms(platforms.filter(p => p !== platform));
    }
  };

  const handleSentimentChange = (sentiment: string, checked: boolean) => {
    if (checked) {
      setSentiments([...sentiments, sentiment]);
    } else {
      setSentiments(sentiments.filter(s => s !== sentiment));
    }
  };

  const handleApplyFilters = () => {
    const filters: any = {
      dateRange,
      platforms,
      sentiments,
      minEngagement,
      maxEngagement,
      keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
    };

    // Include start and end dates when custom range is selected
    if (dateRange === 'custom') {
      if (startDate) {
        filters.startDate = format(startDate, 'yyyy-MM-dd');
      }
      if (endDate) {
        filters.endDate = format(endDate, 'yyyy-MM-dd');
      }
    }

    onFiltersChange(filters);
    onClose();
  };

  const handleReset = () => {
    setDateRange('30d');
    setStartDate(undefined);
    setEndDate(undefined);
    setPlatforms([]);
    setSentiments([]);
    setMinEngagement(0);
    setMaxEngagement(10000);
    setKeywords('');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Advanced Filters</h3>
        <Button variant="ghost" onClick={onClose}>×</Button>
      </div>

      {/* Date Range */}
      <div className="space-y-3">
        <Label>Date Range</Label>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        {/* Custom Date Range Inputs */}
        {dateRange === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Pick start date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : 'Pick end date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </div>

      {/* Platforms */}
      <div className="space-y-3">
        <Label>Platforms</Label>
        <div className="grid grid-cols-2 gap-3">
          {['Twitter', 'Instagram', 'Facebook', 'Reddit', 'LinkedIn', 'TikTok'].map((platform) => (
            <div key={platform} className="flex items-center space-x-2">
              <Checkbox
                id={platform}
                checked={platforms.includes(platform.toLowerCase())}
                onCheckedChange={(checked) => 
                  handlePlatformChange(platform.toLowerCase(), checked as boolean)
                }
              />
              <Label htmlFor={platform}>{platform}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Sentiment */}
      <div className="space-y-3">
        <Label>Sentiment</Label>
        <div className="flex gap-4">
          {['positive', 'neutral', 'negative'].map((sentiment) => (
            <div key={sentiment} className="flex items-center space-x-2">
              <Checkbox
                id={sentiment}
                checked={sentiments.includes(sentiment)}
                onCheckedChange={(checked) => 
                  handleSentimentChange(sentiment, checked as boolean)
                }
              />
              <Label htmlFor={sentiment} className="capitalize">{sentiment}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Range */}
      <div className="space-y-3">
        <Label>Engagement Range</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minEngagement" className="text-sm">Min</Label>
            <Input
              id="minEngagement"
              type="number"
              value={minEngagement}
              onChange={(e) => setMinEngagement(parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="maxEngagement" className="text-sm">Max</Label>
            <Input
              id="maxEngagement"
              type="number"
              value={maxEngagement}
              onChange={(e) => setMaxEngagement(parseInt(e.target.value) || 10000)}
              placeholder="10000"
            />
          </div>
        </div>
      </div>

      {/* Keywords */}
      <div className="space-y-3">
        <Label>Keywords (comma-separated)</Label>
        <Input
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g., brand, product, service"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button onClick={handleReset} variant="outline" className="flex-1">
          Reset
        </Button>
        <Button onClick={handleApplyFilters} className="flex-1 bg-brand-blue hover:bg-brand-blue/90">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default AdvancedFilters;
