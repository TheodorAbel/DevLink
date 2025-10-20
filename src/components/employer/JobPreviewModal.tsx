import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { JobFormData } from "./PostJobForm";
import { JobCard, Job } from "@/components/JobCard";
import { formatDistanceToNow } from "date-fns";

interface JobPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobData: JobFormData;
  companyName?: string;
  companyLogo?: string;
}

export function JobPreviewModal({ 
  isOpen, 
  onClose, 
  jobData, 
  companyName = "Your Company",
  companyLogo 
}: JobPreviewModalProps) {
  
  // Convert JobFormData to Job format for JobCard
  const formatSalary = () => {
    if (jobData.salaryType === 'fixed' && jobData.salary) {
      return `${jobData.currency} ${parseFloat(jobData.salary).toLocaleString()}`;
    }
    if (jobData.salaryType === 'range' && jobData.salaryMin && jobData.salaryMax) {
      return `${jobData.currency} ${parseFloat(jobData.salaryMin).toLocaleString()} - ${parseFloat(jobData.salaryMax).toLocaleString()}`;
    }
    if (jobData.salaryType === 'custom') {
      return jobData.customSalaryMessage;
    }
    return 'Competitive salary';
  };
  
  const previewJob: Job = {
    id: 'preview-' + Date.now(),
    title: jobData.title || 'Job Title',
    company: companyName,
    location: jobData.location || 'Not specified',
    salary: formatSalary(),
    type: jobData.jobType ? jobData.jobType.replace('-', ' ') : 'Not specified',
    postedDate: 'Just now',
    description: jobData.description || 'No description provided',
    skills: jobData.skills || [],
    logo: companyLogo,
    featured: false,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Job Preview</DialogTitle>
          <DialogDescription>
            This is how job seekers will see your job posting
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Use actual JobCard component */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <JobCard
              job={previewJob}
              variant="detailed"
              className="shadow-none border-0"
            />
          </div>

          {/* Additional info not shown in card */}
          {jobData.requirements.length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <h3 className="text-sm font-semibold">Requirements (shown in job details):</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                {jobData.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {jobData.screeningQuestions.length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <h3 className="text-sm font-semibold">Screening Questions ({jobData.screeningQuestions.length}):</h3>
              <p className="text-xs text-muted-foreground">
                Candidates will answer these when applying
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button onClick={onClose}>Close Preview</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
