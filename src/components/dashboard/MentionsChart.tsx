
import React, { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import MotionCard from '@/components/ui/MotionCard';
import { Button } from '@/components/ui/button';
import { useApiData } from '@/hooks/useApiData';
import { dashboardApi } from '@/services/djangoApi';

// Default fallback data
const defaultMentionsData = [
  { date: 'Jan 1', twitter: 40, instagram: 24, facebook: 60, reddit: 15 },
  { date: 'Jan 5', twitter: 30, instagram: 13, facebook: 70, reddit: 25 },
  { date: 'Jan 10', twitter: 20, instagram: 38, facebook: 80, reddit: 35 },
  { date: 'Jan 15', twitter: 27, instagram: 39, facebook: 65, reddit: 40 },
  { date: 'Jan 20', twitter: 90, instagram: 48, facebook: 40, reddit: 20 },
  { date: 'Jan 25', twitter: 75, instagram: 30, facebook: 50, reddit: 15 },
  { date: 'Jan 30', twitter: 110, instagram: 45, facebook: 60, reddit: 30 },
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
            <span>{entry.name}: {entry.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const MentionsChart = () => {
  const [timeRange, setTimeRange] = useState('30d');
  
  // Fetch mentions over time data from Django API
  const { data: apiData, loading, error, refetch } = useApiData(
    () => dashboardApi.getMentionsOverTime(timeRange),
    [timeRange]
  );

  // Use API data or fallback to default data
  const mentionsData = apiData?.results || defaultMentionsData;

  if (error) {
    console.warn('Failed to load mentions chart data, using fallback data:', error);
  }

  const handleTimeRangeChange = (newRange: string) => {
    setTimeRange(newRange);
    // refetch will be called automatically due to dependency array
  };

  return (
    <MotionCard className="col-span-1 lg:col-span-3 h-[350px]">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-medium">Mentions Over Time</h3>
            <p className="text-muted-foreground text-sm">Platform breakdown of brand mentions</p>
          </div>
          <div className="flex gap-2">
            {/* Time range selector */}
            <div className="flex gap-1">
              {[
                { value: '7d', label: '7D' },
                { value: '30d', label: '30D' },
                { value: '90d', label: '90D' }
              ].map((range) => (
                <Button
                  key={range.value}
                  variant={timeRange === range.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTimeRangeChange(range.value)}
                  className={`text-xs ${timeRange === range.value ? "bg-brand-blue hover:bg-brand-blue/90" : ""}`}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-brand-blue" />
            <span className="text-xs text-muted-foreground">Twitter</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#E1306C]" />
            <span className="text-xs text-muted-foreground">Instagram</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#4267B2]" />
            <span className="text-xs text-muted-foreground">Facebook</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF4500]" />
            <span className="text-xs text-muted-foreground">Reddit</span>
          </div>
        </div>
        
        <div className="flex-1">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-pulse text-sm text-muted-foreground">Loading chart data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={mentionsData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTwitter" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorInstagram" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E1306C" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#E1306C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFacebook" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4267B2" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4267B2" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorReddit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4500" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FF4500" stopOpacity={0} />
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
                <CartesianGrid vertical={false} stroke="#f5f5f5" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="twitter"
                  stroke="#0A84FF"
                  fillOpacity={1}
                  fill="url(#colorTwitter)"
                  name="Twitter"
                />
                <Area
                  type="monotone"
                  dataKey="instagram"
                  stroke="#E1306C"
                  fillOpacity={1}
                  fill="url(#colorInstagram)"
                  name="Instagram"
                />
                <Area
                  type="monotone"
                  dataKey="facebook"
                  stroke="#4267B2"
                  fillOpacity={1}
                  fill="url(#colorFacebook)"
                  name="Facebook"
                />
                <Area
                  type="monotone"
                  dataKey="reddit"
                  stroke="#FF4500"
                  fillOpacity={1}
                  fill="url(#colorReddit)"
                  name="Reddit"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </MotionCard>
  );
};

export default MentionsChart;
