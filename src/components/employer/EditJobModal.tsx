import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { PostJobForm, JobFormData } from "./PostJobForm";
import { useJobById } from "@/hooks/employer/useJobById";
import { Loader2, Edit3, Eye, Save } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { JobPreviewModal } from "./JobPreviewModal";
import { ConfirmChangesDialog } from "./ConfirmChangesDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { useCompany } from "@/hooks/employer/useCompany";
import { useDraftStorage } from "@/hooks/useDraftStorage";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface EditJobModalProps {
  jobId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditJobModal({ jobId, isOpen, onClose }: EditJobModalProps) {
  const queryClient = useQueryClient();
  const { data: job, isLoading, error } = useJobById(jobId);
  const { data: companyBundle } = useCompany();
  const [jobTitle, setJobTitle] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<JobFormData | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [initialFormData, setInitialFormData] = useState<Partial<JobFormData> | null>(null);
  const [changes, setChanges] = useState<string[]>([]);
  
  // Draft storage with jobId as key
  const draftKey = jobId ? `job-draft-${jobId}` : 'job-draft-new';
  const { value: draftData, setValue: setDraftData, clearDraft } = useDraftStorage<Partial<JobFormData> | null>(draftKey, null);

  useEffect(() => {
    if (job) {
      setJobTitle(job.title);
      
      // Map DB job_type format to UI format
      const jobTypeMap: Record<string, string> = {
        'full_time': 'full-time',
        'part_time': 'part-time',
        'contract': 'contract',
        'internship': 'internship',
      };
      
      // Set initial form data from job
      const salaryTypeValue = job.salary_type === 'fixed' ? 'fixed' : job.salary_type === 'range' ? 'range' : job.salary_type === 'competitive' ? 'custom' : 'custom';
      
      const initial: Partial<JobFormData> = {
        title: job.title,
        location: job.location || '',
        jobType: jobTypeMap[job.job_type || ''] || job.job_type || '',
        isRemote: job.is_remote || false,
        salaryType: salaryTypeValue as 'fixed' | 'range' | 'custom',
        salary: job.salary_fixed ? String(job.salary_fixed) : '',
        salaryMin: job.salary_min ? String(job.salary_min) : '',
        salaryMax: job.salary_max ? String(job.salary_max) : '',
        currency: job.salary_currency || 'ETB',
        customSalaryMessage: job.custom_salary_message || 'Competitive salary based on experience',
        deadline: job.application_deadline ? new Date(job.application_deadline) : null,
        description: job.description || '',
        skills: job.skills_required || [],
        requirements: job.requirements || [],
        screeningQuestions: [],
        applicationMethod: (job.application_method as 'platform' | 'website' | 'email') || 'platform',
        applicationUrl: job.application_url || '',
        applicationEmail: job.application_email || '',
      };
      
      // ALWAYS set initial form data from the job (this is the baseline for comparison)
      setInitialFormData(initial);
      
      // If there's NO existing draft, use the job data
      // If there IS a draft, we'll use it (user was editing before)
      if (!draftData || Object.keys(draftData).length === 0) {
        setDraftData(initial);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job, jobId]); // Only run when job or jobId changes, not draftData
  
  // Helper function to safely compare dates (handles Date objects and strings)
  const compareDates = (date1: Date | string | null | undefined, date2: Date | string | null | undefined): boolean => {
    // Convert both to timestamps for comparison
    const time1 = date1 ? (date1 instanceof Date ? date1.getTime() : new Date(date1).getTime()) : null;
    const time2 = date2 ? (date2 instanceof Date ? date2.getTime() : new Date(date2).getTime()) : null;
    return time1 !== time2;
  };

  // Detect changes by comparing current draft with initial
  useEffect(() => {
    if (initialFormData && draftData) {
      console.log('[EditJobModal] ===== CHANGE DETECTION RUNNING =====');
      console.log('[EditJobModal] Initial title:', initialFormData.title);
      console.log('[EditJobModal] Draft title:', draftData.title);
      console.log('[EditJobModal] Initial description:', initialFormData.description?.substring(0, 50));
      console.log('[EditJobModal] Draft description:', draftData.description?.substring(0, 50));
      console.log('[EditJobModal] Initial location:', initialFormData.location);
      console.log('[EditJobModal] Draft location:', draftData.location);
      
      const changesList: string[] = [];
      
      // Compare each field
      if (initialFormData.title !== draftData.title) {
        changesList.push(`Title: "${initialFormData.title}" → "${draftData.title}"`);
      }
      if (initialFormData.location !== draftData.location) {
        changesList.push(`Location: "${initialFormData.location}" → "${draftData.location}"`);
      }
      if (initialFormData.jobType !== draftData.jobType) {
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
        changesList.push(`Job Type: "${formatJobType(initialFormData.jobType || '')}" → "${formatJobType(draftData.jobType || '')}"`);
      }
      if (initialFormData.isRemote !== draftData.isRemote) {
        changesList.push(`Remote: ${initialFormData.isRemote ? 'Yes' : 'No'} → ${draftData.isRemote ? 'Yes' : 'No'}`);
      }
      if (initialFormData.description !== draftData.description) {
        changesList.push('Description updated');
      }
      if (JSON.stringify(initialFormData.skills) !== JSON.stringify(draftData.skills)) {
        changesList.push(`Skills changed`);
      }
      if (JSON.stringify(initialFormData.requirements) !== JSON.stringify(draftData.requirements)) {
        changesList.push(`Requirements changed`);
      }
      
      // Salary changes
      if (initialFormData.salaryType !== draftData.salaryType ||
          initialFormData.salary !== draftData.salary ||
          initialFormData.salaryMin !== draftData.salaryMin ||
          initialFormData.salaryMax !== draftData.salaryMax ||
          initialFormData.currency !== draftData.currency) {
        changesList.push('Salary information updated');
      }
      
      // Application method changes
      if (initialFormData.applicationMethod !== draftData.applicationMethod ||
          initialFormData.applicationUrl !== draftData.applicationUrl ||
          initialFormData.applicationEmail !== draftData.applicationEmail) {
        changesList.push('Application method updated');
      }
      
      // Screening questions
      if (JSON.stringify(initialFormData.screeningQuestions) !== JSON.stringify(draftData.screeningQuestions)) {
        const count = draftData.screeningQuestions?.length || 0;
        changesList.push(`Screening questions ${count > 0 ? `(${count})` : 'removed'}`);
      }
      
      // Safely compare deadlines
      if (compareDates(initialFormData.deadline, draftData.deadline)) {
        changesList.push('Application deadline changed');
      }
      
      console.log('[EditJobModal] Total changes detected:', changesList.length);
      console.log('[EditJobModal] Changes list:', changesList);
      
      setChanges(changesList);
      setHasUnsavedChanges(changesList.length > 0);
    } else {
      console.log('[EditJobModal] Cannot compare - initialFormData:', !!initialFormData, 'draftData:', !!draftData);
    }
  }, [draftData, initialFormData]);

  const handleSaveClick = () => {
    console.log('[EditJobModal] ===== SAVE BUTTON CLICKED =====');
    console.log('[EditJobModal] Current changes array:', changes);
    console.log('[EditJobModal] Changes count:', changes.length);
    console.log('[EditJobModal] Initial data exists:', !!initialFormData);
    console.log('[EditJobModal] Draft data exists:', !!draftData);
    
    if (initialFormData && draftData) {
      console.log('[EditJobModal] Comparing title:', initialFormData.title, '→', draftData.title);
      console.log('[EditJobModal] Comparing description:', 
        initialFormData.description?.substring(0, 30), 
        '→', 
        draftData.description?.substring(0, 30)
      );
      console.log('[EditJobModal] Title match:', initialFormData.title === draftData.title);
      console.log('[EditJobModal] Description match:', initialFormData.description === draftData.description);
    }
    
    if (changes.length === 0) {
      console.log('[EditJobModal] ⚠️ No changes detected, but showing dialog anyway');
    } else {
      console.log('[EditJobModal] ✓ Showing confirmation dialog with', changes.length, 'changes');
    }
    
    setShowConfirmDialog(true);
  };
  
  const handleConfirmSave = async () => {
    console.log('[EditJobModal] ===== STARTING SAVE =====');
    console.log('[EditJobModal] jobId:', jobId);
    console.log('[EditJobModal] draftData exists:', !!draftData);
    
    if (!draftData || !jobId) {
      console.error('[EditJobModal] Missing data - draftData:', !!draftData, 'jobId:', jobId);
      toast.error('Missing job data');
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log('[EditJobModal] Fetching session...');
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('[EditJobModal] ===== SESSION ERROR =====');
        console.error('[EditJobModal] Session error:', sessionError);
        toast.error('Authentication error. Please refresh and try again.');
        setIsSaving(false);
        return;
      }
      
      if (!session?.access_token) {
        console.error('[EditJobModal] ===== NO ACCESS TOKEN =====');
        console.error('[EditJobModal] Session:', session);
        toast.error('Not authenticated. Please log in again.');
        setIsSaving(false);
        return;
      }

      console.log('[EditJobModal] ✓ Session valid');
      console.log('[EditJobModal] ===== BUILDING PAYLOAD =====');

      // Build update payload with validation
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

      const deadlineIso = (() => {
        const v = draftData.deadline as unknown;
        if (!v) return null;
        if (v instanceof Date) return isNaN(v.getTime()) ? null : v.toISOString();
        const d = new Date(v as any);
        return isNaN(d.getTime()) ? null : d.toISOString();
      })();

      const payload = {
        title: draftData.title?.trim() || '',
        description: draftData.description?.trim() || '',
        location: draftData.location?.trim() || '',
        job_type: jobTypeMap[draftData.jobType || ''] || draftData.jobType || '',
        is_remote: Boolean(draftData.isRemote),
        salary_type: salaryTypeMap[draftData.salaryType as 'fixed' | 'range' | 'custom'] || salaryTypeMap['custom'],
        salary_min: draftData.salaryType === 'range' ? Number(draftData.salaryMin) || null : null,
        salary_max: draftData.salaryType === 'range' ? Number(draftData.salaryMax) || null : null,
        salary_fixed: draftData.salaryType === 'fixed' ? Number(draftData.salary) || null : null,
        salary_currency: draftData.currency || 'ETB',
        application_deadline: deadlineIso,
        requirements: (draftData.requirements && draftData.requirements.length) ? draftData.requirements : null,
        skills_required: (draftData.skills && draftData.skills.length) ? draftData.skills : null,
        status: 'active',
      };

      console.log('[EditJobModal] Payload built:');
      console.log('[EditJobModal] - title:', payload.title);
      console.log('[EditJobModal] - location:', payload.location);
      console.log('[EditJobModal] - job_type:', payload.job_type);
      console.log('[EditJobModal] - salary_type:', payload.salary_type);
      console.log('[EditJobModal] - Full payload:', JSON.stringify(payload, null, 2));

      // Validate required fields
      if (!payload.title || !payload.description || !payload.location) {
        console.error('[EditJobModal] ===== VALIDATION FAILED =====');
        console.error('[EditJobModal] Missing required fields:');
        console.error('[EditJobModal] - title:', payload.title);
        console.error('[EditJobModal] - description length:', payload.description?.length);
        console.error('[EditJobModal] - location:', payload.location);
        toast.error('Title, description, and location are required');
        setIsSaving(false);
        return;
      }

      console.log('[EditJobModal] ✓ Validation passed');
      console.log('[EditJobModal] ===== SENDING REQUEST =====');
      console.log('[EditJobModal] URL: /api/jobs/' + jobId);
      console.log('[EditJobModal] Method: PUT');

      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('[EditJobModal] ===== RESPONSE RECEIVED =====');
      console.log('[EditJobModal] Status:', res.status);
      console.log('[EditJobModal] Status Text:', res.statusText);
      console.log('[EditJobModal] OK:', res.ok);

      if (!res.ok) {
        console.error('[EditJobModal] ===== REQUEST FAILED =====');
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        console.error('[EditJobModal] Error response:', JSON.stringify(err, null, 2));
        console.error('[EditJobModal] Error details:', err.details);
        console.error('[EditJobModal] Error message:', err.error);
        toast.error(err.details || err.error || `Failed to update job (${res.status})`);
        setIsSaving(false);
        return;
      }

      const result = await res.json();
      console.log('[EditJobModal] ===== SUCCESS =====');
      console.log('[EditJobModal] Success response:', JSON.stringify(result, null, 2));

      // Success!
      console.log('[EditJobModal] Closing dialog and cleaning up...');
      toast.success('Job updated successfully!', { duration: 4000 });
      setShowConfirmDialog(false);
      setIsSaving(false);
      handleSuccess();
    } catch (e) {
      console.error('[EditJobModal] ===== EXCEPTION CAUGHT =====');
      const msg = e instanceof Error ? e.message : 'Unknown error';
      console.error('[EditJobModal] Exception type:', e?.constructor?.name);
      console.error('[EditJobModal] Exception message:', msg);
      console.error('[EditJobModal] Exception stack:', e instanceof Error ? e.stack : 'N/A');
      console.error('[EditJobModal] Full exception:', e);
      toast.error(`Update failed: ${msg}`);
      setIsSaving(false);
    }
  };
  
  const handleSuccess = () => {
    // Invalidate and refetch employer jobs list to show updated data
    queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
    queryClient.invalidateQueries({ queryKey: ['job', jobId] });
    
    // Clear draft
    clearDraft();
    setHasUnsavedChanges(false);
    
    // Close modal
    onClose();
  };
  
  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowDiscardDialog(true);
    } else {
      onClose();
    }
  };
  
  const handleDiscard = () => {
    clearDraft();
    setHasUnsavedChanges(false);
    setShowDiscardDialog(false);
    onClose();
  };
  
  const handlePreview = (data: JobFormData) => {
    setPreviewData(data);
    setIsPreviewOpen(true);
  };
  
  const handleFormChange = (data: Partial<JobFormData>) => {
    setDraftData(prev => ({ ...prev, ...data }));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (draftData && !isLoading) {
          handleSuccess();
        }
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, draftData, isLoading]);

  return (
    <>
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-2xl lg:max-w-4xl overflow-y-auto p-0"
      >
        <SheetHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Edit3 className="h-5 w-5 text-amber-900 dark:text-amber-200" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <SheetTitle className="text-xl">Edit Job</SheetTitle>
                  {hasUnsavedChanges && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200 font-semibold">
                      Unsaved ({changes.length})
                    </span>
                  )}
                </div>
                <SheetDescription className="text-sm">
                  {jobTitle || "Update job details and save changes"}
                </SheetDescription>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => draftData && handlePreview(draftData)}
                disabled={!draftData}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button 
                size="sm"
                onClick={handleSaveClick}
                disabled={isSaving || !draftData}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="px-6 py-4">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Loading job details...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-destructive font-medium">Failed to load job</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {error instanceof Error ? error.message : 'Unknown error'}
                </p>
              </div>
            </div>
          )}

          {job && !isLoading && draftData && (
            <PostJobForm
              jobId={jobId || undefined}
              isEditMode={true}
              onSaveDraft={handleFormChange}
              onPublish={handleSaveClick}
              onPreview={handlePreview}
              onChange={handleFormChange}
              initialData={draftData}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
    
    {/* Preview Modal */}
    {previewData && (
      <JobPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        jobData={previewData}
        companyName={companyBundle?.company?.company_name ?? "Your Company"}
        companyLogo={companyBundle?.company?.logo_url ?? undefined}
      />
    )}
    
    {/* Beautiful Confirm Save Changes Dialog */}
    <ConfirmChangesDialog
      isOpen={showConfirmDialog}
      onClose={() => setShowConfirmDialog(false)}
      onConfirm={handleConfirmSave}
      changes={changes}
      isLoading={isSaving}
    />
    
    {/* Discard Changes Dialog */}
    <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes to this job posting. If you close now, your changes will be lost.
            Your draft is automatically saved and will be available when you reopen this job for editing.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowDiscardDialog(false)}>
            Keep Editing
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDiscard} className="bg-destructive hover:bg-destructive/90">
            Discard Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
