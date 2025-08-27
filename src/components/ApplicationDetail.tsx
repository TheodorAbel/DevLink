import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft,
  MapPin, 
  DollarSign, 
  Calendar,
  Clock,
  Building2,
  Download,
  Eye,
  MessageSquare,
  CheckCircle,
  FileText,
  User,
  ExternalLink,
  CalendarPlus
} from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner';

interface ApplicationDetailProps {
  onBack: () => void;
}

// Mock application data
const applicationData = {
  id: '1',
  job: {
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary: '$120,000 - $160,000',
    type: 'Full-time',
    logo: null
  },
  applicationDate: '2024-01-15',
  status: 'interview',
  resumeUrl: '/resume.pdf',
  coverLetter: `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Frontend Developer position at TechCorp. With over 5 years of experience in React and TypeScript development, I am excited about the opportunity to contribute to your innovative team.

My experience includes building scalable web applications, leading frontend architecture decisions, and mentoring junior developers. I am particularly drawn to TechCorp's commitment to creating user-centered products and would love to bring my passion for clean, performant code to your team.

Thank you for considering my application. I look forward to discussing how my skills and experience can contribute to TechCorp's continued success.

Best regards,
Sarah Johnson`,
  
  timeline: [
    {
      status: 'applied',
      label: 'Application Submitted',
      date: '2024-01-15',
      time: '10:30 AM',
      completed: true,
      description: 'Your application has been successfully submitted'
    },
    {
      status: 'viewed',
      label: 'Application Reviewed',
      date: '2024-01-17',
      time: '2:15 PM',
      completed: true,
      description: 'HR team has reviewed your application'
    },
    {
      status: 'interview',
      label: 'Interview Scheduled',
      date: '2024-01-22',
      time: '3:00 PM',
      completed: true,
      description: 'Technical interview with the engineering team',
      current: true
    },
    {
      status: 'decision',
      label: 'Final Decision',
      date: 'TBD',
      time: '',
      completed: false,
      description: 'Final hiring decision will be communicated'
    }
  ],
  
  messages: [
    {
      id: '1',
      sender: 'HR Team',
      avatar: 'HR',
      message: 'Thank you for your application! We\'ve reviewed your profile and would like to schedule a technical interview.',
      timestamp: '2024-01-20 09:30 AM',
      type: 'received'
    },
    {
      id: '2',
      sender: 'You',
      avatar: 'SJ',
      message: 'Thank you for the opportunity! I\'m available for the interview next week. Please let me know the preferred time.',
      timestamp: '2024-01-20 11:45 AM',
      type: 'sent'
    }
  ],
  
  interviewDetails: {
    date: '2024-01-25',
    time: '2:00 PM PST',
    duration: '60 minutes',
    type: 'Technical Interview',
    interviewer: 'John Smith, Senior Engineering Manager',
    meetingLink: 'https://meet.google.com/abc-defg-hij'
  }
};

