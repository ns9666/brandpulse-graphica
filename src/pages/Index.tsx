
import React from 'react';
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
import { useDashboard } from '@/contexts/DashboardContext';

const Index = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const { currentDashboard, isLoading, error } = useDashboard();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <DashboardNavbar />
      
      <main className="container pt-32 pb-16">
        <DashboardHeader 
          title={currentDashboard ? currentDashboard.name : "Dashboard Overview"} 
          description={currentDashboard ? currentDashboard.description : "Monitor your brand across all platforms"}
        />

        {isLoading && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Loading dashboard data...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200">
              Error loading dashboard: {error}
            </p>
          </div>
        )}

        {currentDashboard && !isLoading && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Viewing dashboard: <strong>{currentDashboard.name}</strong>
              {currentDashboard.keywords.length > 0 && (
                <span className="ml-2">
                  • Tracking: {currentDashboard.keywords.join(', ')}
                </span>
              )}
              {currentDashboard.platforms.length > 0 && (
                <span className="ml-2">
                  • Platforms: {currentDashboard.platforms.join(', ')}
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
  );
};

export default Index;
