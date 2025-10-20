import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { X, Plus, Save, Eye, Trash2, HelpCircle, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useExpensiveToast } from "@/hooks/useExpensiveToast";
import { ConfirmChangesDialog } from "./ConfirmChangesDialog";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "../../lib/utils";
import { supabase } from "@/lib/supabaseClient";

interface ScreeningQuestion {
  id: string;
  text: string;
  type: 'yes-no' | 'multiple-choice' | 'checkbox' | 'short-answer';
  options?: string[];
  required: boolean;
  autoFilter: boolean;
}

export interface JobFormData {
  title: string;
  location: string;
  jobType: string;
  isRemote: boolean;
  salaryType: 'range' | 'fixed' | 'custom';
  salary: string;
  salaryMin: string;
  salaryMax: string;
  currency: string;
  customSalaryMessage: string;
  deadline: Date | null;
  description: string;
  skills: string[];
  screeningQuestions: ScreeningQuestion[];
  applicationMethod: 'platform' | 'website' | 'email';
  applicationUrl?: string;
  applicationEmail?: string;
  requirements: string[];
}

interface PostJobFormProps {
  onSaveDraft: (data: JobFormData) => void;
  onPublish: (data: JobFormData) => void;
  onPreview: (data: JobFormData) => void;
  initialData?: Partial<JobFormData>;
  jobId?: string; // If provided, we're editing an existing job
  isEditMode?: boolean; // Visual indicator for edit mode
  onChange?: (data: Partial<JobFormData>) => void; // Track form changes for drafts
}

