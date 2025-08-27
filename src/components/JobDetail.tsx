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
  Users,
  Building2,
  Bookmark,
  Share2,
  Flag,
  Copy,
  Mail,
  MessageCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { toast } from 'sonner';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface JobDetailProps {
  onBack: () => void;
}

// Mock job data
const jobDetail = {
  id: '1',
  title: 'Senior Frontend Developer',
  company: 'TechCorp',
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

export function JobDetail({ onBack }: JobDetailProps) {
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleApply = () => {
    setIsApplied(true);
    toast.success('Application submitted successfully! 🎉', {
      description: 'We\'ll notify you about the status of your application.'
    });
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Job removed from saved' : 'Job saved successfully!');
  };

  const handleShare = (platform?: string) => {
    const jobUrl = `${window.location.origin}/jobs/${jobDetail.id}`;
    const shareText = `Check out this ${jobDetail.title} position at ${jobDetail.company}!`;
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(jobUrl);
      toast.success('Job URL copied to clipboard!');
    } else if (platform === 'email') {
      window.open(`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\n${jobUrl}`)}`);
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`);
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${jobUrl}`)}`);
    } else {
      // Generic share
      if (navigator.share) {
        navigator.share({
          title: shareText,
          url: jobUrl
        });
      } else {
        navigator.clipboard.writeText(jobUrl);
        toast.success('Job URL copied to clipboard!');
      }
    }
  };

  const handleReport = () => {
    toast.success('Job reported. Thank you for helping us maintain quality listings.');
  };

  const copyJobDescription = () => {
    const fullDescription = `${jobDetail.title} at ${jobDetail.company}\n\n${jobDetail.description}\n\nResponsibilities:\n${jobDetail.responsibilities.map(r => `• ${r}`).join('\n')}\n\nRequirements:\n${jobDetail.requirements.map(r => `• ${r}`).join('\n')}`;
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
                      {jobDetail.title}
                    </h1>
                    <p className="text-lg text-blue-600 font-medium mb-4">{jobDetail.company}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {jobDetail.location}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        {jobDetail.salary}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {jobDetail.type}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {jobDetail.applicants} applicants
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
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleSave}
                      className={`${isSaved ? 'bg-yellow-50 border-yellow-200' : ''}`}
                    >
                      <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleShare('copy')}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare('email')}>
                          <Mail className="h-4 w-4 mr-2" />
                          Share via Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare('linkedin')}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Share on LinkedIn
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Share on WhatsApp
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Button variant="outline" onClick={handleReport}>
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Job Meta Info */}
              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-muted-foreground">
                  Posted {jobDetail.postedDate}
                </div>
                <div className="text-sm text-muted-foreground">
                  Application deadline: {jobDetail.applicationDeadline}
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
            </CardContent>
          </Card>
        </motion.div>

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
                  <p className="text-muted-foreground leading-relaxed">{jobDetail.description}</p>
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
                    {jobDetail.responsibilities.map((responsibility, index) => (
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
                    {jobDetail.requirements.map((requirement, index) => (
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
                    {jobDetail.skills.map((skill, index) => (
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
                  <CardTitle>About {jobDetail.companyInfo.name}</CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <p className="text-sm text-muted-foreground">{jobDetail.companyInfo.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Company size:</span>
                      <span>{jobDetail.companyInfo.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Industry:</span>
                      <span>{jobDetail.companyInfo.industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Founded:</span>
                      <span>{jobDetail.companyInfo.founded}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <a href={jobDetail.companyInfo.website} target="_blank" rel="noopener noreferrer">
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
                    {jobDetail.benefits.map((benefit, index) => (
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
                    Don't miss out on this opportunity. Apply now and take the next step in your career.
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