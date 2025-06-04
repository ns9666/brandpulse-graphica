
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricsOverview from '@/components/dashboard/MetricsOverview';
import MentionsChart from '@/components/dashboard/MentionsChart';
import SentimentAnalysis from '@/components/dashboard/SentimentAnalysis';
import PredictiveInsights from '@/components/dashboard/PredictiveInsights';
import SourceDistribution from '@/components/dashboard/SourceDistribution';
import TopKeywords from '@/components/dashboard/TopKeywords';
import { useDashboard } from '@/contexts/DashboardContext';
import { DashboardFiltersData } from '@/components/dashboard/DashboardFilters';

const Index = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const { currentDashboard, isLoading, error } = useDashboard();

  // State for filters
  const [filters, setFilters] = useState<DashboardFiltersData>({
    dateRange: '30d',
    platforms: [],
    sentiments: [],
    keywords: [],
    minEngagement: 0,
    maxEngagement: 10000,
  });

  const handleFiltersChange = (newFilters: DashboardFiltersData) => {
    console.log('Filters changed on overview page:', newFilters);
    setFilters(newFilters);
    
    // Dispatch custom event to notify all dashboard components about filter changes
    window.dispatchEvent(new CustomEvent('dashboardFiltersChanged', { 
      detail: { 
        filters: newFilters, 
        dashboardId: currentDashboard?.id || parseInt(dashboardId || '1')
      } 
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <DashboardNavbar />
      
      <main className="container pt-32 pb-16">
        <DashboardHeader 
          title={currentDashboard ? currentDashboard.name : "Dashboard Overview"} 
          description={currentDashboard ? currentDashboard.description : "Monitor your brand across all platforms"}
          onFiltersChange={handleFiltersChange}
          currentFilters={filters}
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
          <MetricsOverview filters={filters} />
          
          {/* First Row - Main Charts */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <MentionsChart filters={filters} />
            </div>
            <SentimentAnalysis filters={filters} />
          </div>
          
          {/* Second Row - Distribution and Keywords */}
          <div className="grid gap-6 lg:grid-cols-3">
            <SourceDistribution filters={filters} />
            <TopKeywords filters={filters} />
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold mb-4">Audience Reach Trend</h3>
              <div className="h-32 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <p className="text-2xl font-bold text-brand-blue">1.2M</p>
                  <p className="text-sm">Total Reach</p>
                  <p className="text-xs text-green-600 mt-1">↗ +8.5% vs last period</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Third Row - Predictive Insights */}
          <PredictiveInsights filters={filters} />
        </div>
      </main>
    </div>
  );
};

export default Index;
