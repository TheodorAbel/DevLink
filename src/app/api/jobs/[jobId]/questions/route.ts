import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { createClient } from '@supabase/supabase-js'

// GET /api/jobs/[jobId]/questions
// Returns exact screening questions configured for a job, ordered by display_order
export async function GET(_req: NextRequest, ctx: { params: Promise<{ jobId: string }> }) {
  try {
    const { jobId } = await ctx.params
    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 })
    }

    // Prefer user-bound auth if available, but allow public read if RLS permits
    const authHeader = _req.headers.get('authorization') || _req.headers.get('Authorization')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = authHeader?.startsWith('Bearer ')
      ? createSupabaseServerClient(authHeader.split(' ')[1] || '')
      : createClient(supabaseUrl, anon, { auth: { persistSession: false, autoRefreshToken: false } })

    // Ensure job exists (optional)
    const { data: job, error: jobErr } = await supabase
      .from('jobs')
      .select('id')
      .eq('id', jobId)
      .single()

    if (jobErr || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    const { data: questions, error } = await supabase
      .from('screening_questions')
      .select('id, question_text, question_type, options, is_required, auto_filter, expected_answer, display_order')
      .eq('job_id', jobId)
      .order('display_order', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
    }

    return NextResponse.json({ questions: questions ?? [] }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
