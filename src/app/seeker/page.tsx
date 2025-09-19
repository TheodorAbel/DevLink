'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { ProfileEdit } from '@/components/ProfileEdit';
import { JobList } from '@/components/JobList';
import { SavedJobs } from '@/components/SavedJobs';
import { ApplicationDetail } from '@/components/ApplicationDetail';
import { Settings } from '@/components/Settings';
import { Messaging } from '@/components/Messaging';
import { Analytics } from '@/components/Analytics';
import { JobRecommendations } from '@/components/JobRecommendations';
import { JobDetail } from '@/components/JobDetail';
import RoleGuard from '@/components/RoleGuard';
import { SeekerApplications } from '@/components/SeekerApplications';

export default function SeekerPage() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [profileTab, setProfileTab] = useState<'personal' | 'skills' | 'experience' | 'education' | 'resume'>('personal');
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const handlePageChange = (page: string) => {
    if (page === 'logout') {
      // Handle logout logic here
      console.log('Logout clicked');
      return;
    }
    // Support deep-link like 'profile:resume'
    if (page.startsWith('profile:')) {
      const tab = page.split(':')[1] as typeof profileTab;
      setProfileTab(tab || 'personal');
      setCurrentPage('profile');
      return;
    }
    // Navigating to applications list resets any selection
    if (page === 'applications') {
      setSelectedApplicationId(null);
    }
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={handlePageChange} />;
      case 'profile':
        return <ProfileEdit onBack={() => setCurrentPage('dashboard')} initialTab={profileTab} />;
      case 'jobs':
        return <JobList onJobSelect={(jobId) => console.log('Job selected:', jobId)} />;
      case 'saved-jobs':
        return <SavedJobs onJobSelect={(jobId) => console.log('Saved job selected:', jobId)} />;
      case 'applications':
        return selectedApplicationId ? (
          <ApplicationDetail onBack={() => setSelectedApplicationId(null)} />
        ) : (
          <SeekerApplications onOpenApplication={(id) => setSelectedApplicationId(id)} />
        );
      case 'settings':
        return <Settings onBack={() => setCurrentPage('dashboard')} />;
      case 'messaging':
        return <Messaging onBack={() => setCurrentPage('dashboard')} />;
      case 'analytics':
        return <Analytics onBack={() => setCurrentPage('dashboard')} />;
      case 'recommendations':
        return <JobRecommendations onJobSelect={(jobId) => console.log('Recommended job selected:', jobId)} />;
      case 'job-detail':
        return <JobDetail onBack={() => setCurrentPage('jobs')} />;
      default:
        return <Dashboard onPageChange={handlePageChange} />;
    }
  };

  return (
    <RoleGuard allowedRole="seeker">
      <div className="min-h-screen bg-background">
        <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
        <main className="w-full">
          {renderCurrentPage()}
        </main>
      </div>
    </RoleGuard>
  );
}
