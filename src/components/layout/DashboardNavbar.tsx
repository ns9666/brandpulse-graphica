
import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, MessageSquare, Search, ArrowLeft, Bell, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { useApiData } from '@/hooks/useApiData';
import { dashboardsApi, Dashboard } from '@/services/djangoApi';

const DashboardNavbar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const { currentDashboard, switchToDashboard } = useDashboard();

  // Fetch all dashboards for the switcher dropdown
  const { data: dashboards } = useApiData<Dashboard[]>(
    () => dashboardsApi.getDashboards(),
    []
  );

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const dashboardTabs = [
    { path: `/dashboard/${dashboardId}`, label: 'Overview', icon: BarChart3 },
    { path: `/dashboard/${dashboardId}/mentions`, label: 'Mentions', icon: MessageSquare },
    { path: `/dashboard/${dashboardId}/social-listening`, label: 'Social Listening', icon: Search },
    { path: `/dashboard/${dashboardId}/settings`, label: 'Settings', icon: Settings },
  ];

  const handleDashboardSwitch = (newDashboardId: string) => {
    const id = parseInt(newDashboardId);
    if (!isNaN(id)) {
      switchToDashboard(id);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Back Button */}
          <div className="flex items-center gap-4">
            <Link to="/dashboards" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BrandMonitor
              </span>
            </Link>
            
            <Link to="/dashboards">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={16} />
                <span className="hidden md:inline">Back to Dashboards</span>
              </Button>
            </Link>
          </div>

          {/* Dashboard Switcher and Name */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden md:inline">Dashboard:</span>
              <Select value={dashboardId} onValueChange={handleDashboardSwitch}>
                <SelectTrigger className="w-[280px] border-none bg-transparent hover:bg-muted/50 focus:ring-1 focus:ring-brand-blue">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📌</span>
                    <SelectValue placeholder="Select dashboard">
                      {currentDashboard?.name || 'Loading...'}
                    </SelectValue>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {dashboards?.map((dashboard) => (
                    <SelectItem key={dashboard.id} value={dashboard.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">📊</span>
                        <span>{dashboard.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <Link to={`/dashboard/${dashboardId}/notifications`}>
              <Button variant="ghost" size="sm">
                <Bell size={16} />
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-1 py-2 overflow-x-auto">
            {dashboardTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Link key={tab.path} to={tab.path}>
                  <Button
                    variant={isActive(tab.path) ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center gap-2 whitespace-nowrap ${
                      isActive(tab.path) 
                        ? "bg-brand-blue hover:bg-brand-blue/90 text-white" 
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
