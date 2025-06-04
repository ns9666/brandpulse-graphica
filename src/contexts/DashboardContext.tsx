
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dashboardsApi, Dashboard } from '@/services/djangoApi';

interface DashboardContextType {
  currentDashboard: Dashboard | null;
  isLoading: boolean;
  error: string | null;
  switchToDashboard: (dashboardId: number) => void;
  refreshDashboard: () => void;
}

const DashboardContext = createContext<DashboardContextType>({
  currentDashboard: null,
  isLoading: false,
  error: null,
  switchToDashboard: () => {},
  refreshDashboard: () => {},
});

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const navigate = useNavigate();
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data when dashboardId changes
  const loadDashboard = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log(`Loading dashboard ${id}`);
      
      const dashboard = await dashboardsApi.getDashboard(id);
      setCurrentDashboard(dashboard);
      console.log('Dashboard loaded:', dashboard);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      setCurrentDashboard(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Load dashboard when dashboardId from URL changes
  useEffect(() => {
    if (dashboardId) {
      const id = parseInt(dashboardId);
      if (!isNaN(id)) {
        loadDashboard(id);
      } else {
        setError('Invalid dashboard ID');
      }
    } else {
      setCurrentDashboard(null);
    }
  }, [dashboardId]);

  const switchToDashboard = (newDashboardId: number) => {
    console.log(`Switching to dashboard ${newDashboardId}`);
    // Get current route path (everything after /dashboard/:id)
    const currentLocation = window.location.pathname;
    const currentSubPath = currentLocation.split('/').slice(3).join('/'); // Get path after /dashboard/:id
    
    // Navigate to the same sub-path in the new dashboard
    const newPath = currentSubPath ? `/dashboard/${newDashboardId}/${currentSubPath}` : `/dashboard/${newDashboardId}`;
    navigate(newPath);
  };

  const refreshDashboard = () => {
    if (dashboardId) {
      const id = parseInt(dashboardId);
      if (!isNaN(id)) {
        loadDashboard(id);
      }
    }
  };

  return (
    <DashboardContext.Provider value={{
      currentDashboard,
      isLoading,
      error,
      switchToDashboard,
      refreshDashboard,
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
