import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { 
  User, 
  Lock, 
  Bell, 
  Palette, 
  Eye, 
  Shield, 
  Building, 
  
  MessageSquare, 
  
  
  Upload,
  Check,
  Plus,
  Trash,
  Edit,
  Monitor,
  Sun,
  Moon,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

interface EmployerSettingsProps {
  onBack?: () => void;
}

export function EmployerSettings({ onBack }: EmployerSettingsProps) {
  const [emailVerified] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [theme, setTheme] = useState("system");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    newApplicants: true,
    interviews: true,
    statusChanges: true
  });
  const [accessibility, setAccessibility] = useState({
    fontSize: "medium",
    highContrast: false,
    screenReader: false
  });
  const [companySettings, setCompanySettings] = useState({
    name: "TechCorp",
    description: "Leading technology company focused on innovation",
    website: "https://techcorp.com",
    industry: "Technology",
    location: "San Francisco, CA"
  });
  const [jobDefaults, setJobDefaults] = useState({
    salaryType: "range",
    remoteWork: "hybrid",
    currency: "EUR"
  });
  const [privacy, setPrivacy] = useState({
    dataRetention: "2-years",
    gdprCompliance: true,
    doNotDisturb: false,
    quietHours: { start: "18:00", end: "09:00" }
  });

  const [teamMembers] = useState([
    { id: 1, name: "John Smith", email: "john@techcorp.com", role: "Admin", status: "Active" },
    { id: 2, name: "Sarah Johnson", email: "sarah@techcorp.com", role: "Recruiter", status: "Active" },
    { id: 3, name: "Mike Davis", email: "mike@techcorp.com", role: "Viewer", status: "Pending" }
  ]);

  const [messageTemplates] = useState([
    {
      id: 1,
      name: "Interview Invitation",
      subject: "Interview Invitation - {{position}}",
      content: "Hi {{candidate_name}},\n\nWe'd like to invite you for an interview for the {{position}} role. Please let us know your availability."
    },
    {
      id: 2,
      name: "Application Received",
      subject: "Application Received - {{position}}",
      content: "Thank you for your application for {{position}}. We'll review it and get back to you soon."
    }
  ]);

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const handleInviteUser = () => {
    toast.info("Invite user functionality would open here");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="lg:hidden">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-medium">Settings</h1>
          <p className="text-muted-foreground">Manage your account and company preferences</p>
        </div>
      </div>

      {/* Mobile: Accordion Layout */}
      <div className="lg:hidden">
        <Accordion type="single" collapsible className="space-y-4">
          {/* Personal Settings */}
          <AccordionItem value="personal" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5" />
                <span>Personal Settings</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2">
                      <Input id="email" defaultValue="john@techcorp.com" />
                      <Badge variant={emailVerified ? "default" : "secondary"}>
                        {emailVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Notifications */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications(prev => ({ ...prev, email: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) =>
                        setNotifications(prev => ({ ...prev, push: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Theme */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Theme Preferences
                </h3>
                <div>
                  <Label>Appearance</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Security */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Company Settings */}
          <AccordionItem value="company" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5" />
                <span>Company Settings</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              {/* Company Profile */}
              <div className="space-y-4">
                <h3 className="font-medium">Company Profile</h3>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="" alt="Company logo" />
                    <AvatarFallback>{companySettings.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={companySettings.name}
                      onChange={(e) =>
                        setCompanySettings(prev => ({ ...prev, name: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={companySettings.description}
                      onChange={(e) =>
                        setCompanySettings(prev => ({ ...prev, description: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Team Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Team Members</h3>
                  <Button variant="outline" size="sm" onClick={handleInviteUser}>
                    <Plus className="h-4 w-4 mr-2" />
                    Invite
                  </Button>
                </div>
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{member.role}</Badge>
                        <Badge variant={member.status === "Active" ? "default" : "secondary"}>
                          {member.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Templates */}
          <AccordionItem value="templates" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5" />
                <span>Message Templates</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {messageTemplates.map((template) => (
                <div key={template.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{template.name}</h4>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.subject}</p>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* Privacy */}
          <AccordionItem value="privacy" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5" />
                <span>Privacy & Compliance</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <Label>Data Retention</Label>
                  <Select
                    value={privacy.dataRetention}
                    onValueChange={(value) =>
                      setPrivacy(prev => ({ ...prev, dataRetention: value }))
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-year">1 Year</SelectItem>
                      <SelectItem value="2-years">2 Years</SelectItem>
                      <SelectItem value="5-years">5 Years</SelectItem>
                      <SelectItem value="indefinite">Indefinite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>GDPR Compliance</Label>
                    <p className="text-sm text-muted-foreground">Follow data protection regulations</p>
                  </div>
                  <Switch
                    checked={privacy.gdprCompliance}
                    onCheckedChange={(checked) =>
                      setPrivacy(prev => ({ ...prev, gdprCompliance: checked }))
                    }
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Desktop: Tabs Layout */}
      <div className="hidden lg:block">
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name-desktop">Full Name</Label>
                    <Input id="name-desktop" defaultValue="John Doe" />
                  </div>
                  <div>
                    <Label htmlFor="email-desktop">Email Address</Label>
                    <div className="flex items-center gap-2">
                      <Input id="email-desktop" defaultValue="john@techcorp.com" />
                      <Badge variant={emailVerified ? "default" : "secondary"}>
                        {emailVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Theme & Accessibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>High Contrast</Label>
                    <Switch
                      checked={accessibility.highContrast}
                      onCheckedChange={(checked) =>
                        setAccessibility(prev => ({ ...prev, highContrast: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="company" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Company Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="" alt="Company logo" />
                      <AvatarFallback>{companySettings.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                  </div>
                  <div>
                    <Label htmlFor="company-name-desktop">Company Name</Label>
                    <Input
                      id="company-name-desktop"
                      value={companySettings.name}
                      onChange={(e) =>
                        setCompanySettings(prev => ({ ...prev, name: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={companySettings.website}
                      onChange={(e) =>
                        setCompanySettings(prev => ({ ...prev, website: e.target.value }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Job Posting Defaults</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Default Salary Type</Label>
                    <Select
                      value={jobDefaults.salaryType}
                      onValueChange={(value) =>
                        setJobDefaults(prev => ({ ...prev, salaryType: value }))
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed</SelectItem>
                        <SelectItem value="range">Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Default Remote Work</Label>
                    <Select
                      value={jobDefaults.remoteWork}
                      onValueChange={(value) =>
                        setJobDefaults(prev => ({ ...prev, remoteWork: value }))
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-site">On-site</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>New Applications</Label>
                        <Switch
                          checked={notifications.newApplicants}
                          onCheckedChange={(checked) =>
                            setNotifications(prev => ({ ...prev, newApplicants: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Interview Confirmations</Label>
                        <Switch
                          checked={notifications.interviews}
                          onCheckedChange={(checked) =>
                            setNotifications(prev => ({ ...prev, interviews: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Status Changes</Label>
                        <Switch
                          checked={notifications.statusChanges}
                          onCheckedChange={(checked) =>
                            setNotifications(prev => ({ ...prev, statusChanges: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Push Notifications</h3>
                    <div className="flex items-center justify-between">
                      <Label>Browser Notifications</Label>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) =>
                          setNotifications(prev => ({ ...prev, push: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Message Templates</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messageTemplates.map((template) => (
                    <div key={template.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{template.subject}</p>
                      <p className="text-sm">{template.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Privacy & Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Data Management</h3>
                    <div>
                      <Label>Data Retention Period</Label>
                      <Select
                        value={privacy.dataRetention}
                        onValueChange={(value) =>
                          setPrivacy(prev => ({ ...prev, dataRetention: value }))
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-year">1 Year</SelectItem>
                          <SelectItem value="2-years">2 Years</SelectItem>
                          <SelectItem value="5-years">5 Years</SelectItem>
                          <SelectItem value="indefinite">Indefinite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>GDPR Compliance</Label>
                        <p className="text-sm text-muted-foreground">Follow EU data protection rules</p>
                      </div>
                      <Switch
                        checked={privacy.gdprCompliance}
                        onCheckedChange={(checked) =>
                          setPrivacy(prev => ({ ...prev, gdprCompliance: checked }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Communication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Do Not Disturb</Label>
                        <p className="text-sm text-muted-foreground">Pause notifications during set hours</p>
                      </div>
                      <Switch
                        checked={privacy.doNotDisturb}
                        onCheckedChange={(checked) =>
                          setPrivacy(prev => ({ ...prev, doNotDisturb: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Save Button - Sticky on Mobile */}
      <div className="sticky bottom-4 lg:static lg:bottom-auto">
        <Button onClick={handleSave} className="w-full lg:w-auto">
          <Check className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}