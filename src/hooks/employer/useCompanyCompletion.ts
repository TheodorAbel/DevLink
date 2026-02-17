import { useMemo } from 'react'
import { useCompany } from './useCompany'

export type CompanyCompletion = {
  percentage: number
  missing: string[]
}

function isFilled(v: unknown) {
  if (v === null || v === undefined) return false
  if (typeof v === 'string') return v.trim().length > 0
  if (Array.isArray(v)) return v.length > 0
  return true
}

export function useCompanyCompletion() {
  const { data } = useCompany()

  return useMemo<CompanyCompletion>(() => {
    const c = data?.company
    if (!c) return { percentage: 0, missing: ['Company core not created'] }

    const missing: string[] = []
    let score = 0
    const total = 100

    // Weights
    const W_VISUALS = 10
    const W_BASICS = 25
    const W_STORY = 15
    const W_CULTURE = 15
    const W_SOCIAL = 10
    const W_MEDIA_LEADERS = 15
    const W_OPERATIONS = 10

    // Visuals
    let visuals = 0
    if (isFilled(c.logo_url)) visuals += 0.6
    else missing.push('Logo')
    if (isFilled(c.cover_image_url)) visuals += 0.4
    else missing.push('Cover image')
    score += Math.round(visuals * W_VISUALS)

    // Basics
    let basics = 0
    const basicsChecks: Array<[string, unknown]> = [
      ['Company name', c.company_name],
      ['Website', c.website_url],
      ['Industry', c.industry],
      ['Company size', c.company_size],
      ['Founded year', c.founded_year],
      ['Country', c.country],
      ['City', c.city],
      ['Address', c.address],
    ]
    basicsChecks.forEach(([label, val]) => {
      if (isFilled(val)) basics += 1
      else missing.push(label)
    })
    score += Math.round((basics / basicsChecks.length) * W_BASICS)

    // Story
    let story = 0
    const storyChecks: Array<[string, unknown]> = [
      ['Tagline', c.tagline],
      ['Description', c.description],
      ['Hiring process', c.hiring_process],
    ]
    storyChecks.forEach(([label, val]) => {
      if (isFilled(val)) story += 1
      else missing.push(label)
    })
    score += Math.round((story / storyChecks.length) * W_STORY)

    // Culture
    let culture = 0
    if (isFilled(c.culture)) culture += 0.34
    else missing.push('Culture text')
    if (isFilled(c.specialties)) culture += 0.33
    else missing.push('Specialties')
    if (isFilled(c.benefits)) culture += 0.33
    else missing.push('Benefits')
    score += Math.round(culture * W_CULTURE)

    // Social & contact
    let social = 0
    if (isFilled(c.linkedin_url)) social += 0.5
    else missing.push('LinkedIn')
    if (isFilled(c.contact_email) || isFilled(c.contact_phone)) social += 0.5
    else missing.push('Contact (email or phone)')
    score += Math.round(social * W_SOCIAL)

    // Media & leadership
    const leadersCount = (data?.leaders?.length ?? 0)
    const mediaCount = (data?.media?.length ?? 0)
    let ml = 0
    if (leadersCount > 0) ml += 0.5
    else missing.push('At least 1 leader')
    if (mediaCount > 0) ml += 0.5
    else missing.push('At least 1 media item')
    score += Math.round(ml * W_MEDIA_LEADERS)

    // Operational setup
    const hasJobDefaults = !!data?.job_defaults
    const billingStatus = data?.billing?.status
    let ops = 0
    if (hasJobDefaults) ops += 0.5
    else missing.push('Job posting defaults')
    if (isFilled(billingStatus)) ops += 0.5
    else missing.push('Billing setup')
    score += Math.round(ops * W_OPERATIONS)

    // Clamp and compose
    if (score < 0) score = 0
    if (score > total) score = total

    // Deduplicate missing labels while preserving order
    const seen = new Set<string>()
    const uniqueMissing = missing.filter((m) => (seen.has(m) ? false : (seen.add(m), true)))

    return { percentage: score, missing: uniqueMissing }
  }, [data])
}
