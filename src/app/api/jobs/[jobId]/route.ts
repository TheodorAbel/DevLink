import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET single job by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params
    console.log('[GET /api/jobs/[jobId]] JobId received:', jobId)
    
    if (!jobId) {
      console.error('[GET /api/jobs/[jobId]] No job ID provided')
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : ''
    
    if (!token) {
      console.error('[GET /api/jobs/[jobId]] No auth token')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createSupabaseServerClient(token)
    const { data: userRes, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userRes?.user) {
      console.error('[GET /api/jobs/[jobId]] Auth error:', userErr)
      return NextResponse.json({ error: 'Unauthorized', details: userErr?.message }, { status: 401 })
    }
    const userId = userRes.user.id
    console.log('[GET /api/jobs/[jobId]] User ID:', userId)

    // Get user's company_id
    const { data: userRow, error: userRowErr } = await supabaseAdmin
      .from('users')
      .select('company_id')
      .eq('id', userId)
      .single()
    
    if (userRowErr) {
      console.error('[GET /api/jobs/[jobId]] Error fetching user company_id:', userRowErr)
      return NextResponse.json({ error: 'Failed to fetch user data', details: userRowErr.message }, { status: 500 })
    }
    
    if (!userRow?.company_id) {
      console.error('[GET /api/jobs/[jobId]] User has no company_id')
      return NextResponse.json({ error: 'User has no company' }, { status: 403 })
    }
    
    console.log('[GET /api/jobs/[jobId]] Company ID:', userRow.company_id)

    // Fetch the job
    const { data: job, error: jobErr } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobErr) {
      console.error('[GET /api/jobs/[jobId]] Error fetching job:', jobErr)
      return NextResponse.json({ error: 'Job not found', details: jobErr.message }, { status: 404 })
    }
    
    if (!job) {
      console.error('[GET /api/jobs/[jobId]] Job is null')
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }
    
    console.log('[GET /api/jobs/[jobId]] Job found:', job.id, 'belongs to company:', job.company_id)

    // Verify the job belongs to user's company
    if (job.company_id !== userRow.company_id) {
      console.error('[GET /api/jobs/[jobId]] Job company mismatch. Job company:', job.company_id, 'User company:', userRow.company_id)
      return NextResponse.json({ error: 'Forbidden: Job does not belong to your company' }, { status: 403 })
    }

    console.log('[GET /api/jobs/[jobId]] Success! Returning job')
    return NextResponse.json({ job })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    console.error('[GET /api/jobs/[jobId]] Unexpected error:', message, e)
    return NextResponse.json({ error: 'Unexpected error', details: message }, { status: 500 })
  }
}

