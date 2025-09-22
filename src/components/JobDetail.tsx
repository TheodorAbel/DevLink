"use client";

import React, { useState } from 'react';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft,
  MapPin, 
  DollarSign, 
  Clock,
  Users,
  Building2,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

import Link from 'next/link';
import { AnimatedBackground } from './AnimatedBackground';
import { toast } from 'sonner';

import { ApplySheet } from './ApplySheet';

interface JobDetailProps {
  onBack: () => void;
  autoOpenApply?: boolean;
}

// Mock job data
const jobDetail = {
  id: '1',
  title: 'Senior Frontend Developer',
  company: 'TechCorp',
  companyId: '1',
  location: 'San Francisco, CA',
  salary: '$120,000 - $160,000',
  type: 'Full-time',
  postedDate: '2 days ago',
  applicationDeadline: 'March 15, 2024',
  applicants: 23,
  description: `We are looking for an experienced Senior Frontend Developer to join our growing engineering team. You'll be responsible for building and maintaining user-facing applications that serve millions of users worldwide.

In this role, you'll work closely with our design and product teams to create exceptional user experiences. You'll have the opportunity to mentor junior developers and contribute to architectural decisions that shape the future of our platform.`,
  
  responsibilities: [
    'Develop and maintain high-quality React applications',
    'Collaborate with designers to implement pixel-perfect UIs',
    'Write clean, maintainable, and well-tested code',
    'Mentor junior developers and conduct code reviews',
    'Participate in architecture and technical design discussions',
    'Optimize applications for maximum speed and scalability'
  ],
  
  requirements: [
    '5+ years of experience with React and TypeScript',
    'Strong understanding of modern JavaScript (ES6+)',
    'Experience with state management (Redux, Zustand, etc.)',
    'Proficiency with modern CSS and styling frameworks',
    'Experience with testing frameworks (Jest, React Testing Library)',
    'Bachelor\'s degree in Computer Science or related field'
  ],
  
  skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Jest'],
  benefits: [
    'Competitive salary and equity package',
    'Comprehensive health, dental, and vision insurance',
    'Unlimited PTO and flexible working hours',
    'Annual learning and development budget',
    'Remote work options',
    'Top-tier equipment and workspace setup'
  ],
  
  companyInfo: {
    name: 'TechCorp',
    size: '500-1000 employees',
    industry: 'Technology',
    founded: '2015',
    description: 'TechCorp is a leading technology company that builds innovative solutions for businesses worldwide. We\'re passionate about creating products that make a difference.',
    website: 'https://techcorp.com'
  }
};

export function JobDetail({ onBack, autoOpenApply = false }: JobDetailProps) {
  const [isApplied] = useState(false);
  const [applyOpen, setApplyOpen] = useState(autoOpenApply);
  
  // In a real app, you would fetch job data based on jobId
  // For now, using mock data
  const currentJob = jobDetail; // You could have a function to get job by ID

  const handleApply = () => {
    // Open the responsive Apply sheet instead of instant-apply
    setApplyOpen(true);
  };

  // Removed unused save/share/report handlers to satisfy ESLint

  const copyJobDescription = () => {
    const fullDescription = `${currentJob.title} at ${currentJob.company}\n\n${currentJob.description}\n\nResponsibilities:\n${currentJob.responsibilities.map(r => `• ${r}`).join('\n')}\n\nRequirements:\n${currentJob.requirements.map(r => `• ${r}`).join('\n')}`;
    navigator.clipboard.writeText(fullDescription);
    toast.success('Job description copied to clipboard!');
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground variant="particles" />
      
      <div className="relative z-10 p-6 max-w-4xl mx-auto">
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
            Back to Jobs
          </Button>
        </motion.div>

        {/* Job Header */}
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
                      {currentJob.title}
                    </h1>
                    <p className="text-lg text-blue-600 font-medium mb-4">{currentJob.company}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {currentJob.location}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        {currentJob.salary}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {currentJob.type}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {currentJob.applicants} applicants
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                  <Button
                    onClick={handleApply}
                    disabled={isApplied}
                    className={`${
                      isApplied 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                    } text-white px-8`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Applied
                      </>
                    ) : (
                      'Apply Now'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Apply Sheet (responsive) */}
        <ApplySheet
          open={applyOpen}
          onOpenChange={(o) => setApplyOpen(o)}
          jobTitle={currentJob.title}
          company={currentJob.company}
          profileResumeName={'Sarah_Johnson_Resume.pdf'}
          screeningQuestions={[
            { id: 'q1', text: 'How many years of React experience do you have?', type: 'short-answer', required: true },
            { id: 'q2', text: 'Are you comfortable with TypeScript?', type: 'yes-no', required: true },
            { id: 'q3', text: 'What is your preferred testing framework?', type: 'multiple-choice', options: [
              { id: 'jest', label: 'Jest', value: 'Jest' },
              { id: 'rtl', label: 'React Testing Library', value: 'RTL' },
              { id: 'cypress', label: 'Cypress', value: 'Cypress' },
            ]},
            { id: 'q4', text: 'Which frontend technologies are you proficient with?', type: 'checkbox', options: [
              { id: 'react', label: 'React', value: 'React' },
              { id: 'next', label: 'Next.js', value: 'Next.js' },
              { id: 'vue', label: 'Vue', value: 'Vue' },
              { id: 'svelte', label: 'Svelte', value: 'Svelte' },
            ]},
          ]}
        />

      {/* Job Meta Info */}
      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-muted-foreground">
          Posted {currentJob.postedDate}
        </div>
        <div className="text-sm text-muted-foreground">
          Application deadline: {currentJob.applicationDeadline}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyJobDescription}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-normal"
        >
          Copy job description
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>About the Role</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{currentJob.description}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Responsibilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Key Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentJob.responsibilities.map((responsibility, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="flex items-start gap-2 text-muted-foreground"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      {responsibility}
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentJob.requirements.map((requirement, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="flex items-start gap-2 text-muted-foreground"
                    >
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      {requirement}
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentJob.skills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <Badge 
                        variant="secondary" 
                        className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200"
                      >
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-blue-50/30" />
              <CardHeader className="relative">
                <CardTitle>About {currentJob.companyInfo.name}</CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">{currentJob.title}</h1>
                <div className="flex items-center space-x-2">
                  <div className="group relative">
                    <Link 
                      href={`/company/${currentJob.companyId || '1'}`}
                      className="text-muted-foreground hover:text-blue-600 hover:underline flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {currentJob.company}
                      <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{currentJob.location}</span>
                </div>
                <p className="text-sm text-muted-foreground">{currentJob.companyInfo.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company size:</span>
                    <span>{currentJob.companyInfo.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Industry:</span>
                    <span>{currentJob.companyInfo.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Founded:</span>
                    <span>{currentJob.companyInfo.founded}</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" asChild>
                  <a href={currentJob.companyInfo.website} target="_blank" rel="noopener noreferrer">
                    Visit Company Website
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/30" />
              <CardHeader className="relative">
                <CardTitle>Benefits & Perks</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <ul className="space-y-2">
                  {currentJob.benefits.map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {benefit}
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Application CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/40" />
              <CardContent className="p-6 relative text-center">
                <h3 className="font-semibold mb-2">Ready to Apply?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Don&apos;t miss out on this opportunity. Apply now and take the next step in your career.
                </p>
                <Button
                  onClick={handleApply}
                  disabled={isApplied}
                  className={`w-full ${
                    isApplied 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Application Submitted
                    </>
                  ) : (
                    'Apply for this Position'
                  )}
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