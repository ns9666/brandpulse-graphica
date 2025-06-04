
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart3, MessageSquare, TrendingUp, Users, Search, ArrowLeft, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/contexts/DashboardContext';

const DashboardNavbar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const { selectedDashboardId, selectedDashboardName, clearSelectedDashboard } = useDashboard();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const dashboardTabs = [
    { path: `/dashboard/${selectedDashboardId}`, label: 'Overview', icon: BarChart3 },
    { path: `/dashboard/${selectedDashboardId}/mentions`, label: 'Mentions', icon: MessageSquare },
    { path: `/dashboard/${selectedDashboardId}/analytics`, label: 'Analytics', icon: TrendingUp },
    { path: `/dashboard/${selectedDashboardId}/competitor-analysis`, label: 'Competitors', icon: Users },
    { path: `/dashboard/${selectedDashboardId}/social-listening`, label: 'Social Listening', icon: Search },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
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
            
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelectedDashboard}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              <span className="hidden md:inline">Back to Dashboards</span>
            </Button>
          </div>

          {/* Dashboard Name */}
          {selectedDashboardName && (
            <div className="flex-1 text-center">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                📌 {selectedDashboardName}
              </h2>
            </div>
          )}

          {/* Dashboard Navigation Tabs */}
          <div className="hidden lg:flex items-center gap-1">
            {dashboardTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Link key={tab.path} to={tab.path}>
                  <Button
                    variant={isActive(tab.path) ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center gap-2 ${
                      isActive(tab.path) 
                        ? "bg-brand-blue hover:bg-brand-blue/90 text-white" 
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Bell size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
