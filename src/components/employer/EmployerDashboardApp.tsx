"use client";

import { useState, useEffect, useMemo } from "react";
import { EditJobModal } from "./EditJobModal";
import { motion } from "framer-motion";
import { MobileHeader } from "@/components/employer/MobileHeader";
import { NavigationDrawer } from "@/components/employer/NavigationDrawer";
import { ProgressBar } from "@/components/employer/ProgressBar";
import { DashboardStats } from "@/components/employer/DashboardStats";
import { JobCard } from "@/components/employer/JobCard";
import { ApplicantFeed } from "@/components/employer/ApplicantFeed";
import { PostJobForm } from "@/components/employer/PostJobForm";
import { JobList } from "@/components/employer/JobList";
import { JobsOverview } from "@/components/employer/JobsOverview";
import { MessagingInterface } from "@/components/employer/MessagingInterface";
import { AnalyticsDashboard } from "@/components/employer/AnalyticsDashboard";
import { CompanyProfile } from "@/components/employer/CompanyProfile";
import { EmployerSettings } from "@/components/employer/EmployerSettings";
import { DashboardSkeleton } from "@/components/employer/LoadingStates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Briefcase,
  TrendingUp,
  MessageSquare,
  BarChart,
  Building,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { useExpensiveToast } from "@/hooks/useExpensiveToast";
import { useCompany } from "@/hooks/employer/useCompany";
import { useCompanyCompletion } from "@/hooks/employer/useCompanyCompletion";
import { useEmployerJobs } from "@/hooks/employer/useEmployerJobs";

// Types
type JobStatus = "active" | "paused" | "draft";
type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  applicants: number;
  views: number;
  status: JobStatus;
  isBoosted?: boolean;
  postedAt: string;
  updatedAt?: string;
};

type Applicant = {
  id: string;
  name: string;
  title: string;
  location: string;
  appliedTo: string;
  appliedAt: string;
  rating: number;
  status: "new" | "reviewed" | "shortlisted";
};

// Mock data
const mockStats = [
  {
    title: "Active Jobs",
    value: 12,
    change: 8.2,
    trend: "up" as const,
    badge: "Live",
  },
  {
    title: "Applicants This Week",
    value: 247,
    change: 15.3,
    trend: "up" as const,
  },
  {
    title: "Response Rate",
    value: "89%",
    change: -2.1,
    trend: "down" as const,
  },
];

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    jobType: "Full Time",
    salary: "$120k - $160k",
    applicants: 45,
    views: 342,
    status: "active" as const,
    isBoosted: true,
    postedAt: "2 days ago",
  },
  {
    id: "2",
    title: "Product Manager",
    company: "TechCorp",
    location: "Remote",
    jobType: "Full Time",
    salary: "$140k - $180k",
    applicants: 78,
    views: 523,
    status: "active" as const,
    postedAt: "1 week ago",
  },
  {
    id: "3",
    title: "UX Designer",
    company: "TechCorp",
    location: "New York, NY",
    jobType: "Contract",
    salary: "$85k - $110k",
    applicants: 23,
    views: 156,
    status: "draft" as const,
    postedAt: "3 days ago",
  },
];

const mockApplicants: Applicant[] = [
  {
    id: "1",
    name: "Alex Johnson",
    title: "Senior React Developer",
    location: "San Francisco, CA",
    appliedTo: "Senior Frontend Developer",
    appliedAt: "2 hours ago",
    rating: 4.8,
    status: "new" as const,
  },
  {
    id: "2",
    name: "Sarah Chen",
    title: "Full Stack Engineer",
    location: "Remote",
    appliedTo: "Senior Frontend Developer",
    appliedAt: "4 hours ago",
    rating: 4.9,
    status: "new" as const,
  },
  {
    id: "3",
    name: "Michael Brown",
    title: "Product Strategy Lead",
    location: "New York, NY",
    appliedTo: "Product Manager",
    appliedAt: "1 day ago",
    rating: 4.6,
    status: "reviewed" as const,
  },
  {
    id: "4",
    name: "Emily Davis",
    title: "Senior UX Designer",
    location: "Los Angeles, CA",
    appliedTo: "UX Designer",
    appliedAt: "2 days ago",
    rating: 4.7,
    status: "shortlisted" as const,
  },
];

