import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ApplicationsList } from "./ApplicationsList";
import { ApplicationDetail } from "./ApplicationDetail";
import { 
  Briefcase, 
  Users, 
  Eye, 
  ArrowLeft,
  Plus
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  status: 'active' | 'inactive' | 'draft' | 'closed';
  applicantsCount: number;
  viewsCount: number;
  postedDate: string;
  location: string;
  jobType: string;
  salary: string;
}

interface Application {
  id: string;
  candidateName: string;
  candidateTitle: string;
  candidateLocation: string;
  candidateAvatar?: string;
  appliedDate: string;
  status: 'applied' | 'viewed' | 'interview_scheduled' | 'accepted' | 'rejected';
  rating?: number;
  coverLetterSummary: string;
  screeningSummary: string;
  jobTitle: string;
}

interface JobsOverviewProps {
  onCreateJob: () => void;
}

// Mock data
const mockJobs: Job[] = [
  {
    id: 'job_1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    status: 'active',
    applicantsCount: 23,
    viewsCount: 342,
    postedDate: 'Jan 10, 2025',
    location: 'San Francisco, CA',
    jobType: 'Full Time',
    salary: '$120k - $160k'
  },
  {
    id: 'job_2',
    title: 'UI/UX Designer',
    company: 'TechCorp',
    status: 'inactive',
    applicantsCount: 12,
    viewsCount: 156,
    postedDate: 'Dec 28, 2024',
    location: 'Remote',
    jobType: 'Full Time',
    salary: '$90k - $130k'
  },
  {
    id: 'job_3',
    title: 'Data Analyst',
    company: 'TechCorp',
    status: 'active',
    applicantsCount: 18,
    viewsCount: 278,
    postedDate: 'Jan 8, 2025',
    location: 'New York, NY',
    jobType: 'Contract',
    salary: '$80k - $110k'
  }
];

const mockApplications: Application[] = [
  {
    id: 'app_1',
    candidateName: 'Alice Johnson',
    candidateTitle: 'Senior React Developer',
    candidateLocation: 'San Francisco, CA',
    appliedDate: 'Jan 12, 2025',
    status: 'applied',
    rating: 4.8,
    coverLetterSummary: 'Passionate React developer with 5+ years of experience building scalable applications...',
    screeningSummary: 'React: 5+ years, TypeScript: Yes, Remote: Preferred',
    jobTitle: 'Frontend Developer'
  },
  {
    id: 'app_2',
    candidateName: 'Brian Smith',
    candidateTitle: 'Frontend Engineer',
    candidateLocation: 'Los Angeles, CA',
    appliedDate: 'Jan 11, 2025',
    status: 'viewed',
    rating: 4.6,
    coverLetterSummary: 'Frontend engineer passionate about user experience and modern web technologies...',
    screeningSummary: 'React: 3+ years, TypeScript: Yes, Remote: Open',
    jobTitle: 'Frontend Developer'
  },
  {
    id: 'app_3',
    candidateName: 'Chen Wei',
    candidateTitle: 'Full Stack Developer',
    candidateLocation: 'Seattle, WA',
    appliedDate: 'Jan 10, 2025',
    status: 'interview_scheduled',
    rating: 4.9,
    coverLetterSummary: 'Full stack developer with strong React and Node.js background, interested in frontend focus...',
    screeningSummary: 'React: 4+ years, TypeScript: Expert, Remote: Yes',
    jobTitle: 'Frontend Developer'
  },
  {
    id: 'app_4',
    candidateName: 'Diana Lopez',
    candidateTitle: 'React Developer',
    candidateLocation: 'Austin, TX',
    appliedDate: 'Jan 9, 2025',
    status: 'rejected',
    rating: 3.8,
    coverLetterSummary: 'Junior React developer looking to grow in a senior role...',
    screeningSummary: 'React: 2 years, TypeScript: Learning, Remote: Required',
    jobTitle: 'Frontend Developer'
  },
  {
    id: 'app_5',
    candidateName: 'Ethan Brown',
    candidateTitle: 'Senior Frontend Engineer',
    candidateLocation: 'Boston, MA',
    appliedDate: 'Jan 8, 2025',
    status: 'accepted',
    rating: 4.9,
    coverLetterSummary: 'Senior frontend engineer with extensive React and team leadership experience...',
    screeningSummary: 'React: 6+ years, TypeScript: Expert, Remote: Flexible',
    jobTitle: 'Frontend Developer'
  }
];

const statusConfig = {
  active: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Active' },
  inactive: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Inactive' },
  draft: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Draft' },
  closed: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Closed' }
};

export function JobsOverview({ onCreateJob }: JobsOverviewProps) {
  const [currentView, setCurrentView] = useState<'jobs' | 'applications' | 'application-detail'>('jobs');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredJobs = mockJobs.filter(job => 
    statusFilter === 'all' || job.status === statusFilter
  );

  const handleViewApplications = (job: Job) => {
    setSelectedJob(job);
    setCurrentView('applications');
  };

  const handleViewApplication = (applicationId: string) => {
    setSelectedApplication(applicationId);
    setCurrentView('application-detail');
  };

  const handleBack = () => {
    if (currentView === 'application-detail') {
      setCurrentView('applications');
    } else if (currentView === 'applications') {
      setCurrentView('jobs');
      setSelectedJob(null);
    }
  };

  const handleMessageCandidate = (candidateId: string) => {
    // Handle messaging logic
    console.log('Message candidate:', candidateId);
  };

  const statusCounts = {
    all: mockJobs.length,
    active: mockJobs.filter(j => j.status === 'active').length,
    inactive: mockJobs.filter(j => j.status === 'inactive').length,
    draft: mockJobs.filter(j => j.status === 'draft').length,
    closed: mockJobs.filter(j => j.status === 'closed').length,
  };

  if (currentView === 'application-detail' && selectedApplication) {
    return (
      <ApplicationDetail
        applicationId={selectedApplication}
        onBack={handleBack}
      />
    );
  }

  if (currentView === 'applications' && selectedJob) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-medium">Applications</h1>
            <p className="text-muted-foreground">{selectedJob.title}</p>
          </div>
        </div>
        
        <ApplicationsList
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
          applications={mockApplications}
          onViewApplication={handleViewApplication}
          onMessageCandidate={handleMessageCandidate}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium">Applications Overview</h1>
          <p className="text-muted-foreground">Manage your job postings and review applications</p>
        </div>
        <Button onClick={onCreateJob}>
          <Plus className="h-4 w-4 mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Status Filter Badges */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Badge
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            className="cursor-pointer capitalize"
            onClick={() => setStatusFilter(status)}
          >
            {status} ({count})
          </Badge>
        ))}
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No jobs found</p>
              <p className="text-sm mt-1">
                {statusFilter !== 'all' 
                  ? 'Try adjusting your filters'
                  : 'Create your first job posting to get started'
                }
              </p>
            </div>
            {statusFilter === 'all' && (
              <Button onClick={onCreateJob} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Post Your First Job
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const statusStyle = statusConfig[job.status];
            
            return (
              <Card key={job.id} className="hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt={`${job.company} logo`} />
                        <AvatarFallback>{job.company.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${statusStyle.color}`}
                    >
                      {statusStyle.label}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>{job.location} • {job.jobType}</div>
                    <div>{job.salary}</div>
                    <div>Posted {job.postedDate}</div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{job.applicantsCount} applicants</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{job.viewsCount} views</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleViewApplications(job)}
                    disabled={job.applicantsCount === 0}
                  >
                    {job.applicantsCount === 0 ? 'No Applications Yet' : 'View Applications'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}