import React from 'react';
import { motion } from 'framer-motion';
import { ProfileProgress } from './ProfileProgress';
import { JobCard, Job } from './JobCard';
import { NotificationWidget } from './NotificationWidget';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  TrendingUp, 
  Eye, 
  FileText, 
  CheckCircle, 
  Clock, 
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';

// Mock data
const recentJobs: Job[] = [
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
  }
];

const savedJobs: Job[] = [
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
  }
];

const applications = [
  { id: '1', company: 'TechCorp', position: 'Frontend Developer', status: 'interview', date: '2024-01-20' },
  { id: '2', company: 'DesignStudio', position: 'UX Designer', status: 'pending', date: '2024-01-18' },
  { id: '3', company: 'StartupXYZ', position: 'Product Manager', status: 'rejected', date: '2024-01-15' },
  { id: '4', company: 'DataCorp', position: 'Data Scientist', status: 'applied', date: '2024-01-12' }
];

const recommendations: Job[] = [
  {
    id: '5',
    title: 'Full Stack Developer',
    company: 'InnovateLab',
    location: 'Seattle, WA',
    salary: '$130K - $170K',
    type: 'Full-time',
    postedDate: '1 day ago',
    description: 'Build end-to-end solutions with modern web technologies.',
    skills: ['React', 'Node.js', 'AWS']
  },
  {
    id: '6',
    title: 'Senior UI/UX Designer',
    company: 'CreativeAgency',
    location: 'Los Angeles, CA',
    salary: '$95K - $130K',
    type: 'Full-time',
    postedDate: '2 days ago',
    description: 'Create amazing user experiences for our client projects.',
    skills: ['Design Systems', 'Figma', 'Animation']
  }
];

interface DashboardProps {
  onPageChange?: (page: string) => void;
}

export function Dashboard({ onPageChange }: DashboardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interview': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'applied': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'interview': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      case 'applied': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleProfileStepClick = (stepId: string) => {
    // Map step ids to ProfileEdit tabs
    const map: Record<string, string> = {
      basic: 'personal',
      experience: 'experience',
      resume: 'resume',
      contact: 'personal',
    };
    const tab = map[stepId] || 'personal';
    onPageChange?.(`profile:${tab}`);
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground variant="gradient" />
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, Sarah! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your job search today
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <Card className="relative overflow-hidden cursor-pointer" onClick={() => onPageChange?.('applications')}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100/30" />
                <CardContent className="p-4 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Profile Views</p>
                      <p className="text-2xl font-bold text-blue-600">127</p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden cursor-pointer" onClick={() => onPageChange?.('applications')}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100/30" />
                <CardContent className="p-4 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Applications</p>
                      <p className="text-2xl font-bold text-green-600">23</p>
                    </div>
                    <FileText className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden cursor-pointer" onClick={() => onPageChange?.('applications')}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100/30" />
                <CardContent className="p-4 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Response Rate</p>
                      <p className="text-2xl font-bold text-purple-600">34%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Job Postings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/20" />
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Job Postings</CardTitle>
                    <Button 
                      variant="outline" 
                      onClick={() => onPageChange?.('jobs')}
                      className="hover:bg-blue-50"
                    >
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  {recentJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <JobCard 
                        job={job} 
                        variant="compact"
                        onApply={() => console.log('Apply to', job.id)}
                        onSave={() => console.log('Save', job.id)}
                        onView={() => onPageChange?.('job-detail')}
                      />
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Recommendations Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-pink-50/20" />
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🤖</span>
                    AI Job Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((job, index) => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <JobCard 
                          job={job} 
                          variant="compact"
                          onApply={() => console.log('Apply to', job.id)}
                          onSave={() => console.log('Save', job.id)}
                          onView={() => onPageChange?.('job-detail')}
                        />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Profile Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ProfileProgress onStepClick={handleProfileStepClick} />
            </motion.div>

            {/* Notifications Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <NotificationWidget onViewAll={() => onPageChange?.('notifications')} />
            </motion.div>

            {/* Saved Jobs Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-orange-50/30" />
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <CardTitle>Saved Jobs</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onPageChange?.('saved-jobs')}
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-3">
                  {savedJobs.slice(0, 3).map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-3 bg-white/50 rounded-lg border border-gray-100 hover:bg-white/80 transition-all cursor-pointer"
                      onClick={() => onPageChange?.('job-detail')}
                    >
                      <h4 className="font-medium text-sm line-clamp-1">{job.title}</h4>
                      <p className="text-xs text-muted-foreground">{job.company}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">{job.type}</Badge>
                        <span className="text-xs text-muted-foreground">{job.salary}</span>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Application Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-teal-50/30" />
                <CardHeader className="relative">
                  <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-3">
                  {applications.slice(0, 4).map((app, index) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-gray-100 cursor-pointer"
                      onClick={() => onPageChange?.('applications')}
                    >
                      <div>
                        <h4 className="font-medium text-sm">{app.position}</h4>
                        <p className="text-xs text-muted-foreground">{app.company}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getStatusColor(app.status)}`}
                        >
                          <div className="flex items-center gap-1">
                            {getStatusIcon(app.status)}
                            {app.status}
                          </div>
                        </Badge>
                        <span className="text-xs text-muted-foreground">{app.date}</span>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}