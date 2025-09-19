import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { JobDetail } from './JobDetail';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Bookmark,
  MapPin, 
  DollarSign, 
  Calendar,
  Clock,
  Trash2,
  Eye,
  Filter,
  Grid,
  List,
  Search,
  BookmarkMinus,
  ExternalLink
} from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { Input } from './ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Job } from './JobCard';
import { toast } from 'sonner';

// Mock saved jobs data
const savedJobsData: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary: '$120K - $160K',
    type: 'Full-time',
    postedDate: '2 days ago',
    description: 'We are looking for an experienced frontend developer to join our team and help build amazing user experiences.',
    skills: ['React', 'TypeScript', 'Next.js'],
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
    description: 'Join our design team to create intuitive and beautiful user interfaces for our products.',
    skills: ['Figma', 'Prototyping', 'User Research']
  },
  {
    id: '3',
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'New York, NY',
    salary: '$100K - $140K',
    type: 'Full-time',
    postedDate: '3 days ago',
    description: 'Lead product strategy and work with cross-functional teams to deliver great products.',
    skills: ['Strategy', 'Analytics', 'Agile']
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'DataCorp',
    location: 'Austin, TX',
    salary: '$110K - $150K',
    type: 'Full-time',
    postedDate: '5 days ago',
    description: 'Analyze complex data sets and build machine learning models to drive business insights.',
    skills: ['Python', 'ML', 'SQL']
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudFirst',
    location: 'Denver, CO',
    salary: '$115K - $145K',
    type: 'Full-time',
    postedDate: '1 week ago',
    description: 'Manage cloud infrastructure and CI/CD pipelines.',
    skills: ['AWS', 'Docker', 'Kubernetes']
  },
  {
    id: '6',
    title: 'Mobile Developer',
    company: 'AppStudio',
    location: 'Seattle, WA',
    salary: '$105K - $135K',
    type: 'Full-time',
    postedDate: '2 weeks ago',
    description: 'Build amazing mobile experiences for iOS and Android.',
    skills: ['React Native', 'Swift', 'Kotlin']
  }
];

interface SavedJobsProps {
  onJobSelect?: (jobId: string) => void;
}

