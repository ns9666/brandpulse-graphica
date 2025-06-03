
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MotionCard from '@/components/ui/MotionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, TrendingUp, TrendingDown, AlertTriangle, Search, Bell, Hash, Users, Calendar, Filter } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from 'recharts';
import { useApiData } from '@/hooks/useApiData';
import { socialListeningApi, Alert, TrendingTopic } from '@/services/djangoApi';
import { toast } from '@/hooks/use-toast';

const SocialListening = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [showAddKeywordModal, setShowAddKeywordModal] = useState(false);
  const [showAddAlertModal, setShowAddAlertModal] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [newAlertType, setNewAlertType] = useState('spike');
  const [newAlertConditions, setNewAlertConditions] = useState('');

  // API data fetching
  const { data: trendingTopics, loading: loadingTopics, refetch: refetchTopics } = useApiData<TrendingTopic[]>(() => 
    socialListeningApi.getTrendingTopics(1)
  );

  const { data: alerts, loading: loadingAlerts, refetch: refetchAlerts } = useApiData<Alert[]>(() => 
    socialListeningApi.getAlerts(1)
  );

  const { data: keywords, loading: loadingKeywords, refetch: refetchKeywords } = useApiData(() => 
    socialListeningApi.getKeywords(1)
  );

  const { data: realTimeMentions, loading: loadingMentions } = useApiData(() => 
    socialListeningApi.getRealTimeMentions(selectedTimeRange, 1)
  );

  const { data: sentimentTrend, loading: loadingSentiment } = useApiData(() => 
    socialListeningApi.getSentimentTrend(selectedTimeRange, 1)
  );

  const handleAddKeyword = async () => {
    if (!newKeyword.trim()) {
      toast({
        title: "Error",
        description: "Please enter a keyword",
        variant: "destructive",
      });
      return;
    }

    try {
      await socialListeningApi.addKeyword({
        keyword: newKeyword,
        alertThreshold: 'medium',
        dashboardId: 1
      });
      
      toast({
        title: "Success",
        description: "Keyword added successfully",
      });
      
      setNewKeyword('');
      setShowAddKeywordModal(false);
      refetchKeywords();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add keyword",
        variant: "destructive",
      });
    }
  };

  const handleCreateAlert = async () => {
    if (!newAlertConditions.trim()) {
      toast({
        title: "Error",
        description: "Please enter alert conditions",
        variant: "destructive",
      });
      return;
    }

    try {
      await socialListeningApi.createAlert({
        type: newAlertType,
        conditions: newAlertConditions,
        dashboardId: 1
      });
      
      toast({
        title: "Success",
        description: "Alert created successfully",
      });
      
      setNewAlertType('spike');
      setNewAlertConditions('');
      setShowAddAlertModal(false);
      refetchAlerts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create alert",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      <main className="container pt-28 pb-16">
        <DashboardHeader 
          title="Social Listening" 
          description="Monitor trends, track keywords, and stay ahead of conversations"
          action={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAddAlertModal(true)}>
                <Bell className="mr-2 h-4 w-4" /> Create Alert
              </Button>
              <Button onClick={() => setShowAddKeywordModal(true)} className="bg-brand-blue hover:bg-brand-blue/90">
                <Plus className="mr-2 h-4 w-4" /> Add Keyword
              </Button>
            </div>
          }
        />

        {/* Time Range Filter */}
        <div className="mb-6">
          <MotionCard className="p-4">
            <div className="flex items-center gap-4">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Time Range:</span>
              <div className="flex gap-2">
                {[
                  { value: '1h', label: '1H' },
                  { value: '24h', label: '24H' },
                  { value: '7d', label: '7D' },
                  { value: '30d', label: '30D' }
                ].map((range) => (
                  <Button
                    key={range.value}
                    variant={selectedTimeRange === range.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTimeRange(range.value)}
                    className={selectedTimeRange === range.value ? "bg-brand-blue hover:bg-brand-blue/90" : ""}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>
          </MotionCard>
        </div>

        {/* Alerts Section */}
        <div className="mb-6">
          <MotionCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <AlertTriangle size={20} className="text-yellow-500" />
                Active Alerts
              </h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            {loadingAlerts ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {alerts && alerts.length > 0 ? alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                    <div className={`w-3 h-3 rounded-full mt-1 ${getSeverityColor(alert.severity)}`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{alert.type}</h4>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">Dismiss</Button>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">No active alerts</p>
                )}
              </div>
            )}
          </MotionCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {/* Trending Topics */}
          <MotionCard className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Hash size={20} />
              Trending Topics
            </h3>
            {loadingTopics ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {trendingTopics && trendingTopics.length > 0 ? trendingTopics.map((topic) => (
                  <div key={topic.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{topic.topic}</h4>
                      <p className="text-xs text-muted-foreground">{topic.mentions.toLocaleString()} mentions</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        topic.sentiment >= 70 ? 'bg-green-100 text-green-800' :
                        topic.sentiment >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {topic.sentiment}%
                      </span>
                      <div className="flex items-center gap-1">
                        {topic.trend === 'up' ? (
                          <TrendingUp size={14} className="text-emerald-600" />
                        ) : (
                          <TrendingDown size={14} className="text-rose-600" />
                        )}
                        <span className={`text-xs ${topic.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {topic.change}
                        </span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">No trending topics available</p>
                )}
              </div>
            )}
          </MotionCard>

          {/* Real-time Mentions Chart */}
          <MotionCard className="p-6">
            <h3 className="text-lg font-medium mb-4">Real-time Mentions</h3>
            <div className="h-[300px]">
              {loadingMentions ? (
                <div className="animate-pulse h-full bg-gray-200 rounded"></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={realTimeMentions || []}>
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="mentions" 
                      stroke="#0A84FF" 
                      strokeWidth={2}
                      dot={{ fill: '#0A84FF', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </MotionCard>
        </div>

        {/* Keywords Management */}
        <MotionCard className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Search size={20} />
              Tracked Keywords
            </h3>
            <Button variant="outline" size="sm" onClick={() => setShowAddKeywordModal(true)}>
              <Plus size={16} className="mr-1" />
              Add Keyword
            </Button>
          </div>
          {loadingKeywords ? (
            <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4">Keyword</th>
                    <th className="text-center py-3 px-4">Mentions</th>
                    <th className="text-center py-3 px-4">Alerts</th>
                    <th className="text-center py-3 px-4">Status</th>
                    <th className="text-center py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords && keywords.length > 0 ? keywords.map((keyword: any) => (
                    <tr key={keyword.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 px-4 font-medium">{keyword.keyword}</td>
                      <td className="text-center py-3 px-4">{keyword.mentions?.toLocaleString() || 0}</td>
                      <td className="text-center py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          keyword.alerts > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {keyword.alerts || 0}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          keyword.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {keyword.status || 'active'}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <Button variant="outline" size="sm" className="text-xs">Edit</Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            {keyword.status === 'active' ? 'Pause' : 'Resume'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-muted-foreground">
                        No keywords tracked yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </MotionCard>

        {/* Sentiment Trend */}
        <MotionCard className="p-6">
          <h3 className="text-lg font-medium mb-4">Sentiment Trend</h3>
          <div className="h-[300px]">
            {loadingSentiment ? (
              <div className="animate-pulse h-full bg-gray-200 rounded"></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sentimentTrend || []}>
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar 
                    dataKey="sentiment" 
                    fill="#0A84FF"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </MotionCard>

        {/* Add Keyword Modal */}
        {showAddKeywordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <MotionCard className="w-full max-w-md p-6">
              <h3 className="text-lg font-medium mb-4">Add New Keyword</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Keyword</label>
                  <Input 
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Enter keyword to track..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Alert Threshold</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none">
                    <option>High activity (100+ mentions/hour)</option>
                    <option>Medium activity (50+ mentions/hour)</option>
                    <option>Low activity (10+ mentions/hour)</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowAddKeywordModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddKeyword}
                  className="flex-1 bg-brand-blue hover:bg-brand-blue/90"
                >
                  Add Keyword
                </Button>
              </div>
            </MotionCard>
          </div>
        )}

        {/* Add Alert Modal */}
        {showAddAlertModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <MotionCard className="w-full max-w-md p-6">
              <h3 className="text-lg font-medium mb-4">Create Alert</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Alert Type</label>
                  <select 
                    value={newAlertType}
                    onChange={(e) => setNewAlertType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none"
                  >
                    <option value="spike">Mention spike</option>
                    <option value="sentiment">Sentiment drop</option>
                    <option value="competitor">Competitor activity</option>
                    <option value="trending">New trending topic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Conditions</label>
                  <Input 
                    value={newAlertConditions}
                    onChange={(e) => setNewAlertConditions(e.target.value)}
                    placeholder="e.g., mentions increase by 150%"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowAddAlertModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateAlert}
                  className="flex-1 bg-brand-blue hover:bg-brand-blue/90"
                >
                  Create Alert
                </Button>
              </div>
            </MotionCard>
          </div>
        )}
      </main>
    </div>
  );
};

export default SocialListening;
