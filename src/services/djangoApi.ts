const API_BASE_URL = 'http://localhost:8000/api'; // Django backend URL

// Types for API responses
export interface DashboardStats {
  totalMentions: number;
  engagementRate: number;
  audienceReach: string;
  sentimentScore: number;
  changes: {
    mentions: string;
    engagement: string;
    reach: string;
    sentiment: string;
  };
}

export interface MentionData {
  id: number;
  platform: string;
  author: string;
  authorImage?: string;
  date: string;
  content: string;
  postImage?: string;
  postUrl?: string;
  engagement: {
    likes: number;
    replies: number;
    shares: number;
    views?: number;
  };
  sentiment: 'positive' | 'negative' | 'neutral';
}

// Add response wrapper types for paginated results
export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}

export interface MentionsOverTimeData {
  date: string;
  twitter: number;
  instagram: number;
  facebook: number;
  reddit: number;
}

export interface MentionsOverTimeResponse {
  results: MentionsOverTimeData[];
}

export interface SentimentAnalysis {
  positive: number;
  neutral: number;
  negative: number;
}

export interface CompetitorData {
  id: number;
  name: string;
  mentions: number;
  sentiment: number;
  engagement: number;
  trend: 'up' | 'down';
  change: string;
  isUser?: boolean;
}

export interface CompetitorDataWithId extends CompetitorData {
  id: number;
}

export interface TrendingTopic {
  id: number;
  topic: string;
  mentions: number;
  change: string;
  trend: 'up' | 'down';
  sentiment: number;
}

