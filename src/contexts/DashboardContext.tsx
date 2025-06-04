
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface DashboardContextType {
  selectedDashboardId: number | null;
  selectedDashboardName: string | null;
  setSelectedDashboard: (id: number, name: string) => void;
  clearSelectedDashboard: () => void;
}

const DashboardContext = createContext<DashboardContextType>({
  selectedDashboardId: null,
  selectedDashboardName: null,
  setSelectedDashboard: () => {},
  clearSelectedDashboard: () => {},
});

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedDashboardId, setSelectedDashboardId] = useState<number | null>(null);
  const [selectedDashboardName, setSelectedDashboardName] = useState<string | null>(null);
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Update selected dashboard when URL changes
    if (dashboardId) {
      const id = parseInt(dashboardId);
      setSelectedDashboardId(id);
      console.log('Dashboard context updated from URL:', id);
    } else {
      setSelectedDashboardId(null);
      setSelectedDashboardName(null);
    }
  }, [dashboardId]);

  const setSelectedDashboard = (id: number, name: string) => {
    console.log('Setting selected dashboard:', id, name);
    setSelectedDashboardId(id);
    setSelectedDashboardName(name);
    navigate(`/dashboard/${id}`);
  };

  const clearSelectedDashboard = () => {
    setSelectedDashboardId(null);
    setSelectedDashboardName(null);
    navigate('/dashboards');
  };

  return (
    <DashboardContext.Provider value={{
      selectedDashboardId,
      selectedDashboardName,
      setSelectedDashboard,
      clearSelectedDashboard,
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
