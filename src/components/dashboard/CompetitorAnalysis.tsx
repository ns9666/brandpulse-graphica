
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MotionCard from '@/components/ui/MotionCard';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown, Users, MessageSquare, Eye, Award, Target, Calendar, Filter } from 'lucide-react';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { useApiData } from '@/hooks/useApiData';
import { competitorApi } from '@/services/djangoApi';
import { useDashboardContext } from '@/pages/Index';
import { toast } from 'sonner';

interface CompetitorData {
  id: number;
  name: string;
  logo: string;
  mentions: number;
  sentiment: number;
  engagement: number;
  reach: number;
  trend: string;
  change: string;
  marketShare: number;
  growthRate: number;
  isUser?: boolean;
}

const competitorData: CompetitorData[] = [
  {
    id: 1,
    name: 'Competitor A',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop',
    mentions: 2450,
    sentiment: 72,
    engagement: 4.8,
    reach: 890000,
    trend: 'up',
    change: '+12.5%',
    marketShare: 18,
    growthRate: 8.5
  },
  {
    id: 2,
    name: 'Competitor B',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=40&h=40&fit=crop',
    mentions: 1890,
    sentiment: 68,
    engagement: 3.9,
    reach: 650000,
    trend: 'down',
    change: '-3.2%',
    marketShare: 14,
    growthRate: -2.1
  },
  {
    id: 3,
    name: 'Your Brand',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=40&h=40&fit=crop',
    mentions: 3842,
    sentiment: 76,
    engagement: 5.7,
    reach: 1250000,
    trend: 'up',
    change: '+18.3%',
    marketShare: 24,
    growthRate: 15.2,
    isUser: true
  },
  {
    id: 4,
    name: 'Competitor C',
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
    mentions: 2100,
    sentiment: 70,
    engagement: 4.2,
    reach: 720000,
    trend: 'up',
    change: '+6.8%',
    marketShare: 16,
    growthRate: 5.3
  },
  {
    id: 5,
    name: 'Competitor D',
    logo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop',
    mentions: 1650,
    sentiment: 65,
    engagement: 3.5,
    reach: 580000,
    trend: 'up',
    change: '+4.2%',
    marketShare: 12,
    growthRate: 3.8
  }
];

const radarData = [
  {
    metric: 'Mentions',
    'Your Brand': 95,
    'Competitor A': 65,
    'Competitor B': 45,
    'Competitor C': 55
  },
  {
    metric: 'Sentiment',
    'Your Brand': 76,
    'Competitor A': 72,
    'Competitor B': 68,
    'Competitor C': 70
  },
  {
    metric: 'Engagement',
    'Your Brand': 85,
    'Competitor A': 70,
    'Competitor B': 60,
    'Competitor C': 65
  },
  {
    metric: 'Reach',
    'Your Brand': 90,
    'Competitor A': 75,
    'Competitor B': 55,
    'Competitor C': 60
  },
  {
    metric: 'Growth',
    'Your Brand': 88,
    'Competitor A': 68,
    'Competitor B': 30,
    'Competitor C': 58
  }
];

