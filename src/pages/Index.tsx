
import React, { useEffect, useState, createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricsOverview from '@/components/dashboard/MetricsOverview';
import MentionsChart from '@/components/dashboard/MentionsChart';
import SentimentAnalysis from '@/components/dashboard/SentimentAnalysis';
import CompetitorAnalysis from '@/components/dashboard/CompetitorAnalysis';
import PredictiveInsights from '@/components/dashboard/PredictiveInsights';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import SourceDistribution from '@/components/dashboard/SourceDistribution';
import TopKeywords from '@/components/dashboard/TopKeywords';
import { DashboardFiltersData } from '@/components/dashboard/DashboardFilters';
import { dashboardsApi, Dashboard } from '@/services/djangoApi';
import { useDashboard } from '@/contexts/DashboardContext';

// Dashboard Context for sharing dashboard state across components
interface DashboardContextType {
  selectedDashboard: Dashboard | null;
  dashboardFilters: DashboardFiltersData;
  isLoadingDashboard: boolean;
}

const DashboardContext = createContext<DashboardContextType>({
  selectedDashboard: null,
  dashboardFilters: {
    dateRange: '30d',
    platforms: [],
    sentiments: [],
    keywords: [],
    minEngagement: 0,
    maxEngagement: 10000,
  },
  isLoadingDashboard: false,
});

export const useDashboardContext = () => useContext(DashboardContext);

const Index = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const { selectedDashboardId, selectedDashboardName } = useDashboard();
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [dashboardFilters, setDashboardFilters] = useState<DashboardFiltersData>({
    dateRange: '30d',
    platforms: [],
    sentiments: [],
    keywords: [],
    minEngagement: 0,
    maxEngagement: 10000,
  });

  // Load specific dashboard when dashboard ID changes
  useEffect(() => {
    if (dashboardId) {
      loadSpecificDashboard(parseInt(dashboardId));
    }
  }, [dashboardId]);

  const loadSpecificDashboard = async (id: number) => {
    try {
      setIsLoadingDashboard(true);
      console.log(`Loading specific dashboard ${id} for main view`);
      
      const dashboard = await dashboardsApi.getDashboard(id);
      console.log('Loaded dashboard for main view:', dashboard);
      
      setSelectedDashboard(dashboard);
      
      // Update filters based on dashboard settings
      setDashboardFilters(prev => ({
        ...prev,
        platforms: dashboard.platforms?.length > 0 ? dashboard.platforms : [],
        keywords: dashboard.keywords || [],
      }));
      
    } catch (error) {
      console.error('Failed to load specific dashboard:', error);
      setSelectedDashboard(null);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  const handleFiltersChange = (newFilters: DashboardFiltersData) => {
    console.log('Dashboard filters changed:', newFilters);
    setDashboardFilters(newFilters);
    
    // Trigger refresh of all dashboard components by updating a timestamp
    // This will cause all components using useApiData to refetch
    window.dispatchEvent(new CustomEvent('dashboardFiltersChanged', { 
      detail: { 
        filters: newFilters, 
        dashboardId: selectedDashboard?.id 
      } 
    }));
  };

  const contextValue: DashboardContextType = {
    selectedDashboard,
    dashboardFilters,
    isLoadingDashboard,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <DashboardNavbar />
        
        <main className="container pt-32 pb-16">
          <DashboardHeader 
            title={selectedDashboard ? selectedDashboard.name : "Dashboard Overview"} 
            description={selectedDashboard ? selectedDashboard.description : "Monitor your brand across all platforms"}
            onFiltersChange={handleFiltersChange}
            currentFilters={dashboardFilters}
          />

          {isLoadingDashboard && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Loading dashboard data...
                </p>
              </div>
            </div>
          )}

          {selectedDashboard && !isLoadingDashboard && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Viewing dashboard: <strong>{selectedDashboard.name}</strong>
                {selectedDashboard.keywords.length > 0 && (
                  <span className="ml-2">
                    • Tracking: {selectedDashboard.keywords.join(', ')}
                  </span>
                )}
                {selectedDashboard.platforms.length > 0 && (
                  <span className="ml-2">
                    • Platforms: {selectedDashboard.platforms.join(', ')}
                  </span>
                )}
              </p>
            </div>
          )}

          <div className="space-y-6">
            {/* Metrics Overview */}
            <MetricsOverview />
            
            {/* First Row - Main Charts */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <MentionsChart />
              </div>
              <SentimentAnalysis />
            </div>
            
            {/* Second Row - Analytics and Distribution */}
            <div className="grid gap-6 lg:grid-cols-3">
              <AnalyticsChart />
              <SourceDistribution />
              <TopKeywords />
            </div>
            
            {/* Third Row - Competitor Analysis */}
            <CompetitorAnalysis />
            
            {/* Fourth Row - Predictive Insights */}
            <PredictiveInsights />
          </div>
        </main>
      </div>
    </DashboardContext.Provider>
  );
};

export default Index;
