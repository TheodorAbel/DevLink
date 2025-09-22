// SaaS-grade notification service with real-time integration hooks

import { 
  NotificationResponse, 
  NotificationActionResponse, 
  NotificationPreferences,
  NotificationFilter,
  NotificationEvent
} from '@/types/notification';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

type EventCallback = (data: unknown) => void;

class NotificationService {
  private wsConnection: WebSocket | null = null;
  private eventListeners: Map<string, EventCallback[]> = new Map();
  
  // Core CRUD Operations
  async fetchNotifications(
    page: number = 1, 
    limit: number = 20, 
    filter?: NotificationFilter
  ): Promise<NotificationResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filter?.status && { status: filter.status.join(',') }),
        ...(filter?.types && { types: filter.types.join(',') }),
        ...(filter?.priority && { priority: filter.priority.join(',') }),
        ...(filter?.search && { search: filter.search })
      });
      
      const response = await fetch(`${API_BASE_URL}/notifications?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return await response.json();
    } catch (error) {
      console.error('Fetch notifications error:', error);
      throw error;
    }
  }
  
  async markAsRead(notificationIds: string[]): Promise<NotificationActionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/mark-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationIds })
      });
      
      if (!response.ok) throw new Error('Failed to mark as read');
      return await response.json();
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  }
  
  async markAsUnread(notificationIds: string[]): Promise<NotificationActionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/mark-unread`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationIds })
      });
      
      if (!response.ok) throw new Error('Failed to mark as unread');
      return await response.json();
    } catch (error) {
      console.error('Mark as unread error:', error);
      throw error;
    }
  }
  
  async deleteNotifications(notificationIds: string[]): Promise<NotificationActionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationIds })
      });
      
      if (!response.ok) throw new Error('Failed to delete notifications');
      return await response.json();
    } catch (error) {
      console.error('Delete notifications error:', error);
      throw error;
    }
  }
  
  // Preferences Management
  async getPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/preferences`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch preferences');
      return await response.json();
    } catch (error) {
      console.error('Get preferences error:', error);
      throw error;
    }
  }
  
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationActionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/preferences`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      });
      
      if (!response.ok) throw new Error('Failed to update preferences');
      return await response.json();
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  }
  
  // Real-time Integration
  connectWebSocket(userId: string, organizationId?: string): void {
    if (this.wsConnection?.readyState === WebSocket.OPEN) return;
    
    const wsUrl = `${WS_URL}/notifications?userId=${userId}${organizationId ? `&orgId=${organizationId}` : ''}`;
    this.wsConnection = new WebSocket(wsUrl);
    
    this.wsConnection.onopen = () => {
      console.log('Notification WebSocket connected');
      this.emit('connected', null);
    };
    
    this.wsConnection.onmessage = (event) => {
      try {
        const data: NotificationEvent = JSON.parse(event.data);
        this.emit('notification_event', data);
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };
    
    this.wsConnection.onclose = () => {
      console.log('Notification WebSocket disconnected');
      this.emit('disconnected', null);
      // Auto-reconnect after 5 seconds
      setTimeout(() => this.connectWebSocket(userId, organizationId), 5000);
    };
    
    this.wsConnection.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };
  }
  
  disconnectWebSocket(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }
  
  // Event Management
  on(event: string, callback: EventCallback): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }
  
  off(event: string, callback: EventCallback): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) listeners.splice(index, 1);
    }
  }
  
  private emit(event: string, data: unknown): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }
  
  // Analytics Integration
  async trackEngagement(notificationId: string, action: string, metadata?: unknown): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/notifications/analytics`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notificationId,
          action,
          metadata,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Track engagement error:', error);
      // Don't throw - analytics shouldn't break the app
    }
  }
  
  // Utility Methods
  private getAuthToken(): string {
    // TODO: Implement actual token retrieval
    return localStorage.getItem('auth_token') || '';
  }
  
  // Firebase Integration Hook (alternative to WebSocket)
  initializeFirebase(_config: unknown): void {
    void _config;
    // TODO: Firebase initialization
    // import { initializeApp } from 'firebase/app';
    // import { getMessaging, onMessage } from 'firebase/messaging';
  }
  
  // SignalR Integration Hook (for .NET backends)
  initializeSignalR(_hubUrl: string): void {
    void _hubUrl;
    // TODO: SignalR initialization
    // import * as signalR from '@microsoft/signalr';
  }
}

// Singleton instance
export const notificationService = new NotificationService();

// React Hook for service integration
export function useNotificationService() {
  return notificationService;
}
