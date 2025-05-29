
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricsOverview from '@/components/dashboard/MetricsOverview';
import SentimentAnalysis from '@/components/dashboard/SentimentAnalysis';
import PredictiveInsights from '@/components/dashboard/PredictiveInsights';
import MentionsChart from '@/components/dashboard/MentionsChart';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import CompetitorAnalysis from '@/components/dashboard/CompetitorAnalysis';
import Navbar from '@/components/layout/Navbar';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      <main className="container pt-28 pb-16">
        <DashboardHeader 
          title="Dashboard" 
          description="Monitor your social media presence and analytics"
          action={
            <Button onClick={() => navigate('/create-dashboard')}>
              <Plus className="mr-2 h-4 w-4" /> Create Dashboard
            </Button>
          }
        />
        
        <div className="grid gap-6 lg:grid-cols-3 mt-6">
          <MetricsOverview />
          <SentimentAnalysis />
          <PredictiveInsights />
        </div>
        
        <div className="mt-6">
          <MentionsChart />
        </div>

        <div className="mt-6">
          <AnalyticsChart />
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mt-6">
          <div className="lg:col-span-2">
            <CompetitorAnalysis />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
