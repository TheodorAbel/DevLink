"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CompanyProfileView } from '@/components/company/CompanyProfileView';

// Mock company data - replace with actual API call
const mockCompanyData = {
  id: '1',
  name: 'TechCorp',
  logo: '/placeholder-company.png',
  coverImage: '/placeholder-cover.jpg',
  industry: 'Information Technology',
  companySize: '51-200 employees',
  location: 'San Francisco, CA',
  website: 'https://techcorp.example.com',
  founded: '2015',
  about: 'TechCorp is a leading technology company specializing in innovative software solutions. We build cutting-edge applications that help businesses transform their digital presence and streamline operations.',
  culture: 'At TechCorp, we believe in fostering a culture of innovation, collaboration, and continuous learning. Our team is passionate about creating meaningful impact through technology.',
  media: [
    { id: '1', type: 'image', url: '/office1.jpg', title: 'Modern Office Space' },
    { id: '2', type: 'image', url: '/team1.jpg', title: 'Team Building Event' },
    { id: '3', type: 'video', url: '/company-video.mp4', title: 'Our Culture' },
  ],
  leadership: [
    { id: '1', name: 'John Doe', role: 'CEO & Co-founder', avatar: '/avatar1.jpg' },
    { id: '2', name: 'Jane Smith', role: 'CTO', avatar: '/avatar2.jpg' },
    { id: '3', name: 'Alex Johnson', role: 'Head of Engineering', avatar: '' },
  ],
  hiringProcess: [
    'Application Review (1-3 days)',
    'Initial Screening Call (30 mins)',
    'Technical Assessment (1-2 hours)',
    'Technical Interview (1 hour)',
    'Team Interview (1 hour)',
    'Final Decision (within 1 week)'
  ],
  contact: {
    email: 'careers@techcorp.example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, San Francisco, CA 94103',
  },
  openPositions: [
    { id: '1', title: 'Senior Frontend Developer', type: 'Full-time', location: 'San Francisco, CA' },
    { id: '2', title: 'UX/UI Designer', type: 'Full-time', location: 'Remote' },
    { id: '3', title: 'DevOps Engineer', type: 'Full-time', location: 'New York, NY' },
    { id: '4', title: 'Product Manager', type: 'Full-time', location: 'Remote' },
  ],
};

export default function CompanyProfilePage() {
  const params = useParams();
  const [company, setCompany] = useState(mockCompanyData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch company data by ID from API
    const fetchCompany = async () => {
      try {
        // const response = await fetch(`/api/companies/${params.id}`);
        // const data = await response.json();
        // setCompany(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching company:', error);
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Link>
        </Button>
      </div>

      <CompanyProfileView company={company} />

      {company.openPositions && company.openPositions.length > 0 && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6">Open Positions at {company.name}</h2>
            <div className="space-y-4">
              {company.openPositions.map((position) => (
                <div key={position.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <h3 className="text-lg font-semibold">{position.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span>{position.type}</span>
                    <span className="mx-2">•</span>
                    <span>{position.location}</span>
                  </div>
                  <div className="mt-3">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/jobs/${position.id}`}>View Job</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
