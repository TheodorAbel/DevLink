import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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
  Star
} from "lucide-react";
import { toast } from "sonner";

interface CompanyProfileData {
  logo: string;
  companyName: string;
  description: string;
  website: string;
  industry: string;
  location: string;
  companySize: string;
  founded: string;
  isVerified: boolean;
  verificationStatus: 'verified' | 'pending' | 'not_submitted';
}

export function CompanyProfile() {
  const [activeTab, setActiveTab] = useState('edit');
  const [profileData, setProfileData] = useState<CompanyProfileData>({
    logo: '',
    companyName: 'TechCorp',
    description: 'We are a leading technology company focused on building innovative solutions that transform how businesses operate. Our team of passionate engineers, designers, and product managers work together to create products that make a real impact in the world.\n\nFounded in 2018, we\'ve grown from a small startup to a thriving company with over 200 employees across multiple offices. We pride ourselves on our inclusive culture, commitment to work-life balance, and opportunities for professional growth.',
    website: 'https://techcorp.com',
    industry: 'Technology',
    location: 'San Francisco, CA',
    companySize: '51-200',
    founded: '2018',
    isVerified: true,
    verificationStatus: 'verified'
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleSave = () => {
    // In real app, save to API
    toast.success('Company profile updated successfully!');
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // In real app, upload to cloud storage
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          logo: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
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

  const CompanyPreview = () => (
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
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-medium">{profileData.companyName}</h1>
                {getVerificationBadge()}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {profileData.industry}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {profileData.location}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {profileData.companySize} employees
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <a href={profileData.website} className="text-primary hover:underline">
                    {profileData.website.replace('https://', '')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About {profileData.companyName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {profileData.description}
          </div>
          
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">200+</div>
                <div className="text-sm text-muted-foreground">Employees</div>
              </div>
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">Open Positions</div>
              </div>
              <div>
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-sm text-muted-foreground">Company Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{profileData.founded}</div>
                <div className="text-sm text-muted-foreground">Founded</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Culture */}
      <Card>
        <CardHeader>
          <CardTitle>Company Culture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Innovation First', description: 'We encourage creative thinking and experimentation' },
              { title: 'Work-Life Balance', description: 'Flexible schedules and remote work options' },
              { title: 'Growth Mindset', description: 'Continuous learning and development opportunities' },
              { title: 'Diversity & Inclusion', description: 'Building a diverse and inclusive workplace' },
              { title: 'Team Collaboration', description: 'Cross-functional teamwork and open communication' },
              { title: 'Social Impact', description: 'Making a positive difference in the world' }
            ].map((value, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">{value.title}</h4>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium">Company Profile</h1>
          <p className="text-muted-foreground">Manage your company's public profile</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
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
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: Square image, at least 200x200px
                  </p>
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
                  <Input
                    id="companyName"
                    value={profileData.companyName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={profileData.website}
                    onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={profileData.description}
                  onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
                  rows={6}
                  placeholder="Tell candidates about your company, culture, and mission..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select 
                    value={profileData.industry} 
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, industry: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                  <Select 
                    value={profileData.companySize} 
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, companySize: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, State/Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="founded">Founded Year</Label>
                  <Input
                    id="founded"
                    value={profileData.founded}
                    onChange={(e) => setProfileData(prev => ({ ...prev, founded: e.target.value }))}
                    placeholder="2020"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Company Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Verification Status</h4>
                    <p className="text-sm text-muted-foreground">
                      Verified companies get higher visibility and candidate trust
                    </p>
                  </div>
                </div>
                {getVerificationBadge()}
              </div>
              
              {profileData.verificationStatus === 'verified' && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✅ Your company has been verified! This badge will be displayed on your profile and job postings.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setActiveTab('preview')}>
              <Eye className="h-4 w-4 mr-2" />
              Preview Profile
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <CompanyPreview />
        </TabsContent>
      </Tabs>
    </div>
  );
}