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
import { FileText, CheckCircle2 } from 'lucide-react'

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
  screening: z.record(z.any()).optional(),
})

export type ApplySheetProps = {
  open: boolean
  onOpenChange: (next: boolean) => void
  jobTitle: string
  company: string
  profileResumeName?: string // e.g., from ProfileEdit mock
  screeningQuestions?: ScreeningQuestion[]
}

export function ApplySheet({ open, onOpenChange, jobTitle, company, profileResumeName = 'My_Resume.pdf', screeningQuestions = [] }: ApplySheetProps) {
  const isMobile = useIsMobile()
  const [step, setStep] = React.useState(0)
  const [submitting, setSubmitting] = React.useState(false)

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

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 900))
    setSubmitting(false)
    toast.success('Application submitted', { description: `${jobTitle} • ${company}` })
    onOpenChange(false)
  })

  const steps = [
    { key: 'info', label: 'Your Info' },
    { key: 'resume', label: 'Resume' },
    { key: 'cover', label: 'Cover Letter' },
    ...(screeningQuestions.length ? [{ key: 'screen', label: 'Screening' }] : []),
    { key: 'review', label: 'Review' },
  ]

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const prev = () => setStep((s) => Math.max(s - 1, 0))

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
                    <Input id="email" placeholder="jane@email.com" type="email" {...register('email')} />
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
                        <Badge variant="secondary" className="ml-auto">{profileResumeName}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <input id="resume_upload" type="radio" name="resumeChoice" value="upload" checked={resumeChoice === 'upload'} onChange={() => setValue('resumeChoice', 'upload')} />
                        <Label htmlFor="resume_upload" className="cursor-pointer">Upload a different file (PDF)</Label>
                      </div>
                      {resumeChoice === 'upload' && (
                        <div>
                          <Input type="file" accept="application/pdf" onChange={(e) => setValue('resumeFile', e.target.files?.[0])} />
                        </div>
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

              {step === 3 && screeningQuestions.length > 0 && (
                <motion.div key="step-screen" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <div className="space-y-4">
                    {screeningQuestions.map((q) => (
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

              {((step === 3 && screeningQuestions.length === 0) || step === 4) && (
                <motion.div key="step-review" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center gap-2 text-green-700"><CheckCircle2 className="h-4 w-4" /><span>Final review</span></div>
                      <div className="text-sm text-muted-foreground">Submit your application for {jobTitle} at {company}.</div>
                      <Separator className="my-2" />
                      <div className="text-sm"><span className="font-medium">Resume:</span> {resumeChoice === 'profile' ? profileResumeName : 'Uploaded file'}</div>
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
                {step < steps.length - 1 && <Button onClick={next}>Next</Button>}
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
