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
  name: string;
  mentions: number;
  sentiment: number;
  engagement: number;
  trend: 'up' | 'down';
  change: string;
  isUser?: boolean;
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

    return await response.json();
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
};

// Dashboard APIs - All converted to POST for security
export const dashboardApi = {
  // Get main dashboard statistics
  // Request body: { dashboardId?: number, filters?: DashboardFiltersData }
  // Expected response: { success: boolean, data: DashboardStats }
  getStats: async (dashboardId?: number, filters?: any): Promise<DashboardStats> => {
    console.log('Calling /api/dashboard/stats/ with:', { dashboardId, filters });
    return apiCall<DashboardStats>('/dashboard/stats/', {
      method: 'POST',
      body: JSON.stringify({ 
        dashboardId, 
        filters: filters || {},
        dateRange: filters?.dateRange || '30d',
        platforms: filters?.platforms || [],
        sentiments: filters?.sentiments || [],
        keywords: filters?.keywords || [],
        minEngagement: filters?.minEngagement || 0,
        maxEngagement: filters?.maxEngagement || 10000
      })
    });
  },

  // Get mentions over time data for charts
  // Request body: { timeRange: string, dashboardId?: number, filters?: DashboardFiltersData }
  // Expected response: { success: boolean, data: MentionsOverTimeData[] }
  getMentionsOverTime: async (timeRange: string = '30d', dashboardId?: number, filters?: any): Promise<MentionsOverTimeResponse> => {
    console.log('Calling /api/dashboard/mentions-overtime/ with:', { timeRange, dashboardId, filters });
    return apiCall<MentionsOverTimeResponse>('/dashboard/mentions-overtime/', {
      method: 'POST',
      body: JSON.stringify({ 
        timeRange, 
        dashboardId,
        filters: filters || {},
        platforms: filters?.platforms || [],
        sentiments: filters?.sentiments || [],
        keywords: filters?.keywords || []
      })
    });
  },

  // Get sentiment analysis data
  // Request body: { dashboardId?: number, filters?: DashboardFiltersData }
  // Expected response: { success: boolean, data: SentimentAnalysis }
  getSentimentAnalysis: async (dashboardId?: number, filters?: any): Promise<SentimentAnalysis> => {
    console.log('Calling /api/dashboard/sentiment-analysis/ with:', { dashboardId, filters });
    return apiCall<SentimentAnalysis>('/dashboard/sentiment-analysis/', {
      method: 'POST',
      body: JSON.stringify({ 
        dashboardId, 
        filters: filters || {},
        dateRange: filters?.dateRange || '30d',
        platforms: filters?.platforms || [],
        keywords: filters?.keywords || []
      })
    });
  },

  // Get analytics data for performance charts
  // Request body: { timeRange: string, dashboardId?: number, filters?: DashboardFiltersData }
  // Expected response: { success: boolean, data: any }
  getAnalyticsData: async (timeRange: string = '6m', dashboardId?: number, filters?: any) => {
    console.log('Calling /api/dashboard/analytics/ with:', { timeRange, dashboardId, filters });
    return apiCall('/dashboard/analytics/', {
      method: 'POST',
      body: JSON.stringify({ 
        timeRange, 
        dashboardId,
        filters: filters || {},
        platforms: filters?.platforms || [],
        sentiments: filters?.sentiments || []
      })
    });
  },

  // Get predictive insights
  // Request body: { dashboardId?: number, analysisType?: string, filters?: DashboardFiltersData }
  // Expected response: { success: boolean, data: any }
  getPredictiveInsights: async (dashboardId?: number, filters?: any) => {
    console.log('Calling /api/dashboard/predictive-insights/ with:', { dashboardId, filters });
    return apiCall('/dashboard/predictive-insights/', {
      method: 'POST',
      body: JSON.stringify({ 
        dashboardId, 
        analysisType: 'trend_forecasting',
        filters: filters || {},
        dateRange: filters?.dateRange || '30d',
        platforms: filters?.platforms || []
      })
    });
  },
};

// Mentions APIs - Converted to POST
export const mentionsApi = {
  // Get mentions with filters and pagination
  // Request body: { page: number, pageSize: number, search?: string, platforms?: string[], sentiments?: string[], dateRange?: string, engagementLevel?: string, dashboardId?: number }
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
    return apiCall<PaginatedResponse<MentionData>>('/mentions/search/', {
      method: 'POST',
      body: JSON.stringify({
        page: params.page || 1,
        pageSize: params.pageSize || 20,
        search: params.search || '',
        platforms: params.platforms || [],
        sentiments: params.sentiments || [],
        dateRange: params.dateRange || '30d',
        engagementLevel: params.engagementLevel || 'all',
        dashboardId: params.dashboardId
      })
    });
  },

  // Get mention details by ID
  // Request body: { mentionId: number }
  getMentionById: async (id: number) => {
    return apiCall(`/mentions/get/`, {
      method: 'POST',
      body: JSON.stringify({ mentionId: id })
    });
  },
};

