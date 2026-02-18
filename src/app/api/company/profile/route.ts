import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import type { CompanyProfilePayload } from '@/types/company'

// Helper: pick only allowed keys for companies table
function pickCompanyCore(body: CompanyProfilePayload) {
  const out: Record<string, unknown> = {}
  // Helper that skips undefined, and skips empty strings/arrays; includes booleans and numbers (incl. 0)
  const add = (key: string, value: unknown) => {
    if (value === undefined) return
    if (typeof value === 'string' && value.trim() === '') return
    if (Array.isArray(value) && value.length === 0) return
    out[key] = value
  }

  add('company_name', body.company_name)
  add('logo_url', body.logo_url)
  add('cover_image_url', body.cover_image_url)
  add('website_url', body.website_url)
  add('industry', body.industry)
  add('company_size', body.company_size)
  add('founded_year', body.founded_year)
  add('headquarters', body.headquarters)
  add('registration_number', body.registration_number)
  add('tax_id', body.tax_id)
  add('country', body.country)
  add('city', body.city)
  add('address', body.address)
  add('tagline', body.tagline)
  add('description', body.description)
  add('culture', body.culture)
  add('specialties', body.specialties)
  add('benefits', body.benefits)
  add('remote_policy', body.remote_policy)
  add('linkedin_url', body.linkedin_url)
  add('twitter_url', body.twitter_url)
  add('facebook_url', body.facebook_url)
  add('github_url', body.github_url)
  add('youtube_url', body.youtube_url)
  add('contact_email', body.contact_email)
  add('contact_phone', body.contact_phone)
  // booleans: include even if false
  if (body.show_employees !== undefined) out.show_employees = body.show_employees
  if (body.show_culture !== undefined) out.show_culture = body.show_culture
  if (body.show_media !== undefined) out.show_media = body.show_media
  if (body.show_leadership !== undefined) out.show_leadership = body.show_leadership
  if (body.show_hiring !== undefined) out.show_hiring = body.show_hiring
  if (body.show_contacts !== undefined) out.show_contacts = body.show_contacts
  if (body.show_socials !== undefined) out.show_socials = body.show_socials
  add('hiring_process', body.hiring_process)

  return out
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization') || ''
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : ''
    if (!token) {
      return NextResponse.json({ error: 'Missing Authorization bearer token' }, { status: 401 })
    }

    const supabase = createSupabaseServerClient(token)
    const { data: userRes, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userRes?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = userRes.user.id

    // Get user's company_id using service role to avoid RLS recursion
    const { data: userRow, error: userRowErr } = await supabaseAdmin
      .from('users')
      .select('company_id')
      .eq('id', userId)
      .single()
    if (userRowErr) {
      return NextResponse.json({ error: 'Failed to load user row', details: userRowErr.message }, { status: 400 })
    }
    const companyId = userRow?.company_id as string | null
    if (!companyId) {
      return NextResponse.json({ company: null })
    }

    // Load company core
    const { data: company, error: companyErr } = await supabase
      .from('companies')
      .select(`
        id,
        company_name, logo_url, cover_image_url, website_url,
        industry, company_size, founded_year, headquarters,
        registration_number, tax_id,
        country, city, address,
        tagline, description, culture, specialties, benefits,
        verification_status, is_verified,
        registration_document_url, business_license_url,
        remote_policy,
        linkedin_url, twitter_url, facebook_url, github_url, youtube_url,
        contact_email, contact_phone,
        show_employees, show_culture, show_media, show_leadership, show_hiring, show_contacts, show_socials,
        is_active,
        hiring_process,
        created_at, updated_at
      `)
      .eq('id', companyId)
      .maybeSingle()
    if (companyErr) {
      return NextResponse.json({ error: 'Failed to load company', details: companyErr.message }, { status: 400 })
    }

    // Child collections
    const [leadersRes, mediaRes, cultureRes, jobDefaultsRes, billingRes] = await Promise.all([
      supabase.from('company_leaders').select('id,name,title,photo_url,linkedin_url,display_order').eq('company_id', companyId).order('display_order', { ascending: true }),
      supabase.from('company_media').select('id,media_type,url,title,thumbnail_url,file_size,duration_seconds,display_order').eq('company_id', companyId).order('display_order', { ascending: true }),
      supabase.from('company_culture_values').select('id,title,description,display_order').eq('company_id', companyId).order('display_order', { ascending: true }),
      supabase.from('company_job_defaults').select('salary_type,remote_work,currency').eq('company_id', companyId).maybeSingle(),
      supabase.from('company_billing').select('billing_email,plan,status,payment_method_status').eq('company_id', companyId).maybeSingle(),
    ])

    const leaders = leadersRes.data || []
    const media = mediaRes.data || []
    const culture_values = cultureRes.data || []
    const job_defaults = jobDefaultsRes.data || null
    const billing = billingRes.data || null

    return NextResponse.json({
      company,
      leaders,
      media,
      culture_values,
      job_defaults,
      billing,
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'Unexpected error', details: message }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    console.log('[API] /api/company/profile POST hit')
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : ''
    if (!token) {
      return NextResponse.json({ error: 'Missing Authorization bearer token' }, { status: 401 })
    }

    const supabase = createSupabaseServerClient(token)
    const { data: userRes, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userRes.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = userRes.user.id

    // Fetch the user's company_id
    // Use service role to read users row to avoid any RLS recursion from legacy policies
    const { data: userRow, error: userRowErr } = await supabaseAdmin
      .from('users')
      .select('company_id, email, name')
      .eq('id', userId)
      .single()

    if (userRowErr) {
      return NextResponse.json({ error: 'Failed to load user row', details: userRowErr.message }, { status: 400 })
    }

    const payload = (await req.json()) as CompanyProfilePayload
    console.log('[API] payload keys:', Object.keys(payload || {}))

    // Basic required fields validation (schema requires these NOT NULL):
    const required = ['company_name','industry','company_size','country','city','description'] as const
    const p = payload as Record<string, unknown>
    const missing = required.filter((k) => {
      const v = p[k]
      if (v === undefined || v === null) return true
      if (typeof v === 'string' && v.trim() === '') return true
      return false
    })
    if (missing.length) {
      return NextResponse.json({ error: 'Missing required fields', details: `Missing: ${missing.join(', ')}` }, { status: 400 })
    }

    // Upsert company core
    const core = pickCompanyCore(payload)

    let companyId = userRow?.company_id as string | null

    if (!companyId) {
      // Create new company row first (RLS: users can manage company where id = users.company_id, so use service role for creation, then link to user)
      const { data: created, error: createErr } = await supabaseAdmin
        .from('companies')
        .insert({
          ...core,
          // Ensure owner_user_id is set to satisfy NOT NULL constraint on some deployments
          owner_user_id: userId,
        })
        .select('id')
        .single()

      if (createErr || !created) {
        console.error('[API] create company error:', createErr)
        const code = (createErr as { code?: string } | null | undefined)?.code
        if (code === '23505') { // unique_violation
          return NextResponse.json(
            { error: 'Company name already exists', details: 'Please choose a different company name.' },
            { status: 409 }
          )
        }
        return NextResponse.json({ error: 'Failed to create company', details: createErr?.message }, { status: 400 })
      }
      companyId = created.id

      // Link user to company using service role to avoid RLS recursion on users
      const { error: linkErr } = await supabaseAdmin
        .from('users')
        .update({ company_id: companyId })
        .eq('id', userId)
      if (linkErr) {
        console.error('[API] link user->company error:', linkErr)
        return NextResponse.json({ error: 'Failed to link user to company', details: linkErr.message }, { status: 400 })
      }
    } else {
      // Update existing company via RLS (must match users.company_id)
      const { error: updateErr } = await supabase
        .from('companies')
        .update(core)
        .eq('id', companyId)
      if (updateErr) {
        console.error('[API] update company error:', updateErr)
        return NextResponse.json({ error: 'Failed to update company', details: updateErr.message }, { status: 400 })
      }
    }

    // Ensure role is employer server-side (service role), so client doesn't need to update users.role (often blocked by RLS)
    const { error: roleErr } = await supabaseAdmin
      .from('users')
      .update({ role: 'employer' })
      .eq('id', userId)
    if (roleErr) {
      console.error('[API] set employer role error:', roleErr)
    }

    // Replace-all helpers for child tables
    type ReplaceAllResult = { ok?: true; error?: { message: string } };
    async function replaceAll<TIn extends Record<string, unknown>, TOut extends Record<string, unknown>>(
      table: string,
      rows: TIn[] | undefined | null,
      map: (item: TIn) => TOut
    ): Promise<ReplaceAllResult> {
      if (!rows) return { ok: true }
      // Delete existing
      const { error: delErr } = await supabase
        .from(table)
        .delete()
        .eq('company_id', companyId!)
      if (delErr) return { error: { message: delErr.message } }
      if (rows.length === 0) return { ok: true }
      // Insert new
      const { error: insErr } = await supabase
        .from(table)
        .insert(rows.map(map))
      if (insErr) return { error: { message: insErr.message } }
      return { ok: true }
    }

    // Culture values
    if (payload.culture_values) {
      const r = await replaceAll('company_culture_values', payload.culture_values, (v) => ({
        company_id: companyId,
        title: v.title,
        description: v.description ?? null,
        display_order: v.display_order ?? 0,
      }))
      if (r.error) {
        console.error('[API] culture values error:', r.error)
        return NextResponse.json({ error: 'Failed to save culture values', details: r.error.message }, { status: 400 })
      }
    }

    // Leaders
    if (payload.leaders) {
      const r = await replaceAll('company_leaders', payload.leaders, (v) => ({
        company_id: companyId,
        name: v.name,
        title: v.title,
        photo_url: v.photo_url ?? null,
        linkedin_url: v.linkedin_url ?? null,
        display_order: v.display_order ?? 0,
      }))
      if (r.error) {
        console.error('[API] leaders error:', r.error)
        return NextResponse.json({ error: 'Failed to save leaders', details: r.error.message }, { status: 400 })
      }
    }

    // Media
    if (payload.media) {
      const r = await replaceAll('company_media', payload.media, (m) => ({
        company_id: companyId,
        media_type: m.media_type,
        url: m.url,
        title: m.title ?? null,
        thumbnail_url: m.thumbnail_url ?? null,
        file_size: m.file_size ?? null,
        duration_seconds: m.duration_seconds ?? null,
        display_order: m.display_order ?? 0,
      }))
      if (r.error) {
        console.error('[API] media error:', r.error)
        return NextResponse.json({ error: 'Failed to save media', details: r.error.message }, { status: 400 })
      }
    }

    // Job defaults (single row, unique company_id)
    if (payload.job_defaults) {
      const { error: jdErr } = await supabase
        .from('company_job_defaults')
        .upsert({
          company_id: companyId,
          salary_type: payload.job_defaults.salary_type ?? null,
          remote_work: payload.job_defaults.remote_work ?? null,
          currency: payload.job_defaults.currency ?? 'ETB',
        }, { onConflict: 'company_id' })
      if (jdErr) {
        console.error('[API] job defaults error:', jdErr)
        return NextResponse.json({ error: 'Failed to save job defaults', details: jdErr.message }, { status: 400 })
      }
    }

    // Billing (single row, unique company_id)
    if (payload.billing) {
      const { error: billErr } = await supabase
        .from('company_billing')
        .upsert({
          company_id: companyId,
          stripe_customer_id: payload.billing.stripe_customer_id ?? null,
          billing_email: payload.billing.billing_email ?? null,
          plan: payload.billing.plan ?? null,
          status: payload.billing.status ?? 'inactive',
          payment_method_status: payload.billing.payment_method_status ?? null,
        }, { onConflict: 'company_id' })
      if (billErr) {
        console.error('[API] billing error:', billErr)
        return NextResponse.json({ error: 'Failed to save billing', details: billErr.message }, { status: 400 })
      }
    }

    // Message templates (replace all)
    if (payload.message_templates) {
      const r = await replaceAll('company_message_templates', payload.message_templates, (t) => ({
        company_id: companyId,
        name: t.name,
        subject: t.subject,
        content: t.content,
      }))
      if (r.error) {
        console.error('[API] templates error:', r.error)
        return NextResponse.json({ error: 'Failed to save message templates', details: r.error.message }, { status: 400 })
      }
    }

    console.log('[API] company saved ok:', companyId)
    return NextResponse.json({ ok: true, company_id: companyId })
  } catch (e: unknown) {
    console.error('[API] unexpected error:', e)
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'Unexpected error', details: message }, { status: 500 })
  }
}
