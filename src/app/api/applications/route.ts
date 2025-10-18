import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import type { PostgrestError } from '@supabase/supabase-js'

// POST /api/applications
// Body: {
//   jobId: string,
//   coverLetter?: string,
//   resumeUrl?: string,
//   portfolioUrl?: string,
//   answers: Array<{ questionId: string; answerText?: string; selectedOptions?: string[] }>
// }

// GET /api/applications?jobId=UUID
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const accessToken = authHeader.split(' ')[1] || ''
    const supabase = createSupabaseServerClient(accessToken)

    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get('jobId') || ''
    const limitParam = Number(searchParams.get('limit') || '')
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 20

    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userData?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const seekerUserId = userData.user.id

    if (!jobId) {
      // Single round-trip: include job title/location and company name
      const { data: list, error: listErr } = await supabase
        .from('applications')
        .select(`
          id,
          job_id,
          status,
          created_at,
          jobs:job_id (
            id,
            title,
            location,
            companies:company_id ( company_name )
          )
        `)
        .eq('seeker_user_id', seekerUserId)
        .order('created_at', { ascending: false })
        .range(0, limit - 1)

      if (listErr) return NextResponse.json({ error: 'Failed to load applications' }, { status: 500 })
      return NextResponse.json({ applications: list || [] })
    } else {
      const { data: app, error: appErr } = await supabase
        .from('applications')
        .select('id, cover_letter, resume_url, portfolio_url, status, created_at')
        .eq('job_id', jobId)
        .eq('seeker_user_id', seekerUserId)
        .maybeSingle()

      if (appErr || !app) return NextResponse.json({}, { status: 200 })

      const { data: answers, error: ansErr } = await supabase
        .from('application_screening_answers')
        .select('screening_question_id, answer_text, selected_options')
        .eq('application_id', app.id)

      if (ansErr) return NextResponse.json({ error: 'Failed to load answers' }, { status: 500 })

      return NextResponse.json({
        id: app.id,
        coverLetter: app.cover_letter,
        resumeUrl: app.resume_url,
        portfolioUrl: app.portfolio_url,
        status: app.status,
        created_at: app.created_at,
        answers: (answers || []).map(a => ({
          questionId: a.screening_question_id,
          answerText: a.answer_text || undefined,
          selectedOptions: a.selected_options || undefined,
        })),
      })
    }
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// PUT /api/applications
export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const accessToken = authHeader.split(' ')[1] || ''
    const supabase = createSupabaseServerClient(accessToken)

    const body = await req.json().catch(() => null) as {
      jobId?: string
      coverLetter?: string
      resumeUrl?: string
      portfolioUrl?: string
      answers?: Array<{ questionId?: string; answerText?: string; selectedOptions?: string[] }>
    } | null
    if (!body?.jobId) return NextResponse.json({ error: 'jobId is required' }, { status: 400 })

    const { data: userData } = await supabase.auth.getUser()
    const seekerUserId = userData?.user?.id
    if (!seekerUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: app, error: appErr } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', body.jobId)
      .eq('seeker_user_id', seekerUserId)
      .maybeSingle()

    if (appErr || !app) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

    const { error: updErr } = await supabase
      .from('applications')
      .update({
        cover_letter: body.coverLetter ?? null,
        resume_url: body.resumeUrl ?? null,
        portfolio_url: body.portfolioUrl ?? null,
      })
      .eq('id', app.id)

    if (updErr) return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })

    const answersRows = (body.answers || []).map(a => ({
      application_id: app.id,
      screening_question_id: a.questionId,
      answer_text: a.answerText || null,
      selected_options: a.selectedOptions || null,
    }))
    if (answersRows.length) {
      const { error: ansErr } = await supabase
        .from('application_screening_answers')
        .upsert(answersRows, { onConflict: 'application_id,screening_question_id' })
      if (ansErr) return NextResponse.json({ error: 'Failed to save screening answers' }, { status: 500 })
    }

    return NextResponse.json({ id: app.id })
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const accessToken = authHeader.split(' ')[1] || ''
    const supabase = createSupabaseServerClient(accessToken)

    const body = await req.json().catch(() => null) as {
      jobId?: string
      coverLetter?: string
      resumeUrl?: string
      portfolioUrl?: string
      answers?: Array<{ questionId?: string; answerText?: string; selectedOptions?: string[] }>
    } | null

    if (!body || !body.jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 })
    }

    // Resolve current user
    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const seekerUserId = userData.user.id

    // Ensure job exists and is active (optional: allow active/paused)
    const { data: job, error: jobErr } = await supabase
      .from('jobs')
      .select('id, status')
      .eq('id', body.jobId)
      .single()

    if (jobErr || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }
    if (!['active', 'paused'].includes(job.status)) {
      return NextResponse.json({ error: 'Job is not open for applications' }, { status: 400 })
    }

    // Fetch real screening questions for this job
    const { data: questions, error: qErr } = await supabase
      .from('screening_questions')
      .select('id, question_text, question_type, options, is_required, auto_filter, expected_answer')
      .eq('job_id', job.id)
      .order('display_order', { ascending: true })

    if (qErr) {
      return NextResponse.json({ error: 'Failed to load screening questions' }, { status: 500 })
    }

    const providedAnswers = Array.isArray(body.answers) ? body.answers : []

    // Validate: answers correspond to real questions for this job
    const questionIds = new Set(questions?.map(q => q.id) || [])
    for (const ans of providedAnswers) {
      if (!ans?.questionId || !questionIds.has(ans.questionId)) {
        return NextResponse.json({ error: 'Answer includes invalid questionId for this job' }, { status: 400 })
      }
    }

    // Validate: all required questions are answered
    const requiredIds = new Set((questions || []).filter(q => q.is_required).map(q => q.id))
    for (const reqId of requiredIds) {
      const found = providedAnswers.find(a => a.questionId === reqId)
      if (!found) {
        return NextResponse.json({ error: 'Missing answer(s) for required screening question(s)' }, { status: 400 })
      }
    }

    // Create application (unique on job_id + seeker_user_id by schema)
    const { data: application, error: appErr } = await supabase
      .from('applications')
      .insert({
        job_id: job.id,
        seeker_user_id: seekerUserId,
        cover_letter: body.coverLetter || null,
        resume_url: body.resumeUrl || null,
        portfolio_url: body.portfolioUrl || null,
        status: 'pending',
      })
      .select('id')
      .single()

    if (appErr) {
      if ((appErr as PostgrestError)?.code === '23505' /* unique_violation */) {
        return NextResponse.json({ error: 'You have already applied for this job' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
    }

    const applicationId = application.id

    // Build answers rows and compute auto filter pass when applicable
    const questionById = new Map((questions || []).map(q => [q.id, q]))
    const answersRows = providedAnswers.map(a => {
      const q = questionById.get(a.questionId!)
      let passed: boolean | null = null
      if (q?.auto_filter) {
        if (q.question_type === 'yes_no') {
          const normalized = (a.answerText || '').trim().toLowerCase()
          const expected = (q.expected_answer || '').trim().toLowerCase()
          if (expected) passed = normalized === expected
        } else if (q.question_type === 'multiple_choice') {
          const selected = new Set((a.selectedOptions || []).map((s: unknown) => String(s)))
          const expected = (q.expected_answer || '').split(',').map((s: string) => s.trim()).filter(Boolean)
          if (expected.length) {
            // Simple rule: all expected must be included
            passed = expected.every((e: string) => selected.has(e))
          }
        } else if (q.question_type === 'text') {
          if (q.expected_answer) {
            passed = (a.answerText || '').trim() === q.expected_answer.trim()
          }
        }
      }
      return {
        application_id: applicationId,
        screening_question_id: a.questionId,
        answer_text: a.answerText || null,
        selected_options: a.selectedOptions || null,
        passed_auto_filter: passed,
      }
    })

    if (answersRows.length) {
      const { error: ansErr } = await supabase
        .from('application_screening_answers')
        .upsert(answersRows, { onConflict: 'application_id,screening_question_id' })
      if (ansErr) {
        return NextResponse.json({ error: 'Failed to save screening answers' }, { status: 500 })
      }
    }

    // Optional: bump application count (safe best-effort)
    try {
      await supabase.rpc('increment_job_applications_count', { p_job_id: job.id })
    } catch {}

    return NextResponse.json({ id: applicationId }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
