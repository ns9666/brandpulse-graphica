
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MotionCard from '@/components/ui/MotionCard';
import Chip from '@/components/ui/Chip';
import { ArrowUpRight } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const platformData = [
  { name: 'Twitter', value: 45, color: '#1DA1F2' },
  { name: 'Instagram', value: 25, color: '#E1306C' },
  { name: 'Facebook', value: 15, color: '#4267B2' },
  { name: 'Reddit', value: 10, color: '#FF4500' },
  { name: 'Others', value: 5, color: '#64748b' },
];

const sentimentTrendData = [
  { name: 'Week 1', positive: 65, neutral: 25, negative: 10 },
  { name: 'Week 2', positive: 60, neutral: 30, negative: 10 },
  { name: 'Week 3', positive: 70, neutral: 20, negative: 10 },
  { name: 'Week 4', positive: 55, neutral: 35, negative: 10 },
  { name: 'Week 5', positive: 65, neutral: 20, negative: 15 },
  { name: 'Week 6', positive: 70, neutral: 20, negative: 10 },
  { name: 'Week 7', positive: 80, neutral: 15, negative: 5 },
  { name: 'Week 8', positive: 75, neutral: 15, negative: 10 },
];

const topKeywordsData = [
  { name: 'Innovation', value: 120 },
  { name: 'Quality', value: 80 },
  { name: 'Price', value: 70 },
  { name: 'Features', value: 65 },
  { name: 'Support', value: 60 },
  { name: 'Interface', value: 45 },
  { name: 'Performance', value: 40 },
];

const engagementRateData = [
  { date: 'Jan', rate: 2.4 },
  { date: 'Feb', rate: 2.8 },
  { date: 'Mar', rate: 3.2 },
  { date: 'Apr', rate: 3.6 },
  { date: 'May', rate: 4.0 },
  { date: 'Jun', rate: 5.6 },
  { date: 'Jul', rate: 5.2 },
];

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg">
        <p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }

  return null;
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg">
        <p className="text-sm font-medium mb-1">{label}</p>
        <p className="text-xs">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg">
        <p className="text-sm font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 text-xs mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name}: {entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const Analytics = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      <main className="container pt-28 pb-16">
        <DashboardHeader 
          title="Advanced Analytics" 
          description="Comprehensive analysis of your brand's social media performance."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MotionCard className="p-6">
            <h3 className="text-lg font-medium mb-4">Source Distribution</h3>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {platformData.map((platform, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: platform.color }} 
                  />
                  <span className="text-xs">{platform.name}</span>
                </div>
              ))}
            </div>
          </MotionCard>
          
          <MotionCard className="p-6">
            <h3 className="text-lg font-medium mb-4">Top Keywords</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topKeywordsData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 12 }} 
                    width={80} 
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar 
                    dataKey="value" 
                    fill="#0A84FF"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </MotionCard>
          
          <MotionCard className="p-6 col-span-1 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Sentiment Trend</h3>
              <Chip variant="neutral">Last 8 Weeks</Chip>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={sentimentTrendData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  stackOffset="expand"
                >
                  <defs>
                    <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    dx={-10}
                  />
                  <CartesianGrid vertical={false} stroke="#f5f5f5" />
                  <Tooltip content={<CustomAreaTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="positive"
                    stackId="1"
                    stroke="#16a34a"
                    fill="url(#colorPositive)"
                    name="Positive"
                  />
                  <Area
                    type="monotone"
                    dataKey="neutral"
                    stackId="1"
                    stroke="#64748b"
                    fill="url(#colorNeutral)"
                    name="Neutral"
                  />
                  <Area
                    type="monotone"
                    dataKey="negative"
                    stackId="1"
                    stroke="#dc2626"
                    fill="url(#colorNegative)"
                    name="Negative"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs">Positive</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-500" />
                <span className="text-xs">Neutral</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-600" />
                <span className="text-xs">Negative</span>
              </div>
            </div>
          </MotionCard>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MotionCard className="p-6 col-span-1 md:col-span-2">
            <h3 className="text-lg font-medium mb-1">Engagement Rate</h3>
            <div className="flex items-center mb-4">
              <p className="text-muted-foreground text-sm">Average engagement per post</p>
              <div className="ml-auto flex items-center gap-1 text-emerald-600 text-sm">
                <ArrowUpRight size={16} />
                <span>+12.8%</span>
              </div>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={engagementRateData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
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
                    tickFormatter={(value) => `${value}%`}
                  />
                  <CartesianGrid vertical={false} stroke="#f5f5f5" />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Engagement']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="#0A84FF"
                    fillOpacity={1}
                    fill="url(#colorRate)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </MotionCard>
          
          <MotionCard className="p-6">
            <h3 className="text-lg font-medium mb-4">AI Insights</h3>
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-4">
                <h4 className="font-medium text-sm mb-1">Correlation Analysis</h4>
                <p className="text-muted-foreground text-xs mb-2">
                  Positive mentions have a 73% correlation with product feature discussions.
                </p>
                <Chip variant="info">High Confidence</Chip>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-4">
                <h4 className="font-medium text-sm mb-1">Audience Segmentation</h4>
                <p className="text-muted-foreground text-xs mb-2">
                  Tech enthusiasts (25-34) engage 2.4x more with your brand compared to other segments.
                </p>
                <Chip variant="info">Medium Confidence</Chip>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-4">
                <h4 className="font-medium text-sm mb-1">Content Recommendation</h4>
                <p className="text-muted-foreground text-xs mb-2">
                  Tutorial and how-to content receives 34% higher engagement based on mention context.
                </p>
                <Chip variant="success">Actionable</Chip>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-4">
                <h4 className="font-medium text-sm mb-1">Trending Opportunity</h4>
                <p className="text-muted-foreground text-xs mb-2">
                  Sustainability-related discussions about your industry are up 47% - potential positioning opportunity.
                </p>
                <Chip variant="warning">Time-Sensitive</Chip>
              </div>
            </div>
          </MotionCard>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
