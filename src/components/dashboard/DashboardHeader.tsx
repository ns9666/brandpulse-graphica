
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Chip from '@/components/ui/Chip';
import DashboardFilters, { DashboardFiltersData } from './DashboardFilters';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  onFiltersChange?: (filters: DashboardFiltersData) => void;
  currentFilters?: DashboardFiltersData;
}

const defaultFilters: DashboardFiltersData = {
  dateRange: '30d',
  platforms: [],
  sentiments: [],
  keywords: [],
  minEngagement: 0,
  maxEngagement: 10000,
};

const DashboardHeader = ({ 
  title, 
  description = "Track social media mentions and analyze engagement.", 
  action,
  onFiltersChange,
  currentFilters = defaultFilters
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
      <div>
        <Chip variant="neutral" className="mb-2">Overview</Chip>
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="flex items-center gap-2 self-start md:self-center">
        {action && <div className="mr-2">{action}</div>}
        {onFiltersChange && (
          <DashboardFilters 
            filters={currentFilters}
            onFiltersChange={onFiltersChange}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
