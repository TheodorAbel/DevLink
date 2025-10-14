import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body: string;
  status: 'read' | 'unread';
  priority?: 'low' | 'normal' | 'high';
  created_at: string;
};

export type NotificationFilter = {
  status?: Array<'read' | 'unread'>;
  types?: string[];
  priority?: Array<'low' | 'normal' | 'high'>;
  search?: string;
};

export type NotificationPreferences = {
  email_enabled: boolean;
  push_enabled: boolean;
  subscribed_types?: string[];
};

async function authHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Not authenticated');
  return { Authorization: `Bearer ${token}` } as const;
}

export function useNotifications(params: { page?: number; limit?: number; filter?: NotificationFilter } = {}) {
  const { page = 1, limit = 20, filter } = params;
  return useQuery({
    queryKey: ['notifications', { page, limit, filter }],
    queryFn: async (): Promise<{ items: NotificationItem[]; total: number; page: number; limit: number }> => {
      const headers = await authHeader();
      const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (filter?.status?.length) qs.set('status', filter.status.join(','));
      if (filter?.types?.length) qs.set('types', filter.types.join(','));
      if (filter?.priority?.length) qs.set('priority', filter.priority.join(','));
      if (filter?.search) qs.set('search', filter.search);
      const res = await fetch(`/api/notifications?${qs.toString()}`, { headers });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return res.json();
    },
    staleTime: 30_000,
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ['notificationPreferences'],
    queryFn: async (): Promise<NotificationPreferences> => {
      const headers = await authHeader();
      const res = await fetch('/api/notifications/preferences', { headers });
      if (!res.ok) throw new Error('Failed to fetch preferences');
      return res.json();
    },
    staleTime: 60_000,
  });
}

export function useUpdateNotificationPreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (prefs: Partial<NotificationPreferences>) => {
      const headers = await authHeader();
      const res = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(prefs),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || 'Failed to update preferences');
      }
      return true as const;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['notificationPreferences'] });
    },
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notificationIds: string[]) => {
      const headers = await authHeader();
      const res = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ notificationIds }),
      });
      if (!res.ok) throw new Error('Failed to mark read');
      return true as const;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkUnread() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notificationIds: string[]) => {
      const headers = await authHeader();
      const res = await fetch('/api/notifications/mark-unread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ notificationIds }),
      });
      if (!res.ok) throw new Error('Failed to mark unread');
      return true as const;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useDeleteNotifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notificationIds: string[]) => {
      const headers = await authHeader();
      const res = await fetch('/api/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ notificationIds }),
      });
      if (!res.ok) throw new Error('Failed to delete notifications');
      return true as const;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