// Helper function to get auth headers
const getAuthHeaders = async () => {
  // Get current user session from Supabase for authentication
  const token = localStorage.getItem('supabase.auth.token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Generic API call function with error handling
const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  try {
    const headers = await getAuthHeaders();
    console.log(`Making API call to: ${API_BASE_URL}${endpoint}`);
    console.log('Request body:', options.body);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // For analytics endpoints, extract the data array if it exists
    if (data && typeof data === 'object' && 'data' in data) {
      return data.data as T;
    }
    
    return data as T;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
};

// Dashboard APIs - All converted to POST for security
export const dashboardApi = {
  // Get main dashboard statistics
  getStats: async (dashboardId?: number, filters?: any): Promise<DashboardStats> => {
    const requestBody = { 
      dashboardId: dashboardId || null, 
      filters: filters || {},
      dateRange: filters?.dateRange || '30d',
      platforms: filters?.platforms || [],
      sentiments: filters?.sentiments || [],
      keywords: filters?.keywords || [],
      minEngagement: filters?.minEngagement || 0,
      maxEngagement: filters?.maxEngagement || 10000
    };
    console.log('Dashboard Stats API call with dashboardId:', dashboardId, requestBody);
    return apiCall<DashboardStats>('/dashboard/stats/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },

  // Get mentions over time data for charts
  getMentionsOverTime: async (timeRange: string = '30d', dashboardId?: number, filters?: any): Promise<MentionsOverTimeResponse> => {
    const requestBody = { 
      timeRange, 
      dashboardId: dashboardId || null,
      filters: filters || {},
      platforms: filters?.platforms || [],
      sentiments: filters?.sentiments || [],
      keywords: filters?.keywords || []
    };
    console.log('Mentions Over Time API call with dashboardId:', dashboardId, requestBody);
    return apiCall<MentionsOverTimeResponse>('/dashboard/mentions-overtime/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },

  // Get sentiment analysis data
  getSentimentAnalysis: async (dashboardId?: number, filters?: any): Promise<SentimentAnalysis> => {
    const requestBody = { 
      dashboardId: dashboardId || null, 
      filters: filters || {},
      dateRange: filters?.dateRange || '30d',
      platforms: filters?.platforms || [],
      keywords: filters?.keywords || []
    };
    console.log('Sentiment Analysis API call with dashboardId:', dashboardId, requestBody);
    return apiCall<SentimentAnalysis>('/dashboard/sentiment-analysis/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },

  // Get analytics data for performance charts
  getAnalyticsData: async (timeRange: string = '6m', dashboardId?: number, filters?: any) => {
    const requestBody = { 
      timeRange, 
      dashboardId,
      filters: filters || {},
      platforms: filters?.platforms || [],
      sentiments: filters?.sentiments || []
    };
    console.log('Analytics Data API call with:', requestBody);
    return apiCall('/dashboard/analytics/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },

  // Get predictive insights
  getPredictiveInsights: async (dashboardId?: number, filters?: any) => {
    const requestBody = { 
      dashboardId, 
      analysisType: 'trend_forecasting',
      filters: filters || {},
      dateRange: filters?.dateRange || '30d',
      platforms: filters?.platforms || []
    };
    console.log('Predictive Insights API call with:', requestBody);
    return apiCall('/dashboard/predictive-insights/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },
};

// Mentions APIs - Converted to POST
export const mentionsApi = {
  // Get mentions with filters and pagination
  getMentions: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    platforms?: string[];
    sentiments?: string[];
    dateRange?: string;
    engagementLevel?: string;
    dashboardId?: number;
  }): Promise<PaginatedResponse<MentionData>> => {
    const requestBody = {
      page: params.page || 1,
      pageSize: params.pageSize || 20,
      search: params.search || '',
      platforms: params.platforms || [],
      sentiments: params.sentiments || [],
      dateRange: params.dateRange || '30d',
      engagementLevel: params.engagementLevel || 'all',
      dashboardId: params.dashboardId || null
    };
    console.log('Mentions Search API call with dashboardId:', params.dashboardId, requestBody);
    return apiCall<PaginatedResponse<MentionData>>('/mentions/search/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },

  // Get mention details by ID
  getMentionById: async (id: number) => {
    const requestBody = { mentionId: id };
    console.log('Get Mention By ID API call with:', requestBody);
    return apiCall(`/mentions/get/`, {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },
};

// Competitor Analysis APIs - Converted to POST
export const competitorApi = {
  // Get competitor analysis data
  getCompetitors: async (dashboardId?: number): Promise<CompetitorDataWithId[]> => {
    const requestBody = { 
      dashboardId: dashboardId || null, 
      includeUserBrand: true 
    };
    console.log('Competitors List API call with dashboardId:', dashboardId, requestBody);
    return apiCall<CompetitorDataWithId[]>('/competitors/list/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },

  // Add new competitor for tracking
  addCompetitor: async (competitorData: { name: string; website?: string; dashboardId?: number }) => {
    const requestBody = {
      ...competitorData,
      dashboardId: competitorData.dashboardId || null
    };
    console.log('Add Competitor API call with dashboardId:', competitorData.dashboardId, requestBody);
    return apiCall('/competitors/add/', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  },

  // Remove competitor
  removeCompetitor: async (competitorId: number) => {
    const requestBody = { competitorId };
    console.log('Remove Competitor API call with:', requestBody);
    return apiCall('/competitors/remove/', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  },

  // Get competitor comparison data
  getCompetitorComparison: async (competitorIds: number[]) => {
    const requestBody = { 
      competitorIds, 
      timeRange: '30d',
      metrics: ['mentions', 'sentiment', 'engagement', 'reach']
    };
    console.log('Competitor Comparison API call with:', requestBody);
    return apiCall('/competitors/compare/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },

  // Get performance radar data
  getPerformanceRadar: async (dashboardId?: number) => {
    const requestBody = { 
      dashboardId: dashboardId || null,
      timeRange: '30d',
      metrics: ['mentions', 'sentiment', 'engagement', 'reach']
    };
    console.log('Performance Radar API call with dashboardId:', dashboardId, requestBody);
    return apiCall('/competitors/performance-radar/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },

  // Get mentions comparison data
  getMentionsComparison: async (dashboardId?: number) => {
    const requestBody = { 
      dashboardId: dashboardId || null,
      timeRange: '30d',
      includeUserBrand: true
    };
    console.log('Mentions Comparison API call with dashboardId:', dashboardId, requestBody);
    return apiCall('/competitors/mentions-comparison/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },
};

// Social Listening APIs - Converted to POST with dashboardId
export const socialListeningApi = {
  // Get trending topics
  getTrendingTopics: async (dashboardId?: number): Promise<TrendingTopic[]> => {
    const requestBody = { 
      timeRange: '24h', 
      limit: 10, 
      dashboardId: dashboardId || null 
    };
    console.log('Trending Topics API call with dashboardId:', dashboardId, requestBody);
    return apiCall<TrendingTopic[]>('/social-listening/trending-topics/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },

  // Get tracked keywords
  getKeywords: async (dashboardId?: number) => {
    const requestBody = { dashboardId: dashboardId || null };
    console.log('Keywords API call with dashboardId:', dashboardId, requestBody);
    return apiCall('/social-listening/keywords/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },

  // Add new keyword for tracking
  addKeyword: async (keywordData: { keyword: string; alertThreshold?: string; dashboardId?: number }) => {
    console.log('Add Keyword API call with:', keywordData);
    return apiCall('/social-listening/keywords/add/', {
      method: 'POST',
      body: JSON.stringify(keywordData),
    });
  },

  // Get alerts
  getAlerts: async (dashboardId?: number) => {
    const requestBody = { 
      dashboardId: dashboardId || null, 
      status: 'active' 
    };
    console.log('Alerts API call with dashboardId:', dashboardId, requestBody);
    return apiCall('/social-listening/alerts/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },

  // Create new alert
  createAlert: async (alertData: { type: string; conditions: string; dashboardId?: number }) => {
    console.log('Create Alert API call with:', alertData);
    return apiCall('/social-listening/alerts/create/', {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  },

  // Get real-time mentions data
  getRealTimeMentions: async (timeRange: string = '24h', dashboardId?: number) => {
    const requestBody = { 
      timeRange, 
      dashboardId: dashboardId || null 
    };
    console.log('Real-time Mentions API call with dashboardId:', dashboardId, requestBody);
    return apiCall('/social-listening/realtime-mentions/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },

  // Get sentiment trend data
  getSentimentTrend: async (timeRange: string = '24h', dashboardId?: number) => {
    const requestBody = { 
      timeRange, 
      dashboardId: dashboardId || null 
    };
    console.log('Sentiment Trend API call with dashboardId:', dashboardId, requestBody);
    return apiCall('/social-listening/sentiment-trend/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },

  // Get influencer tracking data
  getInfluencerTracking: async (dashboardId?: number) => {
    const requestBody = { 
      dashboardId: dashboardId || null,
      timeRange: '30d',
      limit: 20
    };
    console.log('Influencer Tracking API call with dashboardId:', dashboardId, requestBody);
    return apiCall('/social-listening/influencer-tracking/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },

  // Get viral content data
  getViralContent: async (dashboardId?: number) => {
    const requestBody = { 
      dashboardId: dashboardId || null,
      timeRange: '7d',
      minEngagement: 1000
    };
    console.log('Viral Content API call with dashboardId:', dashboardId, requestBody);
    return apiCall('/social-listening/viral-content/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },
};

// Dashboards Management APIs - Converted to POST
export const dashboardsApi = {
  // Get all user dashboards
  getDashboards: async (): Promise<Dashboard[]> => {
    const requestBody = { includeStats: true };
    console.log('Get Dashboards API call with:', requestBody);
    return apiCall<Dashboard[]>('/dashboards/list/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },

  // Get single dashboard by ID
  getDashboard: async (id: number): Promise<Dashboard> => {
    const requestBody = { dashboardId: id, includeStats: true };
    console.log('Get Dashboard API call with:', requestBody);
    return apiCall<Dashboard>('/dashboards/get/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },

  // Create new dashboard
  createDashboard: async (dashboardData: CreateDashboardPayload): Promise<Dashboard> => {
    console.log('Create Dashboard API call with:', dashboardData);
    return apiCall<Dashboard>('/dashboards/create/', {
      method: 'POST',
      body: JSON.stringify(dashboardData),
    });
  },

  // Update dashboard
  updateDashboard: async (id: number, dashboardData: Partial<CreateDashboardPayload>): Promise<Dashboard> => {
    console.log(`Update Dashboard API call for id ${id} with:`, dashboardData);
    return apiCall<Dashboard>('/dashboards/update/', {
      method: 'POST',
      body: JSON.stringify({ dashboardId: id, ...dashboardData }),
    });
  },

  // Delete dashboard
  deleteDashboard: async (id: number): Promise<void> => {
    console.log(`Delete Dashboard API call for id ${id}`);
    return apiCall<void>('/dashboards/delete/', {
      method: 'POST',
      body: JSON.stringify({ dashboardId: id }),
    });
  },

  // Get dashboard comparison data
  compareDashboards: async (dashboardIds: number[]) => {
    const requestBody = { 
      dashboardIds, 
      timeRange: '30d',
      metrics: ['mentions', 'sentiment', 'engagement', 'reach']
    };
    console.log('Compare Dashboards API call with:', requestBody);
    return apiCall('/dashboards/compare/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  },
};

// Analytics APIs - Updated with proper typing and error handling
export const analyticsApi = {
  // Get audience reach data
  getAudienceReach: async (timeRange: string = '6m', dashboardId?: number, filters?: any): Promise<{ date: string, reach: number }[]> => {
    const requestBody = { 
      timeRange, 
      dashboardId,
      filters: filters || {},
      platforms: filters?.platforms || [],
      keywords: filters?.keywords || []
    };
    console.log('Audience Reach API call with:', requestBody);
    try {
      return await apiCall<{ date: string, reach: number }[]>('/analytics/audience-reach/', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });
    } catch (error) {
      console.warn('Failed to fetch audience reach data:', error);
      return [];
    }
  },

  // Get monthly mentions data
  getMonthlyMentions: async (timeRange: string = '6m', dashboardId?: number, filters?: any): Promise<{ month: string, mentions: number }[]> => {
    const requestBody = { 
      timeRange, 
      dashboardId,
      filters: filters || {},
      platforms: filters?.platforms || [],
      sentiments: filters?.sentiments || [],
      keywords: filters?.keywords || []
    };
    console.log('Monthly Mentions API call with:', requestBody);
    try {
      return await apiCall<{ month: string, mentions: number }[]>('/analytics/monthly-mentions/', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });
    } catch (error) {
      console.warn('Failed to fetch monthly mentions data:', error);
      return [];
    }
  },

  // Get engagement metrics
  getEngagementMetrics: async (timeRange: string = '6m', dashboardId?: number, filters?: any): Promise<{ date: string, engagement: number, likes: number, shares: number, comments: number }[]> => {
    const requestBody = { 
      timeRange, 
      dashboardId,
      filters: filters || {},
      platforms: filters?.platforms || [],
      minEngagement: filters?.minEngagement || 0,
      maxEngagement: filters?.maxEngagement || 10000
    };
    console.log('Engagement Metrics API call with:', requestBody);
    try {
      return await apiCall<{ date: string, engagement: number, likes: number, shares: number, comments: number }[]>('/analytics/engagement/', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });
    } catch (error) {
      console.warn('Failed to fetch engagement metrics data:', error);
      return [];
    }
  },

  // Get platform performance
  getPlatformPerformance: async (dashboardId?: number, filters?: any): Promise<{ platform: string, mentions: number, engagement: number, reach: number }[]> => {
    const requestBody = { 
      dashboardId, 
      timeRange: '30d',
      filters: filters || {},
      platforms: filters?.platforms || []
    };
    console.log('Platform Performance API call with:', requestBody);
    try {
      return await apiCall<{ platform: string, mentions: number, engagement: number, reach: number }[]>('/analytics/platform-performance/', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });
    } catch (error) {
      console.warn('Failed to fetch platform performance data:', error);
      return [];
    }
  },

  // Get source distribution data
  getSourceDistribution: async (dashboardId?: number, filters?: any): Promise<{ name: string, value: number, color: string }[]> => {
    const requestBody = { 
      dashboardId, 
      timeRange: filters?.dateRange || '30d',
      filters: filters || {},
      platforms: filters?.platforms || []
    };
    console.log('Source Distribution API call with:', requestBody);
    try {
      return await apiCall<{ name: string, value: number, color: string }[]>('/analytics/source-distribution/', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });
    } catch (error) {
      console.warn('Failed to fetch source distribution data:', error);
      return [];
    }
  },

  // Get top keywords data
  getTopKeywords: async (dashboardId?: number, filters?: any): Promise<{ keyword: string, mentions: number, change: string, trend: 'up'|'down' }[]> => {
    const requestBody = { 
      dashboardId, 
      timeRange: filters?.dateRange || '30d',
      limit: 10,
      filters: filters || {},
      keywords: filters?.keywords || []
    };
    console.log('Top Keywords API call with:', requestBody);
    try {
      return await apiCall<{ keyword: string, mentions: number, change: string, trend: 'up'|'down' }[]>('/analytics/top-keywords/', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });
    } catch (error) {
      console.warn('Failed to fetch top keywords data:', error);
      return [];
    }
  },
};

// Add new types for dashboard management
export interface Dashboard {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  lastUpdated: string;
  stats: {
    totalMentions: number;
    avgSentiment: number;
    totalReach: number;
    activePlatforms: number;
  };
  thumbnail: string;
  keywords: string[];
  hashtags: string[];
  urls: string[];
  platforms: string[];
  refreshInterval: number;
  sentimentAnalysis: boolean;
  alertThreshold: number;
  imageUrl?: string;
}

export interface CreateDashboardPayload {
  dashboardName: string;
  description?: string;
  keywords: string[];
  hashtags?: string[];
  urls?: string[];
  refreshInterval: number;
  platforms: string[];
  sentimentAnalysis: boolean;
  alertThreshold: number;
  imageUrl?: string;
}

export default {
  dashboard: dashboardApi,
  mentions: mentionsApi,
  competitors: competitorApi,
  socialListening: socialListeningApi,
  dashboards: dashboardsApi,
  analytics: analyticsApi,
};
