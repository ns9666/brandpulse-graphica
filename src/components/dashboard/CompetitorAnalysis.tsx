
import React, { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, Users, MessageSquare, Plus } from 'lucide-react';
import MotionCard from '@/components/ui/MotionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApiData } from '@/hooks/useApiData';
import { competitorApi } from '@/services/djangoApi';
import { useDashboardContext } from '@/pages/Index';

// Updated interface to include id property
interface CompetitorDataWithId {
  id: number;
  name: string;
  mentions: number;
  sentiment: number;
  engagement: number;
  trend: 'up' | 'down';
  change: string;
  isUser?: boolean;
}

// Default fallback data with id
const defaultCompetitorData: CompetitorDataWithId[] = [
  {
    id: 1,
    name: 'Competitor A',
    mentions: 2450,
    sentiment: 72,
    engagement: 4.8,
    trend: 'up' as const,
    change: '+12.5%'
  },
  {
    id: 2,
    name: 'Competitor B',
    mentions: 1890,
    sentiment: 68,
    engagement: 3.9,
    trend: 'down' as const,
    change: '-3.2%'
  },
  {
    id: 3,
    name: 'Your Brand',
    mentions: 3842,
    sentiment: 76,
    engagement: 5.7,
    trend: 'up' as const,
    change: '+18.3%',
    isUser: true
  }
];

const CompetitorAnalysis = () => {
  const { selectedDashboard, dashboardFilters } = useDashboardContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompetitorName, setNewCompetitorName] = useState('');
  const [newCompetitorWebsite, setNewCompetitorWebsite] = useState('');
  const [isAddingCompetitor, setIsAddingCompetitor] = useState(false);

  // Fetch competitor data from Django API
  const { data: apiData, loading, error, refetch } = useApiData<CompetitorDataWithId[]>(() => 
    competitorApi.getCompetitors(selectedDashboard?.id)
  );

  // Fetch performance radar data
  const { data: performanceData, loading: performanceLoading } = useApiData(() => 
    competitorApi.getPerformanceRadar(selectedDashboard?.id)
  );

  // Fetch mentions comparison data
  const { data: mentionsData, loading: mentionsLoading } = useApiData(() => 
    competitorApi.getMentionsComparison(selectedDashboard?.id)
  );

  // Use API data or fallback to default data
  const competitorData = apiData || defaultCompetitorData;

  if (error) {
    console.warn('Failed to load competitor analysis data, using fallback data:', error);
  }

  // Log the additional API data for debugging
  useEffect(() => {
    if (performanceData) {
      console.log('Performance Radar Data:', performanceData);
    }
    if (mentionsData) {
      console.log('Mentions Comparison Data:', mentionsData);
    }
  }, [performanceData, mentionsData]);

  const handleAddCompetitor = async () => {
    if (!newCompetitorName.trim()) return;

    try {
      setIsAddingCompetitor(true);
      console.log('Adding competitor:', { 
        name: newCompetitorName, 
        website: newCompetitorWebsite,
        dashboardId: selectedDashboard?.id 
      });

      await competitorApi.addCompetitor({
        name: newCompetitorName,
        website: newCompetitorWebsite || undefined,
        dashboardId: selectedDashboard?.id
      });

      // Reset form and close modal
      setNewCompetitorName('');
      setNewCompetitorWebsite('');
      setShowAddModal(false);
      
      // Refresh competitor data
      refetch();
    } catch (error) {
      console.error('Failed to add competitor:', error);
    } finally {
      setIsAddingCompetitor(false);
    }
  };

  return (
    <>
      <MotionCard className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-medium">Competitor Analysis</h3>
            <p className="text-muted-foreground text-sm">Compare your brand performance with competitors</p>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)}
            size="sm"
            className="bg-brand-blue hover:bg-brand-blue/90"
          >
            <Plus size={16} className="mr-1" />
            Add Competitor
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-800/30">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {competitorData.map((competitor) => (
              <div
                key={competitor.id}
                className={`p-4 rounded-lg border ${
                  competitor.isUser 
                    ? 'bg-brand-blue/5 border-brand-blue/20 ring-1 ring-brand-blue/30' 
                    : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <h4 className={`font-medium truncate ${competitor.isUser ? 'text-brand-blue' : ''}`}>
                      {competitor.name}
                    </h4>
                    {competitor.isUser && (
                      <span className="inline-block px-2 py-0.5 bg-brand-blue text-white text-xs rounded-full mt-1">
                        Your Brand
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm ml-2">
                    {competitor.trend === 'up' ? (
                      <TrendingUp size={16} className="text-emerald-600 flex-shrink-0" />
                    ) : (
                      <TrendingDown size={16} className="text-rose-600 flex-shrink-0" />
                    )}
                    <span className={`font-medium ${competitor.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {competitor.change}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <MessageSquare size={12} className="text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Mentions</p>
                    <p className="font-semibold text-sm">{competitor.mentions.toLocaleString()}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users size={12} className="text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Sentiment</p>
                    <p className="font-semibold text-sm">{competitor.sentiment}/100</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp size={12} className="text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                    <p className="font-semibold text-sm">{competitor.engagement}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Performance Radar and Mentions Comparison Debug Info */}
        {(performanceLoading || mentionsLoading) && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Loading additional competitor data (Performance Radar, Mentions Comparison)...
            </p>
          </div>
        )}
      </MotionCard>

      {/* Add Competitor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <MotionCard className="w-full max-w-md p-6">
            <h3 className="text-lg font-medium mb-4">Add New Competitor</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Competitor Name *</label>
                <Input
                  value={newCompetitorName}
                  onChange={(e) => setNewCompetitorName(e.target.value)}
                  placeholder="Enter competitor name..."
                  disabled={isAddingCompetitor}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Website URL (Optional)</label>
                <Input
                  value={newCompetitorWebsite}
                  onChange={(e) => setNewCompetitorWebsite(e.target.value)}
                  placeholder="https://competitor.com"
                  disabled={isAddingCompetitor}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowAddModal(false)} 
                className="flex-1"
                disabled={isAddingCompetitor}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddCompetitor}
                className="flex-1 bg-brand-blue hover:bg-brand-blue/90"
                disabled={isAddingCompetitor || !newCompetitorName.trim()}
              >
                {isAddingCompetitor ? 'Adding...' : 'Add Competitor'}
              </Button>
            </div>
          </MotionCard>
        </div>
      )}
    </>
  );
};

export default CompetitorAnalysis;
