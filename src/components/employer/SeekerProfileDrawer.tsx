import { useState } from "react";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { 
  Download, 
  ExternalLink, 
  MapPin, 
  Mail, 
  Phone, 
  Globe,
  ChevronDown,
  ChevronUp,
  Star,
  Calendar,
  Briefcase,
  GraduationCap,
  FileText,
  Eye
} from "lucide-react";

interface SeekerProfile {
  id: string;
  name: string;
  title: string;
  location: string;
  email: string;
  phone?: string;
  website?: string;
  avatar?: string;
  bio: string;
  rating?: number;
  skills: string[];
  experience: {
    id: string;
    title: string;
    company: string;
    duration: string;
    description: string;
    current: boolean;
  }[];
  education: {
    id: string;
    degree: string;
    school: string;
    year: string;
    description?: string;
  }[];
  portfolioLinks: {
    id: string;
    title: string;
    url: string;
    type: 'website' | 'github' | 'linkedin' | 'behance' | 'dribbble' | 'other';
  }[];
  resumeUrl: string;
  publicProfileUrl: string;
}

interface SeekerProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: SeekerProfile | null;
  onMessage?: () => void;
  onViewPublicProfile?: () => void;
}

export function SeekerProfileDrawer({ 
  isOpen, 
  onClose, 
  profile,
  onMessage,
  onViewPublicProfile 
}: SeekerProfileDrawerProps) {
  const [expandedExperience, setExpandedExperience] = useState<string[]>([]);
  const [expandedEducation, setExpandedEducation] = useState<string[]>([]);

  if (!profile) return null;

  const toggleExperience = (id: string) => {
    setExpandedExperience(prev => 
      prev.includes(id) 
        ? prev.filter(expId => expId !== id)
        : [...prev, id]
    );
  };

  const toggleEducation = (id: string) => {
    setExpandedEducation(prev => 
      prev.includes(id) 
        ? prev.filter(eduId => eduId !== id)
        : [...prev, eduId]
    );
  };

  const getPortfolioIcon = (type: string) => {
    switch (type) {
      case 'github': return '🔗';
      case 'linkedin': return '💼';
      case 'behance': return '🎨';
      case 'dribbble': return '🏀';
      case 'website': return '🌐';
      default: return '🔗';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[600px] p-0 overflow-y-auto"
      >
        <div className="sticky top-0 bg-background border-b border-border z-10">
          <SheetHeader className="p-6 pb-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="text-lg">
                  {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <SheetTitle className="text-left text-xl">{profile.name}</SheetTitle>
                <SheetDescription className="sr-only">
                  Full profile details for {profile.name}, {profile.title}
                </SheetDescription>
                <p className="text-muted-foreground">{profile.title}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {profile.location}
                  </div>
                  {profile.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {profile.rating}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button onClick={onMessage}>
                <Mail className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" onClick={onViewPublicProfile}>
                <Eye className="h-4 w-4 mr-2" />
                Public Profile
              </Button>
              <Button variant="outline" asChild>
                <a href={profile.resumeUrl} download>
                  <Download className="h-4 w-4 mr-2" />
                  Resume
                </a>
              </Button>
            </div>
          </SheetHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
              )}
              {profile.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {profile.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{profile.bio}</p>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.experience.map((exp, index) => (
                <div key={exp.id} className="border-l-2 border-border pl-4 pb-4 last:pb-0">
                  <Collapsible>
                    <CollapsibleTrigger 
                      className="w-full text-left"
                      onClick={() => toggleExperience(exp.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{exp.title}</h4>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            {exp.duration}
                            {exp.current && (
                              <Badge variant="outline" className="text-xs">Current</Badge>
                            )}
                          </div>
                        </div>
                        {expandedExperience.includes(exp.id) ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {exp.description}
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-border pl-4 pb-4 last:pb-0">
                  <Collapsible>
                    <CollapsibleTrigger 
                      className="w-full text-left"
                      onClick={() => toggleEducation(edu.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{edu.degree}</h4>
                          <p className="text-sm text-muted-foreground">{edu.school}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            {edu.year}
                          </div>
                        </div>
                        {edu.description && (
                          expandedEducation.includes(edu.id) ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )
                        )}
                      </div>
                    </CollapsibleTrigger>
                    {edu.description && (
                      <CollapsibleContent className="mt-2">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {edu.description}
                        </p>
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Portfolio */}
          {profile.portfolioLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Portfolio & Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.portfolioLinks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getPortfolioIcon(link.type)}</span>
                      <div>
                        <h5 className="text-sm font-medium">{link.title}</h5>
                        <p className="text-xs text-muted-foreground capitalize">{link.type}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}