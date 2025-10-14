import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

// GET /api/saved-jobs -> list of saved jobs for current user
// POST /api/saved-jobs { jobId } -> save
// DELETE /api/saved-jobs { jobId } -> unsave

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    let supabase: ReturnType<typeof createSupabaseServerClient> | null = null
    let userId: string | null = null
    if (authHeader?.startsWith('Bearer ')) {
      const accessToken = authHeader.split(' ')[1] || ''
      supabase = createSupabaseServerClient(accessToken)
      const { data: user } = await supabase.auth.getUser()
      userId = user?.user?.id ?? null
    } else {
      userId = process.env.DEV_USER_ID ?? null
    }
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // If supabase client isn't set (no auth), create a service client with empty token for DB access via anon (RLS disabled scenario)
    if (!supabase) {
      supabase = createSupabaseServerClient('')
    }

    // 1) Fetch saved job ids
    const { data: savedRows, error: savedErr } = await supabase
      .from('saved_jobs')
      .select('job_id')
      .eq('user_id', userId)
      .order('id', { ascending: false })

    if (savedErr) return NextResponse.json({ error: savedErr.message || 'Failed to load saved jobs' }, { status: 500 })

    const jobIds = (savedRows || []).map(r => r.job_id).filter(Boolean)
    if (jobIds.length === 0) return NextResponse.json({ jobs: [] }, { status: 200 })

    // 2) Fetch jobs by ids
    const { data: jobs, error: jobsErr } = await supabase
      .from('jobs')
      .select(`
        id,
        title,
        location,
        job_type,
        salary_type,
        salary_min,
        salary_max,
        salary_fixed,
        salary_currency,
        custom_salary_message,
        description,
        skills_required,
        published_at,
        company_id,
        companies:company_id ( company_name )
      `)
      .in('id', jobIds)

    if (jobsErr) return NextResponse.json({ error: jobsErr.message || 'Failed to load jobs' }, { status: 500 })

    const typeMap: Record<string, string> = { full_time: 'Full-time', part_time: 'Part-time', contract: 'Contract', internship: 'Internship' }
    const items = (jobs || []).map((j: any) => {
      let salary = 'Competitive'
      if (j.salary_type === 'range' && j.salary_min && j.salary_max) {
        salary = `${j.salary_currency || 'ETB'} ${j.salary_min} - ${j.salary_max}`
      } else if (j.salary_type === 'fixed' && j.salary_fixed) {
        salary = `${j.salary_currency || 'ETB'} ${j.salary_fixed}`
      } else if (j.custom_salary_message) {
        salary = j.custom_salary_message
      }
      return {
        id: j.id,
        title: j.title,
        company: (Array.isArray(j.companies) ? j.companies[0]?.company_name : j.companies?.company_name) || 'Company',
        companyId: j.company_id,
        location: j.location ?? '—',
        salary,
        type: typeMap[j.job_type ?? ''] || j.job_type || 'Full-time',
        postedDate: j.published_at || '',
        description: j.description || '',
        skills: Array.isArray(j.skills_required) ? j.skills_required : [],
      }
    })

    return NextResponse.json({ jobs: items }, { status: 200 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unexpected error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    let supabase = null as any
    let userId: string | null = null
    if (authHeader?.startsWith('Bearer ')) {
      const accessToken = authHeader.split(' ')[1] || ''
      supabase = createSupabaseServerClient(accessToken)
      const { data: user } = await supabase.auth.getUser()
      userId = user?.user?.id ?? null
    } else {
      supabase = createSupabaseServerClient('')
      userId = process.env.DEV_USER_ID ?? null
    }
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => null) as { jobId?: string } | null
    if (!body?.jobId) return NextResponse.json({ error: 'jobId is required' }, { status: 400 })

    const { error } = await supabase.from('saved_jobs').insert({ user_id: userId, job_id: body.jobId })
    if (error) {
      // Handle duplicate save gracefully
      if ((error as any)?.code === '23505') {
        return NextResponse.json({ ok: true }, { status: 200 })
      }
      return NextResponse.json({ error: error.message || 'Failed to save job' }, { status: 500 })
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    let supabase = null as any
    let userId: string | null = null
    if (authHeader?.startsWith('Bearer ')) {
      const accessToken = authHeader.split(' ')[1] || ''
      supabase = createSupabaseServerClient(accessToken)
      const { data: user } = await supabase.auth.getUser()
      userId = user?.user?.id ?? null
    } else {
      supabase = createSupabaseServerClient('')
      userId = process.env.DEV_USER_ID ?? null
    }
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => null) as { jobId?: string } | null
    if (!body?.jobId) return NextResponse.json({ error: 'jobId is required' }, { status: 400 })

    const { error } = await supabase.from('saved_jobs').delete().match({ user_id: userId, job_id: body.jobId })
    if (error) return NextResponse.json({ error: error.message || 'Failed to remove saved job' }, { status: 500 })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
