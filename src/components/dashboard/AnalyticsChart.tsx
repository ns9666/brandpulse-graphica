
import React, { useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import MotionCard from '@/components/ui/MotionCard';
import { Button } from '@/components/ui/button';
import { useApiData } from '@/hooks/useApiData';
import { analyticsApi } from '@/services/djangoApi';
import { useDashboardContext } from '@/pages/Index';

const defaultAnalyticsData = [
  { date: 'Jan', audienceReach: 400, monthlyMentions: 240 },
  { date: 'Feb', audienceReach: 300, monthlyMentions: 139 },
  { date: 'Mar', audienceReach: 200, monthlyMentions: 980 },
  { date: 'Apr', audienceReach: 278, monthlyMentions: 390 },
  { date: 'May', audienceReach: 189, monthlyMentions: 480 },
  { date: 'Jun', audienceReach: 239, monthlyMentions: 380 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg">
        <p className="font-medium text-sm mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name}: {entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsChart = () => {
  const { selectedDashboard, dashboardFilters } = useDashboardContext();
  const [metric, setMetric] = useState<'audienceReach' | 'monthlyMentions'>('audienceReach');
  const [timeRange, setTimeRange] = useState('6m');

  // Fetch audience reach data
  const { data: audienceData, loading: loadingAudience, error: audienceError } = useApiData(() => 
    analyticsApi.getAudienceReach(timeRange, selectedDashboard?.id || 1, dashboardFilters)
  );

  // Fetch monthly mentions data
  const { data: mentionsData, loading: loadingMentions, error: mentionsError } = useApiData(() => 
    analyticsApi.getMonthlyMentions(timeRange, selectedDashboard?.id || 1, dashboardFilters)
  );

  // Combine data for chart
  const chartData = React.useMemo(() => {
    if (audienceData && mentionsData) {
      // Combine API data by date/month
      const combinedData = audienceData.map((audienceItem, index) => ({
        date: audienceItem.date,
        audienceReach: audienceItem.reach,
        monthlyMentions: mentionsData[index]?.mentions || 0
      }));
      return combinedData;
    }
    return defaultAnalyticsData;
  }, [audienceData, mentionsData]);

  const isLoading = loadingAudience || loadingMentions;

  if (audienceError || mentionsError) {
    console.warn('Failed to load analytics data, using fallback data');
  }

  return (
    <MotionCard className="col-span-1 h-[350px]">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-medium">
              {metric === 'audienceReach' ? 'Audience Reach Trend' : 'Monthly Mentions'}
            </h3>
            <p className="text-muted-foreground text-sm">
              {metric === 'audienceReach' ? 'Total reach over time' : 'Mentions per month'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={metric === 'audienceReach' ? "default" : "outline"}
              size="sm"
              onClick={() => setMetric('audienceReach')}
              className={metric === 'audienceReach' ? "bg-brand-blue hover:bg-brand-blue/90" : ""}
            >
              Reach
            </Button>
            <Button
              variant={metric === 'monthlyMentions' ? "default" : "outline"}
              size="sm"
              onClick={() => setMetric('monthlyMentions')}
              className={metric === 'monthlyMentions' ? "bg-brand-blue hover:bg-brand-blue/90" : ""}
            >
              Mentions
            </Button>
          </div>
        </div>
        
        <div className="flex-1">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-pulse text-sm text-muted-foreground">Loading analytics data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey={metric}
                  stroke="#0A84FF"
                  fillOpacity={1}
                  fill="url(#colorMetric)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </MotionCard>
  );
};

export default AnalyticsChart;
