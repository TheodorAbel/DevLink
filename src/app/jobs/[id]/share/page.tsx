'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Building2,
  ArrowLeft,
  Share2,
  Briefcase,
  Users,
  Globe
} from 'lucide-react';

const mockJob = {
  id: '1',
  title: 'Senior Frontend Developer',
  company: 'TechCorp',
  location: 'San Francisco, CA',
  salary: '$120K - $160K',
  type: 'Full-time',
  postedDate: '2 days ago',
  description: 'We are looking for an experienced frontend developer to join our team and help build amazing user experiences with React and TypeScript.',
  skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
  featured: true,
  companyInfo: {
    name: 'TechCorp',
    size: '500-1000 employees',
    industry: 'Technology',
    description: 'Leading technology company focused on building innovative solutions.',
    culture: 'Innovation-driven, collaborative, and inclusive workplace.',
    mission: 'To empower businesses worldwide through cutting-edge technology solutions.'
  }
};

export default function JobSharePage() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Link>
            <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              {copied ? 'Copied!' : 'Share Job'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Job Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-100"
            >
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockJob.title}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-5 w-5 text-gray-500" />
                    <span className="text-xl font-semibold text-blue-600">{mockJob.company}</span>
                    {mockJob.featured && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                        ⭐ Featured
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">{mockJob.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700 font-semibold">{mockJob.salary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">{mockJob.type}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {mockJob.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex-1">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                    <Button variant="outline">
                      Save Job
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Job Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <p className="text-gray-700 leading-relaxed">{mockJob.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Company Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                      <Building2 className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{mockJob.companyInfo.name}</h3>
                      <p className="text-blue-100">{mockJob.companyInfo.industry}</p>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">{mockJob.companyInfo.size}</span>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">About Company</h4>
                      <p className="text-gray-600 text-sm">{mockJob.companyInfo.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Culture</h4>
                      <p className="text-gray-600 text-sm">{mockJob.companyInfo.culture}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Mission</h4>
                      <p className="text-gray-600 text-sm">{mockJob.companyInfo.mission}</p>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Company Website
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
