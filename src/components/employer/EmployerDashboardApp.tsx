"use client";

import React, { useEffect, useState } from "react";
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
  const [jobs, setJobs] = useState<Job[]>(mockJobs);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleJobAction = (action: string, jobId: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => {
        if (job.id === jobId) {
          switch (action) {
            case "pause":
              return {
                ...job,
                status: (job.status === "paused" ? "active" : "paused") as JobStatus,
              };
            case "boost":
              return { ...job, isBoosted: !job.isBoosted };
            case "delete":
              return job; // Would actually remove from array
            default:
              return job;
          }
        }
        return job;
      })
    );

    switch (action) {
      case "edit":
        toast.success("Redirecting to edit job...");
        break;
      case "pause":
        toast.success("Job status updated");
        break;
      case "boost":
        toast.success("Job boost updated");
        break;
      case "delete":
        toast.success("Job deleted successfully");
        setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
        break;
    }
  };

  if (isLoading) {
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
                toast.success("Job saved as draft");
              }}
              onPublish={(data) => {
                console.log("Publishing job:", data);
                toast.success("Job published successfully!");
                setActiveView("dashboard");
              }}
              onPreview={(data) => {
                console.log("Previewing job:", data);
                toast.info("Opening preview...");
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
              jobs={jobs}
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
              percentage={75}
              completedSteps={["Company Info", "Logo Upload", "Payment Setup"]}
              totalSteps={4}
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
                {jobs.slice(0, 3).map((job) => (
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
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />

      {/* Mobile Layout */}
      <div className="lg:hidden">
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

        <main className="pb-20">{renderContent()}</main>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Sidebar */}
        <div
          className={`border-r border-border bg-card transition-all duration-300 ease-in-out ${
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

          <nav className="p-2 space-y-1">
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
        <div className="flex-1 flex">
          <main className="flex-1 overflow-auto">{renderContent()}</main>

          {/* Right Sidebar - Contextual Info */}
          {activeView === "dashboard" && (
            <div className="w-80 border-l border-border p-6 space-y-6">
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
