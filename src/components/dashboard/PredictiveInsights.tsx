
import React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import MotionCard from '@/components/ui/MotionCard';
import Chip from '@/components/ui/Chip';
import { TrendingUp } from 'lucide-react';

// Sample data for predictive trends
const predictiveData = [
  { month: 'Feb', actual: 400, predicted: null },
  { month: 'Mar', actual: 450, predicted: null },
  { month: 'Apr', actual: 520, predicted: null },
  { month: 'May', actual: 490, predicted: null },
  { month: 'Jun', actual: 540, predicted: null },
  { month: 'Jul', actual: null, predicted: 560 },
  { month: 'Aug', actual: null, predicted: 590 },
  { month: 'Sep', actual: null, predicted: 620 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isActual = data.actual !== null;
    
    return (
      <div className="glass-panel p-3 rounded-lg">
        <p className="font-medium text-sm mb-1">{label}</p>
        {isActual ? (
          <p className="text-xs">Actual: {data.actual}</p>
        ) : (
          <p className="text-xs">Predicted: {data.predicted}</p>
        )}
      </div>
    );
  }

  return null;
};

const PredictiveInsights = () => {
  const insights = [
    {
      title: "Projected Growth",
      description: "Brand mentions expected to increase by 14.8% in Q3 based on current trajectory."
    },
    {
      title: "Upcoming Trend",
      description: "AI topics related to your brand are gaining momentum with 32% increase in engagement predicted."
    }
  ];
  
  return (
    <MotionCard className="col-span-1 row-span-2 lg:col-span-2 h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-medium">AI Predictive Insights</h3>
              <Chip variant="info">Beta</Chip>
            </div>
            <p className="text-muted-foreground text-sm">Forecasted trends based on historical data</p>
          </div>
        </div>
        
        <div className="h-[180px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictiveData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
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
                width={30}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#0A84FF"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#0A84FF"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-auto">
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-1.5">
              <TrendingUp size={16} className="text-brand-blue" />
              Key Predictions
            </h4>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-3">
                  <h5 className="font-medium text-sm mb-1">{insight.title}</h5>
                  <p className="text-muted-foreground text-xs">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MotionCard>
  );
};

export default PredictiveInsights;
