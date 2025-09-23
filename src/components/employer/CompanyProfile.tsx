/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { 
  Upload,
  Eye,
  Save,
  CheckCircle,
  Clock,
  Globe,
  MapPin,
  Users,
  Building,
  Linkedin,
  Twitter,
  Github,
  Youtube,
  PanelLeft,
  Play,
  Trash2
} from "lucide-react";
import { Switch } from "./ui/switch";
import { toast } from "sonner";

interface CultureItem { title: string; description?: string }
interface MediaItem { 
  type: 'image' | 'video'; 
  url: string; 
  title?: string;
  thumbnail?: string;
  size?: number;
  duration?: number;
}
interface LeaderItem { name: string; title: string; photoUrl?: string; linkedin?: string }
interface Contacts { email?: string; phone?: string; address?: string }

interface CompanyProfileData {
  logo: string;
  companyName: string;
  slogan?: string;
  description: string;
  website: string;
  industry: string;
  location: string;
  companySize: string;
  founded: string;
  isVerified: boolean;
  verificationStatus: 'verified' | 'pending' | 'not_submitted';
  // optional essentials
  remotePolicy?: 'Remote-first' | 'Hybrid' | 'Onsite';
  socials?: { linkedin?: string; twitter?: string; github?: string; youtube?: string };
  cultureValues?: CultureItem[];
  media?: MediaItem[];
  leaders?: LeaderItem[];
  hiringProcess?: string;
  contacts?: Contacts;
  display?: {
    showEmployees?: boolean;
    showCulture?: boolean;
    showMedia?: boolean;
    showLeadership?: boolean;
    showHiring?: boolean;
    showContacts?: boolean;
    showSocials?: boolean;
  }
}

