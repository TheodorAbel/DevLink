import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

// GET /api/conversations
// Returns conversations for the authenticated user ordered by last_message_at desc
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const accessToken = authHeader.split(' ')[1] || ''
    const supabase = createSupabaseServerClient(accessToken)

    const { data: user } = await supabase.auth.getUser()
    if (!user?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('conversations')
      .select('id, participant_1_id, participant_2_id, job_id, application_id, last_message_at')
      .or('participant_1_id.eq.' + user.user.id + ',participant_2_id.eq.' + user.user.id)
      .order('last_message_at', { ascending: false, nullsFirst: true })

    if (error) return NextResponse.json({ error: 'Failed to load conversations' }, { status: 500 })

    return NextResponse.json({ conversations: data ?? [] }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// POST /api/conversations
// Body: { participantId: string, jobId?: string, applicationId?: string }
// Ensures a conversation exists between auth user and participant (optionally scoped by job/application)
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const accessToken = authHeader.split(' ')[1] || ''
    const supabase = createSupabaseServerClient(accessToken)

    const { data: user } = await supabase.auth.getUser()
    if (!user?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => null) as { participantId?: string; jobId?: string; applicationId?: string } | null
    if (!body?.participantId) return NextResponse.json({ error: 'participantId is required' }, { status: 400 })
    if (body.participantId === user.user.id) return NextResponse.json({ error: 'Cannot start conversation with yourself' }, { status: 400 })

    const p1 = user.user.id
    const p2 = body.participantId

    // Try find existing conversation matching participants and optional scopes
    const { data: existing, error: findErr } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant_1_id.eq.${p1},participant_2_id.eq.${p2}),and(participant_1_id.eq.${p2},participant_2_id.eq.${p1})`)
      .match({ job_id: body.jobId ?? null, application_id: body.applicationId ?? null })
      .limit(1)

    if (findErr) return NextResponse.json({ error: 'Failed to find conversation' }, { status: 500 })

    if (existing && existing.length > 0) {
      return NextResponse.json({ id: existing[0].id }, { status: 200 })
    }

    // Create conversation
    const { data: created, error: createErr } = await supabase
      .from('conversations')
      .insert({
        participant_1_id: p1,
        participant_2_id: p2,
        job_id: body.jobId ?? null,
        application_id: body.applicationId ?? null,
        last_message_at: null,
      })
      .select('id')
      .single()

    if (createErr || !created) return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })

    return NextResponse.json({ id: created.id }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
