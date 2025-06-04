
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, TrendingUp, MessageSquare, Users, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboard } from '@/contexts/DashboardContext';

interface Notification {
  id: number;
  type: 'alert' | 'mention' | 'trend' | 'engagement' | 'system';
  title: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  read: boolean;
  actionRequired?: boolean;
}

const Notifications = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const { currentDashboard } = useDashboard();

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'alert',
      title: 'High Volume Alert',
      message: 'Brand mentions increased by 150% in the last hour. Possible viral content detected.',
      timestamp: '2 minutes ago',
      severity: 'high',
      read: false,
      actionRequired: true
    },
    {
      id: 2,
      type: 'mention',
      title: 'New Mention on Twitter',
      message: 'Your brand was mentioned by @influencer_user with 50K followers.',
      timestamp: '15 minutes ago',
      severity: 'medium',
      read: false
    },
    {
      id: 3,
      type: 'trend',
      title: 'Sentiment Trend Change',
      message: 'Positive sentiment increased by 12% compared to last week.',
      timestamp: '1 hour ago',
      severity: 'low',
      read: true
    },
    {
      id: 4,
      type: 'engagement',
      title: 'Engagement Milestone',
      message: 'Total engagement reached 10K interactions this month!',
      timestamp: '2 hours ago',
      severity: 'medium',
      read: true
    },
    {
      id: 5,
      type: 'system',
      title: 'Weekly Report Ready',
      message: 'Your weekly brand monitoring report is ready for download.',
      timestamp: '1 day ago',
      severity: 'low',
      read: false
    },
    {
      id: 6,
      type: 'alert',
      title: 'Negative Sentiment Spike',
      message: 'Detected unusual negative sentiment pattern. Review required.',
      timestamp: '2 days ago',
      severity: 'high',
      read: true,
      actionRequired: true
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return AlertTriangle;
      case 'mention':
        return MessageSquare;
      case 'trend':
        return TrendingUp;
      case 'engagement':
        return Users;
      case 'system':
        return Bell;
      default:
        return Bell;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <DashboardNavbar />
      
      <main className="container pt-32 pb-16">
        <DashboardHeader 
          title="Notifications" 
          description={`Stay updated with alerts and mentions for ${currentDashboard?.name || 'your dashboard'}`}
          action={
            <div className="flex gap-2">
              <Badge variant="secondary">
                {unreadCount} unread
              </Badge>
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            </div>
          }
        />

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground text-center">
                  You're all caught up! New notifications will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              return (
                <Card key={notification.id} className={cn(
                  "transition-all hover:shadow-md",
                  !notification.read && "border-l-4 border-l-brand-blue bg-blue-50/50 dark:bg-blue-900/10"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "p-2 rounded-full",
                        getSeverityColor(notification.severity)
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          {notification.actionRequired && (
                            <Badge variant="destructive" className="text-xs">
                              Action Required
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs capitalize">
                            {notification.type}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {notification.timestamp}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-6 px-2 text-xs"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Mark as read
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;
