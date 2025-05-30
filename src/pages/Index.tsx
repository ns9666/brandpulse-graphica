
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricsOverview from '@/components/dashboard/MetricsOverview';
import MentionsChart from '@/components/dashboard/MentionsChart';
import SentimentAnalysis from '@/components/dashboard/SentimentAnalysis';
import CompetitorAnalysis from '@/components/dashboard/CompetitorAnalysis';
import PredictiveInsights from '@/components/dashboard/PredictiveInsights';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { dashboardsApi, Dashboard } from '@/services/djangoApi';

const Index = () => {
  const [searchParams] = useSearchParams();
  const dashboardId = searchParams.get('dashboard');
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);

  /**
   * Load specific dashboard data when dashboard ID is provided in URL
   * Expected API response from GET /api/dashboards/{id}/:
   * {
   *   id: number,
   *   name: string,
   *   description: string,
   *   keywords: string[],
   *   hashtags: string[],
   *   urls: string[],
   *   platforms: string[],
   *   refreshInterval: number,
   *   sentimentAnalysis: boolean,
   *   alertThreshold: number,
   *   imageUrl?: string,
   *   createdAt: string,
   *   lastUpdated: string,
   *   stats: { totalMentions: number, avgSentiment: number, totalReach: number, activePlatforms: number },
   *   thumbnail: string
   * }
   */
  useEffect(() => {
    if (dashboardId) {
      loadSpecificDashboard(parseInt(dashboardId));
    } else {
      // Clear selected dashboard if no ID in URL
      setSelectedDashboard(null);
    }
  }, [dashboardId]);

  const loadSpecificDashboard = async (id: number) => {
    try {
      setIsLoadingDashboard(true);
      console.log(`Loading specific dashboard ${id} for main view`);
      
      // Call GET /api/dashboards/{id}/
      const dashboard = await dashboardsApi.getDashboard(id);
      console.log('Loaded dashboard for main view:', dashboard);
      
      setSelectedDashboard(dashboard);
      
      // This dashboard data can now be used to filter/customize the dashboard view
      // For example, the charts could use the dashboard's keywords, platforms, etc.
      
    } catch (error) {
      console.error('Failed to load specific dashboard:', error);
      setSelectedDashboard(null);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      <main className="container pt-28 pb-16">
        <DashboardHeader 
          title={selectedDashboard ? selectedDashboard.name : "Social Media Dashboard"} 
          description={selectedDashboard ? selectedDashboard.description : "Monitor your brand across all platforms"}
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
          {/* 
            All dashboard components will receive data from Django API
            They can optionally use the selectedDashboard data to filter results
            based on the specific dashboard's keywords, platforms, etc.
          */}
          
          {/* Metrics Overview - Uses Django API */}
          <MetricsOverview dashboardFilter={selectedDashboard} />
          
          {/* First Row - Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <MentionsChart dashboardFilter={selectedDashboard} />
            <SentimentAnalysis dashboardFilter={selectedDashboard} />
          </div>
          
          {/* Second Row - Analytics and Competitor */}
          <div className="grid gap-6 lg:grid-cols-2">
            <AnalyticsChart dashboardFilter={selectedDashboard} />
            <CompetitorAnalysis dashboardFilter={selectedDashboard} />
          </div>
          
          {/* Third Row - Predictive Insights */}
          <PredictiveInsights dashboardFilter={selectedDashboard} />
        </div>
      </main>
    </div>
  );
};

export default Index;
