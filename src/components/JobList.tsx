import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JobCard, Job } from './JobCard';
import { JobDetail } from './JobDetail';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal,
  Bell,
  Eye,
  Grid,
  List,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from './ui/sheet';
import { Slider } from './ui/slider';
import { toast } from 'sonner';

// Mock data - expanded for pagination testing
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary: '$120K - $160K',
    type: 'Full-time',
    postedDate: '2 days ago',
    description: 'We are looking for an experienced frontend developer to join our team and help build amazing user experiences with React and TypeScript.',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    featured: true
  },
  {
    id: '2',
    title: 'UX Designer',
    company: 'DesignStudio',
    location: 'Remote',
    salary: '$80K - $110K',
    type: 'Full-time',
    postedDate: '1 day ago',
    description: 'Join our design team to create intuitive and beautiful user interfaces for our products. Experience with Figma and design systems required.',
    skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems']
  },
  {
    id: '3',
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'New York, NY',
    salary: '$100K - $140K',
    type: 'Full-time',
    postedDate: '3 days ago',
    description: 'Lead product strategy and work with cross-functional teams to deliver great products that users love.',
    skills: ['Strategy', 'Analytics', 'Agile', 'Roadmapping']
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'DataCorp',
    location: 'Austin, TX',
    salary: '$110K - $150K',
    type: 'Full-time',
    postedDate: '5 days ago',
    description: 'Analyze complex data sets and build machine learning models to drive business insights and recommendations.',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow']
  },
  {
    id: '5',
    title: 'Full Stack Developer',
    company: 'InnovateLab',
    location: 'Seattle, WA',
    salary: '$130K - $170K',
    type: 'Full-time',
    postedDate: '1 week ago',
    description: 'Build end-to-end solutions with modern web technologies. Experience with both frontend and backend required.',
    skills: ['React', 'Node.js', 'AWS', 'PostgreSQL']
  },
  {
    id: '6',
    title: 'DevOps Engineer',
    company: 'CloudFirst',
    location: 'Denver, CO',
    salary: '$115K - $145K',
    type: 'Full-time',
    postedDate: '1 week ago',
    description: 'Manage cloud infrastructure and CI/CD pipelines. Help scale our platform to support millions of users.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform']
  },
  {
    id: '7',
    title: 'Backend Developer',
    company: 'ServerTech',
    location: 'Chicago, IL',
    salary: '$105K - $135K',
    type: 'Full-time',
    postedDate: '4 days ago',
    description: 'Build scalable backend services and APIs. Work with microservices architecture and cloud technologies.',
    skills: ['Node.js', 'Python', 'MongoDB', 'Redis']
  },
  {
    id: '8',
    title: 'Mobile Developer',
    company: 'AppWorks',
    location: 'Los Angeles, CA',
    salary: '$95K - $125K',
    type: 'Full-time',
    postedDate: '6 days ago',
    description: 'Develop native mobile applications for iOS and Android platforms using React Native.',
    skills: ['React Native', 'iOS', 'Android', 'JavaScript']
  },
  {
    id: '9',
    title: 'QA Engineer',
    company: 'TestPro',
    location: 'Boston, MA',
    salary: '$75K - $95K',
    type: 'Full-time',
    postedDate: '1 week ago',
    description: 'Ensure software quality through comprehensive testing strategies and automation.',
    skills: ['Selenium', 'Jest', 'Cypress', 'API Testing']
  },
  {
    id: '10',
    title: 'Security Engineer',
    company: 'SecureNet',
    location: 'Washington, DC',
    salary: '$125K - $155K',
    type: 'Full-time',
    postedDate: '2 weeks ago',
    description: 'Implement security measures and conduct vulnerability assessments for enterprise applications.',
    skills: ['Cybersecurity', 'Penetration Testing', 'SIEM', 'Compliance']
  },
  {
    id: '11',
    title: 'AI/ML Engineer',
    company: 'AITech',
    location: 'Palo Alto, CA',
    salary: '$140K - $180K',
    type: 'Full-time',
    postedDate: '3 days ago',
    description: 'Develop machine learning models and AI solutions for cutting-edge applications.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning'],
    featured: true
  },
  {
    id: '12',
    title: 'Cloud Architect',
    company: 'CloudSys',
    location: 'Remote',
    salary: '$150K - $190K',
    type: 'Full-time',
    postedDate: '5 days ago',
    description: 'Design and implement cloud infrastructure solutions for enterprise clients.',
    skills: ['AWS', 'Azure', 'GCP', 'Terraform']
  }
];

const recentlyViewedJobs = mockJobs.slice(0, 3);

interface JobListProps {
  onJobSelect: (jobId: string) => void;
}

