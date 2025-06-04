
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface DashboardContextType {
  selectedDashboardId: number | null;
  setSelectedDashboardId: (id: number | null) => void;
}

const DashboardContext = createContext<DashboardContextType>({
  selectedDashboardId: null,
  setSelectedDashboardId: () => {},
});

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedDashboardId, setSelectedDashboardId] = useState<number | null>(null);
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Update selected dashboard when URL changes
    if (dashboardId) {
      setSelectedDashboardId(parseInt(dashboardId));
    } else {
      setSelectedDashboardId(null);
    }
  }, [dashboardId]);

  const handleSetSelectedDashboardId = (id: number | null) => {
    setSelectedDashboardId(id);
    if (id) {
      navigate(`/dashboard/${id}`);
    } else {
      navigate('/dashboards');
    }
  };

  return (
    <DashboardContext.Provider value={{
      selectedDashboardId,
      setSelectedDashboardId: handleSetSelectedDashboardId,
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
