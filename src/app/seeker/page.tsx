'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { SaaSNotificationsPage } from '@/components/notifications/SaaSNotificationsPage';

function SeekerPageInner() {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [profileTab, setProfileTab] = useState<'personal' | 'skills' | 'experience' | 'education' | 'resume'>('personal');
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  // Notifications state managed inside notifications pages/components
  
  // Handle URL parameters for navigation
  useEffect(() => {
    const page = searchParams.get('page');
    const tab = searchParams.get('tab');
    
    if (page) {
      if (page === 'settings' && tab) {
        setCurrentPage('settings');
        // Pass tab to Settings component if needed
      } else {
        setCurrentPage(page);
      }
    }
  }, [searchParams]);

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
      case 'notifications':
        return (
          <SaaSNotificationsPage 
            onNavigateToSettings={() => handlePageChange('settings')}
          />
        );
      default:
        return <Dashboard onPageChange={handlePageChange} />;
    }
  };

  return (
    <RoleGuard allowedRole="seeker">
      <div
        className="min-h-screen bg-background"
        style={{ paddingLeft: 'var(--seeker-sidebar-width, 0px)', transition: 'padding-left 200ms ease' }}
      >
        <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
        <main className="w-full">
          {renderCurrentPage()}
        </main>
      </div>
    </RoleGuard>
  );
}

export default function SeekerPage() {
  return (
    <Suspense fallback={null}>
      <SeekerPageInner />
    </Suspense>
  );
}