// Competitor Analysis APIs - Converted to POST
export const competitorApi = {
  // Get competitor analysis data
  // Request body: { dashboardId?: number, includeUserBrand?: boolean }
  getCompetitors: async (dashboardId?: number): Promise<CompetitorData[]> => {
    return apiCall<CompetitorData[]>('/competitors/list/', {
      method: 'POST',
      body: JSON.stringify({ dashboardId, includeUserBrand: true })
    });
  },

  // Add new competitor for tracking
  // Request body: { name: string, website?: string, dashboardId?: number }
  addCompetitor: async (competitorData: { name: string; website?: string; dashboardId?: number }) => {
    return apiCall('/competitors/add/', {
      method: 'POST',
      body: JSON.stringify(competitorData),
    });
  },

  // Remove competitor
  // Request body: { competitorId: number }
  removeCompetitor: async (competitorId: number) => {
    return apiCall('/competitors/remove/', {
      method: 'POST',
      body: JSON.stringify({ competitorId }),
    });
  },

  // Get competitor comparison data
  // Request body: { competitorIds: number[], timeRange?: string, metrics?: string[] }
  getCompetitorComparison: async (competitorIds: number[]) => {
    return apiCall('/competitors/compare/', {
      method: 'POST',
      body: JSON.stringify({ 
        competitorIds, 
        timeRange: '30d',
        metrics: ['mentions', 'sentiment', 'engagement', 'reach']
      })
    });
  },
};

