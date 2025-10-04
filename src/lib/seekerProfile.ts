import { supabase } from './supabaseClient'

// Data shapes strictly aligned to schema.sql tables
// Tables used:
// - public.seeker_profiles: first_name, last_name, phone, location, bio, website_url, linkedin_url
// - public.seeker_skills: skill_name
// - public.seeker_experience: job_title, company_name, location, start_date, end_date, is_current, description
// - public.seeker_education: degree, school, location, start_date, end_date, is_current, gpa, description

export type UIExperience = {
  id: string
  title: string
  company: string
  startDate: string // YYYY-MM
  endDate: string // YYYY-MM or 'Present' or ''
  location: string
  description: string
}

export type ProfileCompletion = {
  percentage: number
  missing: string[]
}

// Resume upload + DB metadata (strictly aligned with storage policies in schema.sql)
export type UploadedResumeMeta = {
  fileName: string
  uploadDate: string
  sizeKB: number
  storagePath: string // the storage object name (used in policies as 'name')
}

function sanitizeFilename(name: string): string {
  // keep letters, numbers, dashes, underscores, and dots
  return name.replace(/[^A-Za-z0-9._-]/g, '_')
}

export async function uploadSeekerResume(file: File): Promise<UploadedResumeMeta> {
  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF resumes are allowed')
  }

  const userId = await getUserId()

  // Enforce policy naming: split_part(name, '_', 2) = auth.uid()
  // Pattern: <timestamp>_<userId>_<sanitizedName>.pdf
  const ts = Date.now()
  const original = sanitizeFilename(file.name.endsWith('.pdf') ? file.name : `${file.name}.pdf`)
  const objectName = `${ts}_${userId}_${original}`

  const { error: uploadErr } = await supabase.storage
    .from('resumes')
    .upload(objectName, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'application/pdf',
    })
  if (uploadErr) throw new Error(`Failed to upload to storage: ${uploadErr.message || 'unknown error'}`)

  // Ensure we have a seeker_profile row id for FK
  const { data: profileRow, error: profErr } = await supabase
    .from('seeker_profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()
  if (profErr) throw new Error(`Failed to read seeker_profiles: ${profErr.message || 'unknown error'}`)

  let seekerProfileId: string
  if (!profileRow) {
    const { data, error } = await supabase
      .from('seeker_profiles')
      .insert({ user_id: userId })
      .select('id')
      .single()
    if (error) throw new Error(`Failed to insert seeker_profiles: ${error.message || 'unknown error'}`)
    seekerProfileId = data.id
  } else {
    seekerProfileId = profileRow.id
  }

  // Set current primary to false, then insert new row as primary
  const unset = await supabase
    .from('seeker_resumes')
    .update({ is_primary: false })
    .eq('seeker_profile_id', seekerProfileId)
  if (unset.error) throw new Error(`Failed to unset previous primary resumes: ${unset.error.message || 'unknown error'}`)

  const { error: insErr } = await supabase.from('seeker_resumes').insert({
    seeker_profile_id: seekerProfileId,
    file_name: original,
    file_url: objectName, // store storage object name; policies check a.resume_url = name
    file_size: Math.round(file.size),
    file_type: 'application/pdf',
    is_primary: true,
  })
  if (insErr) throw new Error(`Failed to insert seeker_resumes: ${insErr.message || 'unknown error'}`)

  return {
    fileName: original,
    uploadDate: new Date().toISOString().split('T')[0],
    sizeKB: Math.round(file.size / 1024),
    storagePath: objectName,
  }
}

export async function fetchPrimaryResume(): Promise<{ file_name: string; file_url: string; uploaded_at: string | null; file_size: number | null } | null> {
  const userId = await getUserId()
  const { data: profileRow, error: profErr } = await supabase
    .from('seeker_profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()
  if (profErr) throw profErr
  if (!profileRow) return null
  const { data, error } = await supabase
    .from('seeker_resumes')
    .select('file_name, file_url, uploaded_at, file_size')
    .eq('seeker_profile_id', profileRow.id)
    .eq('is_primary', true)
    .maybeSingle()
  if (error) throw error
  return data ?? null
}

export async function createResumeSignedUrl(storagePath: string, expiresInSeconds = 60): Promise<string> {
  const { data, error } = await supabase.storage
    .from('resumes')
    .createSignedUrl(storagePath, expiresInSeconds)
  if (error) throw error
  return data.signedUrl
}

export type UIEducation = {
  id: string
  degree: string
  school: string
  startDate: string // YYYY-MM
  endDate: string // YYYY-MM
  location: string
  gpa?: string
}

export type UIProfile = {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    location: string
    bio: string
    website: string
    linkedin: string
  }
  skills: string[]
  experience: UIExperience[]
  education: UIEducation[]
}

