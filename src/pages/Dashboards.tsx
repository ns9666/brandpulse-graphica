import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MotionCard from '@/components/ui/MotionCard';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, BarChart3, TrendingUp, Users, MessageSquare, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApiData } from '@/hooks/useApiData';
import { dashboardsApi, Dashboard } from '@/services/djangoApi';
import { toast } from 'sonner';
import { useDashboard } from '@/contexts/DashboardContext';

// Fallback data for when API is not available
const fallbackDashboards: Dashboard[] = [
  {
    id: 1,
    name: 'Main Brand Dashboard',
    description: 'Primary dashboard tracking overall brand performance across all platforms',
    createdAt: '2024-01-15',
    lastUpdated: '2 hours ago',
    stats: {
      totalMentions: 15423,
      avgSentiment: 76,
      totalReach: 2400000,
      activePlatforms: 6
    },
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
    keywords: ['brand', 'product'],
    hashtags: ['#brand', '#marketing'],
    urls: ['https://example.com'],
    platforms: ['twitter', 'instagram', 'facebook'],
    refreshInterval: 30,
    sentimentAnalysis: true,
    alertThreshold: 50
  },
  // ... keep existing fallback data (other dashboards)
];

const Dashboards = () => {
  const { setSelectedDashboard } = useDashboard();
  const navigate = useNavigate();
  const [selectedDashboards, setSelectedDashboards] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [deletingDashboard, setDeletingDashboard] = useState(false);

  // Fetch dashboards from API with fallback data
  const { data: dashboards, loading, error, refetch } = useApiData<Dashboard[]>(
    () => dashboardsApi.getDashboards(),
    []
  );

  // Use API data or fallback data
  const dashboardsData = dashboards || fallbackDashboards;

  if (error) {
    console.warn('Failed to load dashboards from API, using fallback data:', error);
  }

  const handleSelectDashboard = (id: number) => {
    setSelectedDashboards(prev => 
      prev.includes(id) 
        ? prev.filter(dashId => dashId !== id)
        : [...prev, id]
    );
  };

  /**
   * Delete dashboard with proper API call
   * Expected API response: void (204 No Content)
   * On success: Removes dashboard from list and shows success toast
   * On error: Shows error toast and keeps dashboard in list
   */
  const handleDeleteDashboard = async (id: number) => {
    if (deletingDashboard) return;
    
    try {
      setDeletingDashboard(true);
      console.log(`Attempting to delete dashboard ${id}`);
      
      // Call DELETE /api/dashboards/{id}/
      await dashboardsApi.deleteDashboard(id);
      
      toast.success('Dashboard deleted successfully');
      setShowDeleteModal(null);
      
      // Refresh the dashboard list to reflect deletion
      await refetch();
      
      // Remove from selected dashboards if it was selected
      setSelectedDashboards(prev => prev.filter(dashId => dashId !== id));
      
    } catch (error) {
      console.error('Failed to delete dashboard:', error);
      toast.error('Failed to delete dashboard. Please try again.');
    } finally {
      setDeletingDashboard(false);
    }
  };

  /**
   * Open specific dashboard with proper routing to dashboard view
   * Uses the dashboard context to set selected dashboard and navigate
   */
  const handleOpenDashboard = (dashboard: Dashboard) => {
    console.log(`Opening dashboard ${dashboard.id} (${dashboard.name}) - navigating to dashboard view`);
    setSelectedDashboard(dashboard.id, dashboard.name);
  };

  /**
   * Edit dashboard with proper parameter passing
   * Navigates to CreateDashboard page in edit mode
   * The CreateDashboard page will load existing dashboard data via API call
   */
  const handleEditDashboard = (id: number) => {
    console.log(`Editing dashboard ${id} - will trigger API call to load existing data`);
    // Navigate to create dashboard page with edit mode
    // The edit=id parameter will trigger an API call in CreateDashboard to load existing data
    navigate(`/create-dashboard?edit=${id}`);
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 75) return 'text-green-600';
    if (sentiment >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      <main className="container pt-28 pb-16">
        <DashboardHeader 
          title="My Dashboards" 
          description="Manage and view all your monitoring dashboards"
          action={
            <div className="flex gap-2">
              {selectedDashboards.length > 0 && (
                <Link to={`/competitor-analysis?compare=${selectedDashboards.join(',')}`}>
                  <Button variant="outline" className="mr-2">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Compare Selected ({selectedDashboards.length})
                  </Button>
                </Link>
              )}
              <Link to="/create-dashboard">
                <Button className="bg-brand-blue hover:bg-brand-blue/90">
                  <Plus className="mr-2 h-4 w-4" /> Create Dashboard
                </Button>
              </Link>
            </div>
          }
        />

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <MotionCard key={i} className="h-[400px] animate-pulse">
                <div className="h-48 bg-muted"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-8 bg-muted rounded"></div>
                    ))}
                  </div>
                </div>
              </MotionCard>
            ))}
          </div>
        ) : (
          <>
            {/* Dashboard Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {dashboardsData.map((dashboard) => (
                <MotionCard
                  key={dashboard.id}
                  className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                    selectedDashboards.includes(dashboard.id)
                      ? 'ring-2 ring-brand-blue shadow-md'
                      : ''
                  }`}
                  onClick={() => handleSelectDashboard(dashboard.id)}
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={dashboard.thumbnail} 
                      alt={dashboard.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-lg mb-1">{dashboard.name}</h3>
                      <p className="text-white/90 text-sm">{dashboard.description}</p>
                    </div>
                    {selectedDashboards.includes(dashboard.id) && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <MessageSquare size={14} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Mentions</span>
                        </div>
                        <p className="font-semibold text-sm">{dashboard.stats.totalMentions.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingUp size={14} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Sentiment</span>
                        </div>
                        <p className={`font-semibold text-sm ${getSentimentColor(dashboard.stats.avgSentiment)}`}>
                          {dashboard.stats.avgSentiment}/100
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users size={14} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Reach</span>
                        </div>
                        <p className="font-semibold text-sm">{(dashboard.stats.totalReach / 1000000).toFixed(1)}M</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <BarChart3 size={14} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Platforms</span>
                        </div>
                        <p className="font-semibold text-sm">{dashboard.stats.activePlatforms}</p>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>Created {dashboard.createdAt}</span>
                      </div>
                      <span>Updated {dashboard.lastUpdated}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDashboard(dashboard);
                        }}
                      >
                        <ExternalLink size={12} className="mr-1" />
                        Open
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditDashboard(dashboard.id);
                        }}
                      >
                        <Edit size={12} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteModal(dashboard.id);
                        }}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                </MotionCard>
              ))}
            </div>

            {/* Empty State */}
            {dashboardsData.length === 0 && (
              <MotionCard className="p-12 text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Dashboards Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first dashboard to start monitoring your brand mentions.
                </p>
                <Link to="/create-dashboard">
                  <Button className="bg-brand-blue hover:bg-brand-blue/90">
                    <Plus className="mr-2 h-4 w-4" /> Create Your First Dashboard
                  </Button>
                </Link>
              </MotionCard>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <MotionCard className="w-full max-w-md p-6">
              <h3 className="text-lg font-medium mb-4">Delete Dashboard</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete this dashboard? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteModal(null)} 
                  className="flex-1"
                  disabled={deletingDashboard}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDeleteDashboard(showDeleteModal)} 
                  className="flex-1"
                  disabled={deletingDashboard}
                >
                  {deletingDashboard ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </MotionCard>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboards;