export function SavedJobs({ onJobSelect }: SavedJobsProps) {
  const [jobs, setJobs] = useState(savedJobsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  
  // State for job detail view
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [autoOpenApply, setAutoOpenApply] = useState(false);
  const [selectedJobDetail, setSelectedJobDetail] = useState<string | null>(null);

  // Group jobs by recency
  const recentJobs = jobs.filter(job => {
    const days = getDaysFromPostedDate(job.postedDate);
    return days <= 7;
  });

  const olderJobs = jobs.filter(job => {
    const days = getDaysFromPostedDate(job.postedDate);
    return days > 7;
  });

  function getDaysFromPostedDate(postedDate: string): number {
    if (postedDate.includes('day')) {
      const days = parseInt(postedDate.match(/\d+/)?.[0] || '0');
      return days;
    } else if (postedDate.includes('week')) {
      const weeks = parseInt(postedDate.match(/\d+/)?.[0] || '0');
      return weeks * 7;
    }
    return 0;
  }

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return getDaysFromPostedDate(a.postedDate) - getDaysFromPostedDate(b.postedDate);
      case 'oldest':
        return getDaysFromPostedDate(b.postedDate) - getDaysFromPostedDate(a.postedDate);
      case 'company':
        return a.company.localeCompare(b.company);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleRemoveJob = (jobId: string) => {
    setJobs(jobs.filter(job => job.id !== jobId));
    setSelectedJobs(selectedJobs.filter(id => id !== jobId));
    toast.success('Job removed from saved jobs');
  };

  const handleRemoveSelected = () => {
    setJobs(jobs.filter(job => !selectedJobs.includes(job.id)));
    setSelectedJobs([]);
    toast.success(`${selectedJobs.length} jobs removed from saved jobs`);
  };

  const handleSelectJob = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleSelectAll = () => {
    setSelectedJobs(selectedJobs.length === sortedJobs.length ? [] : sortedJobs.map(job => job.id));
  };

  // Handle job view (View button and card click)
  const handleJobView = (jobId: string) => {
    setAutoOpenApply(false);
    setShowJobDetail(true);
    setSelectedJobDetail(jobId);
    onJobSelect?.(jobId);
  };

  // Handle job apply (Apply button)
  const handleJobApply = (jobId: string) => {
    setAutoOpenApply(true);
    setShowJobDetail(true);
    setSelectedJobDetail(jobId);
    onJobSelect?.(jobId);
  };

  // Handle back from job detail
  const handleBackToSavedJobs = () => {
    setShowJobDetail(false);
    setAutoOpenApply(false);
  };

  const renderJobCard = (job: Job, index: number) => {
    const isSelected = selectedJobs.includes(job.id);
    
    return (
      <motion.div
        key={job.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`group ${viewMode === 'grid' ? '' : 'mb-4'}`}
      >
        <Card className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer border-2 ${
          isSelected ? 'border-blue-300 bg-blue-50/30' : 'border-transparent hover:border-blue-200/50'
        }`}>
          {/* Selection overlay */}
          <div 
            className="absolute top-3 left-3 z-10"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectJob(job.id);
            }}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              isSelected 
                ? 'bg-blue-500 border-blue-500' 
                : 'border-gray-300 hover:border-blue-400 bg-white'
            }`}>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 bg-white rounded-sm"
                />
              )}
            </div>
          </div>

          {job.featured && (
            <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-bl-lg">
              Featured
            </div>
          )}

          <CardContent 
            className="p-6 pl-12"
            onClick={() => handleJobView(job.id)}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-semibold text-blue-600">
                      {job.company.charAt(0)}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-muted-foreground">{job.company}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {job.type}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {job.postedDate}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{job.type}</Badge>
                  {job.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {job.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{job.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-row lg:flex-col gap-2 lg:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJobView(job.id);
                  }}
                  className="flex-1 lg:flex-none"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJobApply(job.id);
                  }}
                  className="flex-1 lg:flex-none bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Apply Now
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveJob(job.id);
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (showJobDetail) {
    return <JobDetail onBack={handleBackToSavedJobs} autoOpenApply={autoOpenApply} jobId={selectedJobDetail} />;
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground variant="gradient" />
      
      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Saved Jobs
          </h1>
          <p className="text-muted-foreground mt-2">
            {jobs.length} saved opportunities • {selectedJobs.length} selected
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search saved jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-none px-3"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-none px-3"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={handleSelectAll}
                  className="whitespace-nowrap"
                >
                  {selectedJobs.length === sortedJobs.length ? 'Deselect All' : 'Select All'}
                </Button>

                {selectedJobs.length > 0 && (
                  <Button
                    variant="destructive"
                    onClick={handleRemoveSelected}
                    className="whitespace-nowrap"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Selected ({selectedJobs.length})
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Empty State */}
        {jobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Card className="max-w-md mx-auto p-8">
              <BookmarkMinus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Saved Jobs</h3>
              <p className="text-sm text-muted-foreground">
                Start exploring jobs and save the ones you're interested in.
              </p>
            </Card>
          </motion.div>
        )}

        {/* Jobs List */}
        {jobs.length > 0 && (
          <>
            {/* Recently Saved */}
            {recentJobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-blue-600" />
                  Recently Saved ({recentJobs.length})
                </h2>
                
                <div className={`${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' 
                    : 'space-y-4'
                }`}>
                  {recentJobs
                    .filter(job => filteredJobs.includes(job))
                    .map((job, index) => renderJobCard(job, index))}
                </div>
              </motion.div>
            )}

            {/* Older Saves */}
            {olderJobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  Older Saves ({olderJobs.length})
                </h2>
                
                <div className={`${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' 
                    : 'space-y-4'
                }`}>
                  {olderJobs
                    .filter(job => filteredJobs.includes(job))
                    .map((job, index) => renderJobCard(job, index + recentJobs.length))}
                </div>
              </motion.div>
            )}

            {/* No Results */}
            {filteredJobs.length === 0 && searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Card className="max-w-md mx-auto p-8">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Results Found</h3>
                  <p className="text-sm text-muted-foreground">
                    No saved jobs match your search for "{searchQuery}".
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery('')}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                </Card>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}