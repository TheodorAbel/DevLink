/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Globe, MapPin, Users, Building, Mail, Phone, Linkedin, Twitter, Github, Youtube, CheckCircle } from "lucide-react";
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
    tagline?: string; // short mission statement for header
    verified?: boolean; // show Verified pill if true
    remotePolicy?: string; // e.g., Hybrid, Remote, On-site
    social?: { linkedin?: string; twitter?: string; github?: string; youtube?: string };
    culture?: string;
    cultureItems?: Array<{ title: string; description: string }>; // richer culture grid
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
    <div className="space-y-6 overflow-x-hidden">
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
            {company.tagline && (
              <p className="text-muted-foreground mt-1">{company.tagline}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center"><Building className="h-4 w-4 mr-1" />{company.industry}</div>
              <div className="flex items-center"><Users className="h-4 w-4 mr-1" />{company.companySize}</div>
              <div className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{company.location}</div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            {company.verified && (
              <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 border border-green-200 text-xs font-medium px-2 py-1 rounded-full">
                <CheckCircle className="h-3 w-3" /> Verified
              </span>
            )}
            {company.website && (
              <Button variant="outline" size="sm" asChild>
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" /> Website
                </a>
              </Button>
            )}
          </div>
        </div>
        {/* Social + Remote policy */}
        {(company.social || company.remotePolicy) && (
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
            {company.social?.linkedin && (
              <a href={company.social.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-blue-600">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            )}
            {company.social?.twitter && (
              <a href={company.social.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-blue-600">
                <Twitter className="h-4 w-4" /> Twitter
              </a>
            )}
            {company.social?.github && (
              <a href={company.social.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-blue-600">
                <Github className="h-4 w-4" /> GitHub
              </a>
            )}
            {company.social?.youtube && (
              <a href={company.social.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-blue-600">
                <Youtube className="h-4 w-4" /> YouTube
              </a>
            )}
            {company.remotePolicy && (
              <div className="text-sm text-muted-foreground">
                Remote policy: <span className="font-medium">{company.remotePolicy}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="jobs">Open Positions</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{company.about}</p>
              {company.cultureItems?.length ? (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Our Culture</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {company.cultureItems.map((c, idx) => (
                      <div key={idx} className="rounded-xl border p-4 bg-white">
                        <div className="font-semibold mb-1">{c.title}</div>
                        <div className="text-sm text-muted-foreground">{c.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : company.culture ? (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Our Culture</h3>
                  <p className="text-muted-foreground">{company.culture}</p>
                </div>
              ) : null}
              {/* Divider */}
              <div className="my-6 h-px w-full bg-border" />

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-2xl font-semibold">{company.companySize}</div>
                  <div className="text-sm text-muted-foreground mt-1">Employees</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold">{company.founded || '—'}</div>
                  <div className="text-sm text-muted-foreground mt-1">Founded</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold truncate" title={company.location}>{company.location}</div>
                  <div className="text-sm text-muted-foreground mt-1">Location</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold truncate">
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {company.website.replace(/^https?:\/\//, '')}
                      </a>
                    ) : '—'}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Website</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {company.media?.length ? (
            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {company.media.map((m, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden border">
                      {m.type === 'image' ? (
                        <img src={m.url} alt={m.title || 'Media'} className="w-full h-40 object-cover" />
                      ) : (
                        <video controls className="w-full h-40 object-cover">
                          <source src={m.url} />
                        </video>
                      )}
                      {m.title && <div className="p-2 text-sm text-muted-foreground">{m.title}</div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {company.leadership?.length ? (
            <Card>
              <CardHeader>
                <CardTitle>Leadership</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {company.leadership.map((leader, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border">
                      <Avatar>
                        {leader.avatar ? (
                          <AvatarImage src={leader.avatar} alt={leader.name} />
                        ) : (
                          <AvatarFallback>{leader.name.split(' ').map(w=>w[0]).join('').toUpperCase().substring(0,2)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium">{leader.name}</div>
                        <div className="text-sm text-muted-foreground">{leader.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {company.hiringProcess?.length ? (
            <Card>
              <CardHeader>
                <CardTitle>Hiring Process</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                  {company.hiringProcess.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ) : null}

          {company.contact && (company.contact.email || company.contact.phone || company.contact.address) ? (
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {company.contact.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-muted-foreground">Email</div>
                        <a className="text-blue-600 hover:underline" href={`mailto:${company.contact.email}`}>{company.contact.email}</a>
                      </div>
                    </div>
                  )}
                  {company.contact.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-muted-foreground">Phone</div>
                        <a className="text-blue-600 hover:underline" href={`tel:${company.contact.phone}`}>{company.contact.phone}</a>
                      </div>
                    </div>
                  )}
                  {company.contact.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <div className="text-muted-foreground">Address</div>
                        <div>{company.contact.address}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : null}
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