const CompetitorAnalysis = () => {
  const { selectedDashboard, dashboardFilters } = useDashboardContext();
  const [selectedCompetitors, setSelectedCompetitors] = useState([3]); // Start with user's brand selected
  const [timeRange, setTimeRange] = useState('30days');
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch competitors data from API
  const { data: apiCompetitors, loading: loadingCompetitors, error: competitorError } = useApiData(() => 
    competitorApi.getCompetitors(selectedDashboard?.id || 1)
  );

  // Fetch performance radar data
  const { data: radarApiData, loading: loadingRadar, error: radarError } = useApiData(() => 
    competitorApi.getPerformanceRadar(selectedDashboard?.id || 1)
  );

  // Fetch mentions comparison data
  const { data: mentionsApiData, loading: loadingMentions, error: mentionsError } = useApiData(() => 
    competitorApi.getMentionsComparison(selectedDashboard?.id || 1)
  );

  // Transform API data to match our interface or use fallback data
  const competitorsData: CompetitorData[] = apiCompetitors ? 
    (Array.isArray(apiCompetitors) ? apiCompetitors.map((competitor: any) => ({
      id: competitor.id,
      name: competitor.name || 'Unknown',
      logo: competitor.logo || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop',
      mentions: competitor.mentions || 0,
      sentiment: competitor.sentiment || 0,
      engagement: competitor.engagement || 0,
      reach: competitor.reach || 0,
      trend: competitor.trend || 'up',
      change: competitor.change || '0%',
      marketShare: competitor.marketShare || 0,
      growthRate: competitor.growthRate || 0,
      isUser: competitor.isUser || false
    })) : []) : competitorData;

  if (competitorError) {
    console.warn('Failed to load competitors data:', competitorError);
  }

  const toggleCompetitor = (id: number) => {
    const competitor = competitorsData.find(c => c.id === id);
    if (competitor?.isUser) return; // Always keep user's brand selected
    
    setSelectedCompetitors(prev => 
      prev.includes(id) 
        ? prev.filter(compId => compId !== id)
        : [...prev, id]
    );
  };

  const getSelectedData = () => {
    return competitorsData.filter(c => selectedCompetitors.includes(c.id));
  };

  const handleAddCompetitor = async () => {
    setShowAddModal(true);
  };

  const handleSubmitCompetitor = async (name: string, website?: string) => {
    try {
      console.log('Adding competitor:', { name, website, dashboardId: selectedDashboard?.id });
      await competitorApi.addCompetitor({
        name,
        website,
        dashboardId: selectedDashboard?.id || 1
      });
      toast.success('Competitor added successfully');
      setShowAddModal(false);
      // Refresh the competitors list
      window.dispatchEvent(new CustomEvent('dashboardFiltersChanged', { 
        detail: { 
          filters: dashboardFilters, 
          dashboardId: selectedDashboard?.id 
        } 
      }));
    } catch (error) {
      console.error('Failed to add competitor:', error);
      toast.error('Failed to add competitor');
    }
  };

  const applyTimeFilter = (range: string) => {
    setTimeRange(range);
    console.log(`Applied time filter: ${range}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      <main className="container pt-28 pb-16">
        <DashboardHeader 
          title="Competitor Analysis" 
          description="Compare your brand performance with competitors across key metrics"
          action={
            <Button onClick={handleAddCompetitor} className="bg-brand-blue hover:bg-brand-blue/90">
              <Plus className="mr-2 h-4 w-4" /> Add Competitor
            </Button>
          }
        />

        {/* Time Range and Filters */}
        <div className="mb-6">
          <MotionCard className="p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Time Period:</span>
                <div className="flex gap-2">
                  {[
                    { value: '7days', label: '7D' },
                    { value: '30days', label: '30D' },
                    { value: '3months', label: '3M' },
                    { value: '6months', label: '6M' },
                    { value: '1year', label: '1Y' }
                  ].map((range) => (
                    <Button
                      key={range.value}
                      variant={timeRange === range.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => applyTimeFilter(range.value)}
                      className={timeRange === range.value ? "bg-brand-blue hover:bg-brand-blue/90" : ""}
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {selectedCompetitors.length} of {competitorsData.length} selected
                </span>
              </div>
            </div>
          </MotionCard>
        </div>

        {/* Competitor Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-6">
          {competitorsData.map((competitor) => (
            <MotionCard
              key={competitor.id}
              className={`p-4 cursor-pointer border-2 transition-all hover:shadow-lg ${
                selectedCompetitors.includes(competitor.id)
                  ? 'border-brand-blue bg-brand-blue/5 shadow-md'
                  : 'border-transparent hover:border-slate-300'
              } ${competitor.isUser ? 'ring-2 ring-brand-blue/30' : ''}`}
              onClick={() => toggleCompetitor(competitor.id)}
            >
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={competitor.logo} 
                  alt={competitor.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <h4 className={`font-medium truncate ${competitor.isUser ? 'text-brand-blue' : ''}`}>
                    {competitor.name}
                  </h4>
                  {competitor.isUser && (
                    <span className="text-xs text-brand-blue">Your Brand</span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Market Share</span>
                  <span className="font-semibold text-sm">{competitor.marketShare}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Growth</span>
                  <div className="flex items-center gap-1">
                    {competitor.trend === 'up' ? (
                      <TrendingUp size={12} className="text-emerald-600" />
                    ) : (
                      <TrendingDown size={12} className="text-rose-600" />
                    )}
                    <span className={`text-xs font-medium ${
                      competitor.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {competitor.change}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Mentions</span>
                  <span className="font-semibold text-sm">{competitor.mentions.toLocaleString()}</span>
                </div>
              </div>
            </MotionCard>
          ))}
        </div>

        {/* Comparison Charts */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {/* Radar Chart Comparison */}
          <MotionCard className="p-6">
            <h3 className="text-lg font-medium mb-4">Performance Radar</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="Your Brand"
                    dataKey="Your Brand"
                    stroke="#0A84FF"
                    fill="#0A84FF"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  {getSelectedData().filter(c => !c.isUser).slice(0, 3).map((competitor, index) => (
                    <Radar
                      key={competitor.name}
                      name={competitor.name}
                      dataKey={competitor.name}
                      stroke={index === 0 ? '#FF6B6B' : index === 1 ? '#4ECDC4' : '#45B7D1'}
                      fill="none"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  ))}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </MotionCard>

          {/* Mentions Comparison */}
          <MotionCard className="p-6">
            <h3 className="text-lg font-medium mb-4">Mentions Comparison</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getSelectedData()}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
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

        {/* Detailed Metrics */}
        <MotionCard className="p-6">
          <h3 className="text-lg font-medium mb-6">Detailed Metrics Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4">Brand</th>
                  <th className="text-center py-3 px-4">Mentions</th>
                  <th className="text-center py-3 px-4">Sentiment</th>
                  <th className="text-center py-3 px-4">Engagement</th>
                  <th className="text-center py-3 px-4">Reach</th>
                  <th className="text-center py-3 px-4">Growth</th>
                  <th className="text-center py-3 px-4">Market Share</th>
                </tr>
              </thead>
              <tbody>
                {getSelectedData()
                  .sort((a, b) => b.mentions - a.mentions)
                  .map((competitor, index) => (
                  <tr 
                    key={competitor.id} 
                    className={`border-b border-slate-100 dark:border-slate-800 ${
                      competitor.isUser ? 'bg-brand-blue/5' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={competitor.logo} 
                          alt={competitor.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <span className={`font-medium ${competitor.isUser ? 'text-brand-blue' : ''}`}>
                            {competitor.name}
                          </span>
                          {index === 0 && (
                            <Award className="inline-block ml-2 text-yellow-500" size={16} />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4 font-medium">
                      {competitor.mentions.toLocaleString()}
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        competitor.sentiment >= 75 ? 'bg-green-100 text-green-800' :
                        competitor.sentiment >= 65 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {competitor.sentiment}/100
                      </span>
                    </td>
                    <td className="text-center py-4 px-4 font-medium">
                      {competitor.engagement}%
                    </td>
                    <td className="text-center py-4 px-4 font-medium">
                      {(competitor.reach / 1000000).toFixed(1)}M
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="flex items-center justify-center gap-1">
                        {competitor.trend === 'up' ? (
                          <TrendingUp size={14} className="text-emerald-600" />
                        ) : (
                          <TrendingDown size={14} className="text-rose-600" />
                        )}
                        <span className={`font-medium ${
                          competitor.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {competitor.change}
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4 font-medium">
                      {competitor.marketShare}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MotionCard>

        {/* Add Competitor Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <MotionCard className="w-full max-w-md p-6">
              <h3 className="text-lg font-medium mb-4">Add New Competitor</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Competitor Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter competitor name..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Website URL</label>
                  <input 
                    type="url" 
                    placeholder="https://competitor.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    setShowAddModal(false);
                    console.log('Adding new competitor...');
                  }} 
                  className="flex-1 bg-brand-blue hover:bg-brand-blue/90"
                >
                  Add Competitor
                </Button>
              </div>
            </MotionCard>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompetitorAnalysis;