export function JobList({ onJobSelect: _onJobSelect }: JobListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [jobType, setJobType] = useState('all');
  const [salaryRange, setSalaryRange] = useState([0, 200000]);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(true);
  void _onJobSelect;
  
  // Saved jobs state
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;
  
  // New state for job detail view
  // selectedJobId removed since it was not being used to render anything
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [autoOpenApply, setAutoOpenApply] = useState(false);

  // State for job alert panel
  const [showJobAlertPanel, setShowJobAlertPanel] = useState(false);
  const [alertCreated, setAlertCreated] = useState(false);

  // Job Alert form state
  const [alertTitle, setAlertTitle] = useState("");
  const [alertLocation, setAlertLocation] = useState<string>("Remote");
  const [alertTypes, setAlertTypes] = useState<Record<'Full-time' | 'Part-time' | 'Remote', boolean>>({
    'Full-time': true,
    'Part-time': false,
    'Remote': false,
  });
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Instant'>("Daily");
  const [delivery, setDelivery] = useState<'Email' | 'SMS' | 'Push'>("Email");

  // Multi-step and saved alerts state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  type AlertItem = {
    id: string;
    title: string;
    location: string;
    types: string[];
    frequency: 'Daily' | 'Weekly' | 'Instant';
    delivery: 'Email' | 'SMS' | 'Push';
  };
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const atLeastOneType = Object.values(alertTypes).some(Boolean);
  const isValidStep1 = alertTitle.trim().length > 0 && atLeastOneType;
  const isValidStep2 = Boolean(frequency) && Boolean(delivery);
  const isValidAll = isValidStep1 && isValidStep2;

  const resetForm = () => {
    setAlertTitle("");
    setAlertLocation("Remote");
    setAlertTypes({ 'Full-time': true, 'Part-time': false, 'Remote': false });
    setFrequency("Daily");
    setDelivery("Email");
    setCurrentStep(1);
  };

  const createAlert = () => {
    if (!isValidAll) return;
    const item: AlertItem = {
      id: crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
      title: alertTitle.trim(),
      location: alertLocation,
      types: Object.entries(alertTypes).filter(([,v])=>v).map(([k])=>k),
      frequency,
      delivery,
    };
    setAlerts(prev => [item, ...prev]);
    setAlertCreated(true);
    toast.success(`Job Alert created! We'll notify you about new '${item.title}' jobs.`);
    setTimeout(() => {
      setShowJobAlertPanel(false);
      resetForm();
    }, 1200);
  };

  const deleteAlert = (id: string) => setAlerts(prev => prev.filter(a => a.id !== id));

  // Handle save job
  const handleSaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      const newSavedJobs = new Set(prev);
      if (newSavedJobs.has(jobId)) {
        newSavedJobs.delete(jobId);
        toast.success('Job removed from saved jobs');
      } else {
        newSavedJobs.add(jobId);
        toast.success('Job saved successfully!');
      }
      return newSavedJobs;
    });
  };

  // Handle share job
  const handleShareJob = (jobId: string) => {
    const job = mockJobs.find(j => j.id === jobId);
    if (job) {
      const shareUrl = `${window.location.origin}/jobs/${jobId}/share`;
      if (navigator.share) {
        navigator.share({
          title: `${job.title} at ${job.company}`,
          text: `Check out this job opportunity: ${job.title} at ${job.company}`,
          url: shareUrl,
        }).catch(() => {
          // Fallback to clipboard
          navigator.clipboard.writeText(shareUrl);
          toast.success('Job link copied to clipboard!');
        });
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl);
        toast.success('Job link copied to clipboard!');
      }
    }
  };

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesJobType = jobType === 'all' || job.type === jobType;
    
    // Simple salary filter (assuming salary format like "$120K - $160K")
    const salaryMatch = true; // Simplified for demo
    
    return matchesSearch && matchesJobType && salaryMatch;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      case 'salary':
        return 0; // Simplified for demo
      case 'company':
        return a.company.localeCompare(b.company);
      default:
        return 0;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = sortedJobs.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle job card click to show detail view
  const handleJobView = (_jobId?: string) => {
    setAutoOpenApply(false);
    setShowJobDetail(true);
  };

  // Handle apply button click to show detail view with auto-open apply
  const handleJobApply = (_jobId?: string) => {
    setAutoOpenApply(true);
    setShowJobDetail(true);
  };

  // Handle back from job detail
  const handleBackToJobs = () => {
    setShowJobDetail(false);
    setAutoOpenApply(false);
  };

  // If showing job detail, render JobDetail component
  if (showJobDetail) {
    return (
      <JobDetail
        onBack={handleBackToJobs}
        autoOpenApply={autoOpenApply}
      />
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Discover Your Dream Job
          </h1>
          <p className="text-muted-foreground mt-2">
            {filteredJobs.length} opportunities waiting for you • Page {currentPage} of {totalPages}
          </p>
        </motion.div>

        {/* Notification Prompt */}
        <AnimatePresence>
          {showNotificationPrompt && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Card className="border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium text-blue-900">Stay Updated</h3>
                        <p className="text-sm text-blue-700">Get notified when new jobs matching your preferences are posted</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowNotificationPrompt(false)}>
                        Maybe Later
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Enable Notifications
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex gap-2 flex-wrap lg:flex-nowrap">
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger className="w-32 h-12">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 h-12">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                  </SelectContent>
                </Select>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="h-12">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Advanced Filters</SheetTitle>
                      <SheetDescription>
                        Refine your job search with detailed criteria
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="py-6 space-y-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Salary Range</label>
                        <Slider
                          value={salaryRange}
                          onValueChange={setSalaryRange}
                          max={200000}
                          min={0}
                          step={5000}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-2">
                          <span>${salaryRange[0].toLocaleString()}</span>
                          <span>${salaryRange[1].toLocaleString()}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Location</label>
                        <Input placeholder="City, State, or Remote" />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Experience Level</label>
                        <div className="space-y-2">
                          {['Entry Level', 'Mid Level', 'Senior Level', 'Executive'].map((level) => (
                            <div key={level} className="flex items-center space-x-2">
                              <input type="checkbox" id={level} className="rounded" />
                              <label htmlFor={level} className="text-sm">{level}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-none px-3"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-none px-3"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Job List */}
          <div className="xl:col-span-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 lg:grid-cols-2' 
                  : 'grid-cols-1'
              }`}
            >
              {currentJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <JobCard
                    job={job}
                    variant={viewMode === 'list' ? 'compact' : 'default'}
                    onApply={(jobId) => handleJobApply(jobId)}
                    onSave={handleSaveJob}
                    onShare={handleShareJob}
                    onView={(jobId) => handleJobView(jobId)}
                    isSaved={savedJobs.has(job.id)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex justify-center"
              >
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  {/* Page numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(page)}
                        className="w-10 h-10"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recently Viewed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-red-50/30" />
                <div className="relative p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Recently Viewed
                  </h3>
                  <div className="space-y-3">
                    {recentlyViewedJobs.map((job, index) => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-3 bg-white/50 rounded-lg border border-gray-100 hover:bg-white/80 transition-all cursor-pointer"
                        onClick={() => handleJobView(job.id)}
                      >
                        <h4 className="font-medium text-sm line-clamp-1">{job.title}</h4>
                        <p className="text-xs text-muted-foreground">{job.company}</p>
                        <Badge variant="outline" className="text-xs mt-1">{job.type}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Job Alert */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-teal-50/30" />
                <div className="relative p-4">
                  <h3 className="font-semibold mb-2">Create Job Alert</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get notified when jobs matching your search are posted
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative overflow-hidden rounded-lg"
                  >
                    <Button 
                      className={`w-full relative transition-all duration-300 will-change-transform ${
                        alertCreated 
                          ? 'bg-green-600 hover:bg-green-600 cursor-default' 
                          : 'bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-green-400 hover:shadow-lg hover:shadow-green-500/25'
                      }`}
                      onClick={() => !alertCreated && setShowJobAlertPanel(true)}
                      disabled={alertCreated}
                    >
                      <motion.div
                        animate={alertCreated ? {} : { rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                        className="mr-2"
                      >
                        {alertCreated ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            ✅
                          </motion.div>
                        ) : (
                          <Bell className="h-4 w-4" />
                        )}
                      </motion.div>
                      {alertCreated ? 'Alert Created' : 'Create Alert'}
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Job Alert Modal (Sheet) */}
      <Sheet open={showJobAlertPanel} onOpenChange={(o) => setShowJobAlertPanel(o)}>
        <SheetContent side="right" className="bg-white border-l shadow-xl rounded-l-xl p-0 max-w-md sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Create Job Alert</SheetTitle>
            <SheetDescription>Get notified when new jobs match your preferences.</SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-4">
            {/* Step indicators (interactive) */}
            <div className="flex items-center gap-3 pt-1 pb-4">
              {[1,2,3].map((s) => (
                <button
                  key={s}
                  aria-label={`Go to step ${s}`}
                  className={`size-2.5 rounded-full transition ${currentStep === s ? 'bg-primary scale-110' : 'bg-muted hover:bg-muted-foreground/30'}`}
                  onClick={() => setCurrentStep(s as 1|2|3)}
                />
              ))}
            </div>

            {/* Steps container: vertical scroll if needed */}
            <div className="space-y-5 overflow-y-auto pr-1" style={{ maxHeight: 'calc(100vh - 11rem)' }}>
              {/* Step 1: Basics */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="alert-title" className="text-sm font-medium mb-2 block">Job Title / Keywords</label>
                    <Input id="alert-title" placeholder="e.g., Frontend Developer" value={alertTitle} onChange={(e) => setAlertTitle(e.target.value)} />
                    {!alertTitle.trim() && (<p className="text-xs text-red-600 mt-1">Title is required.</p>)}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Select value={alertLocation} onValueChange={setAlertLocation}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Remote">Remote</SelectItem>
                          <SelectItem value="Addis Ababa">Addis Ababa</SelectItem>
                          <SelectItem value="San Francisco">San Francisco</SelectItem>
                          <SelectItem value="New York">New York</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Job Type</label>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {(['Full-time','Part-time','Remote'] as const).map(t => (
                        <label key={t} className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={alertTypes[t]} onChange={(e) => setAlertTypes((s) => ({...s, [t]: e.target.checked}))} className="rounded" />
                          {t}
                        </label>
                      ))}
                    </div>
                    {!atLeastOneType && (<p className="text-xs text-red-600 mt-1">Select at least one type.</p>)}
                  </div>
                </div>
              )}

              {/* Step 2: Preferences */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Notification Frequency</label>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {(['Daily','Weekly','Instant'] as const).map((f: 'Daily'|'Weekly'|'Instant') => (
                        <label key={f} className="flex items-center gap-2 rounded-md border p-2 text-sm cursor-pointer">
                          <input type="radio" name="frequency" value={f} checked={frequency === f} onChange={(e) => setFrequency(e.target.value as 'Daily'|'Weekly'|'Instant')} />
                          <span>{f}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {frequency === 'Instant' ? "You'll receive alerts instantly." : frequency === 'Daily' ? "You'll receive alerts once per day." : "You'll receive alerts once per week."}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Delivery Method</label>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {(['Email','SMS','Push'] as const).map((d: 'Email'|'SMS'|'Push') => (
                        <label key={d} className="flex items-center gap-2 rounded-md border p-2 text-sm cursor-pointer">
                          <input type="radio" name="delivery" value={d} checked={delivery === d} onChange={(e) => setDelivery(e.target.value as 'Email'|'SMS'|'Push')} />
                          <span>{d}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {delivery === 'Email' ? "We'll send alerts to your signup email." : delivery === 'SMS' ? "SMS will be sent to your verified phone." : "You'll see alerts as push notifications."}
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Preview & Manage */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="pt-1">
                    <h4 className="font-medium mb-2">Preview of Matching Jobs</h4>
                    <div className="space-y-2">
                      {mockJobs.slice(0, 3).map((job) => (
                        <div key={job.id} className="rounded-md border p-3">
                          <div className="font-medium text-sm">{job.title}</div>
                          <div className="text-xs text-muted-foreground">{job.company} • {job.location} • {job.type}</div>
                        </div>
                      ))}
                      {mockJobs.length === 0 && (
                        <div className="text-xs text-muted-foreground">No matching jobs yet. Try adjusting filters.</div>
                      )}
                    </div>
                  </div>
                  <div className="pt-2">
                    <h4 className="font-medium mb-2">Your Alerts</h4>
                    <div className="space-y-2">
                      {alerts.length === 0 && <div className="text-xs text-muted-foreground">You have no alerts yet.</div>}
                      {alerts.map(a => (
                        <div key={a.id} className="flex items-center justify-between rounded-md border p-3">
                          <div>
                            <div className="font-medium text-sm">{a.title}</div>
                            <div className="text-xs text-muted-foreground">{a.location} • {a.types.join(', ')} • {a.frequency} • {a.delivery}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => { setAlertTitle(a.title); setAlertLocation(a.location); setAlertTypes({ 'Full-time': a.types.includes('Full-time'), 'Part-time': a.types.includes('Part-time'), 'Remote': a.types.includes('Remote') }); setFrequency(a.frequency); setDelivery(a.delivery); setCurrentStep(1); }}>Edit</Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteAlert(a.id)}>Delete</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky footer controls */}
          <SheetFooter className="sticky bottom-0 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-t p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={() => setCurrentStep((s) => (Math.max(1, (s as number) - 1) as 1|2|3))}>Back</Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => { setShowJobAlertPanel(false); }}>Cancel</Button>
                {currentStep < 3 ? (
                  <Button className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed" disabled={currentStep === 1 ? !isValidStep1 : !isValidStep2} onClick={() => setCurrentStep((s) => (Math.min(3, (s as number) + 1) as 1|2|3))}>Next</Button>
                ) : (
                  <Button className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isValidAll} onClick={createAlert}>Create Alert</Button>
                )}
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}