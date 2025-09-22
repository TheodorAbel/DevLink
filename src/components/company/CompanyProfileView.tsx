import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Globe, MapPin, Users, Building, Linkedin, Mail, Phone, Briefcase } from "lucide-react";
import Link from "next/link";

interface MediaItem { type: 'image' | 'video'; url: string; title?: string; }
interface LeaderItem { name: string; role: string; avatar?: string; }

interface CompanyProfileViewProps {
  company: {
    id: string;
    name: string;
    logo: string;
    coverImage: string;
    industry: string;
    companySize: string;
    location: string;
    website: string;
    founded: string;
    about: string;
    culture?: string;
    media?: MediaItem[];
    leadership?: LeaderItem[];
    hiringProcess?: string[];
    contact?: { email?: string; phone?: string; address?: string; };
    openPositions?: Array<{ id: string; title: string; type: string; location: string; }>;
  };
}

export function CompanyProfileView({ company }: CompanyProfileViewProps) {
  const getInitials = (name: string) => name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 rounded-lg overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-100">
        {company.coverImage && (
          <img src={company.coverImage} alt={`${company.name} cover`} className="w-full h-full object-cover" />
        )}
        <div className="absolute -bottom-8 left-6">
          <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-background bg-white">
            {company.logo ? (
              <AvatarImage src={company.logo} alt={company.name} />
            ) : (
              <AvatarFallback className="text-2xl font-semibold text-blue-600">
                {getInitials(company.name)}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>

      {/* Company Header */}
      <div className="pt-10 px-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{company.name}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center"><Building className="h-4 w-4 mr-1" />{company.industry}</div>
              <div className="flex items-center"><Users className="h-4 w-4 mr-1" />{company.companySize}</div>
              <div className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{company.location}</div>
            </div>
          </div>
          {company.website && (
            <Button variant="outline" size="sm" asChild className="mt-4 md:mt-0">
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <Globe className="h-4 w-4 mr-2" /> Website
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="jobs">Open Positions</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{company.about}</p>
              {company.culture && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Our Culture</h3>
                  <p className="text-muted-foreground">{company.culture}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add more sections for leadership, hiring process, etc. */}
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
              {company.openPositions?.length ? (
                <div className="space-y-4">
                  {company.openPositions.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                      <h3 className="font-medium">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{job.type}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                      </div>
                      <Button variant="outline" size="sm" className="mt-4" asChild>
                        <Link href={`/jobs/${job.id}`}>View Job</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No open positions at the moment.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
