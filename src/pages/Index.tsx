
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricsOverview from '@/components/dashboard/MetricsOverview';
import MentionsChart from '@/components/dashboard/MentionsChart';
import SentimentAnalysis from '@/components/dashboard/SentimentAnalysis';
import CompetitorAnalysis from '@/components/dashboard/CompetitorAnalysis';
import PredictiveInsights from '@/components/dashboard/PredictiveInsights';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      <main className="container pt-28 pb-16">
        <DashboardHeader 
          title="Brand Monitoring Dashboard" 
          description="Real-time insights into your brand's online presence and social media performance."
        />
        
        <div className="space-y-6">
          {/* Metrics Overview */}
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
