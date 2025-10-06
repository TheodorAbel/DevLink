import { supabase } from '@/lib/supabaseClient'

async function getAuthHeader() {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('Not authenticated')
  return { Authorization: `Bearer ${token}` }
}

export type ConversationBrief = {
  id: string
  participant_1_id: string
  participant_2_id: string
  job_id: string | null
  application_id: string | null
  last_message_at: string | null
}

export async function getConversations(): Promise<ConversationBrief[]> {
  const headers = await getAuthHeader()
  const res = await fetch('/api/conversations', { headers })
  if (!res.ok) throw new Error('Failed to load conversations')
  const json = await res.json()
  return (json.conversations || []) as ConversationBrief[]
}

export async function ensureConversation(args: { participantId: string; jobId?: string; applicationId?: string }): Promise<string> {
  const headers = await getAuthHeader()
  const res = await fetch('/api/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(args),
  })
  if (!res.ok) throw new Error('Failed to create conversation')
  const json = await res.json()
  return json.id as string
}

export type MessageRow = {
  id: string
  conversation_id: string
  sender_user_id: string
  content: string
  created_at: string
  read_by_recipient: boolean | null
}

export async function getMessages(conversationId: string): Promise<MessageRow[]> {
  const headers = await getAuthHeader()
  const res = await fetch(`/api/messages/${conversationId}`, { headers })
  if (!res.ok) throw new Error('Failed to load messages')
  const json = await res.json()
  return (json.messages || []) as MessageRow[]
}

export async function sendMessage(conversationId: string, content: string): Promise<{ id: string; created_at: string }> {
  const headers = await getAuthHeader()
  const res = await fetch(`/api/messages/${conversationId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ content }),
  })
  if (!res.ok) throw new Error('Failed to send message')
  return res.json()
}
