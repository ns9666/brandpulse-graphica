
import React from 'react';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import MotionCard from '@/components/ui/MotionCard';

const performanceData = [
  { month: 'Jan', reach: 890000, engagement: 4.2, mentions: 1240 },
  { month: 'Feb', reach: 920000, engagement: 4.8, mentions: 1350 },
  { month: 'Mar', reach: 1100000, engagement: 5.1, mentions: 1580 },
  { month: 'Apr', reach: 980000, engagement: 4.6, mentions: 1420 },
  { month: 'May', reach: 1200000, engagement: 5.7, mentions: 1690 },
  { month: 'Jun', reach: 1250000, engagement: 6.2, mentions: 1850 },
];

const AnalyticsChart = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <MotionCard className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Audience Reach Trend</h3>
          <p className="text-muted-foreground text-sm">Monthly audience reach over time</p>
        </div>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                formatter={(value: number) => [`${(value / 1000000).toFixed(1)}M`, 'Reach']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="reach"
                stroke="#0A84FF"
                strokeWidth={3}
                dot={{ r: 4, fill: '#0A84FF' }}
                activeDot={{ r: 6, fill: '#0A84FF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </MotionCard>

      <MotionCard className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Monthly Mentions</h3>
          <p className="text-muted-foreground text-sm">Brand mentions across all platforms</p>
        </div>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number) => [value, 'Mentions']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Bar
                dataKey="mentions"
                fill="#0A84FF"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </MotionCard>
    </div>
  );
};

export default AnalyticsChart;
