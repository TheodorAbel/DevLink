"use client";

import React, { useMemo, useState } from 'react';

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

import { AnimatedBackground } from './AnimatedBackground';
import { toast } from 'sonner';

import { ApplySheet } from './ApplySheet';
import { CompanyProfileView } from './company/CompanyProfileView';
import { supabase } from '@/lib/supabaseClient';
import { formatDistanceToNow } from 'date-fns';
import { useJob, useHasApplied, type DbJob } from '@/hooks/useJob';

interface JobDetailProps {
  onBack: () => void;
  autoOpenApply?: boolean;
  jobId?: string;
}

// DbJob type comes from useJob hook

export function JobDetail({ onBack, autoOpenApply = false, jobId }: JobDetailProps) {
  const [isApplied, setIsApplied] = useState(false);
  const [applyOpen, setApplyOpen] = useState(autoOpenApply);
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);
  const [companyData, setCompanyData] = useState<null | Parameters<typeof CompanyProfileView>[0]["company"]>(null);
  const { data: dbJob, isLoading: loading, error } = useJob(jobId);
  const { data: hasApplied } = useHasApplied(jobId);
  
  // keep local flag in sync with query result unless set by onApplied
  React.useEffect(() => {
    if (hasApplied) setIsApplied(true);
  }, [hasApplied]);

  const mapped = useMemo(() => {
    if (!dbJob) return null;
    const typeMap: Record<string, string> = {
      full_time: 'Full-time',
      part_time: 'Part-time',
      contract: 'Contract',
      internship: 'Internship',
    };
    // Salary
    let salary = 'Competitive';
    if (dbJob.salary_type === 'range' && dbJob.salary_min && dbJob.salary_max) {
      salary = `${dbJob.salary_currency || 'ETB'} ${dbJob.salary_min} - ${dbJob.salary_max}`;
    } else if (dbJob.salary_type === 'fixed' && dbJob.salary_fixed) {
      salary = `${dbJob.salary_currency || 'ETB'} ${dbJob.salary_fixed}`;
    } else if (dbJob.custom_salary_message) {
      salary = dbJob.custom_salary_message;
    }
    const postedDate = dbJob.published_at
      ? formatDistanceToNow(new Date(dbJob.published_at), { addSuffix: true })
      : 'Recently';

    return {
      id: dbJob.id,
      title: dbJob.title,
      company: dbJob.companies?.company_name || 'Company',
      companyId: dbJob.company_id,
      location: dbJob.location || '—',
      salary,
      type: typeMap[dbJob.job_type || ''] || dbJob.job_type || 'Full-time',
      postedDate,
      applicationDeadline: dbJob.application_deadline ? new Date(dbJob.application_deadline).toDateString() : '—',
      applicants: 0,
      description: dbJob.description || '',
      responsibilities: dbJob.responsibilities || [],
      requirements: dbJob.requirements || [],
      skills: dbJob.skills_required || [],
      benefits: dbJob.companies?.benefits || [],
      companyInfo: {
        name: dbJob.companies?.company_name || 'Company',
        size: dbJob.companies?.company_size || '—',
        industry: dbJob.companies?.industry || '—',
        founded: dbJob.companies?.founded_year ? String(dbJob.companies.founded_year) : '—',
        description: dbJob.companies?.description || '',
        website: dbJob.companies?.website_url || '#',
        headquarters: dbJob.companies?.headquarters || undefined,
      },
    };
  }, [dbJob]);

  const currentJob = mapped || {
    id: '',
    title: '',
    company: 'Company',
    companyId: '',
    location: '—',
    salary: '—',
    type: '—',
    postedDate: '—',
    applicationDeadline: '—',
    applicants: 0,
    description: '',
    responsibilities: [],
    requirements: [],
    skills: [],
    benefits: [],
    companyInfo: {
      name: 'Company',
      size: '—',
      industry: '—',
      founded: '—',
      description: '',
      website: '#',
      headquarters: undefined as string | undefined,
    },
  };

  const handleApply = () => {
    // Open the responsive Apply sheet instead of instant-apply
    setApplyOpen(true);
  };

  const buildCompanyFromDb = (): NonNullable<Parameters<typeof CompanyProfileView>[0]["company"]> => ({
    id: currentJob.companyId,
    name: currentJob.company,
    logo: '',
    coverImage: '',
    industry: currentJob.companyInfo.industry || '—',
    companySize: currentJob.companyInfo.size || '—',
    location: currentJob.companyInfo.headquarters || currentJob.location,
    website: currentJob.companyInfo.website,
    founded: currentJob.companyInfo.founded,
    about: currentJob.companyInfo.description,
    tagline: '',
    verified: true,
    remotePolicy: '',
    social: {},
    culture: '',
    cultureItems: [],
    media: [],
    leadership: [],
    hiringProcess: [],
    contact: { email: '', phone: '', address: currentJob.location },
    openPositions: [
      { id: currentJob.id, title: currentJob.title, type: currentJob.type, location: currentJob.location }
    ]
  });

  const openCompany = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCompanyData(buildCompanyFromDb());
    setShowCompanyProfile(true);
  };

  // Removed unused save/share/report handlers to satisfy ESLint

  const copyJobDescription = () => {
    const fullDescription = `${currentJob.title} at ${currentJob.company}\n\n${currentJob.description}\n\nResponsibilities:\n${currentJob.responsibilities.map(r => `• ${r}`).join('\n')}\n\nRequirements:\n${currentJob.requirements.map(r => `• ${r}`).join('\n')}`;
    navigator.clipboard.writeText(fullDescription);
    toast.success('Job description copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground variant="particles" />
        <div className="relative z-10 p-6 max-w-4xl mx-auto">
          <div className="h-10 w-40 bg-gray-100 animate-pulse rounded mb-4" />
          <div className="h-32 w-full bg-gray-100 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground variant="particles" />
        <div className="relative z-10 p-6 max-w-4xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-4">Back</Button>
          <Card><CardContent className="p-6 text-red-600">{String(error)}</CardContent></Card>
        </div>
      </div>
    );
  }

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
                  <div
                    className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 hover:ring-2 hover:ring-blue-200 cursor-pointer"
                    onClick={openCompany}
                  >
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {currentJob.title}
                    </h1>
                    <button
                      type="button"
                      onClick={openCompany}
                      className="text-left text-lg text-blue-600 font-medium mb-4 hover:underline"
                    >
                      {currentJob.company}
                    </button>
                    
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
          jobId={currentJob.id}
          onApplied={() => setIsApplied(true)}
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

          {/* About Company (inline Company Profile Preview) */}
          {showCompanyProfile && companyData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>About {companyData.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 overflow-x-hidden">
                  <CompanyProfileView company={companyData} />
                </CardContent>
              </Card>
            </motion.div>
          )}

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
                    <button
                      type="button"
                      onClick={openCompany}
                      className="text-muted-foreground hover:text-blue-600 hover:underline flex items-center"
                    >
                      {currentJob.company}
                      <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
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