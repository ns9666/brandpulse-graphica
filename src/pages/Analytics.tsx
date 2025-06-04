
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricsOverview from '@/components/dashboard/MetricsOverview';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import SentimentAnalysis from '@/components/dashboard/SentimentAnalysis';
import SourceDistribution from '@/components/dashboard/SourceDistribution';
import TopKeywords from '@/components/dashboard/TopKeywords';
import { useDashboard } from '@/contexts/DashboardContext';

const Analytics = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const { selectedDashboardName } = useDashboard();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <DashboardNavbar />
      
      <main className="container pt-32 pb-16">
        <DashboardHeader 
          title="Analytics Dashboard" 
          description={`Deep dive analytics for ${selectedDashboardName || 'your dashboard'}`}
        />

        <div className="space-y-6">
          {/* Metrics Overview */}
          <MetricsOverview />
          
          {/* Analytics Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <AnalyticsChart />
            <SentimentAnalysis />
          </div>
          
          {/* Source Distribution and Keywords */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SourceDistribution />
            <TopKeywords />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