function toMonthDate(month: string | null | undefined): string | null {
  if (!month) return null
  const m = month.trim()
  if (!m) return null
  // Strict: accept only YYYY-MM, convert to YYYY-MM-01
  if (/^\d{4}-\d{2}$/.test(m)) return `${m}-01`
  return null
}

function fromDateToMonth(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getUTCFullYear()
  const m = `${d.getUTCMonth() + 1}`.padStart(2, '0')
  return `${y}-${m}`
}

async function getUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error(`Not authenticated${error?.message ? `: ${error.message}` : ''}`)
  return data.user.id
}

export async function fetchSeekerProfile(): Promise<UIProfile> {
  const userId = await getUserId()

  // Get base profile row per schema
  const { data: profileRow, error: profileErr } = await supabase
    .from('seeker_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (profileErr) throw new Error(`Failed to load seeker_profiles: ${profileErr.message || 'unknown error'}`)

  // Fetch email from users (email lives in users table per schema)
  const { data: userRow } = await supabase
    .from('users')
    .select('email')
    .eq('id', userId)
    .maybeSingle()
  const email = userRow?.email ?? ''

  if (!profileRow) {
    return {
      personalInfo: {
        firstName: '',
        lastName: '',
        email,
        phone: '',
        location: '',
        bio: '',
        website: '',
        linkedin: '',
      },
      skills: [],
      experience: [],
      education: [],
    }
  }

  const seekerProfileId = profileRow.id as string

  const [skillsRes, expRes, eduRes] = await Promise.all([
    supabase
      .from('seeker_skills')
      .select('id, skill_name')
      .eq('seeker_profile_id', seekerProfileId)
      .order('skill_name'),
    supabase
      .from('seeker_experience')
      .select('*')
      .eq('seeker_profile_id', seekerProfileId)
      .order('start_date', { ascending: false }),
    supabase
      .from('seeker_education')
      .select('*')
      .eq('seeker_profile_id', seekerProfileId)
      .order('start_date', { ascending: false }),
  ])

  if (skillsRes.error) throw new Error(`Failed to load seeker_skills: ${skillsRes.error.message || 'unknown error'}`)
  if (expRes.error) throw new Error(`Failed to load seeker_experience: ${expRes.error.message || 'unknown error'}`)
  if (eduRes.error) throw new Error(`Failed to load seeker_education: ${eduRes.error.message || 'unknown error'}`)

  const skills = (skillsRes.data ?? []).map((r) => r.skill_name as string)

  const experience: UIExperience[] = (expRes.data ?? []).map((r) => ({
    id: r.id,
    title: r.job_title ?? '',
    company: r.company_name ?? '',
    startDate: fromDateToMonth(r.start_date),
    endDate: r.is_current ? 'Present' : fromDateToMonth(r.end_date),
    location: r.location ?? '',
    description: r.description ?? '',
  }))

  const education: UIEducation[] = (eduRes.data ?? []).map((r) => ({
    id: r.id,
    degree: r.degree ?? '',
    school: r.school ?? '',
    startDate: fromDateToMonth(r.start_date),
    endDate: fromDateToMonth(r.end_date),
    location: r.location ?? '',
    gpa: r.gpa ?? undefined,
  }))

  return {
    personalInfo: {
      firstName: profileRow.first_name ?? '',
      lastName: profileRow.last_name ?? '',
      email,
      phone: profileRow.phone ?? '',
      location: profileRow.location ?? '',
      bio: profileRow.bio ?? '',
      website: profileRow.website_url ?? '',
      linkedin: profileRow.linkedin_url ?? '',
    },
    skills,
    experience,
    education,
  }
}

export async function saveSeekerProfile(profile: UIProfile): Promise<void> {
  const userId = await getUserId()

  // Ensure seeker_profiles row exists or update it (strictly schema columns)
  const basePayload = {
    user_id: userId,
    first_name: profile.personalInfo.firstName || null,
    last_name: profile.personalInfo.lastName || null,
    phone: profile.personalInfo.phone || null,
    location: profile.personalInfo.location || null,
    bio: profile.personalInfo.bio || null,
    website_url: profile.personalInfo.website || null,
    linkedin_url: profile.personalInfo.linkedin || null,
  }

  const { data: existing, error: existErr } = await supabase
    .from('seeker_profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()
  if (existErr) throw new Error(`Failed to check existing seeker_profile: ${existErr.message || 'unknown error'}`)

  let seekerProfileId: string
  if (!existing) {
    const { data, error } = await supabase
      .from('seeker_profiles')
      .insert(basePayload)
      .select('id')
      .single()
    if (error) throw error
    seekerProfileId = data.id
  } else {
    const { data, error } = await supabase
      .from('seeker_profiles')
      .update(basePayload)
      .eq('id', existing.id)
      .select('id')
      .single()
    if (error) throw error
    seekerProfileId = data.id
  }

  // Replace related tables to reflect current UI state exactly
  // Skills
  {
    const del = await supabase.from('seeker_skills').delete().eq('seeker_profile_id', seekerProfileId)
    if (del.error) throw new Error(`Failed to clear seeker_skills: ${del.error.message || 'unknown error'}`)
    if (profile.skills.length > 0) {
      const ins = await supabase
        .from('seeker_skills')
        .insert(profile.skills.map((s) => ({ seeker_profile_id: seekerProfileId, skill_name: s })))
      if (ins.error) throw new Error(`Failed to insert seeker_skills: ${ins.error.message || 'unknown error'}`)
    }
  }

  // Experience
  {
    const del = await supabase.from('seeker_experience').delete().eq('seeker_profile_id', seekerProfileId)
    if (del.error) throw del.error
    if (profile.experience.length > 0) {
      const rows = profile.experience.map((e) => {
        const endSpecified = e.endDate && e.endDate.toLowerCase() !== 'present'
        const end_date = toMonthDate(endSpecified ? e.endDate : '')
        const is_current = !endSpecified
        return {
          seeker_profile_id: seekerProfileId,
          job_title: e.title || null,
          company_name: e.company || null,
          location: e.location || null,
          start_date: toMonthDate(e.startDate),
          end_date,
          is_current,
          description: e.description || null,
        }
      })
      const ins = await supabase.from('seeker_experience').insert(rows)
      if (ins.error) throw new Error(`Failed to insert seeker_experience: ${ins.error.message || 'unknown error'}`)
    }
  }

  // Education
  {
    const del = await supabase.from('seeker_education').delete().eq('seeker_profile_id', seekerProfileId)
    if (del.error) throw new Error(`Failed to clear seeker_education: ${del.error.message || 'unknown error'}`)
    if (profile.education.length > 0) {
      const rows = profile.education.map((e) => ({
        seeker_profile_id: seekerProfileId,
        degree: e.degree || null,
        school: e.school || null,
        location: e.location || null,
        start_date: toMonthDate(e.startDate),
        end_date: toMonthDate(e.endDate),
        is_current: !e.endDate,
        gpa: e.gpa || null,
        description: null,
      }))
      const ins = await supabase.from('seeker_education').insert(rows)
      if (ins.error) throw new Error(`Failed to insert seeker_education: ${ins.error.message || 'unknown error'}`)
    }
  }

  // Recompute completion and persist
  const completion = await updateProfileCompletionByUserId(userId)
}

async function getSeekerProfileIdByUserId(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('seeker_profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw new Error(`Failed to lookup seeker_profile: ${error.message || 'unknown error'}`)
  return data?.id ?? null
}

function isFilled(v: unknown): boolean {
  if (v === null || v === undefined) return false
  if (typeof v === 'string') return v.trim().length > 0
  return true
}

async function evaluateProfileCompletion(seekerProfileId: string): Promise<ProfileCompletion> {
  // Load core profile fields
  const { data: p, error: pErr } = await supabase
    .from('seeker_profiles')
    .select('first_name,last_name,phone,location,bio,website_url,linkedin_url')
    .eq('id', seekerProfileId)
    .single()
  if (pErr) throw new Error(`Failed to read seeker_profiles for completion: ${pErr.message || 'unknown error'}`)

  // Related counts (fetch rows and use lengths to avoid count/head issues)
  const [skills, exp, edu, resume] = await Promise.all([
    supabase.from('seeker_skills').select('id').eq('seeker_profile_id', seekerProfileId),
    supabase.from('seeker_experience').select('id').eq('seeker_profile_id', seekerProfileId),
    supabase.from('seeker_education').select('id').eq('seeker_profile_id', seekerProfileId),
    supabase.from('seeker_resumes').select('id').eq('seeker_profile_id', seekerProfileId).eq('is_primary', true),
  ])
  if (skills.error) throw new Error(`Failed to load seeker_skills (completion): ${skills.error.message || 'unknown error'}`)
  if (exp.error) throw new Error(`Failed to load seeker_experience (completion): ${exp.error.message || 'unknown error'}`)
  if (edu.error) throw new Error(`Failed to load seeker_education (completion): ${edu.error.message || 'unknown error'}`)
  if (resume.error) throw new Error(`Failed to load seeker_resumes (completion): ${resume.error.message || 'unknown error'}`)
  const skillsCount = (skills.data?.length) ?? 0
  const expCount = (exp.data?.length) ?? 0
  const eduCount = (edu.data?.length) ?? 0
  const hasResume = ((resume.data?.length) ?? 0) > 0

  // Checklist
  const checks: Array<{ key: string; filled: boolean }> = [
    { key: 'First name', filled: isFilled(p.first_name) },
    { key: 'Last name', filled: isFilled(p.last_name) },
    { key: 'Phone', filled: isFilled(p.phone) },
    { key: 'Location', filled: isFilled(p.location) },
    { key: 'Bio', filled: isFilled(p.bio) },
    { key: 'Website', filled: isFilled(p.website_url) },
    { key: 'LinkedIn', filled: isFilled(p.linkedin_url) },
    { key: 'At least 1 skill', filled: skillsCount > 0 },
    { key: 'At least 1 experience', filled: expCount > 0 },
    { key: 'At least 1 education', filled: eduCount > 0 },
    { key: 'Resume uploaded', filled: hasResume },
  ]

  const total = checks.length
  const filled = checks.filter(c => c.filled).length
  const percentage = Math.round((filled / total) * 100)
  const missing = checks.filter(c => !c.filled).map(c => c.key)
  return { percentage, missing }
}

async function updateProfileCompletionByUserId(userId: string): Promise<ProfileCompletion> {
  const seekerProfileId = await getSeekerProfileIdByUserId(userId)
  if (!seekerProfileId) return { percentage: 0, missing: [
    'First name','Last name','Phone','Location','Bio','Website','LinkedIn','At least 1 skill','At least 1 experience','At least 1 education','Resume uploaded'
  ] }
  const completion = await evaluateProfileCompletion(seekerProfileId)
  const { error } = await supabase
    .from('seeker_profiles')
    .update({ profile_completion_percentage: completion.percentage })
    .eq('id', seekerProfileId)
  if (error) throw new Error(`Failed to update profile completion: ${error.message || 'unknown error'}`)
  return completion
}

export async function fetchProfileCompletion(): Promise<ProfileCompletion> {
  const userId = await getUserId()
  const seekerProfileId = await getSeekerProfileIdByUserId(userId)
  if (!seekerProfileId) return { percentage: 0, missing: [
    'First name','Last name','Phone','Location','Bio','Website','LinkedIn','At least 1 skill','At least 1 experience','At least 1 education','Resume uploaded'
  ] }
  return evaluateProfileCompletion(seekerProfileId)
}

export async function fetchProfileStepsStatus(): Promise<{ basic: boolean; experience: boolean; resume: boolean; contact: boolean }> {
  const userId = await getUserId()
  const seekerProfileId = await getSeekerProfileIdByUserId(userId)
  if (!seekerProfileId) return { basic: false, experience: false, resume: false, contact: false }

  const { data: p, error: pErr } = await supabase
    .from('seeker_profiles')
    .select('first_name,last_name,location,bio,phone,website_url,linkedin_url')
    .eq('id', seekerProfileId)
    .single()
  if (pErr) throw new Error(`Failed to read seeker_profiles for steps: ${pErr.message || 'unknown error'}`)

  const [exp, resume] = await Promise.all([
    supabase.from('seeker_experience').select('id').eq('seeker_profile_id', seekerProfileId),
    supabase.from('seeker_resumes').select('id').eq('seeker_profile_id', seekerProfileId).eq('is_primary', true),
  ])
  if (exp.error) throw new Error(`Failed to load seeker_experience (steps): ${exp.error.message || 'unknown error'}`)
  if (resume.error) throw new Error(`Failed to load seeker_resumes (steps): ${resume.error.message || 'unknown error'}`)

  const basic = isFilled(p.first_name) && isFilled(p.last_name) && isFilled(p.location) && isFilled(p.bio)
  const experience = ((exp.data?.length) ?? 0) > 0
  const resumeDone = ((resume.data?.length) ?? 0) > 0
  const contact = isFilled(p.phone) && (isFilled(p.linkedin_url) || isFilled(p.website_url))
  return { basic, experience, resume: resumeDone, contact }
}