export function PostJobForm({ 
  onSaveDraft, 
  onPublish, 
  onPreview,
  initialData = {},
  jobId,
  isEditMode = false,
  onChange
}: PostJobFormProps) {
  const xToast = useExpensiveToast();
  const [isLoadingJob, setIsLoadingJob] = useState(false);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    location: '',
    jobType: '',
    isRemote: false,
    salaryType: 'range',
    salary: '',
    salaryMin: '',
    salaryMax: '',
    currency: 'ETB',
    customSalaryMessage: 'Competitive salary based on experience',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
    description: '',
    skills: [],
    screeningQuestions: [],
    applicationMethod: 'platform',
    applicationUrl: '',
    applicationEmail: '',
    requirements: [],
    ...initialData
  });

  const [newSkill, setNewSkill] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<ScreeningQuestion>({
    id: '',
    text: '',
    type: 'yes-no',
    options: [],
    required: false,
    autoFilter: false
  });
  const [newOption, setNewOption] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [changes, setChanges] = useState<string[]>([]);
  const [initialFormData, setInitialFormData] = useState<Partial<JobFormData> | null>(null);

  // Load initialData when provided (for edit mode)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      // Normalize deadline which might arrive as a string/number from API
      const normalizeDeadline = (val: unknown): Date | null => {
        if (!val) return null;
        if (val instanceof Date) return val;
        const d = new Date(val as any);
        return isNaN(d.getTime()) ? null : d;
      };
      
      // Map DB job_type format to UI format
      const jobTypeMap: Record<string, string> = {
        'full_time': 'full-time',
        'part_time': 'part-time',
        'contract': 'contract',
        'internship': 'internship',
      };
      
      const normalized = {
        ...initialData,
        jobType: initialData.jobType ? (jobTypeMap[initialData.jobType] || initialData.jobType) : '',
        deadline: normalizeDeadline((initialData as any).deadline ?? null),
      };
      setFormData(prev => ({ ...prev, ...normalized }));
      // Store initial data for change tracking
      if (jobId) {
        setInitialFormData(normalized);
      }
    }
  }, [initialData, jobId]);
  
  // Track changes for edit mode
  useEffect(() => {
    if (!jobId || !initialFormData) return;
    
    const changesList: string[] = [];
    
    if (initialFormData.title !== formData.title) {
      changesList.push(`Title: "${initialFormData.title}" → "${formData.title}"`);
    }
    if (initialFormData.location !== formData.location) {
      changesList.push(`Location: "${initialFormData.location}" → "${formData.location}"`);
    }
    if (initialFormData.jobType !== formData.jobType) {
      const formatJobType = (type: string) => {
        const map: Record<string, string> = {
          'full-time': 'Full-time',
          'part-time': 'Part-time',
          'contract': 'Contract',
          'freelance': 'Freelance',
          'internship': 'Internship',
        };
        return map[type] || type;
      };
      changesList.push(`Job Type: "${formatJobType(initialFormData.jobType || '')}" → "${formatJobType(formData.jobType || '')}"`);
    }
    if (initialFormData.isRemote !== formData.isRemote) {
      changesList.push(`Remote: ${initialFormData.isRemote ? 'Yes' : 'No'} → ${formData.isRemote ? 'Yes' : 'No'}`);
    }
    if (initialFormData.description !== formData.description) {
      changesList.push('Description updated');
    }
    if (JSON.stringify(initialFormData.skills) !== JSON.stringify(formData.skills)) {
      changesList.push('Skills changed');
    }
    if (JSON.stringify(initialFormData.requirements) !== JSON.stringify(formData.requirements)) {
      changesList.push('Requirements changed');
    }
    if (initialFormData.salaryType !== formData.salaryType ||
        initialFormData.salary !== formData.salary ||
        initialFormData.salaryMin !== formData.salaryMin ||
        initialFormData.salaryMax !== formData.salaryMax ||
        initialFormData.currency !== formData.currency) {
      changesList.push('Salary information updated');
    }
    
    if (initialFormData.applicationMethod !== formData.applicationMethod ||
        initialFormData.applicationUrl !== formData.applicationUrl ||
        initialFormData.applicationEmail !== formData.applicationEmail) {
      changesList.push('Application method updated');
    }
    
    if (JSON.stringify(initialFormData.screeningQuestions) !== JSON.stringify(formData.screeningQuestions)) {
      const count = formData.screeningQuestions?.length || 0;
      changesList.push(`Screening questions ${count > 0 ? `(${count})` : 'removed'}`);
    }
    
    const time1 = initialFormData.deadline ? (initialFormData.deadline instanceof Date ? initialFormData.deadline.getTime() : new Date(initialFormData.deadline as any).getTime()) : null;
    const time2 = formData.deadline ? (formData.deadline instanceof Date ? formData.deadline.getTime() : new Date(formData.deadline).getTime()) : null;
    if (time1 !== time2) {
      changesList.push('Application deadline changed');
    }
    
    setChanges(changesList);
  }, [formData, initialFormData, jobId]);
  
  // Track form changes for draft saving (debounced to avoid excessive updates)
  useEffect(() => {
    if (!onChange) return;
    
    const timeoutId = setTimeout(() => {
      onChange(formData);
    }, 500); // Debounce by 500ms
    
    return () => clearTimeout(timeoutId);
  }, [formData, onChange]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (reqToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(r => r !== reqToRemove)
    }));
  };

  const handleAddQuestion = () => {
    if (currentQuestion.text.trim()) {
      const newQuestion: ScreeningQuestion = {
        ...currentQuestion,
        id: Date.now().toString(),
        text: currentQuestion.text.trim(),
        options: currentQuestion.type === 'yes-no' 
          ? ['Yes', 'No'] 
          : currentQuestion.options?.filter(opt => opt.trim() !== '') || []
      };
      
      setFormData(prev => ({
        ...prev,
        screeningQuestions: [...prev.screeningQuestions, newQuestion]
      }));
      
      setCurrentQuestion({
        id: '',
        text: '',
        type: 'yes-no',
        options: [],
        required: false,
        autoFilter: false
      });
    }
  };

  const handleRemoveQuestion = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      screeningQuestions: prev.screeningQuestions.filter(q => q.id !== questionId)
    }));
  };

  const handleAddOption = () => {
    if (newOption.trim()) {
      setCurrentQuestion(prev => ({
        ...prev,
        options: [...(prev.options || []), newOption.trim()]
      }));
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSaveDraft = () => {
    onSaveDraft(formData);
    toast.success("Job saved as draft");
  };

  const handlePublish = async () => {
    // If editing via modal (like EditJobModal), delegate to parent's onPublish
    // The parent will show its own confirmation dialog and handle the update
    if (jobId && isEditMode) {
      onPublish(formData);
      return;
    }
    
    // If editing but NOT in modal mode, show our own confirmation dialog
    if (jobId) {
      setShowConfirmDialog(true);
      return;
    }
    
    // Original publish logic for new jobs
    if (isPublishing) return;
    setIsPublishing(true);
    // Basic required fields
    if (!formData.title.trim() || !formData.description.trim() || !formData.jobType.trim()) {
      toast.error("Please fill in all required fields: Title, Job Type, Description");
      setIsPublishing(false);
      return;
    }
    // Schema requires location NOT NULL
    if (!formData.location.trim()) {
      toast.error("Location is required");
      setIsPublishing(false);
      return;
    }

    // Validate application method specifics
    if (formData.applicationMethod === 'website') {
      const url = (formData.applicationUrl || '').trim();
      const isValidUrl = /^https?:\/\//i.test(url);
      if (!url || !isValidUrl) {
        toast.error("Please provide a valid application URL (http/https)");
        setIsPublishing(false);
        return;
      }
    }
    if (formData.applicationMethod === 'email') {
      const email = (formData.applicationEmail || '').trim();
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!email || !isValidEmail) {
        toast.error("Please provide a valid application email address");
        setIsPublishing(false);
        return;
      }
    }

    // Salary validations based on type
    if (formData.salaryType === 'range') {
      const min = Number(formData.salaryMin);
      const max = Number(formData.salaryMax);
      if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0 || max <= 0 || min > max) {
        toast.error("Please provide a valid salary range (min <= max, both > 0)");
        setIsPublishing(false);
        return;
      }
    }
    if (formData.salaryType === 'fixed') {
      const amt = Number(formData.salary);
      if (!Number.isFinite(amt) || amt <= 0) {
        toast.error("Please provide a valid fixed salary amount (> 0)");
        setIsPublishing(false);
        return;
      }
    }

    // Resolve current user + company_id
    const { data: sessionRes } = await supabase.auth.getSession();
    const user = sessionRes?.session?.user ?? null;
    if (!user) {
      toast.error("You must be logged in to publish a job");
      setIsPublishing(false);
      return;
    }

    // Prefer server bootstrap (service role) to get role/company_id reliably
    let companyId: string | undefined = undefined;
    let effectiveRole: string | undefined = undefined;
    try {
      const accessToken = sessionRes?.session?.access_token;
      const res = await fetch('/api/user/bootstrap', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const out = await res.json().catch(() => ({}));
      console.log('Bootstrap result:', res.status, out);
      companyId = out?.company_id || undefined;
      effectiveRole = (out?.role as string | undefined)?.toLowerCase();
    } catch (e) {
      console.error('Bootstrap request failed:', e);
    }

    // Fallbacks to metadata if server failed
    if (!companyId) companyId = user.user_metadata?.company_id as string | undefined;
    if (!effectiveRole) effectiveRole = (user.user_metadata?.role as string | undefined)?.toLowerCase();

    if (effectiveRole !== 'employer') {
      toast.error("Only employer accounts can publish jobs. Your role: " + (effectiveRole || 'unknown'));
      setIsPublishing(false);
      return;
    }

    if (!companyId) {
      toast.error("Complete your company profile to link a company before posting jobs");
      setIsPublishing(false);
      return;
    }

    console.log('Publishing with company_id:', companyId);

    // Map UI fields to schema
    const jobTypeMap: Record<string, string> = {
      'full-time': 'full_time',
      'part-time': 'part_time',
      'contract': 'contract',
      'freelance': 'contract', // map freelance to contract if using schema set
      'internship': 'internship',
    };

    const applicationMethodMap: Record<JobFormData['applicationMethod'], 'internal' | 'external' | 'email'> = {
      platform: 'internal',
      website: 'external',
      email: 'email',
    };

    // Salary mapping
    let salary_type: string | null = null;
    let salary_min: number | null = null;
    let salary_max: number | null = null;
    let salary_fixed: number | null = null;
    const salary_currency: string | null = formData.currency || 'ETB';
    let custom_salary_message: string | null = null;

    if (formData.salaryType === 'range') {
      salary_type = 'range';
      salary_min = Number(formData.salaryMin);
      salary_max = Number(formData.salaryMax);
    } else if (formData.salaryType === 'fixed') {
      salary_type = 'fixed';
      salary_fixed = Number(formData.salary);
    } else {
      salary_type = 'competitive';
      custom_salary_message = formData.customSalaryMessage?.trim() || 'Competitive salary based on experience';
    }

    // Insert job
    const jobPayload = {
      company_id: companyId,
      posted_by_user_id: user.id,
      title: formData.title.trim(),
      location: formData.location.trim(),
      job_type: jobTypeMap[formData.jobType] || formData.jobType,
      is_remote: !!formData.isRemote,
      remote_policy: formData.isRemote ? 'hybrid' : null,
      salary_type,
      salary_min,
      salary_max,
      salary_fixed,
      salary_currency,
      custom_salary_message,
      description: formData.description.trim(),
      requirements: formData.requirements.length ? formData.requirements : null,
      skills_required: formData.skills.length ? formData.skills : null,
      application_deadline: formData.deadline ? new Date(formData.deadline) : null,
      application_method: applicationMethodMap[formData.applicationMethod],
      application_url: formData.applicationMethod === 'website' ? (formData.applicationUrl || null) : null,
      application_email: formData.applicationMethod === 'email' ? (formData.applicationEmail || null) : null,
      status: 'active',
      published_at: new Date().toISOString(),
    } as const;

    const { data: inserted, error: insertErr } = await supabase
      .from('jobs')
      .insert(jobPayload)
      .select('id')
      .maybeSingle();

    if (insertErr || !inserted?.id) {
      // Surface details for debugging
      console.error('Publish job failed:', { insertErr });
      if (insertErr?.message && String(insertErr.message).includes('RLS')) {
        toast.error("Permission denied. Ensure your account is linked to a company.");
      } else {
        toast.error("Failed to publish job. Please try again.");
      }
      setIsPublishing(false);
      return;
    }

    const insertedJobId = inserted.id as string;

    // Insert screening questions if any
    if (formData.screeningQuestions.length) {
      const qTypeMap: Record<ScreeningQuestion['type'], 'text' | 'multiple_choice' | 'yes_no'> = {
        'yes-no': 'yes_no',
        'multiple-choice': 'multiple_choice',
        'checkbox': 'multiple_choice',
        'short-answer': 'text',
      };

      const rows = formData.screeningQuestions.map((q, idx) => ({
        job_id: insertedJobId,
        question_text: q.text,
        question_type: qTypeMap[q.type],
        options: q.options && q.options.length ? q.options : null,
        is_required: q.required,
        auto_filter: q.autoFilter,
        display_order: idx,
      }));

      const { error: qErr } = await supabase
        .from('screening_questions')
        .insert(rows);

      if (qErr) {
        console.error('Failed to insert screening questions:', qErr);
        toast.warning("Job published, but adding screening questions failed");
      }
    }

    onPublish(formData);
    toast.success("Job published successfully");
    setIsPublishing(false);
  };

  const handleUpdateJob = async () => {
    console.log('[PostJobForm] ===== STARTING UPDATE =====');
    console.log('[PostJobForm] jobId:', jobId);
    console.log('[PostJobForm] formData:', formData);
    setIsPublishing(true);
    
    try {
      console.log('[PostJobForm] Fetching session...');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('[PostJobForm] No access token found');
        xToast.error({ title: 'Not authenticated', description: 'Please log in to update jobs.' });
        setIsPublishing(false);
        return;
      }
      console.log('[PostJobForm] ✓ Session valid');

      // Build update payload
      console.log('[PostJobForm] ===== BUILDING PAYLOAD =====');
      console.log('[PostJobForm] formData.title:', formData.title);
      console.log('[PostJobForm] formData.description:', formData.description?.substring(0, 50) + '...');
      console.log('[PostJobForm] formData.location:', formData.location);
      console.log('[PostJobForm] formData.jobType:', formData.jobType);
      console.log('[PostJobForm] formData.salaryType:', formData.salaryType);
      
      const jobTypeMap: Record<string, string> = {
        'full-time': 'full_time',
        'part-time': 'part_time',
        'contract': 'contract',
        'freelance': 'contract',
        'internship': 'internship',
      };

      const salaryTypeMap: Record<'range' | 'fixed' | 'custom', 'range' | 'fixed' | 'competitive'> = {
        range: 'range',
        fixed: 'fixed',
        custom: 'competitive',
      };

      // Safely serialize deadline to ISO if valid
      const deadlineIso = (() => {
        const v = formData.deadline as unknown;
        if (!v) return null;
        if (v instanceof Date) return isNaN(v.getTime()) ? null : v.toISOString();
        const d = new Date(v as any);
        return isNaN(d.getTime()) ? null : d.toISOString();
      })();

      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        job_type: jobTypeMap[formData.jobType] || formData.jobType,
        is_remote: formData.isRemote,
        salary_type: salaryTypeMap[formData.salaryType],
        salary_min: formData.salaryType === 'range' ? Number(formData.salaryMin) || null : null,
        salary_max: formData.salaryType === 'range' ? Number(formData.salaryMax) || null : null,
        salary_fixed: formData.salaryType === 'fixed' ? Number(formData.salary) || null : null,
        salary_currency: formData.currency,
        application_deadline: deadlineIso,
        requirements: formData.requirements?.length ? formData.requirements : null,
        skills_required: formData.skills?.length ? formData.skills : null,
        status: 'active',
      };
      
      console.log('[PostJobForm] ===== PAYLOAD BUILT =====');
      console.log('[PostJobForm] Payload:', JSON.stringify(payload, null, 2));
      console.log('[PostJobForm] Payload keys:', Object.keys(payload));
      console.log('[PostJobForm] Payload field values:');
      Object.entries(payload).forEach(([key, value]) => {
        console.log(`[PostJobForm]   - ${key}:`, typeof value === 'string' && value.length > 50 ? value.substring(0, 50) + '...' : value);
      });

      console.log('[PostJobForm] ===== SENDING REQUEST =====');
      console.log('[PostJobForm] URL:', `/api/jobs/${jobId}`);
      console.log('[PostJobForm] Method: PUT');
      
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('[PostJobForm] ===== RESPONSE RECEIVED =====');
      console.log('[PostJobForm] Status:', res.status);
      console.log('[PostJobForm] Status Text:', res.statusText);
      console.log('[PostJobForm] OK:', res.ok);

      if (!res.ok) {
        console.error('[PostJobForm] ===== REQUEST FAILED =====');
        let errBody: any = null;
        const ct = res.headers.get('content-type') || '';
        try {
          if (ct.includes('application/json')) {
            errBody = await res.json();
          } else {
            const text = await res.text();
            errBody = { error: text };
          }
        } catch (parseErr) {
          console.error('[PostJobForm] Failed to parse error response as JSON:', parseErr);
          errBody = { error: 'Request failed', details: `Status ${res.status} ${res.statusText}` };
        }
        console.error('[PostJobForm] Error response:', JSON.stringify(errBody, null, 2));
        xToast.error({ title: 'Failed to update job', description: errBody?.error || 'Could not update job.' });
        setIsPublishing(false);
        return;
      }

      const result = await res.json();
      console.log('[PostJobForm] ===== SUCCESS =====');
      console.log('[PostJobForm] Success response:', JSON.stringify(result, null, 2));
      
      xToast.success({ 
        title: 'Job updated', 
        description: 'The job posting has been updated successfully.',
        duration: 4000
      });
      
      setShowConfirmDialog(false);
      
      // Call the onPublish callback to trigger navigation
      onPublish(formData);
    } catch (e) {
      console.error('[PostJobForm] ===== EXCEPTION CAUGHT =====');
      const msg = e instanceof Error ? e.message : 'Unknown error';
      console.error('[PostJobForm] Exception type:', e?.constructor?.name);
      console.error('[PostJobForm] Exception message:', msg);
      console.error('[PostJobForm] Exception stack:', e instanceof Error ? e.stack : 'N/A');
      console.error('[PostJobForm] Full exception:', e);
      xToast.error({ title: 'Update failed', description: msg });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <TooltipProvider>
      <div className={isEditMode ? 'space-y-6 pb-20' : 'max-w-4xl mx-auto space-y-6'}>
        {!isEditMode && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-medium">{jobId ? 'Edit Job' : 'Post New Job'}</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onPreview(formData)}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button 
              onClick={handlePublish} 
              disabled={isPublishing}
            >
              {isPublishing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {jobId ? 'Updating...' : 'Publishing...'}
                </span>
              ) : (
                jobId ? 'Save Changes' : 'Publish Job'
              )}
            </Button>
          </div>
        </div>
        )}
        
        {/* Edit Mode: Sticky Footer - Hidden when used in EditJobModal (buttons are in header) */}
        {/* {isEditMode && (
          <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t p-4 flex items-center justify-end gap-3 z-50">
            <Button 
              variant="outline" 
              onClick={() => onPreview(formData)}
              disabled={isPublishing}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={handlePublish} 
              disabled={isPublishing}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {isPublishing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Changes...
                </span>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        )} */}

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Senior Software Engineer"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. San Francisco, CA"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type *</Label>
              <Select 
                name="jobType"
                value={formData.jobType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, jobType: value }))}
              >
                <SelectTrigger id="jobType">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="remote"
                checked={formData.isRemote}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRemote: checked }))}
              />
              <Label htmlFor="remote">Remote Work Available</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground ml-1" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-sm">
                      Enable this if the position can be performed remotely (fully or partially). 
                      This will be visible to job seekers.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="salaryType">Salary Type</Label>
              <Select 
                name="salaryType"
                value={formData.salaryType} 
                onValueChange={(value: 'range' | 'fixed' | 'custom') => {
                  setFormData(prev => ({
                    ...prev, 
                    salaryType: value,
                    // Clear salary fields when switching to custom message
                    ...(value === 'custom' ? { 
                      salary: '',
                      salaryMin: '',
                      salaryMax: ''
                    } : {})
                  }));
                }}
              >
                <SelectTrigger id="salaryType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="range">Salary Range</SelectItem>
                  <SelectItem value="fixed">Fixed Salary</SelectItem>
                  <SelectItem value="custom">Custom Salary Message</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.salaryType === 'range' && (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="salaryMin" className="sr-only">Minimum Salary</Label>
                  <Input
                    id="salaryMin"
                    value={formData.salaryMin}
                    onChange={(e) => setFormData(prev => ({ ...prev, salaryMin: e.target.value }))}
                    placeholder="Min salary"
                    type="number"
                  />
                </div>
                <div>
                  <Label htmlFor="salaryMax" className="sr-only">Maximum Salary</Label>
                  <Input
                    id="salaryMax"
                    value={formData.salaryMax}
                    onChange={(e) => setFormData(prev => ({ ...prev, salaryMax: e.target.value }))}
                    placeholder="Max salary"
                    type="number"
                  />
                </div>
                <div>
                  <Label htmlFor="currencyRange" className="sr-only">Currency</Label>
                  <Select 
                    name="currencyRange"
                    value={formData.currency} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger id="currencyRange">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETB">ETB</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {formData.salaryType === 'fixed' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="salaryFixed" className="sr-only">Salary Amount</Label>
                  <Input
                    id="salaryFixed"
                    value={formData.salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                    placeholder="Salary amount"
                    type="number"
                  />
                </div>
                <div>
                  <Label htmlFor="currencyFixed" className="sr-only">Currency</Label>
                  <Select 
                    name="currencyFixed"
                    value={formData.currency} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger id="currencyFixed">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETB">ETB</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}


            {formData.salaryType === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="customSalary">Custom Salary Message</Label>
                <Input
                  id="customSalary"
                  value={formData.customSalaryMessage}
                  onChange={(e) => setFormData(prev => ({ ...prev, customSalaryMessage: e.target.value }))}
                  placeholder="e.g., Competitive salary, Negotiable based on experience"
                />
                <p className="text-xs text-muted-foreground">
                  This message will be displayed instead of a specific salary range
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Application Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deadline ? (
                      format(formData.deadline, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.deadline || undefined}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, deadline: date }))}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={8}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newSkill">Required Skills</Label>
            <div className="flex gap-2">
              <Input
                id="newSkill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              />
              <Button type="button" onClick={handleAddSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newRequirement">Job Requirements</Label>
            <div className="flex gap-2">
              <Input
                id="newRequirement"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Add a requirement..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddRequirement()}
              />
              <Button type="button" onClick={handleAddRequirement}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.requirements.map((req) => (
                <Badge key={req} variant="secondary" className="gap-1">
                  {req}
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(req)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicationMethod">How should candidates apply?</Label>
              <Select
                name="applicationMethod"
                value={formData.applicationMethod}
                onValueChange={(value: 'platform' | 'website' | 'email') =>
                  setFormData(prev => ({
                    ...prev,
                    applicationMethod: value,
                    applicationUrl: value === 'website' ? prev.applicationUrl || '' : '',
                    applicationEmail: value === 'email' ? prev.applicationEmail || '' : '',
                  }))
                }
              >
                <SelectTrigger id="applicationMethod">
                  <SelectValue placeholder="Select application method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="platform">Through this platform</SelectItem>
                  <SelectItem value="website">Company website</SelectItem>
                  <SelectItem value="email">By email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.applicationMethod === 'website' && (
              <div className="space-y-2">
                <Label htmlFor="applicationUrl">Application URL *</Label>
                <Input
                  id="applicationUrl"
                  value={formData.applicationUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicationUrl: e.target.value }))}
                  placeholder="https://company.com/careers/apply"
                />
              </div>
            )}

            {formData.applicationMethod === 'email' && (
              <div className="space-y-2">
                <Label htmlFor="applicationEmail">Application Email *</Label>
                <Input
                  id="applicationEmail"
                  type="email"
                  value={formData.applicationEmail || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicationEmail: e.target.value }))}
                  placeholder="jobs@company.com"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Screening Questions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add questions to help filter and evaluate candidates
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Existing Questions */}
          {formData.screeningQuestions.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Added Questions</h4>
              {formData.screeningQuestions.map((question) => (
                <Card key={question.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{question.text}</span>
                        <Badge variant={question.type === 'yes-no' ? 'default' : 'secondary'}>
                          {question.type === 'yes-no' ? 'Yes/No' : 
                           question.type === 'multiple-choice' ? 'Multiple Choice' :
                           question.type === 'checkbox' ? 'Checkbox' : 'Short Answer'}
                        </Badge>
                        {question.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                        {question.autoFilter && (
                          <Badge variant="outline" className="text-xs">Auto-filter</Badge>
                        )}
                      </div>
                      {question.options && question.options.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {question.options.map((option, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {option}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveQuestion(question.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Add New Question */}
          <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
            <h4 className="font-medium">Add New Question</h4>
            
            <div className="space-y-2">
              <Label htmlFor="questionText">Question Text</Label>
              <Input
                id="questionText"
                value={currentQuestion.text}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                placeholder="e.g., Do you have 3+ years of React experience?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answerType">Answer Type</Label>
              <Select 
                name="answerType"
                value={currentQuestion.type} 
                onValueChange={(value: 'yes-no' | 'multiple-choice' | 'checkbox' | 'short-answer') => 
                  setCurrentQuestion(prev => ({ 
                    ...prev, 
                    type: value,
                    options: value === 'yes-no' ? ['Yes', 'No'] : []
                  }))
                }
              >
                <SelectTrigger id="answerType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes-no">✅ Yes / No</SelectItem>
                  <SelectItem value="multiple-choice">🔘 Multiple Choice (Single Select)</SelectItem>
                  <SelectItem value="checkbox">☑️ Checkbox (Multi Select)</SelectItem>
                  <SelectItem value="short-answer">✍️ Short Answer (Text)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'checkbox') && (
              <div className="space-y-2">
                <Label htmlFor="newOption">Answer Options</Label>
                <div className="flex gap-2">
                  <Input
                    id="newOption"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Add an option..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                  />
                  <Button type="button" onClick={handleAddOption}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentQuestion.options?.map((option, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {option}
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="required"
                  checked={currentQuestion.required}
                  onCheckedChange={(checked) => setCurrentQuestion(prev => ({ ...prev, required: checked }))}
                />
                <Label htmlFor="required" className="text-sm">Required</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoFilter"
                  checked={currentQuestion.autoFilter}
                  onCheckedChange={(checked) => setCurrentQuestion(prev => ({ ...prev, autoFilter: checked }))}
                />
                <Label htmlFor="autoFilter" className="text-sm">Auto-filter</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">
                        Mark if this question should be used to automatically filter applications
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <Button 
              type="button" 
              onClick={handleAddQuestion}
              disabled={!currentQuestion.text.trim()}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </CardContent>
      </Card>

      </div>
      
      {/* Confirmation Dialog for Edit Mode - Only show when NOT in modal (EditJobModal has its own) */}
      {jobId && !isEditMode && (
        <ConfirmChangesDialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={handleUpdateJob}
          changes={changes}
          isLoading={isPublishing}
        />
      )}
    </TooltipProvider>
  );
}