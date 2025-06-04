
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import CompetitorAnalysis from '@/components/dashboard/CompetitorAnalysis';
import { useDashboard } from '@/contexts/DashboardContext';

const CompetitorAnalysisPage = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const { selectedDashboardName } = useDashboard();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <DashboardNavbar />
      
      <main className="container pt-32 pb-16">
        <DashboardHeader 
          title="Competitor Analysis" 
          description={`Compare your brand performance against competitors for ${selectedDashboardName || 'your dashboard'}`}
        />

        <div className="space-y-6">
          <CompetitorAnalysis />
        </div>
      </main>
    </div>
  );
};

export default CompetitorAnalysisPage;
