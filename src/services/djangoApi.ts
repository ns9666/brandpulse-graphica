
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

// Dashboard APIs
export const dashboardApi = {
  // Get main dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    return apiCall<DashboardStats>('/dashboard/stats/');
  },

  // Get mentions over time data for charts
  getMentionsOverTime: async (timeRange: string = '30d') => {
    return apiCall(`/dashboard/mentions-overtime/?range=${timeRange}`);
  },

  // Get sentiment analysis data
  getSentimentAnalysis: async (): Promise<SentimentAnalysis> => {
    return apiCall<SentimentAnalysis>('/dashboard/sentiment-analysis/');
  },

  // Get analytics data for performance charts
  getAnalyticsData: async (timeRange: string = '6m') => {
    return apiCall(`/dashboard/analytics/?range=${timeRange}`);
  },

  // Get predictive insights
  getPredictiveInsights: async () => {
    return apiCall('/dashboard/predictive-insights/');
  },
};

// Mentions APIs
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
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });
    
    return apiCall(`/mentions/?${queryParams.toString()}`);
  },

  // Get mention details by ID
  getMentionById: async (id: number) => {
    return apiCall(`/mentions/${id}/`);
  },
};

// Competitor Analysis APIs
export const competitorApi = {
  // Get competitor analysis data
  getCompetitors: async (): Promise<CompetitorData[]> => {
    return apiCall<CompetitorData[]>('/competitors/');
  },

  // Add new competitor for tracking
  addCompetitor: async (competitorData: { name: string; website?: string }) => {
    return apiCall('/competitors/', {
      method: 'POST',
      body: JSON.stringify(competitorData),
    });
  },

  // Remove competitor
  removeCompetitor: async (competitorId: number) => {
    return apiCall(`/competitors/${competitorId}/`, {
      method: 'DELETE',
    });
  },

  // Get competitor comparison data
  getCompetitorComparison: async (competitorIds: number[]) => {
    const params = competitorIds.map(id => `ids=${id}`).join('&');
    return apiCall(`/competitors/compare/?${params}`);
  },
};

// Social Listening APIs
export const socialListeningApi = {
  // Get trending topics
  getTrendingTopics: async (): Promise<TrendingTopic[]> => {
    return apiCall<TrendingTopic[]>('/social-listening/trending-topics/');
  },

  // Get tracked keywords
  getKeywords: async () => {
    return apiCall('/social-listening/keywords/');
  },

  // Add new keyword for tracking
  addKeyword: async (keywordData: { keyword: string; alertThreshold?: string }) => {
    return apiCall('/social-listening/keywords/', {
      method: 'POST',
      body: JSON.stringify(keywordData),
    });
  },

  // Get alerts
  getAlerts: async () => {
    return apiCall('/social-listening/alerts/');
  },

  // Create new alert
  createAlert: async (alertData: { type: string; conditions: string }) => {
    return apiCall('/social-listening/alerts/', {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  },

  // Get real-time mentions data
  getRealTimeMentions: async (timeRange: string = '24h') => {
    return apiCall(`/social-listening/realtime-mentions/?range=${timeRange}`);
  },

  // Get sentiment trend data
  getSentimentTrend: async (timeRange: string = '24h') => {
    return apiCall(`/social-listening/sentiment-trend/?range=${timeRange}`);
  },
};

// Dashboards Management APIs
export const dashboardsApi = {
  // Get all user dashboards
  getDashboards: async () => {
    return apiCall('/dashboards/');
  },

  // Create new dashboard
  createDashboard: async (dashboardData: { name: string; description?: string; widgets: any[] }) => {
    return apiCall('/dashboards/', {
      method: 'POST',
      body: JSON.stringify(dashboardData),
    });
  },

  // Update dashboard
  updateDashboard: async (id: number, dashboardData: any) => {
    return apiCall(`/dashboards/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(dashboardData),
    });
  },

  // Delete dashboard
  deleteDashboard: async (id: number) => {
    return apiCall(`/dashboards/${id}/`, {
      method: 'DELETE',
    });
  },

  // Get dashboard comparison data
  compareDashboards: async (dashboardIds: number[]) => {
    const params = dashboardIds.map(id => `ids=${id}`).join('&');
    return apiCall(`/dashboards/compare/?${params}`);
  },
};

// Analytics APIs
export const analyticsApi = {
  // Get audience reach data
  getAudienceReach: async (timeRange: string = '6m') => {
    return apiCall(`/analytics/audience-reach/?range=${timeRange}`);
  },

  // Get monthly mentions data
  getMonthlyMentions: async (timeRange: string = '6m') => {
    return apiCall(`/analytics/monthly-mentions/?range=${timeRange}`);
  },

  // Get engagement metrics
  getEngagementMetrics: async (timeRange: string = '6m') => {
    return apiCall(`/analytics/engagement/?range=${timeRange}`);
  },

  // Get platform performance
  getPlatformPerformance: async () => {
    return apiCall('/analytics/platform-performance/');
  },
};

export default {
  dashboard: dashboardApi,
  mentions: mentionsApi,
  competitors: competitorApi,
  socialListening: socialListeningApi,
  dashboards: dashboardsApi,
  analytics: analyticsApi,
};
