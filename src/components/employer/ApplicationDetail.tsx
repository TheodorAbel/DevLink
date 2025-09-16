import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { 
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
  User,
  MessageSquare,
  Star,
  MapPin,
  Mail,
  Phone,
  Calendar
} from "lucide-react";
import { StatusPanel } from "./StatusPanel";
import { ApplicationTimeline } from "./ApplicationTimeline";
import { SeekerProfileDrawer } from "./SeekerProfileDrawer";

interface ApplicationDetailProps {
  applicationId: string;
  onBack: () => void;
}

// Mock data - in real app this would come from API
const mockApplicationData = {
  id: 'app_001',
  candidate: {
    id: 'candidate_001',
    name: 'Alex Johnson',
    title: 'Senior React Developer',
    location: 'San Francisco, CA',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    avatar: '',
    rating: 4.8,
    bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture. Love solving complex problems and mentoring junior developers.',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Docker', 'MongoDB', 'Jest', 'Webpack', 'Redux'],
    experience: [
      {
        id: 'exp_1',
        title: 'Senior Software Engineer',
        company: 'Tech Innovations Inc.',
        duration: '2022 - Present',
        description: 'Lead development of customer-facing React applications serving 100k+ users. Improved performance by 40% through code optimization and caching strategies.',
        current: true
      },
      {
        id: 'exp_2',
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        duration: '2020 - 2022',
        description: 'Built entire web platform from scratch using React and Node.js. Implemented real-time features using WebSockets and integrated payment processing.',
        current: false
      }
    ],
    education: [
      {
        id: 'edu_1',
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of California, Berkeley',
        year: '2020',
        description: 'Focused on software engineering and algorithms. Graduated Summa Cum Laude.'
      }
    ],
    portfolioLinks: [
      {
        id: 'port_1',
        title: 'Personal Website',
        url: 'https://alexjohnson.dev',
        type: 'website' as const
      },
      {
        id: 'port_2',
        title: 'GitHub Profile',
        url: 'https://github.com/alexj',
        type: 'github' as const
      }
    ],
    resumeUrl: '/resume.pdf',
    publicProfileUrl: '/profile/alexjohnson'
  },
  jobTitle: 'Senior Frontend Developer',
  appliedDate: '2024-01-10',
  status: 'viewed' as const,
  coverLetter: 'Dear Hiring Manager,\n\nI am excited to apply for the Senior Frontend Developer position at TechCorp. With over 5 years of experience in React development and a passion for creating exceptional user experiences, I believe I would be a valuable addition to your team.\n\nIn my current role at Tech Innovations Inc., I have led the development of several high-impact React applications, including a customer dashboard that serves over 100,000 users daily. I improved the application\'s performance by 40% through strategic code optimization and implemented modern caching strategies.\n\nI am particularly drawn to TechCorp\'s mission of building innovative solutions that make a real difference in people\'s lives. Your recent work on accessibility features aligns perfectly with my values and experience in creating inclusive web applications.\n\nI would love the opportunity to discuss how my skills in React, TypeScript, and performance optimization can contribute to your team\'s success.\n\nThank you for your consideration.\n\nBest regards,\nAlex Johnson',
  screeningAnswers: [
    {
      question: 'How many years of React experience do you have?',
      answer: '5+ years of professional React experience, including leading frontend architecture decisions and mentoring junior developers.'
    },
    {
      question: 'Are you comfortable with TypeScript?',
      answer: 'Yes, I have been using TypeScript for the past 3 years and am very comfortable with advanced type patterns and generics.'
    },
    {
      question: 'What is your preferred testing framework?',
      answer: 'I primarily use Jest and React Testing Library for unit and integration tests. I also have experience with Cypress for E2E testing.'
    }
  ],
  internalNotes: 'Strong candidate with excellent React skills. Resume shows good progression and relevant experience. Cover letter is well-written and shows genuine interest in the company.',
  timeline: [
    {
      id: 'timeline_1',
      type: 'applied' as const,
      timestamp: '2024-01-10T09:00:00Z',
      actor: 'system' as const
    },
    {
      id: 'timeline_2',
      type: 'viewed' as const,
      timestamp: '2024-01-10T14:30:00Z',
      actor: 'employer' as const,
      actorName: 'Sarah Wilson',
      actorEmail: 'sarah@techcorp.com'
    }
  ]
};

