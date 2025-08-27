import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Target,
  Heart,
  X,
  Bookmark,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Star,
  RotateCcw,
  Filter,
  Zap,
  TrendingUp
} from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { Job } from './JobCard';
import { toast } from 'sonner';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Label } from './ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Slider } from './ui/slider';

interface JobRecommendationsProps {
  onJobSelect?: (jobId: string) => void;
}

// Enhanced mock job recommendations with match scores
const jobRecommendations: (Job & { 
  matchScore: number; 
  matchReasons: string[];
  trending: boolean;
  urgent: boolean;
})[] = [
  {
    id: '1',
    title: 'Senior React Developer',
    company: 'TechFlow',
    location: 'San Francisco, CA',
    salary: '$130K - $170K',
    type: 'Full-time',
    postedDate: '1 day ago',
    description: 'Join our innovative team building next-generation web applications. We\'re looking for a passionate React developer to help shape the future of our platform.',
    skills: ['React', 'TypeScript', 'GraphQL', 'AWS'],
    featured: true,
    matchScore: 95,
    matchReasons: ['Perfect skill match', 'Salary aligned', 'Top company'],
    trending: true,
    urgent: false
  },
  {
    id: '2',
    title: 'Frontend Architect',
    company: 'InnovateLabs',
    location: 'Remote',
    salary: '$140K - $180K',
    type: 'Full-time',
    postedDate: '2 days ago',
    description: 'Lead the frontend architecture for our cutting-edge products. Design scalable solutions and mentor a team of talented developers.',
    skills: ['React', 'TypeScript', 'Micro-frontends', 'Leadership'],
    matchScore: 92,
    matchReasons: ['Leadership experience', 'React expertise', 'Remote friendly'],
    trending: false,
    urgent: true
  },
  {
    id: '3',
    title: 'Full Stack Engineer',
    company: 'DataViz Inc',
    location: 'New York, NY',
    salary: '$120K - $160K',
    type: 'Full-time',
    postedDate: '3 days ago',
    description: 'Build amazing data visualization tools that help businesses make better decisions. Work with modern tech stack and passionate team.',
    skills: ['React', 'Node.js', 'D3.js', 'PostgreSQL'],
    matchScore: 88,
    matchReasons: ['Tech stack match', 'Growth opportunity', 'Data focus'],
    trending: true,
    urgent: false
  },
  {
    id: '4',
    title: 'Senior JavaScript Developer',
    company: 'NextGen Solutions',
    location: 'Austin, TX',
    salary: '$115K - $145K',
    type: 'Full-time',
    postedDate: '1 week ago',
    description: 'Create innovative web solutions for enterprise clients. Work with latest JavaScript frameworks and cutting-edge technologies.',
    skills: ['JavaScript', 'Vue.js', 'Node.js', 'MongoDB'],
    matchScore: 82,
    matchReasons: ['JavaScript focus', 'Good benefits', 'Tech hub location'],
    trending: false,
    urgent: false
  },
  {
    id: '5',
    title: 'React Native Developer',
    company: 'MobileFirst',
    location: 'Seattle, WA',
    salary: '$125K - $155K',
    type: 'Full-time',
    postedDate: '4 days ago',
    description: 'Build cross-platform mobile applications that millions of users love. Join our mobile-first development team.',
    skills: ['React Native', 'TypeScript', 'iOS', 'Android'],
    matchScore: 79,
    matchReasons: ['React experience', 'Mobile expansion', 'Growing team'],
    trending: false,
    urgent: false
  }
];

