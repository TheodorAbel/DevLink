// Core notification types for SaaS-grade notification system

export type NotificationType = 
  | 'job_update' 
  | 'application_status' 
  | 'system_alert' 
  | 'message' 
  | 'security' 
  | 'billing' 
  | 'feature_update';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export type NotificationStatus = 'unread' | 'read' | 'archived';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  organizationId?: string; // Multi-tenant support
  metadata?: Record<string, unknown>; // Extensible data
  actionUrl?: string; // Deep linking
  groupId?: string; // For notification grouping
  expiresAt?: Date; // Auto-cleanup
}

export interface NotificationGroup {
  id: string;
  type: NotificationType;
  count: number;
  latestNotification: Notification;
  notifications: Notification[];
}

export interface NotificationPreferences {
  userId: string;
  organizationId?: string;
  categories: {
    [K in NotificationType]: {
      enabled: boolean;
      inApp: boolean;
      email: boolean;
      push: boolean;
    };
  };
  globalSettings: {
    doNotDisturb: boolean;
    quietHours: {
      enabled: boolean;
      start: string; // HH:mm format
      end: string;
    };
    groupSimilar: boolean;
    maxDailyEmails: number;
  };
}

export interface NotificationFilter {
  status?: NotificationStatus[];
  types?: NotificationType[];
  priority?: NotificationPriority[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
}

// API Response types
export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  stats: NotificationStats;
}

export interface NotificationActionResponse {
  success: boolean;
  message: string;
  updatedNotification?: Notification;
}

// Real-time event types
export interface NotificationEvent {
  type: 'notification_created' | 'notification_updated' | 'notification_deleted';
  notification: Notification;
  userId: string;
  organizationId?: string;
}

// Analytics types
export interface NotificationEngagement {
  notificationId: string;
  userId: string;
  action: 'viewed' | 'clicked' | 'dismissed' | 'archived';
  timestamp: Date;
  metadata?: Record<string, unknown>;
}
