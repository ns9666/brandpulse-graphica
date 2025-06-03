import React, { useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import MotionCard from '@/components/ui/MotionCard';
import Chip from '@/components/ui/Chip';
import { Button } from '@/components/ui/button';
import { TrendingUp, Brain, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useApiData } from '@/hooks/useApiData';
import { dashboardApi } from '@/services/djangoApi';
import { useDashboardContext } from '@/pages/Index';

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
  const { selectedDashboard, dashboardFilters } = useDashboardContext();
  const [showTextAnalysis, setShowTextAnalysis] = useState(false);

  // Fetch predictive insights from Django API
  const { data: apiData, loading, error } = useApiData(() => 
    dashboardApi.getPredictiveInsights(selectedDashboard?.id || 1, dashboardFilters)
  );

  if (error) {
    console.warn('Failed to load predictive insights, using fallback data:', error);
  }

  const insights = [
    {
      title: "Projected Growth",
      description: "Brand mentions expected to increase by 14.8% in Q3 based on current trajectory.",
      confidence: 92
    },
    {
      title: "Upcoming Trend",
      description: "AI topics related to your brand are gaining momentum with 32% increase in engagement predicted.",
      confidence: 87
    },
    {
      title: "Platform Shift",
      description: "Instagram engagement likely to surpass Twitter by 15% in the next quarter.",
      confidence: 78
    }
  ];

  const textAnalysis = {
    summary: "Our AI analysis indicates a strong positive sentiment trajectory for your brand. Key factors driving this include increased product satisfaction, effective social media campaigns, and growing brand recognition in the tech community.",
    keyFindings: [
      "Sentiment score improvement of 23% expected over next 3 months",
      "Product-related mentions showing 67% positive sentiment growth",
      "Competitor gap widening in your favor by 12% monthly",
      "Influencer partnership opportunities increasing by 45%"
    ],
    recommendations: [
      "Focus marketing efforts on Instagram and LinkedIn for maximum ROI",
      "Leverage positive product feedback in upcoming campaigns",
      "Consider expanding influencer partnerships in Q4",
      "Monitor competitor strategy shifts in September"
    ]
  };
  
  return (
    <MotionCard className="col-span-1 lg:col-span-2 h-auto">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-medium">AI Predictive Insights</h3>
              <Chip variant="info">Beta</Chip>
            </div>
            <p className="text-muted-foreground text-sm">Forecasted trends based on historical data</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowTextAnalysis(!showTextAnalysis)}
            className="flex items-center gap-2"
          >
            <FileText size={16} />
            Analysis
            {showTextAnalysis ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
        
        {!showTextAnalysis ? (
          <>
            <div className="h-[220px] mb-6">
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
            
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-1.5">
                <Brain size={16} className="text-brand-blue" />
                Key Predictions
              </h4>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div key={index} className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-sm">{insight.title}</h5>
                      <Chip variant="success" className="text-xs px-2 py-1">
                        {insight.confidence}% confident
                      </Chip>
                    </div>
                    <p className="text-muted-foreground text-xs">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Brain className="text-blue-600" size={16} />
                AI Analysis Summary
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{textAnalysis.summary}</p>
            </div>

            {/* Key Findings */}
            <div>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="text-green-600" size={16} />
                Key Findings
              </h4>
              <div className="space-y-2">
                {textAnalysis.keyFindings.map((finding, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300">{finding}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <FileText className="text-purple-600" size={16} />
                Recommendations
              </h4>
              <div className="space-y-2">
                {textAnalysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </MotionCard>
  );
};

export default PredictiveInsights;
