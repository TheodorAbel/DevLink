import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

// GET /api/messages/[conversationId]
// Returns messages for a conversation, newest last
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const accessToken = authHeader.split(' ')[1] || ''
    const supabase = createSupabaseServerClient(accessToken)

    const { data: user } = await supabase.auth.getUser()
    if (!user?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const url = new URL(req.url)
    const segments = url.pathname.split('/').filter(Boolean)
    const conversationId = segments[segments.length - 1] || ''
    if (!conversationId) return NextResponse.json({ error: 'conversationId is required' }, { status: 400 })

    // Verify user has access to this conversation via RLS by selecting from conversations
    const { data: convo, error: convoErr } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .single()

    if (convoErr || !convo) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })

    const { data: messages, error } = await supabase
      .from('messages')
      .select('id, conversation_id, sender_user_id, content, created_at, read_by_recipient')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 })

    return NextResponse.json({ messages: messages ?? [] }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// POST /api/messages/[conversationId]
// Body: { content: string }
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const accessToken = authHeader.split(' ')[1] || ''
    const supabase = createSupabaseServerClient(accessToken)

    const { data: user } = await supabase.auth.getUser()
    if (!user?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const url = new URL(req.url)
    const segments = url.pathname.split('/').filter(Boolean)
    const conversationId = segments[segments.length - 1] || ''
    if (!conversationId) return NextResponse.json({ error: 'conversationId is required' }, { status: 400 })

    const body = await req.json().catch(() => null) as { content?: string } | null
    if (!body?.content || !body.content.trim()) return NextResponse.json({ error: 'content is required' }, { status: 400 })

    // Insert message (RLS 'Users can send messages in own conversations' must allow this)
    const { data: inserted, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_user_id: user.user.id,
        content: body.content.trim(),
      })
      .select('id, created_at')
      .single()

    if (error || !inserted) return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })

    // Update last_message_at on conversation (best-effort)
    try {
      await supabase
        .from('conversations')
        .update({ last_message_at: inserted.created_at })
        .eq('id', conversationId)
    } catch {
      // ignore
    }

    return NextResponse.json({ id: inserted.id, created_at: inserted.created_at }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
