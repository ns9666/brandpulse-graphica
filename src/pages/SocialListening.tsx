
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SocialListeningWidgets from '@/components/dashboard/SocialListeningWidgets';
import { useDashboard } from '@/contexts/DashboardContext';

const SocialListening = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const { currentDashboard } = useDashboard();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <DashboardNavbar />
      
      <main className="container pt-32 pb-16">
        <DashboardHeader 
          title="Social Listening" 
          description={`Monitor social conversations and trends for ${currentDashboard?.name || 'your dashboard'}`}
        />

        <div className="space-y-6">
          <SocialListeningWidgets />
        </div>
      </main>
    </div>
  );
};

export default SocialListening;