export function JobRecommendations({ onJobSelect }: JobRecommendationsProps) {
  const [jobs, setJobs] = useState(jobRecommendations);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAction, setLastAction] = useState<'liked' | 'passed' | null>(null);
  const [filters, setFilters] = useState({
    jobType: 'all',
    location: 'all',
    salaryRange: [0, 200000],
    matchScore: 70
  });

  const swipeRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const currentJob = jobs[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex >= jobs.length - 1) return;

    const action = direction === 'right' ? 'liked' : 'passed';
    setLastAction(action);

    if (direction === 'right') {
      toast.success(`Liked ${currentJob.title} at ${currentJob.company}!`);
    } else {
      toast.success('Job passed');
    }

    setCurrentIndex(prev => prev + 1);
    x.set(0);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      handleSwipe('right');
    } else if (info.offset.x < -threshold) {
      handleSwipe('left');
    } else {
      x.set(0);
    }
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setLastAction(null);
      x.set(0);
      toast.success('Action undone');
    }
  };

  const handleDirectAction = (action: 'like' | 'pass' | 'save') => {
    switch (action) {
      case 'like':
        handleSwipe('right');
        break;
      case 'pass':
        handleSwipe('left');
        break;
      case 'save':
        toast.success(`Saved ${currentJob.title}!`);
        break;
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  if (currentIndex >= jobs.length) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground variant="gradient" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto p-8"
          >
            <Card className="p-8">
              <div className="text-center">
                <Target className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">You've seen all recommendations!</h2>
                <p className="text-muted-foreground mb-6">
                  Great job reviewing all job recommendations. New opportunities will appear as they match your profile.
                </p>
                <Button 
                  onClick={() => {
                    setCurrentIndex(0);
                    setJobs(jobRecommendations);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Review Again
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground variant="particles" />
      
      <div className="relative z-10 p-6 max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Job Recommendations
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Swipe right to like, left to pass
              </p>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Recommendations</SheetTitle>
                  <SheetDescription>
                    Customize your job recommendations
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-6 space-y-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Job Type</Label>
                    <Select 
                      value={filters.jobType} 
                      onValueChange={(value: string) => setFilters(prev => ({ ...prev, jobType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Minimum Match Score: {filters.matchScore}%
                    </Label>
                    <Slider
                      value={[filters.matchScore]}
                      onValueChange={([value]: [number]) => setFilters(prev => ({ ...prev, matchScore: value }))}
                      max={100}
                      min={50}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Salary Range</Label>
                    <Slider
                      value={filters.salaryRange}
                      onValueChange={(value: number[]) => setFilters(prev => ({ ...prev, salaryRange: value }))}
                      max={200000}
                      min={0}
                      step={5000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>${filters.salaryRange[0].toLocaleString()}</span>
                      <span>${filters.salaryRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / jobs.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {jobs.length}
            </span>
          </div>
        </motion.div>

        {/* Job Cards Stack */}
        <div className="relative h-[600px] mb-8">
          <AnimatePresence>
            {jobs.slice(currentIndex, currentIndex + 3).map((job, index) => (
              <motion.div
                key={job.id}
                ref={index === 0 ? swipeRef : undefined}
                className="absolute inset-0"
                style={{
                  x: index === 0 ? x : 0,
                  rotate: index === 0 ? rotate : 0,
                  opacity: index === 0 ? opacity : 1,
                  zIndex: jobs.length - index,
                  scale: 1 - index * 0.05,
                  y: index * 10
                }}
                drag={index === 0 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={index === 0 ? handleDragEnd : undefined}
                whileDrag={{ scale: 1.05 }}
              >
                <Card className="h-full overflow-hidden shadow-xl border-2 border-gray-100">
                  {/* Job Image/Logo Area */}
                  <div className="h-40 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Building2 className="h-16 w-16 text-blue-600" />
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {job.trending && (
                        <Badge className="bg-orange-500 text-white">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                      {job.urgent && (
                        <Badge className="bg-red-500 text-white">
                          <Zap className="h-3 w-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                    </div>

                    {/* Match Score */}
                    <div className="absolute top-4 right-4">
                      <Badge className={`${getMatchScoreColor(job.matchScore)} border`}>
                        <Star className="h-3 w-3 mr-1" />
                        {job.matchScore}% match
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 h-[calc(100%-160px)] flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                      <p className="text-lg text-blue-600 font-medium mb-4">{job.company}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          {job.salary}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {job.type} • Posted {job.postedDate}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {job.description}
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      {/* Match Reasons */}
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Why this matches you:</p>
                        <div className="space-y-1">
                          {job.matchReasons.slice(0, 2).map((reason, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              <span className="text-xs text-muted-foreground">{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleDirectAction('pass')}
            className="w-16 h-16 rounded-full border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            <X className="h-6 w-6 text-red-500" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => handleDirectAction('save')}
            className="w-16 h-16 rounded-full border-yellow-200 hover:bg-yellow-50 hover:border-yellow-300"
          >
            <Bookmark className="h-6 w-6 text-yellow-500" />
          </Button>

          <Button
            size="lg"
            onClick={() => handleDirectAction('like')}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Heart className="h-6 w-6 text-white" />
          </Button>
        </motion.div>

        {/* Undo Button */}
        {lastAction && currentIndex > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-4"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              className="text-blue-600 hover:bg-blue-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Undo {lastAction}
            </Button>
          </motion.div>
        )}

        {/* Swipe Hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6"
        >
          <div className="flex items-center justify-center gap-8 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-8 h-5 border border-red-300 rounded flex items-center justify-center">
                <X className="h-3 w-3 text-red-500" />
              </div>
              <span>Swipe left to pass</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-8 h-5 border border-green-300 rounded flex items-center justify-center">
                <Heart className="h-3 w-3 text-green-500" />
              </div>
              <span>Swipe right to like</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}