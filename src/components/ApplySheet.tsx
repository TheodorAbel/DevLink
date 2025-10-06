/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useIsMobile } from './ui/use-mobile'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Checkbox } from './ui/checkbox'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { toast } from 'sonner'
import { CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { fetchPrimaryResume, uploadSeekerResume } from '@/lib/seekerProfile'

// Question types mirror employer PostJobForm
export type ScreeningType = 'yes-no' | 'multiple-choice' | 'checkbox' | 'short-answer'
export type ScreeningOption = { id: string; label: string; value: string }
export type ScreeningQuestion = {
  id: string
  text: string
  type: ScreeningType
  options?: ScreeningOption[]
  required?: boolean
}

const schema = z.object({
  fullName: z.string().min(2, 'Your full name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  resumeChoice: z.enum(['profile', 'upload']),
  resumeFile: z.any().optional(),
  coverLetter: z.string().min(20, 'Cover letter is too short'),
  // Screening answers captured in a generic way (UI only)
  screening: z.record(z.string(), z.any()).optional(),
})

export type ApplySheetProps = {
  open: boolean
  onOpenChange: (next: boolean) => void
  jobTitle: string
  company: string
  jobId: string
  profileResumeName?: string // optional fallback label; will be overridden by fetched primary resume
  onApplied?: () => void
}

export function ApplySheet({ open, onOpenChange, jobTitle, company, jobId, profileResumeName = 'My_Resume.pdf', onApplied }: ApplySheetProps) {
  const isMobile = useIsMobile()
  const [step, setStep] = React.useState(0)
  const [submitting, setSubmitting] = React.useState(false)
  const [primaryResumeName, setPrimaryResumeName] = React.useState<string | null>(null)
  const [hasPrimaryResume, setHasPrimaryResume] = React.useState<boolean>(false)
  const [questions, setQuestions] = React.useState<ScreeningQuestion[]>([])

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      resumeChoice: 'profile',
      coverLetter: '',
      screening: {},
    }
  })

  const resumeChoice = watch('resumeChoice')

  React.useEffect(() => {
    if (!open) {
      setStep(0)
    }
  }, [open])

  // Load auth email and lock it in the form
  React.useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser()
      const email = data?.user?.email || ''
      setValue('email', email)
    })()
  }, [setValue])

  // Fetch primary resume metadata on open to show the correct filename and validate availability
  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const primary = await fetchPrimaryResume()
        if (!mounted) return
        if (primary) {
          setPrimaryResumeName(primary.file_name || null)
          setHasPrimaryResume(true)
        } else {
          setPrimaryResumeName(null)
          setHasPrimaryResume(false)
        }
      } catch {
        if (mounted) {
          setPrimaryResumeName(null)
          setHasPrimaryResume(false)
        }
      }
    })()
    return () => { mounted = false }
  }, [open])

  // Fetch screening questions for the job; skip step if none
  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!open || !jobId) return
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const token = sessionData.session?.access_token
        const res = await fetch(`/api/jobs/${jobId}/questions`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        if (!res.ok) {
          setQuestions([])
          return
        }
        const j = await res.json()
        const raw = (j?.questions || []) as Array<{
          id: string
          question_text: string
          question_type: string
          options?: string[] | { id: string; label: string; value: string }[] | null
          is_required?: boolean
        }>
        const mapped: ScreeningQuestion[] = raw.map((q) => {
          let type: ScreeningType = 'short-answer'
          const qt = (q.question_type || '').toLowerCase()
          if (qt.includes('yes')) type = 'yes-no'
          else if (qt.includes('multiple')) type = 'multiple-choice'
          else if (qt.includes('checkbox')) type = 'checkbox'
          else type = 'short-answer'

          const optsRaw = q.options || []
          const opts: ScreeningOption[] = Array.isArray(optsRaw)
            ? (optsRaw as any[]).map((o: any, idx: number) => {
                if (typeof o === 'string') return { id: String(idx), label: o, value: o }
                return { id: String(o.id ?? idx), label: String(o.label ?? o.value ?? ''), value: String(o.value ?? o.label ?? '') }
              })
            : []
          return { id: q.id, text: q.question_text, type, options: opts, required: !!q.is_required }
        })
        if (mounted) setQuestions(mapped)
      } catch {
        if (mounted) setQuestions([])
      } finally {
        // no-op
      }
    })()
    return () => { mounted = false }
  }, [open, jobId])

  // Prefill existing application when editing
  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!open || !jobId) return
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const token = sessionData.session?.access_token
        if (!token) return
        const res = await fetch(`/api/applications?jobId=${encodeURIComponent(jobId)}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const j = await res.json()
        if (!mounted || !j) return
        if (j.coverLetter) setValue('coverLetter', j.coverLetter)
        if (j.answers && Array.isArray(j.answers)) {
          for (const a of j.answers as Array<{ questionId: string; answerText?: string; selectedOptions?: string[] }>) {
            if (a.selectedOptions && a.selectedOptions.length) {
              setValue(`screening.${a.questionId}` as any, a.selectedOptions)
            } else if (typeof a.answerText === 'string') {
              setValue(`screening.${a.questionId}` as any, a.answerText)
            }
          }
        }
      } catch {
        // ignore
      }
    })()
    return () => { mounted = false }
  }, [open, jobId, setValue])

  const onSubmit = handleSubmit(async (form) => {
    try {
      setSubmitting(true)
      // Resolve resumeUrl: use primary if profile, otherwise upload selected file
      let resumeUrl: string | undefined = undefined
      if (form.resumeChoice === 'profile') {
        const primary = await fetchPrimaryResume()
        resumeUrl = primary?.file_url || undefined
      } else if (form.resumeChoice === 'upload' && form.resumeFile instanceof File) {
        const meta = await uploadSeekerResume(form.resumeFile as File)
        resumeUrl = meta.storagePath
      }

      // Map screening answers
      const answers: Array<{ questionId: string; answerText?: string; selectedOptions?: string[] }> = []
      const record = (form.screening || {}) as Record<string, unknown>
      for (const q of questions) {
        const v = record[q.id]
        if (v === undefined) continue
        if (q.type === 'checkbox') {
          answers.push({ questionId: q.id, selectedOptions: Array.isArray(v) ? (v as string[]) : [] })
        } else if (q.type === 'multiple-choice' || q.type === 'yes-no') {
          answers.push({ questionId: q.id, answerText: String(v) })
        } else {
          answers.push({ questionId: q.id, answerText: typeof v === 'string' ? v : '' })
        }
      }

      // Call applications API
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token
      if (!token) throw new Error('Not authenticated')
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          jobId,
          coverLetter: form.coverLetter,
          resumeUrl,
          answers,
        }),
      })
      if (!res.ok) {
        let msg = 'failed to submit application'
        try { const j = await res.json(); msg = j.error || msg } catch {}
        // If already applied, fall back to updating the application
        if (res.status === 409) {
          const upd = await fetch('/api/applications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ jobId, coverLetter: form.coverLetter, resumeUrl, answers }),
          })
          if (!upd.ok) {
            try { const j2 = await upd.json(); msg = j2.error || msg } catch {}
            throw new Error(msg)
          }
        } else {
          throw new Error(msg)
        }
      }
      toast.success('Application submitted', { description: `${jobTitle} • ${company}` })
      // Notify parent + global listeners
      try { onApplied?.() } catch {}
      try { window.dispatchEvent(new CustomEvent('application:applied', { detail: { jobId } })) } catch {}
      onOpenChange(false)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to submit'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  })

  const steps = [
    { key: 'info', label: 'Your Info' },
    { key: 'resume', label: 'Resume' },
    { key: 'cover', label: 'Cover Letter' },
    ...(questions.length ? [{ key: 'screen', label: 'Screening' }] : []),
    { key: 'review', label: 'Review' },
  ]

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const prev = () => setStep((s) => Math.max(s - 1, 0))

  // Per-step validation to control Next button
  const watched = watch()
  const isStepValid = React.useMemo(() => {
    // Step 0: basic info
    if (step === 0) {
      const nameValid = typeof watched.fullName === 'string' && watched.fullName.trim().length >= 2
      const emailValid = typeof watched.email === 'string' && watched.email.trim().length > 0
      return nameValid && emailValid
    }
    // Step 1: resume
    if (step === 1) {
      if (watched.resumeChoice === 'profile') {
        return hasPrimaryResume
      }
      if (watched.resumeChoice === 'upload') {
        const f = watched.resumeFile as File | undefined
        return !!f && f.type === 'application/pdf'
      }
      return false
    }
    // Step 2: cover letter
    if (step === 2) {
      const cl = watched.coverLetter as string
      return typeof cl === 'string' && cl.trim().length >= 20
    }
    // Step 3: screening (only if present)
    if (step === 3 && questions.length > 0) {
      const answers = (watched.screening || {}) as Record<string, unknown>
      for (const q of questions) {
        if (!q.required) continue
        const v = answers[q.id]
        if (q.type === 'checkbox') {
          if (!Array.isArray(v) || (v as unknown[]).length === 0) return false
        } else {
          if (v === undefined || v === null || String(v).trim() === '') return false
        }
      }
      return true
    }
    // Review step: always valid
    return true
  }, [step, watched, questions, hasPrimaryResume])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? 'bottom' : 'right'} className={isMobile ? 'h-[100dvh] w-full p-0' : 'w-[520px] sm:w-[560px]'}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <SheetHeader>
              <SheetTitle>Apply for {jobTitle}</SheetTitle>
              <SheetDescription>{company}</SheetDescription>
            </SheetHeader>
            {/* Stepper */}
            <div className="mt-3 flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s.key} className={`h-1.5 rounded-full ${i <= step ? 'bg-blue-500' : 'bg-gray-200'} ${isMobile ? 'flex-1' : 'w-16'}`} />
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step-info" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <div className="space-y-3">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input id="fullName" placeholder="Jane Doe" {...register('fullName')} />
                    {errors.fullName && <p className="text-sm text-red-600">{errors.fullName.message}</p>}

                    <Label htmlFor="email" className="mt-4">Email</Label>
                    <Input id="email" type="email" {...register('email')} disabled readOnly className="bg-muted/50 cursor-not-allowed" />
                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}

                    <Label htmlFor="phone" className="mt-4">Phone (optional)</Label>
                    <Input id="phone" placeholder="+1 (555) 123-4567" {...register('phone')} />
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step-resume" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <div className="space-y-4">
                    <Label>Resume</Label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input id="resume_profile" type="radio" name="resumeChoice" value="profile" checked={resumeChoice === 'profile'} onChange={() => setValue('resumeChoice', 'profile')} />
                        <Label htmlFor="resume_profile" className="cursor-pointer">Use profile resume</Label>
                        <Badge variant="secondary" className="ml-auto">{primaryResumeName || profileResumeName}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <input id="resume_upload" type="radio" name="resumeChoice" value="upload" checked={resumeChoice === 'upload'} onChange={() => setValue('resumeChoice', 'upload')} />
                        <Label htmlFor="resume_upload" className="cursor-pointer">Upload a different file (PDF)</Label>
                      </div>
                      {resumeChoice === 'upload' && (
                        <div>
                          <Input type="file" accept="application/pdf" onChange={(e) => setValue('resumeFile', e.target.files?.[0])} />
                          {watched.resumeChoice === 'upload' && !(watched.resumeFile instanceof File) && (
                            <p className="text-sm text-red-600 mt-1">Please select a PDF file</p>
                          )}
                          {watched.resumeChoice === 'upload' && watched.resumeFile instanceof File && watched.resumeFile.type !== 'application/pdf' && (
                            <p className="text-sm text-red-600 mt-1">Only PDF files are allowed</p>
                          )}
                        </div>
                      )}
                      {resumeChoice === 'profile' && !hasPrimaryResume && (
                        <p className="text-sm text-red-600">No profile resume found. Please upload a resume.</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step-cover" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <div className="space-y-3">
                    <Label htmlFor="coverLetter">Cover letter</Label>
                    <Textarea id="coverLetter" placeholder="Write a short cover letter..." className="min-h-[180px]" {...register('coverLetter')} />
                    {errors.coverLetter && <p className="text-sm text-red-600">{errors.coverLetter.message}</p>}
                    <div className="text-xs text-muted-foreground">Tip: highlight 2–3 achievements relevant to this role.</div>
                  </div>
                </motion.div>
              )}

              {step === 3 && questions.length > 0 && (
                <motion.div key="step-screen" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <div className="space-y-4">
                    {questions.map((q) => (
                      <Card key={q.id}>
                        <CardContent className="p-4 space-y-3">
                          <div className="font-medium">{q.text}{q.required ? ' *' : ''}</div>
                          {q.type === 'yes-no' && (
                            <RadioGroup onValueChange={(v) => setValue(`screening.${q.id}` as any, v)}>
                              <div className="flex items-center gap-2"><RadioGroupItem value="yes" id={`yn-${q.id}-y`} /><Label htmlFor={`yn-${q.id}-y`}>Yes</Label></div>
                              <div className="flex items-center gap-2"><RadioGroupItem value="no" id={`yn-${q.id}-n`} /><Label htmlFor={`yn-${q.id}-n`}>No</Label></div>
                            </RadioGroup>
                          )}
                          {q.type === 'multiple-choice' && (
                            <RadioGroup onValueChange={(v) => setValue(`screening.${q.id}` as any, v)}>
                              {q.options?.map((opt) => (
                                <div key={opt.id} className="flex items-center gap-2"><RadioGroupItem value={opt.value} id={`mc-${q.id}-${opt.id}`} /><Label htmlFor={`mc-${q.id}-${opt.id}`}>{opt.label}</Label></div>
                              ))}
                            </RadioGroup>
                          )}
                          {q.type === 'checkbox' && (
                            <div className="space-y-2">
                              {q.options?.map((opt) => (
                                <div key={opt.id} className="flex items-center gap-2">
                                  <Checkbox onCheckedChange={(checked) => {
                                    const prev: string[] = (watch('screening') as any)?.[q.id] || []
                                    const next = checked ? [...prev, opt.value] : prev.filter(v => v !== opt.value)
                                    setValue(`screening.${q.id}` as any, next)
                                  }} id={`cb-${q.id}-${opt.id}`} />
                                  <Label htmlFor={`cb-${q.id}-${opt.id}`}>{opt.label}</Label>
                                </div>
                              ))}
                            </div>
                          )}
                          {q.type === 'short-answer' && (
                            <Textarea placeholder="Your answer" onChange={(e) => setValue(`screening.${q.id}` as any, e.target.value)} />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {((step === 3 && questions.length === 0) || step === 4) && (
                <motion.div key="step-review" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center gap-2 text-green-700"><CheckCircle2 className="h-4 w-4" /><span>Final review</span></div>
                      <div className="text-sm text-muted-foreground">Submit your application for {jobTitle} at {company}.</div>
                      <Separator className="my-2" />
                      <div className="text-sm"><span className="font-medium">Resume:</span> {resumeChoice === 'profile' ? (primaryResumeName || profileResumeName) : ((watched.resumeFile as File | undefined)?.name || 'Uploaded file')}</div>
                      <div className="text-sm"><span className="font-medium">Cover letter:</span> {watch('coverLetter')?.slice(0, 60) || '—'}{watch('coverLetter')?.length > 60 ? '…' : ''}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer actions */}
          <div className="p-4 border-t bg-background">
            <div className="flex items-center justify-between gap-2">
              <Button variant="ghost" onClick={onOpenChange.bind(null, false)}>Cancel</Button>
              <div className="flex items-center gap-2">
                {step > 0 && <Button variant="outline" onClick={prev}>Back</Button>}
                {step < steps.length - 1 && <Button onClick={next} disabled={!isStepValid}>Next</Button>}
                {step === steps.length - 1 && (
                  <Button onClick={onSubmit} disabled={submitting} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {submitting ? 'Submitting…' : 'Submit Application'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
