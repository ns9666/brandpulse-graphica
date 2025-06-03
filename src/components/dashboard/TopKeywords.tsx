
import React from 'react';
import { TrendingUp, TrendingDown, Hash } from 'lucide-react';
import MotionCard from '@/components/ui/MotionCard';
import { useApiData } from '@/hooks/useApiData';
import { analyticsApi } from '@/services/djangoApi';
import { useDashboardContext } from '@/pages/Index';

interface KeywordData {
  keyword: string;
  mentions: number;
  change: string;
  trend: 'up' | 'down';
}

const defaultKeywordsData: KeywordData[] = [
  { keyword: 'brand awareness', mentions: 1247, change: '+12.5%', trend: 'up' },
  { keyword: 'customer service', mentions: 892, change: '+8.3%', trend: 'up' },
  { keyword: 'product quality', mentions: 756, change: '-2.1%', trend: 'down' },
  { keyword: 'user experience', mentions: 634, change: '+15.7%', trend: 'up' },
  { keyword: 'pricing', mentions: 523, change: '+4.2%', trend: 'up' },
  { keyword: 'competition', mentions: 445, change: '-5.8%', trend: 'down' },
];

const TopKeywords = () => {
  const { selectedDashboard, dashboardFilters } = useDashboardContext();

  // Fetch top keywords data from Django API
  const { data: apiData, loading, error } = useApiData<KeywordData[]>(() => 
    analyticsApi.getTopKeywords(selectedDashboard?.id, dashboardFilters)
  );

  // Use API data or fallback to default data
  const keywordsData: KeywordData[] = Array.isArray(apiData) && apiData.length > 0 ? apiData : defaultKeywordsData;

  if (error) {
    console.warn('Failed to load top keywords data, using fallback data:', error);
  }

  return (
    <MotionCard className="p-6 h-[350px]">
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Top Keywords</h3>
          <p className="text-muted-foreground text-sm">Most mentioned keywords</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {keywordsData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-full bg-brand-blue/10 text-brand-blue">
                      <Hash size={14} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.keyword}</p>
                      <p className="text-xs text-muted-foreground">{item.mentions} mentions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.trend === 'up' ? (
                      <TrendingUp size={14} className="text-emerald-600" />
                    ) : (
                      <TrendingDown size={14} className="text-rose-600" />
                    )}
                    <span className={`text-xs font-medium ${
                      item.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MotionCard>
  );
};

export default TopKeywords;
