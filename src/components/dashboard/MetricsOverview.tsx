import React from 'react';
import { ArrowDown, ArrowUp, BarChart3, MessageSquare, TrendingUp, Users } from 'lucide-react';
import MotionCard from '@/components/ui/MotionCard';
import { cn } from '@/lib/utils';
import { useApiData } from '@/hooks/useApiData';
import { dashboardApi } from '@/services/djangoApi';
import { useDashboardContext } from '@/pages/Index';

interface MetricCardProps {
  title: string;
  value: string;
  change: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon: React.ElementType;
  loading?: boolean;
}

const MetricCard = ({ title, value, change, icon: Icon, loading }: MetricCardProps) => {
  const trendColor = {
    up: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
    down: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-400',
    neutral: 'text-slate-600 bg-slate-50 dark:bg-slate-900/20 dark:text-slate-400'
  };
  
  const TrendIcon = change.trend === 'up' ? ArrowUp : change.trend === 'down' ? ArrowDown : TrendingUp;
  
  if (loading) {
    return (
      <MotionCard className="flex flex-col h-full p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-3"></div>
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </MotionCard>
    );
  }
  
  return (
    <MotionCard className="flex flex-col h-full p-4 sm:p-6">
      <div className="flex justify-between items-start mb-3">
        <span className="text-muted-foreground text-xs sm:text-sm font-medium">{title}</span>
        <div className="bg-brand-blue/10 dark:bg-brand-blue/20 p-1.5 sm:p-2 rounded-full text-brand-blue">
          <Icon size={16} className="sm:w-5 sm:h-5" />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight mb-2">{value}</h3>
        <div className="flex items-center">
          <span className={cn('text-xs font-medium rounded-full px-1.5 py-0.5 flex items-center gap-0.5', trendColor[change.trend])}>
            <TrendIcon size={10} className="inline-block" />
            {change.value}
          </span>
          <span className="text-xs text-muted-foreground ml-1.5">vs previous</span>
        </div>
      </div>
    </MotionCard>
  );
};

const MetricsOverview = () => {
  const { selectedDashboard, dashboardFilters } = useDashboardContext();

  // Fetch dashboard stats from Django API with dashboard context
  const { data: stats, loading, error } = useApiData(() => 
    dashboardApi.getStats(selectedDashboard?.id, dashboardFilters)
  );

  // Fallback data if API fails
  const defaultMetrics = [
    {
      title: 'Total Mentions',
      value: '3,842',
      change: { value: '12.5%', trend: 'up' as const },
      icon: MessageSquare
    },
    {
      title: 'Engagement Rate',
      value: '5.7%',
      change: { value: '3.2%', trend: 'up' as const },
      icon: TrendingUp
    },
    {
      title: 'Audience Reach',
      value: '1.2M',
      change: { value: '8.1%', trend: 'up' as const },
      icon: Users
    },
    {
      title: 'Sentiment Score',
      value: '76/100',
      change: { value: '2.3%', trend: 'down' as const },
      icon: BarChart3
    }
  ];

  // Convert API data to metrics format
  const metrics = stats ? [
    {
      title: 'Total Mentions',
      value: stats.totalMentions.toLocaleString(),
      change: { value: stats.changes.mentions, trend: stats.changes.mentions.startsWith('+') ? 'up' as const : 'down' as const },
      icon: MessageSquare
    },
    {
      title: 'Engagement Rate',
      value: `${stats.engagementRate}%`,
      change: { value: stats.changes.engagement, trend: stats.changes.engagement.startsWith('+') ? 'up' as const : 'down' as const },
      icon: TrendingUp
    },
    {
      title: 'Audience Reach',
      value: stats.audienceReach,
      change: { value: stats.changes.reach, trend: stats.changes.reach.startsWith('+') ? 'up' as const : 'down' as const },
      icon: Users
    },
    {
      title: 'Sentiment Score',
      value: `${stats.sentimentScore}/100`,
      change: { value: stats.changes.sentiment, trend: stats.changes.sentiment.startsWith('+') ? 'up' as const : 'down' as const },
      icon: BarChart3
    }
  ] : defaultMetrics;

  if (error) {
    console.warn('Failed to load dashboard stats, using fallback data:', error);
  }
  
  return (
    <div className="col-span-full">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
};

export default MetricsOverview;