export default function EmployerDashboardApp() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: companyBundle, isLoading: companyLoading } = useCompany();
  const completion = useCompanyCompletion();
  const { data: employerJobs = [], isLoading: jobsLoading } = useEmployerJobs(30);
  const expensiveToast = useExpensiveToast();

  const companyName = companyBundle?.company?.company_name || "Your Company";

  const allCompletionLabels = useMemo(
    () => [
      "Logo",
      "Cover image",
      "Company name",
      "Website",
      "Industry",
      "Company size",
      "Founded year",
      "Country",
      "City",
      "Address",
      "Tagline",
      "Description",
      "Hiring process",
      "Culture text",
      "Specialties",
      "Benefits",
      "LinkedIn",
      "Contact (email or phone)",
      "At least 1 leader",
      "At least 1 media item",
      "Job posting defaults",
      "Billing setup",
    ],
    []
  );

  const completedStepLabels = useMemo(() => {
    const missing = new Set(completion.missing || []);
    return allCompletionLabels.filter((l) => !missing.has(l));
  }, [completion.missing, allCompletionLabels]);

  const jobsMapped: Job[] = useMemo(() => {
    const formatTimeAgo = (dateStr: string | null) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    };

    return (employerJobs || []).map((j) => ({
      id: j.id,
      title: j.title,
      company: companyName,
      location: j.location || "",
      jobType: j.job_type || "",
      salary: j.salary_type === "fixed"
        ? `${j.salary_fixed ?? "-"} ${j.salary_currency ?? ""}`
        : j.salary_type === "range"
        ? `${j.salary_min ?? "-"}-${j.salary_max ?? "-"} ${j.salary_currency ?? ""}`
        : j.salary_currency || "Competitive",
      applicants: j.applications_count ?? 0,
      views: j.views_count ?? 0,
      status: ((j.status as any) ?? "draft") as JobStatus,
      isBoosted: false,
      postedAt: formatTimeAgo(j.published_at || j.created_at),
      updatedAt: j.updated_at ? formatTimeAgo(j.updated_at) : undefined,
    }));
  }, [employerJobs, companyName]);

  const stepsPercentage = useMemo(() => {
    const total = allCompletionLabels.length || 1;
    const done = completedStepLabels.length || 0;
    return Math.min(100, Math.max(0, Math.round((done / total) * 100)));
  }, [completedStepLabels, allCompletionLabels]);

  

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleJobAction = (action: string, jobId: string) => {
    switch (action) {
      case "edit":
        setEditingJobId(jobId);
        setIsEditModalOpen(true);
        break;
      case "pause":
        expensiveToast.success({ title: "Job status updated", description: "The job visibility has been toggled." });
        break;
      case "boost":
        expensiveToast.info({ title: "Boost updated", description: "Job promotion settings have been adjusted." });
        break;
      case "delete":
        expensiveToast.warning({ title: "Job deleted", description: "The posting has been removed from your listings." });
        break;
    }
  };

  if (isLoading || companyLoading || jobsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardSkeleton />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case "post-job":
        return (
          <div className="p-4">
            <PostJobForm
              onSaveDraft={(data) => {
                console.log("Saving draft:", data);
                expensiveToast.info({ title: "Draft saved", description: "You can return to publish when ready." });
              }}
              onPublish={(data) => {
                console.log("Publishing job:", data);
                expensiveToast.success({ title: "Job published", description: "Your job is now live and visible to seekers." });
                setActiveView("job-management");
              }}
              onPreview={(data) => {
                console.log("Previewing job:", data);
                expensiveToast.info({ title: "Opening preview", description: "See how your posting will appear to candidates." });
              }}
            />
          </div>
        );

      case "applications":
        return (
          <div className="p-4">
            <JobsOverview onCreateJob={() => setActiveView("post-job")} />
          </div>
        );

      case "job-management":
        return (
          <div className="p-4">
            <JobList
              jobs={jobsMapped}
              onCreateJob={() => setActiveView("post-job")}
              onEditJob={(id) => handleJobAction("edit", id)}
              onPauseJob={(id) => handleJobAction("pause", id)}
              onDeleteJob={(id) => handleJobAction("delete", id)}
              onBoostJob={(id) => handleJobAction("boost", id)}
            />
          </div>
        );

      case "messaging":
        return (
          <div className="p-4">
            <MessagingInterface />
          </div>
        );

      case "analytics":
        return (
          <div className="p-4">
            <AnalyticsDashboard />
          </div>
        );

      case "company-profile":
        return (
          <div className="p-4">
            <CompanyProfile />
          </div>
        );

      case "settings":
        return (
          <div className="p-4">
            <EmployerSettings onBack={() => setActiveView("dashboard")} />
          </div>
        );

      default:
        return (
          <div className="space-y-6 p-4">
            {/* Progress Bar */}
            <ProgressBar
              percentage={stepsPercentage}
              completedSteps={completedStepLabels}
              totalSteps={allCompletionLabels.length}
            />

            {/* Stats */}
            <DashboardStats stats={mockStats} />

            {/* Job Summary */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Recent Jobs</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveView("job-management")}
                >
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {jobsMapped.slice(0, 3).map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <JobCard
                      {...job}
                      onEdit={(id) => handleJobAction("edit", id)}
                      onPause={(id) => handleJobAction("pause", id)}
                      onDelete={(id) => handleJobAction("delete", id)}
                      onBoost={(id) => handleJobAction("boost", id)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Applicants */}
            <ApplicantFeed
              applicants={mockApplicants}
              onViewProfile={(id) => {
                toast.info(`Viewing profile for applicant ${id}`);
              }}
            />

            {/* Quick Actions - Mobile Sticky */}
            <div className="lg:hidden fixed bottom-4 right-4 z-50">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="rounded-full shadow-lg h-14 px-6"
                  onClick={() => setActiveView("post-job")}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Post Job
                </Button>
              </motion.div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-background overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Edit Job Modal */}
      <EditJobModal
        jobId={editingJobId}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingJobId(null);
        }}
      />

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-screen">
        <MobileHeader
          onMenuClick={() => setIsDrawerOpen(true)}
          companyName="TechCorp"
          notificationCount={3}
          messageCount={7}
        />

        <NavigationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          activeView={activeView}
          onNavigate={setActiveView}
          companyName="TechCorp"
          userEmail="admin@techcorp.com"
        />

        <main className="flex-1 overflow-y-auto pb-20">{renderContent()}</main>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Left Sidebar */}
        <div
          className={`border-r border-border bg-card transition-all duration-300 ease-in-out flex flex-col ${
            isSidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="p-6 border-b border-border relative">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              {!isSidebarCollapsed && (
                <div className="overflow-hidden">
                  <h1 className="font-medium truncate">TechCorp</h1>
                  <p className="text-sm text-muted-foreground truncate">Employer Dashboard</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border bg-background shadow-md hover:bg-accent"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          <nav className="p-2 space-y-1 overflow-y-auto flex-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: TrendingUp },
              { id: "post-job", label: "Post Job", icon: Plus },
              { id: "applications", label: "Applications", icon: FileText },
              { id: "job-management", label: "Job Management", icon: Briefcase },
              { id: "messaging", label: "Messaging", icon: MessageSquare },
              { id: "analytics", label: "Analytics", icon: BarChart },
              { id: "company-profile", label: "Company Profile", icon: Building },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon as React.ComponentType<{ className?: string }>;
              const isActive = activeView === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full h-12 transition-all duration-200 ${
                    isSidebarCollapsed ? "justify-center px-0" : "justify-start gap-3 px-4"
                  }`}
                  onClick={() => setActiveView(item.id)}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto">{renderContent()}</main>

          {/* Right Sidebar - Contextual Info */}
          {activeView === "dashboard" && (
            <div className="w-80 border-l border-border p-6 space-y-6 overflow-y-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Applications</span>
                    <Badge variant="secondary">1,247</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Interview Scheduled</span>
                    <Badge variant="secondary">23</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Offers Extended</span>
                    <Badge variant="secondary">8</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <p className="text-sm">New application received</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">Job posting approved</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">Interview scheduled</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
