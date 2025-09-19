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
  DollarSign, 
  Calendar,
  Filter,
  SlidersHorizontal,
  Bell,
  Eye,
  ChevronDown,
  Grid,
  List
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
} from './ui/sheet';
import { Slider } from './ui/slider';
import { toast } from 'sonner';

// Mock data
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
  }
];

const recentlyViewedJobs = mockJobs.slice(0, 3);

interface JobListProps {
  onJobSelect: (jobId: string) => void;
}

export function JobList({ onJobSelect }: JobListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [jobType, setJobType] = useState('all');
  const [salaryRange, setSalaryRange] = useState([0, 200000]);
  const [showFilters, setShowFilters] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(true);
  
  // New state for job detail view
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [autoOpenApply, setAutoOpenApply] = useState(false);

  // State for job alert panel
  const [showJobAlertPanel, setShowJobAlertPanel] = useState(false);
  const [alertCreated, setAlertCreated] = useState(false);

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

  // Handle job card click to show detail view
  const handleJobView = (jobId: string) => {
    setSelectedJobId(jobId);
    setAutoOpenApply(false);
    setShowJobDetail(true);
  };

  // Handle apply button click to show detail view with auto-open apply
  const handleJobApply = (jobId: string) => {
    setSelectedJobId(jobId);
    setAutoOpenApply(true);
    setShowJobDetail(true);
  };

  // Handle back from job detail
  const handleBackToJobs = () => {
    setShowJobDetail(false);
    setAutoOpenApply(false);
    setSelectedJobId(null);
  };

  // If showing job detail, render JobDetail component
  if (showJobDetail) {
    return (
      <JobDetail
        jobId={selectedJobId!}
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
            {filteredJobs.length} opportunities waiting for you
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
              {sortedJobs.map((job, index) => (
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
                    onSave={(jobId) => console.log('Save', jobId)}
                    onView={(jobId) => handleJobView(jobId)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex justify-center"
            >
              <div className="flex gap-2">
                <Button variant="outline" disabled>Previous</Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Next</Button>
              </div>
            </motion.div>
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
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative overflow-hidden rounded-lg"
                  >
                    <Button 
                      className={`w-full relative transition-all duration-300 ${
                        alertCreated 
                          ? 'bg-green-600 hover:bg-green-600 cursor-default' 
                          : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 hover:shadow-lg hover:shadow-green-500/25'
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
    </div>
  );
}