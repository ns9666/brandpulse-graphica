
import React from 'react';
import MotionCard from '@/components/ui/MotionCard';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, Users, Zap, Plus, Hash } from 'lucide-react';
import { useApiData } from '@/hooks/useApiData';
import { socialListeningApi, Alert, Influencer, ViralContent, TrendingTopic } from '@/services/djangoApi';
import { useDashboardContext } from '@/pages/Index';

const SocialListeningWidgets = () => {
  const { selectedDashboard, dashboardFilters } = useDashboardContext();

  // Fetch trending topics
  const { data: trendingTopics, loading: loadingTopics, error: topicsError } = useApiData<TrendingTopic[]>(() => 
    socialListeningApi.getTrendingTopics(selectedDashboard?.id || 1)
  );

  // Fetch alerts
  const { data: alerts, loading: loadingAlerts, error: alertsError } = useApiData<Alert[]>(() => 
    socialListeningApi.getAlerts(selectedDashboard?.id || 1)
  );

  // Fetch influencer tracking
  const { data: influencers, loading: loadingInfluencers, error: influencersError } = useApiData<Influencer[]>(() => 
    socialListeningApi.getInfluencerTracking(selectedDashboard?.id || 1)
  );

  // Fetch viral content
  const { data: viralContent, loading: loadingViral, error: viralError } = useApiData<ViralContent[]>(() => 
    socialListeningApi.getViralContent(selectedDashboard?.id || 1)
  );

  // Default fallback data
  const defaultTrendingTopics: TrendingTopic[] = [
    { id: 1, topic: 'AI Technology', mentions: 1247, change: '+15.3%', trend: 'up', sentiment: 78 },
    { id: 2, topic: 'Customer Service', mentions: 892, change: '+8.7%', trend: 'up', sentiment: 65 },
    { id: 3, topic: 'Product Launch', mentions: 634, change: '-2.1%', trend: 'down', sentiment: 82 }
  ];

  const defaultAlerts: Alert[] = [
    { id: 1, type: 'Mention Spike', message: 'Brand mentions increased by 45% in the last hour', severity: 'high', timestamp: '2 min ago' },
    { id: 2, type: 'Sentiment Drop', message: 'Negative sentiment detected on Twitter', severity: 'medium', timestamp: '15 min ago' }
  ];

  const defaultInfluencers: Influencer[] = [
    { id: 1, name: 'Tech Reviewer', platform: 'YouTube', followers: 250000, engagement: 4.5, mentions: 12 },
    { id: 2, name: 'Industry Expert', platform: 'LinkedIn', followers: 45000, engagement: 6.2, mentions: 8 }
  ];

  const defaultViralContent: ViralContent[] = [
    { id: 1, content: 'Amazing product review video...', platform: 'TikTok', engagement: 15420, shares: 892, timestamp: '3 hours ago' },
    { id: 2, content: 'Customer success story...', platform: 'Instagram', engagement: 8341, shares: 432, timestamp: '6 hours ago' }
  ];

  // Use API data or fallback
  const topicsData = trendingTopics || defaultTrendingTopics;
  const alertsData = alerts || defaultAlerts;
  const influencersData = influencers || defaultInfluencers;
  const viralData = viralContent || defaultViralContent;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Trending Topics */}
        <MotionCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Hash className="text-brand-blue" size={20} />
              Trending Topics
            </h3>
            <Button variant="outline" size="sm">
              <Plus size={16} className="mr-1" />
              Add Topic
            </Button>
          </div>
          {loadingTopics ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {topicsData.map((topic) => (
                <div key={topic.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                  <div>
                    <p className="font-medium">{topic.topic}</p>
                    <p className="text-sm text-muted-foreground">{topic.mentions} mentions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`${topic.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} size={16} />
                    <span className={`text-sm font-medium ${topic.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {topic.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </MotionCard>

        {/* Alerts */}
        <MotionCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <AlertTriangle className="text-orange-500" size={20} />
              Recent Alerts
            </h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          {loadingAlerts ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="animate-pulse h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {alertsData.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                  alert.severity === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                  alert.severity === 'medium' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' :
                  'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{alert.type}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </MotionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Influencer Tracking */}
        <MotionCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Users className="text-purple-500" size={20} />
              Influencer Tracking
            </h3>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
          {loadingInfluencers ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="animate-pulse h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {influencersData.map((influencer) => (
                <div key={influencer.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                  <div>
                    <p className="font-medium">{influencer.name}</p>
                    <p className="text-sm text-muted-foreground">{influencer.platform} • {influencer.followers.toLocaleString()} followers</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{influencer.mentions} mentions</p>
                    <p className="text-xs text-muted-foreground">{influencer.engagement}% engagement</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </MotionCard>

        {/* Viral Content */}
        <MotionCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Zap className="text-yellow-500" size={20} />
              Viral Content
            </h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          {loadingViral ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="animate-pulse h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {viralData.map((content) => (
                <div key={content.id} className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                  <p className="text-sm font-medium mb-2">{content.content}</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{content.platform}</span>
                    <div className="flex gap-3">
                      <span>{content.engagement.toLocaleString()} engagements</span>
                      <span>{content.shares} shares</span>
                      <span>{content.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </MotionCard>
      </div>
    </div>
  );
};

export default SocialListeningWidgets;