export function CompanyProfile() {
  const [activeTab, setActiveTab] = useState('edit');
  // Media validation constants
  const MEDIA_LIMITS = {
    MAX_IMAGES: 10,
    MAX_VIDEOS: 3,
    MAX_VIDEO_DURATION: 300, // 5 minutes in seconds
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_VIDEO_SIZE: 50 * 1024 * 1024, // 50MB
  };

  const [mediaError, setMediaError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [profileData, setProfileData] = useState<CompanyProfileData>({
    logo: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    companyName: 'TechCorp',
    slogan: 'Building products that empower people and businesses',
    description: 'We are a leading technology company focused on building innovative solutions that transform how businesses operate. Our team of passionate engineers, designers, and product managers work together to create products that make a real impact in the world.\n\nFounded in 2018, we\'ve grown from a small startup to a thriving company with over 200 employees across multiple offices. We pride ourselves on our inclusive culture, commitment to work-life balance, and opportunities for professional growth.',
    website: 'https://techcorp.com',
    industry: 'Technology',
    location: 'San Francisco, CA',
    companySize: '51-200',
    founded: '2018',
    isVerified: true,
    verificationStatus: 'verified',
    remotePolicy: 'Hybrid',
    socials: {
      linkedin: 'https://linkedin.com/company/techcorp',
      twitter: 'https://twitter.com/techcorp',
      github: 'https://github.com/techcorp',
      youtube: 'https://youtube.com/techcorp'
    },
    cultureValues: [
      {
        title: 'Innovation',
        description: 'We encourage creative thinking and experimentation to drive breakthrough solutions.'
      },
      {
        title: 'Collaboration',
        description: 'We believe in the power of teamwork and open communication across all levels.'
      },
      {
        title: 'Diversity & Inclusion',
        description: 'We celebrate differences and believe diverse perspectives make us stronger.'
      },
      {
        title: 'Work-Life Balance',
        description: 'We support our team in maintaining a healthy balance between work and personal life.'
      }
    ],
    media: [
      {
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        title: 'Our Headquarters',
        thumbnail: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=60',
        size: 1024 * 500, // 500KB sample size
        duration: 0
      },
      {
        type: 'video' as const,
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        title: 'Company Culture Video',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        size: 10 * 1024 * 1024, // 10MB sample size
        duration: 212 // 3:32 minutes in seconds
      }
    ],
    leaders: [
      {
        name: 'Alex Johnson',
        title: 'CEO & Co-Founder',
        photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        linkedin: 'https://linkedin.com/in/alexjohnson'
      },
      {
        name: 'Sarah Williams',
        title: 'CTO',
        photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
        linkedin: 'https://linkedin.com/in/sarahwilliams'
      },
      {
        name: 'Michael Chen',
        title: 'Head of Product',
        photoUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
        linkedin: 'https://linkedin.com/in/michaelchen'
      }
    ],
    hiringProcess: 'Our hiring process is designed to be thorough yet efficient:\n\n1. **Application Review** - Our team reviews your application and resume\n2. **Initial Screening** - A 30-minute call with our HR team\n3. **Technical Assessment** - A practical task to showcase your skills\n4. **Team Interview** - Meet with your potential future team members\n5. **Final Interview** - A conversation with senior leadership\n\nWe aim to complete the entire process within 2-3 weeks.',
    contacts: {
      email: 'careers@techcorp.com',
      phone: '+1 (555) 123-4567',
      address: '123 Tech Street, San Francisco, CA 94107, USA'
    },
    display: {
      showEmployees: true,
      showCulture: true,
      showMedia: true,
      showLeadership: true,
      showHiring: true,
      showContacts: true,
      showSocials: true
    }
  });

  // Removed unused logoFile state

  const handleSave = () => {
    // Validate media before saving
    const media = profileData.media ?? [];
    const imageCount = media.filter(m => m.type === 'image').length;
    const videoCount = media.filter(m => m.type === 'video').length;
    
    if (imageCount > MEDIA_LIMITS.MAX_IMAGES) {
      toast.error(`Maximum ${MEDIA_LIMITS.MAX_IMAGES} images allowed`);
      return;
    }
    
    if (videoCount > MEDIA_LIMITS.MAX_VIDEOS) {
      toast.error(`Maximum ${MEDIA_LIMITS.MAX_VIDEOS} videos allowed`);
      return;
    }
    
    const longVideo = media.find(m => m.type === 'video' && (m.duration ?? 0) > MEDIA_LIMITS.MAX_VIDEO_DURATION);
    if (longVideo) {
      toast.error(`Videos must be under ${Math.floor(MEDIA_LIMITS.MAX_VIDEO_DURATION / 60)} minutes`);
      return;
    }
    
    toast.success('Company profile updated successfully!');
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Validate file size (max 2MB for logo)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo size should be less than 2MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileData(prev => ({ ...prev, logo: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };
  
  const handleMediaUpload = async (type: 'image' | 'video', file: File) => {
    if (isUploading) return;
    
    setIsUploading(true);
    setMediaError(null);
    
    try {
      // Check media limits
      const currentMedia = [...(profileData.media || [])];
      const imageCount = currentMedia.filter(m => m.type === 'image').length;
      const videoCount = currentMedia.filter(m => m.type === 'video').length;
      
      if (type === 'image' && imageCount >= MEDIA_LIMITS.MAX_IMAGES) {
        throw new Error(`Maximum ${MEDIA_LIMITS.MAX_IMAGES} images allowed`);
      }
      
      if (type === 'video' && videoCount >= MEDIA_LIMITS.MAX_VIDEOS) {
        throw new Error(`Maximum ${MEDIA_LIMITS.MAX_VIDEOS} videos allowed`);
      }
      
      // Validate file size
      const maxSize = type === 'image' ? MEDIA_LIMITS.MAX_IMAGE_SIZE : MEDIA_LIMITS.MAX_VIDEO_SIZE;
      if (file.size > maxSize) {
        const maxSizeMB = Math.floor(maxSize / (1024 * 1024));
        throw new Error(`${type === 'image' ? 'Image' : 'Video'} size should be less than ${maxSizeMB}MB`);
      }
      
      // For videos, we would typically upload to a server here
      // For this example, we'll just create a preview
      const url = URL.createObjectURL(file);
      const thumbnail = type === 'image' ? url : 'https://via.placeholder.com/300x169?text=Video+Thumbnail';
      
      const newMedia = {
        type,
        url,
        title: file.name,
        thumbnail,
        size: file.size,
        duration: 0 // Would be set after processing the video
      };
      
      setProfileData(prev => ({
        ...prev,
        media: [...currentMedia, newMedia]
      }));
      
      toast.success(`${type === 'image' ? 'Image' : 'Video'} uploaded successfully`);
      
    } catch (error) {
      setMediaError(error instanceof Error ? error.message : 'Error uploading media');
      toast.error(mediaError || 'Error uploading media');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleMediaDelete = (index: number) => {
    const newMedia = [...(profileData.media ?? [])];
    newMedia.splice(index, 1);
    setProfileData(prev => ({
      ...prev,
      media: newMedia
    }));
  };

  const getVerificationBadge = () => {
    switch (profileData.verificationStatus) {
      case 'verified':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Verification Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Not Verified
          </Badge>
        );
    }
  };

  // Basic completeness meter (counts required fields filled)
  const completeness = useMemo(() => {
    const required = [
      profileData.companyName,
      profileData.website,
      profileData.industry,
      profileData.location,
      profileData.companySize,
      profileData.founded,
      profileData.description,
    ];
    const filled = required.filter(Boolean).length;
    return Math.round((filled / required.length) * 100);
  }, [profileData]);

  const CompanyPreview = () => {
    const socials = profileData.socials || {};
    const show = {
      showEmployees: profileData.display?.showEmployees ?? true,
      showSocials: profileData.display?.showSocials ?? true,
      showCulture: profileData.display?.showCulture ?? true,
      showMedia: profileData.display?.showMedia ?? true,
      showLeadership: profileData.display?.showLeadership ?? true,
      showHiring: profileData.display?.showHiring ?? true,
      showContacts: profileData.display?.showContacts ?? true,
    };
    
    const hasSocials = show.showSocials && (socials.linkedin || socials.twitter || socials.github || socials.youtube);
    const hasCulture = show.showCulture && profileData.cultureValues && profileData.cultureValues.length > 0;
    const hasMedia = show.showMedia && profileData.media && profileData.media.length > 0;
    const hasLeaders = show.showLeadership && profileData.leaders && profileData.leaders.length > 0;
    const hasHiringProcess = show.showHiring && !!profileData.hiringProcess;
    const hasContacts = show.showContacts && profileData.contacts && (
      profileData.contacts.email || 
      profileData.contacts.phone || 
      profileData.contacts.address
    );

    return (
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileData.logo} alt={profileData.companyName} />
                <AvatarFallback className="text-xl">
                  {profileData.companyName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-medium">{profileData.companyName}</h1>
                  {getVerificationBadge()}
                </div>
                
                {profileData.slogan && (
                  <p className="text-muted-foreground -mt-0.5 mb-2">{profileData.slogan}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {profileData.industry}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {profileData.location}
                  </div>
                  {show.showEmployees !== false && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {profileData.companySize} employees
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a href={profileData.website} className="text-primary hover:underline">
                      {profileData.website.replace('https://', '')}
                    </a>
                  </div>
                </div>

                {/* Social links (dynamic count, hide if none) */}
                {hasSocials && (
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                    {socials.linkedin && (
                      <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline"><Linkedin className="h-4 w-4"/> LinkedIn</a>
                    )}
                    {socials.twitter && (
                      <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline"><Twitter className="h-4 w-4"/> Twitter</a>
                    )}
                    {socials.github && (
                      <a href={socials.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline"><Github className="h-4 w-4"/> GitHub</a>
                    )}
                    {socials.youtube && (
                      <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline"><Youtube className="h-4 w-4"/> YouTube</a>
                    )}
                  </div>
                )}

                {/* Remote policy */}
                {profileData.remotePolicy && (
                  <div className="mt-2 text-xs text-muted-foreground">Remote policy: <span className="text-foreground font-medium">{profileData.remotePolicy}</span></div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About + Key metrics (rating removed) */}
        <Card>
          <CardHeader>
            <CardTitle>About {profileData.companyName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {profileData.description}
            </div>
            
            {/* Key metrics - respect showEmployees */}
            {(show.showEmployees !== false || profileData.founded) && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {show.showEmployees !== false && (
                    <div>
                      <div className="text-2xl font-bold">{profileData.companySize.replace('+','')}+</div>
                      <div className="text-sm text-muted-foreground">Employees</div>
                    </div>
                  )}
                  {profileData.founded && (
                    <div>
                      <div className="text-2xl font-bold">{profileData.founded}</div>
                      <div className="text-sm text-muted-foreground">Founded</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Culture Section */}
        {show.showCulture && hasCulture && (
          <Card>
            <CardHeader>
              <CardTitle>Our Culture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileData.cultureValues?.map((item, i) => (
                  <div key={i} className="p-4 border rounded-lg bg-muted/10">
                    <h4 className="font-medium mb-1">{item.title}</h4>
                    {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Media Section */}
        {show.showMedia && hasMedia && (
          <Card>
            <CardHeader>
              <CardTitle>Media Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profileData.media?.map((item, i) => (
                  <div key={i} className="group relative rounded-lg overflow-hidden border">
                    {item.type === 'image' ? (
                      <img 
                        src={item.url} 
                        alt={item.title || 'Company media'} 
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                        }}
                      />
                    ) : (
                      <div className="relative pt-[56.25%] bg-black">
                        {item.thumbnail ? (
                          <img 
                            src={item.thumbnail} 
                            alt={item.title || 'Video thumbnail'} 
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted">
                            <Youtube className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                            <svg className="w-6 h-6 text-foreground group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        {(item.duration ?? 0) > 0 && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                            {`${Math.floor((item.duration ?? 0) / 60)}:${(((item.duration ?? 0) % 60).toString()).padStart(2, '0')}`}
                          </div>
                        )}
                      </div>
                    )}
                    {item.title && (
                      <div className="p-3">
                        <p className="font-medium text-sm">{item.title}</p>
                      </div>
                    )}
                    {item.type === 'video' && (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute inset-0 z-10"
                        title="Open video in new tab"
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leadership Section */}
        {show.showLeadership && hasLeaders && (
          <Card>
            <CardHeader>
              <CardTitle>Leadership</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {profileData.leaders?.map((leader, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={leader.photoUrl} alt={leader.name} />
                      <AvatarFallback>
                        {leader.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{leader.name}</h4>
                      <p className="text-sm text-muted-foreground">{leader.title}</p>
                      {leader.linkedin && (
                        <a 
                          href={leader.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1"
                        >
                          <Linkedin className="h-3 w-3" /> Connect
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hiring Process Section */}
        {show.showHiring && hasHiringProcess && (
          <Card>
            <CardHeader>
              <CardTitle>Our Hiring Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {profileData.hiringProcess}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contacts Section */}
        {show.showContacts && hasContacts && (
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profileData.contacts?.email && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a href={`mailto:${profileData.contacts.email}`} className="text-foreground hover:underline">
                        {profileData.contacts.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {profileData.contacts?.phone && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <a href={`tel:${profileData.contacts.phone.replace(/\D/g, '')}`} className="text-foreground hover:underline">
                        {profileData.contacts.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {profileData.contacts?.address && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-md">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="text-foreground">{profileData.contacts.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium">Company Profile</h1>
          <p className="text-muted-foreground">Manage your company&#39;s public profile</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setActiveTab(activeTab === 'preview' ? 'edit' : 'preview')}
          >
            {activeTab === 'preview' ? (
              <>
                <PanelLeft className="h-4 w-4" />
                Back to Edit
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Preview Public View
              </>
            )}
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
          {/* Completeness meter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile Completeness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Fill in the key fields to complete your public profile.</span>
                <span className="text-muted-foreground">{completeness}%</span>
              </div>
              <Progress value={completeness} />
              
              <div className="mt-4 pt-4 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">What&#39;s visible to job seekers</h4>
                    <p className="text-sm text-muted-foreground">
                      Toggle sections to control what appears on your public profile.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showEmployees" className="text-sm font-medium">Employees & Team Size</Label>
                      <Switch
                        id="showEmployees"
                        checked={profileData.display?.showEmployees !== false}
                        onCheckedChange={(checked) => 
                          setProfileData(prev => ({
                            ...prev,
                            display: { ...prev.display, showEmployees: checked }
                          }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showSocials" className="text-sm font-medium">Social Media Links</Label>
                      <Switch
                        id="showSocials"
                        checked={profileData.display?.showSocials !== false}
                        onCheckedChange={(checked) => 
                          setProfileData(prev => ({
                            ...prev,
                            display: { ...prev.display, showSocials: checked }
                          }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showCulture" className="text-sm font-medium">Company Culture</Label>
                      <Switch
                        id="showCulture"
                        checked={profileData.display?.showCulture !== false}
                        onCheckedChange={(checked) => 
                          setProfileData(prev => ({
                            ...prev,
                            display: { ...prev.display, showCulture: checked }
                          }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showMedia" className="text-sm font-medium">Media Gallery</Label>
                      <Switch
                        id="showMedia"
                        checked={profileData.display?.showMedia !== false}
                        onCheckedChange={(checked) => 
                          setProfileData(prev => ({
                            ...prev,
                            display: { ...prev.display, showMedia: checked }
                          }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showLeadership" className="text-sm font-medium">Leadership Team</Label>
                      <Switch
                        id="showLeadership"
                        checked={profileData.display?.showLeadership !== false}
                        onCheckedChange={(checked) => 
                          setProfileData(prev => ({
                            ...prev,
                            display: { ...prev.display, showLeadership: checked }
                          }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showHiring" className="text-sm font-medium">Hiring Process</Label>
                      <Switch
                        id="showHiring"
                        checked={profileData.display?.showHiring !== false}
                        onCheckedChange={(checked) => 
                          setProfileData(prev => ({
                            ...prev,
                            display: { ...prev.display, showHiring: checked }
                          }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showContacts" className="text-sm font-medium">Contact Information</Label>
                      <Switch
                        id="showContacts"
                        checked={profileData.display?.showContacts !== false}
                        onCheckedChange={(checked) => 
                          setProfileData(prev => ({
                            ...prev,
                            display: { ...prev.display, showContacts: checked }
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logo Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Company Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileData.logo} alt={profileData.companyName} />
                  <AvatarFallback className="text-xl">
                    {profileData.companyName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-2">
                  <Label htmlFor="logo-upload" className="cursor-pointer">
                    <Button variant="outline" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </span>
                    </Button>
                  </Label>
                  <Input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  <p className="text-xs text-muted-foreground">Recommended: Square image, at least 200x200px</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" value={profileData.companyName} onChange={(e) => setProfileData(prev => ({ ...prev, companyName: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" type="url" value={profileData.website} onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))} placeholder="https://company.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Company Description</Label>
                <Textarea id="description" value={profileData.description} onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))} rows={6} placeholder="Tell candidates about your company, culture, and mission..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={profileData.industry} onValueChange={(value) => setProfileData(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select value={profileData.companySize} onValueChange={(value) => setProfileData(prev => ({ ...prev, companySize: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="501-1000">501-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={profileData.location} onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))} placeholder="City, State/Country" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founded">Founded Year</Label>
                  <Input id="founded" value={profileData.founded} onChange={(e) => setProfileData(prev => ({ ...prev, founded: e.target.value }))} placeholder="2020" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optional: Remote Policy + Socials */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Work Style & Socials (optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Remote Policy</Label>
                <Select value={profileData.remotePolicy} onValueChange={(v: 'Remote-first' | 'Hybrid' | 'Onsite') => setProfileData(prev => ({...prev, remotePolicy: v}))}>
                  <SelectTrigger><SelectValue placeholder="Select policy"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote-first">Remote-first</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Onsite">Onsite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>LinkedIn</Label>
                  <Input placeholder="https://linkedin.com/company/..." value={profileData.socials?.linkedin || ''} onChange={(e) => setProfileData(prev => ({...prev, socials: { ...(prev.socials||{}), linkedin: e.target.value }}))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Twitter</Label>
                  <Input placeholder="https://twitter.com/..." value={profileData.socials?.twitter || ''} onChange={(e) => setProfileData(prev => ({...prev, socials: { ...(prev.socials||{}), twitter: e.target.value }}))} />
                </div>
                <div className="space-y-1.5">
                  <Label>GitHub</Label>
                  <Input placeholder="https://github.com/org/..." value={profileData.socials?.github || ''} onChange={(e) => setProfileData(prev => ({...prev, socials: { ...(prev.socials||{}), github: e.target.value }}))} />
                </div>
                <div className="space-y-1.5">
                  <Label>YouTube</Label>
                  <Input placeholder="https://youtube.com/@..." value={profileData.socials?.youtube || ''} onChange={(e) => setProfileData(prev => ({...prev, socials: { ...(prev.socials||{}), youtube: e.target.value }}))} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Display Options (default ON) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Display Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {([
                  ['showEmployees','Show employees metric'],
                  ['showCulture','Show company culture'],
                  ['showMedia','Show media gallery'],
                  ['showLeadership','Show leadership'],
                  ['showHiring','Show hiring process'],
                  ['showContacts','Show contacts'],
                ] as const).map(([key, label]) => (
                  <label key={key} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={(profileData.display?.[key as keyof NonNullable<CompanyProfileData['display']>] ?? true) as boolean}
                      onChange={(e)=> setProfileData(p => ({...p, display: { ...(p.display||{}), [key]: e.target.checked }}))}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Media Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Media Gallery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label 
                    htmlFor="image-upload" 
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Images (max 5MB)
                      </p>
                    </div>
                    <Input 
                      id="image-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleMediaUpload('image', file);
                      }}
                    />
                  </Label>
                </div>
                <div>
                  <Label 
                    htmlFor="video-upload" 
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Youtube className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Upload video</span> or paste YouTube URL
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Max 5 min, 50MB
                      </p>
                    </div>
                    <Input 
                      id="video-upload" 
                      type="file" 
                      accept="video/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleMediaUpload('video', file);
                      }}
                    />
                  </Label>
                </div>
              </div>

              {mediaError && (
                <div className="text-sm text-destructive p-3 bg-destructive/10 rounded-md">
                  {mediaError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profileData.media?.map((item, idx) => (
                  <div key={idx} className="border rounded-lg overflow-hidden group relative">
                    {item.type === 'image' ? (
                      <img 
                        src={item.url} 
                        alt={item.title || 'Media'} 
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                        }}
                      />
                    ) : (
                      <div className="relative pt-[56.25%] bg-black">
                        {item.thumbnail ? (
                          <img 
                            src={item.thumbnail} 
                            alt={item.title || 'Video thumbnail'} 
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted">
                            <Youtube className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                            <Play className="w-6 h-6 text-foreground group-hover:text-white" />
                          </div>
                        </div>
                        {item.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                            {`${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}`}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm truncate">{item.title || `Media ${idx + 1}`}</h4>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => handleMediaDelete(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                        <span className="capitalize">{item.type}</span>
                        <span>
                          {item.size ? `${(item.size / (1024 * 1024)).toFixed(1)}MB` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {(profileData.media?.length || 0) === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Upload images or videos to showcase your workplace. Maximum 10 images and 3 videos allowed.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Optional: Slogan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Slogan (optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Slogan</Label>
                <Input placeholder="e.g., Empowering every developer" value={profileData.slogan || ''} onChange={(e) => setProfileData(prev => ({ ...prev, slogan: e.target.value }))} />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave}><Save className="h-4 w-4 mr-2"/>Save Changes</Button>
            <Button variant="outline" onClick={() => setActiveTab('preview')}><Eye className="h-4 w-4 mr-2"/>Preview Profile</Button>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <CompanyPreview />
        </TabsContent>
      </Tabs>
    </div>
  );
}