export function ApplicationDetail({ onBack }: ApplicationDetailProps) {
  const [showCoverLetter, setShowCoverLetter] = useState(false);

  const getStatusColor = (status: string, completed: boolean, current: boolean) => {
    if (current) return 'text-blue-600 bg-blue-100 border-blue-300';
    if (completed) return 'text-green-600 bg-green-100 border-green-300';
    return 'text-gray-400 bg-gray-100 border-gray-300';
  };

  const getStatusIcon = (status: string, completed: boolean, current: boolean) => {
    if (completed || current) {
      return <CheckCircle className="w-6 h-6" />;
    }
    return <Clock className="w-6 h-6" />;
  };

  const handleDownloadResume = () => {
    toast.success('Resume download started');
    // Simulate download
  };

  const handleScheduleInterview = () => {
    if (applicationData.interviewDetails.meetingLink) {
      window.open(applicationData.interviewDetails.meetingLink, '_blank');
    }
    toast.success('Opening interview link...');
  };

  const handleAddToCalendar = () => {
    const { date, time, duration, type } = applicationData.interviewDetails;
    const startDate = new Date(`${date} ${time}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(type + ' - ' + applicationData.job.company)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent('Interview for ' + applicationData.job.title + ' position')}`;
    
    window.open(calendarUrl, '_blank');
    toast.success('Opening calendar...');
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground variant="gradient" />
      
      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="hover:bg-white/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
        </motion.div>

        {/* Application Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40" />
            
            <CardContent className="p-6 relative">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {applicationData.job.title}
                    </h1>
                    <p className="text-lg text-blue-600 font-medium mb-4">{applicationData.job.company}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {applicationData.job.location}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        {applicationData.job.salary}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {applicationData.job.type}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Applied {applicationData.applicationDate}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Badge 
                    variant="outline" 
                    className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2"
                  >
                    Status: {applicationData.status.charAt(0).toUpperCase() + applicationData.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Application Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {applicationData.timeline.map((step, index) => (
                      <motion.div
                        key={step.status}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="relative flex items-start gap-4"
                      >
                        {/* Timeline line */}
                        {index < applicationData.timeline.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
                        )}
                        
                        {/* Status icon */}
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${getStatusColor(step.status, step.completed, step.current || false)}`}
                        >
                          {getStatusIcon(step.status, step.completed, step.current || false)}
                        </motion.div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-medium ${step.completed || step.current ? 'text-gray-900' : 'text-gray-500'}`}>
                              {step.label}
                            </h4>
                            {step.date !== 'TBD' && (
                              <span className="text-sm text-muted-foreground">
                                {step.date} {step.time}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                          
                          {step.current && applicationData.interviewDetails && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200"
                            >
                              <h5 className="font-medium text-blue-900 mb-2">Interview Details</h5>
                              <div className="space-y-2 text-sm">
                                <div><strong>Date:</strong> {applicationData.interviewDetails.date}</div>
                                <div><strong>Time:</strong> {applicationData.interviewDetails.time}</div>
                                <div><strong>Duration:</strong> {applicationData.interviewDetails.duration}</div>
                                <div><strong>Interviewer:</strong> {applicationData.interviewDetails.interviewer}</div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button 
                                  size="sm"
                                  onClick={handleScheduleInterview}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Join Interview
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={handleAddToCalendar}
                                >
                                  <CalendarPlus className="h-4 w-4 mr-2" />
                                  Add to Calendar
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Messages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Messages from Employer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applicationData.messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className={`flex gap-3 ${message.type === 'sent' ? 'flex-row-reverse' : ''}`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={`text-xs ${
                            message.type === 'sent' 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {message.avatar}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className={`flex-1 max-w-[80%] ${message.type === 'sent' ? 'text-right' : ''}`}>
                          <div className={`inline-block p-3 rounded-lg ${
                            message.type === 'sent'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.message}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {message.sender} • {message.timestamp}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resume Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/30" />
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Resume
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="bg-white border rounded-lg p-4 mb-4">
                    <div className="aspect-[3/4] bg-gray-50 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Resume Preview</p>
                        <p className="text-xs text-gray-400">Sarah_Johnson_Resume.pdf</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={handleDownloadResume}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open('/resume.pdf', '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Cover Letter */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/30" />
                <CardHeader className="relative">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Cover Letter
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCoverLetter(!showCoverLetter)}
                    >
                      {showCoverLetter ? 'Hide' : 'Show'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                {showCoverLetter && (
                  <CardContent className="relative">
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white rounded-lg border p-4"
                    >
                      <div className="max-h-60 overflow-y-auto">
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {applicationData.coverLetter}
                        </p>
                      </div>
                    </motion.div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-yellow-50/30" />
                <CardHeader className="relative">
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => toast.success('Opening messaging...')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => toast.success('Withdrawing application...')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Withdraw Application
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => toast.success('Updating application...')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Update Application
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}