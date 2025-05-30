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
import { dashboardsApi } from '@/services/djangoApi';

const Index = () => {
  const [searchParams] = useSearchParams();
  const dashboardId = searchParams.get('dashboard');
  const [selectedDashboard, setSelectedDashboard] = useState<any>(null);

  // Load specific dashboard if ID is provided
  useEffect(() => {
    if (dashboardId) {
      loadSpecificDashboard(parseInt(dashboardId));
    }
  }, [dashboardId]);

  const loadSpecificDashboard = async (id: number) => {
    try {
      console.log(`Loading specific dashboard ${id}`);
      const dashboard = await dashboardsApi.getDashboard(id);
      setSelectedDashboard(dashboard);
      // You could use this data to filter/customize the dashboard view
    } catch (error) {
      console.error('Failed to load specific dashboard:', error);
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

        {selectedDashboard && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Viewing dashboard: <strong>{selectedDashboard.name}</strong>
              {selectedDashboard.keywords.length > 0 && (
                <span className="ml-2">
                  • Tracking: {selectedDashboard.keywords.join(', ')}
                </span>
              )}
            </p>
          </div>
        )}

        <div className="space-y-6">
          {/* Metrics Overview - Now uses Django API */}
          <MetricsOverview />
          
          {/* First Row - Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <MentionsChart />
            <SentimentAnalysis />
          </div>
          
          {/* Second Row - Analytics and Competitor */}
          <div className="grid gap-6 lg:grid-cols-2">
            <AnalyticsChart />
            <CompetitorAnalysis />
          </div>
          
          {/* Third Row - Predictive Insights */}
          <PredictiveInsights />
        </div>
      </main>
    </div>
  );
};

export default Index;
