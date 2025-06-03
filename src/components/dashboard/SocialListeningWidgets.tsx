
import React from 'react';
import { TrendingUp, AlertTriangle, Users, Zap, Crown, Flame } from 'lucide-react';
import MotionCard from '@/components/ui/MotionCard';
import { useApiData } from '@/hooks/useApiData';
import { socialListeningApi } from '@/services/djangoApi';
import { useDashboardContext } from '@/pages/Index';

interface TrendingTopic {
  id: number;
  topic: string;
  mentions: number;
  change: string;
  trend: 'up' | 'down';
  sentiment: number;
}

interface Alert {
  id: number;
  type: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
}

interface Influencer {
  id: number;
  name: string;
  platform: string;
  followers: number;
  engagement: number;
  mentions: number;
}

interface ViralContent {
  id: number;
  content: string;
  platform: string;
  engagement: number;
  shares: number;
  timestamp: string;
}

const SocialListeningWidgets = () => {
  const { selectedDashboard } = useDashboardContext();

  // Fetch trending topics
  const { data: trendingTopics, loading: topicsLoading, error: topicsError } = useApiData<TrendingTopic[]>(() => 
    socialListeningApi.getTrendingTopics(selectedDashboard?.id)
  );

  // Fetch alerts
  const { data: alerts, loading: alertsLoading, error: alertsError } = useApiData<Alert[]>(() => 
    socialListeningApi.getAlerts(selectedDashboard?.id)
  );

  // Fetch real-time mentions
  const { data: realTimeMentions, loading: mentionsLoading, error: mentionsError } = useApiData(() => 
    socialListeningApi.getRealTimeMentions('24h', selectedDashboard?.id)
  );

  // Fetch sentiment trend
  const { data: sentimentTrend, loading: sentimentLoading, error: sentimentError } = useApiData(() => 
    socialListeningApi.getSentimentTrend('24h', selectedDashboard?.id)
  );

  // Fetch influencer tracking
  const { data: influencers, loading: influencersLoading, error: influencersError } = useApiData<Influencer[]>(() => 
    socialListeningApi.getInfluencerTracking(selectedDashboard?.id)
  );

  // Fetch viral content
  const { data: viralContent, loading: viralLoading, error: viralError } = useApiData<ViralContent[]>(() => 
    socialListeningApi.getViralContent(selectedDashboard?.id)
  );

  // Default fallback data
  const defaultTrendingTopics = [
    { id: 1, topic: 'Brand Launch', mentions: 1250, change: '+25%', trend: 'up' as const, sentiment: 85 },
    { id: 2, topic: 'Customer Service', mentions: 980, change: '+12%', trend: 'up' as const, sentiment: 72 },
    { id: 3, topic: 'Product Quality', mentions: 750, change: '-5%', trend: 'down' as const, sentiment: 65 }
  ];

  const defaultAlerts = [
    { id: 1, type: 'Sentiment Drop', message: 'Negative sentiment increased by 15%', severity: 'high' as const, timestamp: '2 hours ago' },
    { id: 2, type: 'Mention Spike', message: 'Unusual activity detected on Twitter', severity: 'medium' as const, timestamp: '4 hours ago' }
  ];

  if (topicsError) console.warn('Failed to load trending topics:', topicsError);
  if (alertsError) console.warn('Failed to load alerts:', alertsError);
  if (mentionsError) console.warn('Failed to load real-time mentions:', mentionsError);
  if (sentimentError) console.warn('Failed to load sentiment trend:', sentimentError);
  if (influencersError) console.warn('Failed to load influencers:', influencersError);
  if (viralError) console.warn('Failed to load viral content:', viralError);

  return (
    <div className="space-y-6">
      {/* API Status Indicator */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MotionCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <h4 className="font-medium">Real-time Mentions</h4>
          </div>
          {mentionsLoading ? (
            <div className="animate-pulse text-sm text-muted-foreground">Loading...</div>
          ) : (
            <div className="text-sm text-muted-foreground">
              {realTimeMentions ? 'API Connected' : 'Using fallback data'}
            </div>
          )}
        </MotionCard>

        <MotionCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <h4 className="font-medium">Sentiment Trend</h4>
          </div>
          {sentimentLoading ? (
            <div className="animate-pulse text-sm text-muted-foreground">Loading...</div>
          ) : (
            <div className="text-sm text-muted-foreground">
              {sentimentTrend ? 'API Connected' : 'Using fallback data'}
            </div>
          )}
        </MotionCard>

        <MotionCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-5 w-5 text-purple-500" />
            <h4 className="font-medium">Influencer Tracking</h4>
          </div>
          {influencersLoading ? (
            <div className="animate-pulse text-sm text-muted-foreground">Loading...</div>
          ) : (
            <div className="text-sm text-muted-foreground">
              {influencers ? 'API Connected' : 'Using fallback data'}
            </div>
          )}
        </MotionCard>
      </div>

      {/* Trending Topics Widget */}
      <MotionCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-medium">Trending Topics</h3>
        </div>
        {topicsLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {(trendingTopics || defaultTrendingTopics).map((topic) => (
              <div key={topic.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                <div>
                  <p className="font-medium text-sm">{topic.topic}</p>
                  <p className="text-xs text-muted-foreground">{topic.mentions} mentions</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${topic.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {topic.change}
                  </span>
                  <TrendingUp size={14} className={topic.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'} />
                </div>
              </div>
            ))}
          </div>
        )}
      </MotionCard>

      {/* Alerts Widget */}
      <MotionCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-medium">Active Alerts</h3>
        </div>
        {alertsLoading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {(alerts || defaultAlerts).map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                alert.severity === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{alert.type}</p>
                    <p className="text-xs text-muted-foreground">{alert.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </MotionCard>

      {/* Viral Content Widget */}
      <MotionCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-medium">Viral Content</h3>
        </div>
        {viralLoading ? (
          <div className="animate-pulse text-sm text-muted-foreground">Loading viral content...</div>
        ) : (
          <div className="text-sm text-muted-foreground">
            {viralContent ? `${Array.isArray(viralContent) ? viralContent.length : 0} viral posts tracked` : 'Using fallback data'}
          </div>
        )}
      </MotionCard>
    </div>
  );
};

export default SocialListeningWidgets;
