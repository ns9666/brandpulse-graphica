
import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

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
    onClose();
  };

  const handleClearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    onDateRangeChange({ from: null, to: null });
    onEngagementFilterChange('all');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Advanced Filters</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <Calendar className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, 'MMM dd, yyyy') : 'From date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    initialFocus
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
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Engagement Level</label>
            <div className="grid grid-cols-2 gap-2">
              {['all', 'high', 'medium', 'low'].map((level) => (
                <Button
                  key={level}
                  variant={engagementFilter === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => onEngagementFilterChange(level)}
                  className="capitalize"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button variant="outline" onClick={handleClearFilters} className="flex-1">
            Clear All
          </Button>
          <Button onClick={handleApplyFilters} className="flex-1 bg-brand-blue hover:bg-brand-blue/90">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
