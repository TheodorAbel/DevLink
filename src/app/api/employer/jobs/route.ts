import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : ''
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createSupabaseServerClient(token)
    const { data: userRes, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userRes?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = userRes.user.id

    // get company_id of the user
    const { data: userRow, error: userRowErr } = await supabaseAdmin
      .from('users')
      .select('company_id')
      .eq('id', userId)
      .single()
    if (userRowErr) return NextResponse.json({ error: 'Failed to load user row', details: userRowErr.message }, { status: 400 })
    const companyId = userRow?.company_id as string | null
    if (!companyId) return NextResponse.json({ jobs: [] })

    const { searchParams } = new URL(req.url)
    const limitParam = Number(searchParams.get('limit') || '')
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 20

    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('id, title, location, job_type, description, salary_type, salary_min, salary_max, salary_fixed, salary_currency, status, published_at, created_at, updated_at, views_count, applications_count')
      .eq('company_id', companyId)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .range(0, limit - 1)

    if (error) return NextResponse.json({ error: 'Failed to load jobs', details: error.message }, { status: 400 })

    return NextResponse.json({ jobs: jobs || [] })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'Unexpected error', details: message }, { status: 500 })
  }
}
