import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

async function getAuthHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Not authenticated');
  return { Authorization: `Bearer ${token}` } as const;
}

export type ConversationBrief = {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  job_id: string | null;
  application_id: string | null;
  last_message_at: string | null;
};

export type MessageRow = {
  id: string;
  conversation_id: string;
  sender_user_id: string;
  content: string;
  created_at: string;
  read_by_recipient: boolean | null;
};

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async (): Promise<ConversationBrief[]> => {
      const headers = await getAuthHeader();
      const res = await fetch('/api/conversations', { headers });
      if (!res.ok) throw new Error('Failed to load conversations');
      const json = await res.json();
      return (json.conversations || []) as ConversationBrief[];
    },
  });
}

export function useMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: ['messages', conversationId],
    enabled: !!conversationId,
    queryFn: async (): Promise<MessageRow[]> => {
      const headers = await getAuthHeader();
      const res = await fetch(`/api/messages/${conversationId}`, { headers });
      if (!res.ok) throw new Error('Failed to load messages');
      const json = await res.json();
      return (json.messages || []) as MessageRow[];
    },
    refetchInterval: 5000,
  });
}

export function useEnsureConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { participantId: string; jobId?: string; applicationId?: string }) => {
      const headers = await getAuthHeader();
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(args),
      });
      if (!res.ok) throw new Error('Failed to create conversation');
      return res.json() as Promise<{ id: string }>
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
}

export function useSendMessageMutation(conversationId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      if (!conversationId) throw new Error('No conversation');
      const headers = await getAuthHeader();
      const res = await fetch(`/api/messages/${conversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      return res.json() as Promise<{ id: string; created_at: string }>
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['messages', conversationId] });
      await qc.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
