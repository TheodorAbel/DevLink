"use client";

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
import { Job } from '@/components/JobCard';
import { JobDetail } from '@/components/JobDetail';
import RoleGuard from '@/components/RoleGuard';
import { SeekerApplications } from '@/components/SeekerApplications';
import { SaaSNotificationsPage } from '@/components/notifications/SaaSNotificationsPage';
import { useEnsureConversation } from '@/hooks/useChat';

interface Props {
  initialRecentJobs: Job[];
}

function SeekerPageInnerClient({ initialRecentJobs }: Props) {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [profileTab, setProfileTab] = useState<'personal' | 'skills' | 'experience' | 'education' | 'resume'>('personal');
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [initialParticipantId, setInitialParticipantId] = useState<string | null>(null);
  const [initialJobId, setInitialJobId] = useState<string | null>(null);
  const [initialApplicationId, setInitialApplicationId] = useState<string | null>(null);
  const ensureConversation = useEnsureConversation();

  useEffect(() => {
    const page = searchParams.get('page');
    const tab = searchParams.get('tab');
    if (page) {
      if (page === 'settings' && tab) {
        setCurrentPage('settings');
      } else {
        setCurrentPage(page);
      }
    }
  }, [searchParams]);

  const handlePageChange = (page: string) => {
    if (page === 'logout') {
      console.log('Logout clicked');
      return;
    }
    if (page.startsWith('profile:')) {
      const tab = page.split(':')[1] as typeof profileTab;
      setProfileTab(tab || 'personal');
      setCurrentPage('profile');
      return;
    }
    if (page.startsWith('job-detail:')) {
      const id = page.split(':')[1] || '';
      setSelectedJobId(id);
      setCurrentPage('job-detail');
      return;
    }
    if (page === 'applications') {
      setSelectedApplicationId(null);
    }
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={handlePageChange} initialRecentJobs={initialRecentJobs} />;
      case 'profile':
        return <ProfileEdit onBack={() => setCurrentPage('dashboard')} initialTab={profileTab} />;
      case 'jobs':
        return <JobList onJobSelect={(jobId) => console.log('Job selected:', jobId)} />;
      case 'saved-jobs':
        return <SavedJobs onJobSelect={(jobId) => console.log('Saved job selected:', jobId)} />;
      case 'applications':
        return selectedApplicationId ? (
          <ApplicationDetail 
            onBack={() => setSelectedApplicationId(null)} 
            jobId={selectedApplicationId}
            onSendMessage={async ({ participantId, jobId, applicationId }) => {
              try {
                await ensureConversation.mutateAsync({ participantId, jobId, applicationId });
                setInitialParticipantId(participantId);
                setInitialJobId(jobId);
                setInitialApplicationId(applicationId);
                setCurrentPage('messaging');
              } catch {}
            }}
          />
        ) : (
          <SeekerApplications onOpenApplication={(id) => setSelectedApplicationId(id)} />
        );
      case 'settings':
        return <Settings onBack={() => setCurrentPage('dashboard')} />;
      case 'messaging':
        return (
          <Messaging 
            onBack={() => setCurrentPage('dashboard')} 
            initialParticipantId={initialParticipantId ?? undefined}
            initialJobId={initialJobId ?? undefined}
            initialApplicationId={initialApplicationId ?? undefined}
          />
        );
      case 'analytics':
        return <Analytics onBack={() => setCurrentPage('dashboard')} />;
      case 'recommendations':
        return <JobRecommendations onJobSelect={(jobId) => console.log('Recommended job selected:', jobId)} />;
      case 'job-detail':
        return <JobDetail onBack={() => setCurrentPage('dashboard')} jobId={selectedJobId ?? ''} />;
      case 'notifications':
        return (
          <SaaSNotificationsPage 
            onNavigateToSettings={() => handlePageChange('settings')}
          />
        );
      default:
        return <Dashboard onPageChange={handlePageChange} initialRecentJobs={initialRecentJobs} />;
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

export default function SeekerPageClientWrapper({ initialRecentJobs }: Props) {
  return (
    <Suspense fallback={null}>
      <SeekerPageInnerClient initialRecentJobs={initialRecentJobs} />
    </Suspense>
  );
}