// Social Listening APIs - Converted to POST
export const socialListeningApi = {
  // Get trending topics
  // Request body: { timeRange?: string, limit?: number, dashboardId?: number }
  getTrendingTopics: async (dashboardId?: number): Promise<TrendingTopic[]> => {
    return apiCall<TrendingTopic[]>('/social-listening/trending-topics/', {
      method: 'POST',
      body: JSON.stringify({ timeRange: '24h', limit: 10, dashboardId })
    });
  },

  // Get tracked keywords
  // Request body: { dashboardId?: number }
  getKeywords: async (dashboardId?: number) => {
    return apiCall('/social-listening/keywords/', {
      method: 'POST',
      body: JSON.stringify({ dashboardId })
    });
  },

  // Add new keyword for tracking
  // Request body: { keyword: string, alertThreshold?: string, dashboardId?: number }
  addKeyword: async (keywordData: { keyword: string; alertThreshold?: string; dashboardId?: number }) => {
    return apiCall('/social-listening/keywords/add/', {
      method: 'POST',
      body: JSON.stringify(keywordData),
    });
  },

  // Get alerts
  // Request body: { dashboardId?: number, status?: string }
  getAlerts: async (dashboardId?: number) => {
    return apiCall('/social-listening/alerts/', {
      method: 'POST',
      body: JSON.stringify({ dashboardId, status: 'active' })
    });
  },

  // Create new alert
  // Request body: { type: string, conditions: string, dashboardId?: number }
  createAlert: async (alertData: { type: string; conditions: string; dashboardId?: number }) => {
    return apiCall('/social-listening/alerts/create/', {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  },

  // Get real-time mentions data
  // Request body: { timeRange: string, dashboardId?: number }
  getRealTimeMentions: async (timeRange: string = '24h', dashboardId?: number) => {
    return apiCall('/social-listening/realtime-mentions/', {
      method: 'POST',
      body: JSON.stringify({ timeRange, dashboardId })
    });
  },

  // Get sentiment trend data
  // Request body: { timeRange: string, dashboardId?: number }
  getSentimentTrend: async (timeRange: string = '24h', dashboardId?: number) => {
    return apiCall('/social-listening/sentiment-trend/', {
      method: 'POST',
      body: JSON.stringify({ timeRange, dashboardId })
    });
  },
};

// Dashboards Management APIs - Converted to POST
export const dashboardsApi = {
  // Get all user dashboards
  // Request body: { userId?: string, includeStats?: boolean }
  getDashboards: async (): Promise<Dashboard[]> => {
    return apiCall<Dashboard[]>('/dashboards/list/', {
      method: 'POST',
      body: JSON.stringify({ includeStats: true })
    });
  },

  // Get single dashboard by ID
  // Request body: { dashboardId: number, includeStats?: boolean }
  getDashboard: async (id: number): Promise<Dashboard> => {
    return apiCall<Dashboard>('/dashboards/get/', {
      method: 'POST',
      body: JSON.stringify({ dashboardId: id, includeStats: true })
    });
  },

  // Create new dashboard
  // Request body: CreateDashboardPayload
  createDashboard: async (dashboardData: CreateDashboardPayload): Promise<Dashboard> => {
    return apiCall<Dashboard>('/dashboards/create/', {
      method: 'POST',
      body: JSON.stringify(dashboardData),
    });
  },

  // Update dashboard
  // Request body: { dashboardId: number, ...UpdateData }
  updateDashboard: async (id: number, dashboardData: Partial<CreateDashboardPayload>): Promise<Dashboard> => {
    return apiCall<Dashboard>('/dashboards/update/', {
      method: 'POST',
      body: JSON.stringify({ dashboardId: id, ...dashboardData }),
    });
  },

  // Delete dashboard
  // Request body: { dashboardId: number }
  deleteDashboard: async (id: number): Promise<void> => {
    return apiCall<void>('/dashboards/delete/', {
      method: 'POST',
      body: JSON.stringify({ dashboardId: id }),
    });
  },

  // Get dashboard comparison data
  // Request body: { dashboardIds: number[], timeRange?: string, metrics?: string[] }
  compareDashboards: async (dashboardIds: number[]) => {
    return apiCall('/dashboards/compare/', {
      method: 'POST',
      body: JSON.stringify({ 
        dashboardIds, 
        timeRange: '30d',
        metrics: ['mentions', 'sentiment', 'engagement', 'reach']
      })
    });
  },
};

// Analytics APIs - Updated with proper filtering
export const analyticsApi = {
  // Get audience reach data
  // Request body: { timeRange: string, dashboardId?: number, filters?: DashboardFiltersData }
  // Expected response: { success: boolean, data: { date: string, reach: number }[] }
  getAudienceReach: async (timeRange: string = '6m', dashboardId?: number, filters?: any) => {
    console.log('Calling /api/analytics/audience-reach/ with:', { timeRange, dashboardId, filters });
    return apiCall('/analytics/audience-reach/', {
      method: 'POST',
      body: JSON.stringify({ 
        timeRange, 
        dashboardId,
        filters: filters || {},
        platforms: filters?.platforms || [],
        keywords: filters?.keywords || []
      })
    });
  },

  // Get monthly mentions data
  // Request body: { timeRange: string, dashboardId?: number, filters?: DashboardFiltersData }
  // Expected response: { success: boolean, data: { month: string, mentions: number }[] }
  getMonthlyMentions: async (timeRange: string = '6m', dashboardId?: number, filters?: any) => {
    console.log('Calling /api/analytics/monthly-mentions/ with:', { timeRange, dashboardId, filters });
    return apiCall('/analytics/monthly-mentions/', {
      method: 'POST',
      body: JSON.stringify({ 
        timeRange, 
        dashboardId,
        filters: filters || {},
        platforms: filters?.platforms || [],
        sentiments: filters?.sentiments || [],
        keywords: filters?.keywords || []
      })
    });
  },

  // Get engagement metrics
  // Request body: { timeRange: string, dashboardId?: number, filters?: DashboardFiltersData }
  // Expected response: { success: boolean, data: { date: string, engagement: number, likes: number, shares: number, comments: number }[] }
  getEngagementMetrics: async (timeRange: string = '6m', dashboardId?: number, filters?: any) => {
    console.log('Calling /api/analytics/engagement/ with:', { timeRange, dashboardId, filters });
    return apiCall('/analytics/engagement/', {
      method: 'POST',
      body: JSON.stringify({ 
        timeRange, 
        dashboardId,
        filters: filters || {},
        platforms: filters?.platforms || [],
        minEngagement: filters?.minEngagement || 0,
        maxEngagement: filters?.maxEngagement || 10000
      })
    });
  },

  // Get platform performance
  // Request body: { dashboardId?: number, timeRange?: string, filters?: DashboardFiltersData }
  // Expected response: { success: boolean, data: { platform: string, mentions: number, engagement: number, reach: number }[] }
  getPlatformPerformance: async (dashboardId?: number, filters?: any) => {
    console.log('Calling /api/analytics/platform-performance/ with:', { dashboardId, filters });
    return apiCall('/analytics/platform-performance/', {
      method: 'POST',
      body: JSON.stringify({ 
        dashboardId, 
        timeRange: '30d',
        filters: filters || {},
        platforms: filters?.platforms || []
      })
    });
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
