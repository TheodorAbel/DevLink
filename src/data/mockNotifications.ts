// Comprehensive mock data for SaaS notification system

import { Notification, NotificationPreferences } from '@/types/notification';

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Job Application Received',
    message: 'Sarah Johnson has applied for the Senior Frontend Developer position at TechCorp. Review her application and schedule an interview.',
    type: 'application_status',
    priority: 'high',
    status: 'unread',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    userId: 'user-1',
    organizationId: 'org-1',
    actionUrl: '/applications/app-123',
    metadata: {
      applicantId: 'applicant-123',
      jobId: 'job-456',
      applicationId: 'app-123'
    }
  },
  {
    id: '2',
    title: 'System Maintenance Scheduled',
    message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM EST. Some features may be temporarily unavailable during this time.',
    type: 'system_alert',
    priority: 'medium',
    status: 'unread',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    userId: 'user-1',
    organizationId: 'org-1',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
    metadata: {
      maintenanceType: 'scheduled',
      affectedServices: ['notifications', 'messaging']
    }
  },
  {
    id: '3',
    title: 'Job Alert: 5 New Matches',
    message: 'We found 5 new job opportunities that match your saved search criteria for "React Developer in San Francisco".',
    type: 'job_update',
    priority: 'medium',
    status: 'read',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // Read 3 hours ago
    userId: 'user-1',
    organizationId: 'org-1',
    actionUrl: '/jobs?alert=react-sf',
    groupId: 'job-alerts-react-sf',
    metadata: {
      searchId: 'search-789',
      matchCount: 5,
      newJobs: ['job-101', 'job-102', 'job-103', 'job-104', 'job-105']
    }
  },
  {
    id: '4',
    title: 'Security Alert: New Login Detected',
    message: 'A new login to your account was detected from Chrome on Windows in New York, NY. If this wasn\'t you, please secure your account immediately.',
    type: 'security',
    priority: 'critical',
    status: 'unread',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    userId: 'user-1',
    organizationId: 'org-1',
    actionUrl: '/security/sessions',
    metadata: {
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome/120.0.0.0',
      location: 'New York, NY',
      deviceType: 'desktop'
    }
  },
  {
    id: '5',
    title: 'Payment Successful',
    message: 'Your monthly subscription payment of $29.99 has been processed successfully. Your premium features remain active.',
    type: 'billing',
    priority: 'low',
    status: 'read',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // Read 20 hours ago
    userId: 'user-1',
    organizationId: 'org-1',
    actionUrl: '/billing/invoices',
    metadata: {
      amount: 29.99,
      currency: 'USD',
      invoiceId: 'inv-2024-001',
      paymentMethod: 'card-ending-4242'
    }
  },
  {
    id: '6',
    title: 'New Message from Recruiter',
    message: 'Emily Chen from Google has sent you a message regarding the Staff Software Engineer position. Check your inbox for details.',
    type: 'message',
    priority: 'high',
    status: 'unread',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    userId: 'user-1',
    organizationId: 'org-1',
    actionUrl: '/messages/msg-456',
    metadata: {
      senderId: 'recruiter-456',
      senderName: 'Emily Chen',
      senderCompany: 'Google',
      messageId: 'msg-456',
      jobId: 'job-google-staff'
    }
  },
  {
    id: '7',
    title: 'Application Status Update',
    message: 'Your application for UX Designer at Spotify has moved to the interview stage. The hiring team will contact you within 2 business days.',
    type: 'application_status',
    priority: 'high',
    status: 'read',
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    updatedAt: new Date(Date.now() - 16 * 60 * 60 * 1000), // Read 16 hours ago
    userId: 'user-1',
    organizationId: 'org-1',
    actionUrl: '/applications/my-applications',
    metadata: {
      applicationId: 'app-spotify-ux',
      jobId: 'job-spotify-ux',
      company: 'Spotify',
      newStatus: 'interview',
      previousStatus: 'under_review'
    }
  },
  {
    id: '8',
    title: 'New Feature: AI Resume Builder',
    message: 'Introducing our new AI-powered resume builder! Create professional resumes tailored to specific job requirements in minutes.',
    type: 'feature_update',
    priority: 'low',
    status: 'unread',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
    updatedAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
    userId: 'user-1',
    organizationId: 'org-1',
    actionUrl: '/tools/resume-builder',
    metadata: {
      featureName: 'AI Resume Builder',
      version: '2.1.0',
      category: 'productivity'
    }
  },
  {
    id: '9',
    title: 'Weekly Job Market Report',
    message: 'Your personalized job market report is ready! This week: 127 new jobs in your field, average salary increased by 3.2%.',
    type: 'job_update',
    priority: 'low',
    status: 'read',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 40 * 60 * 60 * 1000), // Read 40 hours ago
    userId: 'user-1',
    organizationId: 'org-1',
    actionUrl: '/reports/weekly',
    groupId: 'weekly-reports',
    metadata: {
      reportType: 'weekly',
      newJobs: 127,
      salaryTrend: 3.2,
      topCompanies: ['Google', 'Apple', 'Microsoft']
    }
  },
  {
    id: '10',
    title: 'Profile Views Increased',
    message: 'Great news! Your profile was viewed 23 times this week by recruiters from top companies. Keep your profile updated to attract more opportunities.',
    type: 'job_update',
    priority: 'low',
    status: 'unread',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    userId: 'user-1',
    organizationId: 'org-1',
    actionUrl: '/profile/analytics',
    metadata: {
      viewCount: 23,
      period: 'week',
      topViewers: ['Google', 'Meta', 'Netflix']
    }
  }
];

export const mockPreferences: NotificationPreferences = {
  userId: 'user-1',
  organizationId: 'org-1',
  categories: {
    job_update: {
      enabled: true,
      inApp: true,
      email: true,
      push: false
    },
    application_status: {
      enabled: true,
      inApp: true,
      email: true,
      push: true
    },
    system_alert: {
      enabled: true,
      inApp: true,
      email: false,
      push: false
    },
    message: {
      enabled: true,
      inApp: true,
      email: true,
      push: true
    },
    security: {
      enabled: true,
      inApp: true,
      email: true,
      push: true
    },
    billing: {
      enabled: true,
      inApp: true,
      email: true,
      push: false
    },
    feature_update: {
      enabled: true,
      inApp: true,
      email: false,
      push: false
    }
  },
  globalSettings: {
    doNotDisturb: false,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    groupSimilar: true,
    maxDailyEmails: 5
  }
};

// Helper function to generate relative time strings
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}

// Helper function to get notification icon
export function getNotificationIcon(type: string): string {
  const iconMap: Record<string, string> = {
    job_update: '💼',
    application_status: '📋',
    system_alert: '⚙️',
    message: '💬',
    security: '🔒',
    billing: '💳',
    feature_update: '✨'
  };
  
  return iconMap[type] || '📢';
}

// Helper function to get priority color
export function getPriorityColor(priority: string): string {
  const colorMap: Record<string, string> = {
    low: 'text-gray-500',
    medium: 'text-blue-500',
    high: 'text-orange-500',
    critical: 'text-red-500'
  };
  
  return colorMap[priority] || 'text-gray-500';
}
