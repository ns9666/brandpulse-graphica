
import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import MotionCard from '@/components/ui/MotionCard';

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  dateRange: { from: Date | null; to: Date | null };
  onDateRangeChange: (range: { from: Date | null; to: Date | null }) => void;
  engagementFilter: string;
  onEngagementFilterChange: (filter: string) => void;
}

const AdvancedFilters = ({
  isOpen,
  onClose,
  dateRange,
  onDateRangeChange,
  engagementFilter,
  onEngagementFilterChange
}: AdvancedFiltersProps) => {
  const [fromDate, setFromDate] = useState<Date | undefined>(dateRange.from || undefined);
  const [toDate, setToDate] = useState<Date | undefined>(dateRange.to || undefined);

  const handleApplyFilters = () => {
    onDateRangeChange({
      from: fromDate || null,
      to: toDate || null
    });
    console.log('Applied advanced filters');
  };

  const handleClearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    onDateRangeChange({ from: null, to: null });
    onEngagementFilterChange('all');
  };

  const setQuickDateRange = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);
    setFromDate(from);
    setToDate(to);
    onDateRangeChange({ from, to });
  };

  if (!isOpen) return null;

  return (
    <MotionCard className="p-6 h-fit sticky top-28">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Advanced Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Quick Date Ranges */}
        <div>
          <label className="block text-sm font-medium mb-3">Quick Date Ranges</label>
          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" size="sm" onClick={() => setQuickDateRange(7)} className="justify-start">
              Last 7 days
            </Button>
            <Button variant="outline" size="sm" onClick={() => setQuickDateRange(30)} className="justify-start">
              Last 30 days
            </Button>
            <Button variant="outline" size="sm" onClick={() => setQuickDateRange(90)} className="justify-start">
              Last 3 months
            </Button>
            <Button variant="outline" size="sm" onClick={() => setQuickDateRange(365)} className="justify-start">
              Last year
            </Button>
          </div>
        </div>

        {/* Custom Date Range */}
        <div>
          <label className="block text-sm font-medium mb-3">Custom Date Range</label>
          <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <Calendar className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, 'MMM dd, yyyy') : 'From date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={fromDate}
                  onSelect={(date) => {
                    setFromDate(date);
                    if (date) {
                      handleApplyFilters();
                    }
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <Calendar className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, 'MMM dd, yyyy') : 'To date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={toDate}
                  onSelect={(date) => {
                    setToDate(date);
                    if (date) {
                      handleApplyFilters();
                    }
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Engagement Level */}
        <div>
          <label className="block text-sm font-medium mb-3">Engagement Level</label>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'All Levels' },
              { value: 'high', label: 'High (1000+)' },
              { value: 'medium', label: 'Medium (100-999)' },
              { value: 'low', label: 'Low (<100)' }
            ].map((level) => (
              <Button
                key={level.value}
                variant={engagementFilter === level.value ? "default" : "outline"}
                size="sm"
                onClick={() => onEngagementFilterChange(level.value)}
                className={`w-full justify-start ${engagementFilter === level.value ? "bg-brand-blue hover:bg-brand-blue/90" : ""}`}
              >
                {level.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Current Selection Display */}
        {(fromDate || toDate || engagementFilter !== 'all') && (
          <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Active Filters:</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              {fromDate && toDate && (
                <div>Date: {format(fromDate, 'MMM dd')} - {format(toDate, 'MMM dd')}</div>
              )}
              {engagementFilter !== 'all' && (
                <div>Engagement: {engagementFilter}</div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClearFilters} className="flex-1">
            Clear All
          </Button>
          <Button onClick={handleApplyFilters} className="flex-1 bg-brand-blue hover:bg-brand-blue/90">
            Apply
          </Button>
        </div>
      </div>
    </MotionCard>
  );
};

export default AdvancedFilters;