export function ApplicationDetail({ applicationId, onBack }: ApplicationDetailProps) {
  const [internalNotes, setInternalNotes] = useState(mockApplicationData.internalNotes);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [timeline, setTimeline] = useState(mockApplicationData.timeline);
  const [currentStatus, setCurrentStatus] = useState(mockApplicationData.status);

  const data = mockApplicationData; // In real app, fetch by applicationId

  const handleScheduleInterview = (interviewData: any) => {
    const newEntry = {
      id: `timeline_${Date.now()}`,
      type: 'interview_scheduled' as const,
      timestamp: new Date().toISOString(),
      actor: 'employer' as const,
      actorName: 'Sarah Wilson',
      actorEmail: 'sarah@techcorp.com',
      details: {
        interviewDate: interviewData.date,
        interviewTime: interviewData.time,
        interviewType: interviewData.meetingType,
        meetingLink: interviewData.meetingLink
      }
    };
    
    setTimeline(prev => [newEntry, ...prev]);
    setCurrentStatus('interview_scheduled');
  };

  const handleAcceptCandidate = (message: string) => {
    const newEntry = {
      id: `timeline_${Date.now()}`,
      type: 'accepted' as const,
      timestamp: new Date().toISOString(),
      actor: 'employer' as const,
      actorName: 'Sarah Wilson',
      actorEmail: 'sarah@techcorp.com',
      details: { message }
    };
    
    setTimeline(prev => [newEntry, ...prev]);
    setCurrentStatus('accepted');
  };

  const handleRejectCandidate = (message: string) => {
    const newEntry = {
      id: `timeline_${Date.now()}`,
      type: 'rejected' as const,
      timestamp: new Date().toISOString(),
      actor: 'employer' as const,
      actorName: 'Sarah Wilson',
      actorEmail: 'sarah@techcorp.com',
      details: { message }
    };
    
    setTimeline(prev => [newEntry, ...prev]);
    setCurrentStatus('rejected');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={data.candidate.avatar} alt={data.candidate.name} />
                <AvatarFallback>
                  {data.candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-medium">{data.candidate.name}</h1>
                <p className="text-sm text-muted-foreground">{data.candidate.title}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsProfileDrawerOpen(true)}
            >
              <User className="h-4 w-4 mr-2" />
              View Profile
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Candidate Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {data.candidate.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {data.candidate.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {data.candidate.phone}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Applied {data.appliedDate}</span>
                    {data.candidate.rating && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{data.candidate.rating}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resume Preview */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Resume</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <a href={data.candidate.resumeUrl} download>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* PDF Preview Placeholder */}
              <div className="bg-muted rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">PDF Preview</p>
                <p className="text-sm text-muted-foreground">
                  Resume preview would be embedded here using PDF.js
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <a href={data.candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cover Letter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cover Letter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {data.coverLetter}
              </div>
            </CardContent>
          </Card>

          {/* Screening Answers */}
          {data.screeningAnswers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Screening Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.screeningAnswers.map((qa, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium text-sm">{qa.question}</h4>
                    <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3">
                      {qa.answer}
                    </p>
                    {index < data.screeningAnswers.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <ApplicationTimeline 
            entries={timeline} 
            candidateName={data.candidate.name}
          />
        </div>

        {/* Right Sidebar - Status Panel */}
        <div className="w-80 border-l border-border p-6">
          <StatusPanel
            applicationId={data.id}
            currentStatus={currentStatus}
            candidateName={data.candidate.name}
            jobTitle={data.jobTitle}
            internalNotes={internalNotes}
            onUpdateNotes={setInternalNotes}
            onScheduleInterview={handleScheduleInterview}
            onAcceptCandidate={handleAcceptCandidate}
            onRejectCandidate={handleRejectCandidate}
          />
        </div>
      </div>

      {/* Seeker Profile Drawer */}
      <SeekerProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        profile={data.candidate}
        onMessage={() => {
          setIsProfileDrawerOpen(false);
          // Handle message action
        }}
        onViewPublicProfile={() => {
          window.open(data.candidate.publicProfileUrl, '_blank');
        }}
      />
    </div>
  );
}