// PUT/PATCH to update job
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params
    console.log('[PUT /api/jobs/[jobId]] ===== REQUEST START =====')
    console.log('[PUT /api/jobs/[jobId]] JobId received:', jobId)
    
    if (!jobId) {
      console.error('[PUT /api/jobs/[jobId]] No jobId provided')
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization') || ''
    console.log('[PUT /api/jobs/[jobId]] Auth header present:', !!authHeader)
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : ''
    
    if (!token) {
      console.error('[PUT /api/jobs/[jobId]] No token found in headers')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[PUT /api/jobs/[jobId]] Token present, authenticating...')
    const supabase = createSupabaseServerClient(token)
    const { data: userRes, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userRes?.user) {
      console.error('[PUT /api/jobs/[jobId]] Auth failed:', userErr?.message)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = userRes.user.id
    console.log('[PUT /api/jobs/[jobId]] ✓ User authenticated:', userId)

    // Get user's company_id
    console.log('[PUT /api/jobs/[jobId]] Fetching user company...')
    const { data: userRow, error: userRowErr } = await supabaseAdmin
      .from('users')
      .select('company_id')
      .eq('id', userId)
      .single()
    
    if (userRowErr || !userRow?.company_id) {
      console.error('[PUT /api/jobs/[jobId]] User company error:', userRowErr)
      return NextResponse.json({ error: 'User has no company' }, { status: 403 })
    }

    console.log('[PUT /api/jobs/[jobId]] ✓ User company:', userRow.company_id)

    // Verify the job belongs to user's company
    console.log('[PUT /api/jobs/[jobId]] Verifying job ownership...')
    const { data: existingJob, error: checkErr } = await supabase
      .from('jobs')
      .select('company_id')
      .eq('id', jobId)
      .single()

    if (checkErr || !existingJob) {
      console.error('[PUT /api/jobs/[jobId]] Job not found:', checkErr?.message)
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    console.log('[PUT /api/jobs/[jobId]] Job company:', existingJob.company_id, 'User company:', userRow.company_id)
    if (existingJob.company_id !== userRow.company_id) {
      console.error('[PUT /api/jobs/[jobId]] Company mismatch - Job:', existingJob.company_id, 'User:', userRow.company_id)
      return NextResponse.json({ error: 'Forbidden: Job does not belong to your company' }, { status: 403 })
    }
    console.log('[PUT /api/jobs/[jobId]] ✓ Job ownership verified')

    // Parse update payload
    const payload = await req.json()
    // Backward compatibility: map 'tags' -> 'skills_required' if present
    if (payload && payload.tags !== undefined && payload.skills_required === undefined) {
      try {
        payload.skills_required = payload.tags
        delete payload.tags
        console.log('[PUT /api/jobs/[jobId]] Mapped legacy field "tags" to "skills_required"')
      } catch {}
    }
    console.log('[PUT /api/jobs/[jobId]] ===== UPDATE PAYLOAD =====')
    console.log('[PUT /api/jobs/[jobId]] Payload:', JSON.stringify(payload, null, 2))
    console.log('[PUT /api/jobs/[jobId]] Payload keys:', Object.keys(payload))

    // Build update object (only include provided fields)
    const updateData: Record<string, string | number | boolean | string[] | null> = {}
    
    // Allow updating these fields
    const allowedFields = [
      'title', 'description', 'location', 'job_type', 'experience_level',
      'salary_type', 'salary_min', 'salary_max', 'salary_fixed', 'salary_currency',
      'requirements', 'responsibilities', 'qualifications', 'benefits',
      'status', 'application_deadline', 'is_remote', 'skills_required'
    ]

    allowedFields.forEach(field => {
      if (payload[field] !== undefined) {
        updateData[field] = payload[field]
        console.log(`[PUT /api/jobs/[jobId]] Adding field '${field}':`, payload[field])
      }
    })

    // Always update the updated_at timestamp
    updateData.updated_at = new Date().toISOString()

    if (Object.keys(updateData).length === 1) { // Only updated_at
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    console.log('[PUT /api/jobs/[jobId]] ===== UPDATE DATA =====')
    console.log('[PUT /api/jobs/[jobId]] Updating job with', Object.keys(updateData).length, 'fields')
    console.log('[PUT /api/jobs/[jobId]] Update data:', JSON.stringify(updateData, null, 2))
    console.log('[PUT /api/jobs/[jobId]] Fields being updated:', Object.keys(updateData))

    // Update the job
    console.log('[PUT /api/jobs/[jobId]] Executing Supabase update...')
    const { data: updatedJob, error: updateErr } = await supabase
      .from('jobs')
      .update(updateData)
      .eq('id', jobId)
      .select()
      .single()

    if (updateErr) {
      console.error('[PUT /api/jobs/[jobId]] ===== UPDATE ERROR =====')
      console.error('[PUT /api/jobs/[jobId]] Error object:', JSON.stringify(updateErr, null, 2))
      console.error('[PUT /api/jobs/[jobId]] Error message:', updateErr.message)
      console.error('[PUT /api/jobs/[jobId]] Error code:', updateErr.code)
      console.error('[PUT /api/jobs/[jobId]] Error details:', updateErr.details)
      return NextResponse.json({ error: 'Failed to update job', details: updateErr.message }, { status: 400 })
    }

    console.log('[PUT /api/jobs/[jobId]] ===== UPDATE SUCCESS =====')
    console.log('[PUT /api/jobs/[jobId]] Updated job ID:', updatedJob?.id)
    console.log('[PUT /api/jobs/[jobId]] Updated job title:', updatedJob?.title)
    return NextResponse.json({ job: updatedJob, message: 'Job updated successfully' })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    console.error('[PUT /api/jobs/[jobId]] Unexpected error:', message, e)
    return NextResponse.json({ error: 'Unexpected error', details: message }, { status: 500 })
  }
}
