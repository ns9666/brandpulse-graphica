
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import MotionCard from '@/components/ui/MotionCard';
import { useApiData } from '@/hooks/useApiData';
import { analyticsApi } from '@/services/djangoApi';
import { useDashboardContext } from '@/pages/Index';

const defaultSourceData = [
  { name: 'Organic Search', value: 35, color: '#0A84FF' },
  { name: 'Direct Traffic', value: 25, color: '#34C759' },
  { name: 'Social Media', value: 20, color: '#FF9500' },
  { name: 'Email', value: 12, color: '#AF52DE' },
  { name: 'Referrals', value: 8, color: '#FF3B30' },
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

const SourceDistribution = () => {
  const { selectedDashboard, dashboardFilters } = useDashboardContext();

  // Fetch source distribution data from Django API
  const { data: apiData, loading, error } = useApiData(() => 
    analyticsApi.getSourceDistribution(selectedDashboard?.id, dashboardFilters)
  );

  // Use API data or fallback to default data
  const sourceData = apiData || defaultSourceData;

  if (error) {
    console.warn('Failed to load source distribution data, using fallback data:', error);
  }

  return (
    <MotionCard className="p-6 h-[350px]">
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Source Distribution</h3>
          <p className="text-muted-foreground text-sm">Traffic sources breakdown</p>
        </div>
        
        <div className="flex-1">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-pulse text-sm text-muted-foreground">Loading source data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={false}
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </MotionCard>
  );
};

export default SourceDistribution;
