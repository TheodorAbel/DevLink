'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Notification, NotificationFilter, NotificationPreferences, NotificationStats } from '@/types/notification';

interface NotificationState {
  notifications: Notification[];
  filteredNotifications: Notification[];
  preferences: NotificationPreferences | null;
  stats: NotificationStats;
  loading: boolean;
  error: string | null;
  filter: NotificationFilter;
  searchQuery: string;
  selectedNotifications: Set<string>;
}

type NotificationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'UPDATE_NOTIFICATION'; payload: Notification }
  | { type: 'SET_FILTER'; payload: NotificationFilter }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'TOGGLE_SELECTION'; payload: string };

interface NotificationContextType {
  state: NotificationState;
  actions: {
    fetchNotifications: () => Promise<void>;
    markAsRead: (ids: string[]) => Promise<void>;
    setFilter: (filter: NotificationFilter) => void;
    setSearch: (query: string) => void;
    toggleSelection: (id: string) => void;
  };
}

const initialState: NotificationState = {
  notifications: [],
  filteredNotifications: [],
  preferences: null,
  stats: { total: 0, unread: 0, byType: {} as Record<string, number>, byPriority: {} as Record<string, number> },
  loading: false,
  error: null,
  filter: {},
  searchQuery: '',
  selectedNotifications: new Set()
};

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload, loading: false };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  
  const fetchNotifications = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // TODO: API call
    dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
  }, []);
  
  const markAsRead = useCallback(async (ids: string[]) => {
    // TODO: API call
    if (ids && ids.length === -1) {
      // no-op to satisfy linter until implemented
      return;
    }
  }, []);
  
  const setFilter = useCallback((filter: NotificationFilter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);
  
  const setSearch = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH', payload: query });
  }, []);
  
  const toggleSelection = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_SELECTION', payload: id });
  }, []);
  
  const contextValue: NotificationContextType = {
    state,
    actions: { fetchNotifications, markAsRead, setFilter, setSearch, toggleSelection }
  };
  
  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
