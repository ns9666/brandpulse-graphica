
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import MotionCard from '@/components/ui/MotionCard';
import { useApiData } from '@/hooks/useApiData';
import { dashboardApi } from '@/services/djangoApi';
import { useDashboardContext } from '@/pages/Index';

// Default fallback data
const defaultSentimentData = [
  { name: 'Positive', value: 65, color: '#16a34a' },
  { name: 'Neutral', value: 25, color: '#64748b' },
  { name: 'Negative', value: 10, color: '#dc2626' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg">
        <p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }

  return null;
};

const SentimentAnalysis = () => {
  const { selectedDashboard, dashboardFilters } = useDashboardContext();

  // Fetch sentiment analysis data from Django API with dashboard context
  const { data: apiData, loading, error } = useApiData(() => 
    dashboardApi.getSentimentAnalysis(selectedDashboard?.id || 1, dashboardFilters)
  );

  // Convert API data to chart format or use fallback
  const sentimentData = apiData ? [
    { name: 'Positive', value: apiData.positive, color: '#16a34a' },
    { name: 'Neutral', value: apiData.neutral, color: '#64748b' },
    { name: 'Negative', value: apiData.negative, color: '#dc2626' },
  ] : defaultSentimentData;

  if (error) {
    console.warn('Failed to load sentiment analysis data, using fallback data:', error);
  }

  return (
    <MotionCard className="col-span-1 h-[350px]">
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Sentiment Analysis</h3>
          <p className="text-muted-foreground text-sm">Breakdown of mention sentiment</p>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          {loading ? (
            <div className="h-[220px] flex items-center justify-center">
              <div className="animate-pulse text-sm text-muted-foreground">Loading sentiment data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
          
          <div className="flex justify-center gap-6 mt-2">
            {sentimentData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }} 
                />
                <span className="text-xs">{entry.name} {entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MotionCard>
  );
};

export default SentimentAnalysis;
