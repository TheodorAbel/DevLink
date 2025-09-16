import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent } from "./ui/card";
import { JobCard } from "./JobCard";
import { Search, Filter, Grid, List, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  applicants: number;
  views: number;
  status: 'active' | 'draft' | 'paused' | 'closed';
  isBoosted?: boolean;
  postedAt: string;
}

interface JobListProps {
  jobs: Job[];
  onCreateJob: () => void;
  onEditJob: (id: string) => void;
  onPauseJob: (id: string) => void;
  onDeleteJob: (id: string) => void;
  onBoostJob: (id: string) => void;
}

export function JobList({ 
  jobs, 
  onCreateJob, 
  onEditJob, 
  onPauseJob, 
  onDeleteJob, 
  onBoostJob 
}: JobListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
        case 'oldest':
          return new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime();
        case 'applicants':
          return b.applicants - a.applicants;
        case 'views':
          return b.views - a.views;
        default:
          return 0;
      }
    });

  const statusCounts = {
    all: jobs.length,
    active: jobs.filter(j => j.status === 'active').length,
    draft: jobs.filter(j => j.status === 'draft').length,
    paused: jobs.filter(j => j.status === 'paused').length,
    closed: jobs.filter(j => j.status === 'closed').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium">Job Management</h1>
          <p className="text-muted-foreground">Manage your job postings</p>
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

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs by title or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="applicants">Most Applicants</SelectItem>
                  <SelectItem value="views">Most Views</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="h-10 w-10 rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="h-10 w-10 rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid/List */}
      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground">
              <p>No jobs found</p>
              <p className="text-sm mt-1">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first job posting to get started'
                }
              </p>
            </div>
            {!searchQuery && statusFilter === 'all' && (
              <Button onClick={onCreateJob} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Post Your First Job
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              {...job}
              onEdit={onEditJob}
              onPause={onPauseJob}
              onDelete={onDeleteJob}
              onBoost={onBoostJob}
            />
          ))}
        </div>
      )}
    </div>
  );
}