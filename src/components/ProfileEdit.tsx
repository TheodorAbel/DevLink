import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { 
  User,
  MapPin, 
  Mail,
  Phone,
  Upload,
  FileText,
  Plus,
  Trash2,
  Eye,
  Download,
  Edit,
  Save,
  X,
  Building2,
  Calendar,
  GraduationCap,
  Star,
  Link as LinkIcon
} from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface ProfileEditProps {
  onBack?: () => void;
}

// Mock profile data
const initialProfile = {
  personalInfo: {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Passionate Frontend Developer with 5+ years of experience building user-centric web applications. Specialized in React, TypeScript, and modern JavaScript frameworks.',
    website: 'https://sarahjohnson.dev',
    linkedin: 'https://linkedin.com/in/sarahjohnson'
  },
  skills: ['React', 'TypeScript', 'Next.js', 'JavaScript', 'HTML/CSS', 'Node.js', 'GraphQL', 'Jest', 'Figma', 'Git'],
  experience: [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechStart Inc.',
      startDate: '2022-03',
      endDate: 'Present',
      location: 'San Francisco, CA',
      description: 'Led frontend development for multiple client projects, mentored junior developers, and implemented modern React architecture patterns.'
    },
    {
      id: '2',
      title: 'Frontend Developer',
      company: 'WebSolutions LLC',
      startDate: '2020-01',
      endDate: '2022-02',
      location: 'San Francisco, CA',
      description: 'Developed responsive web applications using React and TypeScript, collaborated with design teams to implement pixel-perfect UIs.'
    }
  ],
  education: [
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of California, Berkeley',
      startDate: '2016-09',
      endDate: '2020-05',
      location: 'Berkeley, CA',
      gpa: '3.8'
    }
  ],
  resume: {
    fileName: 'Sarah_Johnson_Resume.pdf',
    uploadDate: '2024-01-10',
    size: '245 KB'
  }
};

export function ProfileEdit({ onBack }: ProfileEditProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showResumeBuilder, setShowResumeBuilder] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [editingExperience, setEditingExperience] = useState<string | null>(null);
  const [editingEducation, setEditingEducation] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length > 0) {
      const file = pdfFiles[0];
      setProfile(prev => ({
        ...prev,
        resume: {
          fileName: file.name,
          uploadDate: new Date().toISOString().split('T')[0],
          size: `${Math.round(file.size / 1024)} KB`
        }
      }));
      toast.success('Resume uploaded successfully!');
    } else {
      toast.error('Please upload a PDF file');
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setProfile(prev => ({
        ...prev,
        resume: {
          fileName: file.name,
          uploadDate: new Date().toISOString().split('T')[0],
          size: `${Math.round(file.size / 1024)} KB`
        }
      }));
      toast.success('Resume uploaded successfully!');
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
      toast.success('Skill added!');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
    toast.success('Skill removed!');
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      location: '',
      description: ''
    };
    setProfile(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
    setEditingExperience(newExp.id);
  };

  const saveExperience = (id: string, data: any) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, ...data } : exp
      )
    }));
    setEditingExperience(null);
    toast.success('Experience saved!');
  };

  const removeExperience = (id: string) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
    toast.success('Experience removed!');
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      startDate: '',
      endDate: '',
      location: '',
      gpa: ''
    };
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
    setEditingEducation(newEdu.id);
  };

  const saveEducation = (id: string, data: any) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, ...data } : edu
      )
    }));
    setEditingEducation(null);
    toast.success('Education saved!');
  };

  const removeEducation = (id: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
    toast.success('Education removed!');
  };

  const handleSaveProfile = () => {
    toast.success('Profile saved successfully!');
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground variant="gradient" />
      
      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Edit Profile
              </h1>
              <p className="text-muted-foreground mt-2">
                Update your information to stand out to employers
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button 
                onClick={handleSaveProfile}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.personalInfo.firstName}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.personalInfo.lastName}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                        }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.personalInfo.email}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profile.personalInfo.phone}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: e.target.value }
                        }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.personalInfo.location}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, location: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={profile.personalInfo.bio}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, bio: e.target.value }
                      }))}
                      placeholder="Tell employers about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={profile.personalInfo.website}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, website: e.target.value }
                        }))}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={profile.personalInfo.linkedin}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                        }))}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Skills */}
          <TabsContent value="skills">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Skills & Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button onClick={addSkill}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {profile.skills.map((skill, index) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Badge 
                            variant="secondary" 
                            className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 pr-1"
                          >
                            {skill}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 ml-2 hover:bg-red-100"
                              onClick={() => removeSkill(skill)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Experience */}
          <TabsContent value="experience">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Work Experience
                    </CardTitle>
                    <Button onClick={addExperience}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profile.experience.map((exp, index) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ExperienceCard
                        experience={exp}
                        isEditing={editingExperience === exp.id}
                        onEdit={() => setEditingExperience(exp.id)}
                        onSave={(data) => saveExperience(exp.id, data)}
                        onCancel={() => setEditingExperience(null)}
                        onRemove={() => removeExperience(exp.id)}
                      />
                      {index < profile.experience.length - 1 && <Separator className="my-6" />}
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Education */}
          <TabsContent value="education">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Education
                    </CardTitle>
                    <Button onClick={addEducation}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profile.education.map((edu, index) => (
                    <motion.div
                      key={edu.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <EducationCard
                        education={edu}
                        isEditing={editingEducation === edu.id}
                        onEdit={() => setEditingEducation(edu.id)}
                        onSave={(data) => saveEducation(edu.id, data)}
                        onCancel={() => setEditingEducation(null)}
                        onRemove={() => removeEducation(edu.id)}
                      />
                      {index < profile.education.length - 1 && <Separator className="my-6" />}
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Resume */}
          <TabsContent value="resume">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Resume Upload
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                      isDragOver 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <motion.div
                      animate={isDragOver ? { scale: 1.05 } : { scale: 1 }}
                      className="space-y-4"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium">Drop your resume here</p>
                        <p className="text-muted-foreground">or click to browse files</p>
                        <p className="text-sm text-muted-foreground mt-2">PDF files only, max 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="resume-upload"
                      />
                      <Button asChild>
                        <label htmlFor="resume-upload" className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Browse Files
                        </label>
                      </Button>
                    </motion.div>
                  </div>

                  {profile.resume && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="font-medium">{profile.resume.fileName}</p>
                            <p className="text-sm text-muted-foreground">
                              Uploaded on {profile.resume.uploadDate} • {profile.resume.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resume Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Build Your Resume</h3>
                    <p className="text-muted-foreground mb-6">
                      Create a professional resume using our built-in templates
                    </p>
                    <Button 
                      onClick={() => setShowResumeBuilder(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Open Resume Builder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Profile Preview Modal */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowPreview(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Profile Preview</h2>
                    <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <ProfilePreview profile={profile} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Experience Card Component
function ExperienceCard({ experience, isEditing, onEdit, onSave, onCancel, onRemove }: any) {
  const [formData, setFormData] = useState(experience);

  const handleSave = () => {
    onSave(formData);
  };

  if (isEditing) {
    return (
      <Card className="border-blue-200 bg-blue-50/30">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Job Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  placeholder="Present"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={onCancel} size="sm">
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold">{experience.title}</h4>
          <p className="text-blue-600">{experience.company}</p>
          <p className="text-sm text-muted-foreground">
            {experience.startDate} - {experience.endDate} • {experience.location}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{experience.description}</p>
    </div>
  );
}

// Education Card Component
function EducationCard({ education, isEditing, onEdit, onSave, onCancel, onRemove }: any) {
  const [formData, setFormData] = useState(education);

  const handleSave = () => {
    onSave(formData);
  };

  if (isEditing) {
    return (
      <Card className="border-blue-200 bg-blue-50/30">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label>Degree</Label>
              <Input
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              />
            </div>
            
            <div>
              <Label>School</Label>
              <Input
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
              <div>
                <Label>GPA (Optional)</Label>
                <Input
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={onCancel} size="sm">
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold">{education.degree}</h4>
          <p className="text-blue-600">{education.school}</p>
          <p className="text-sm text-muted-foreground">
            {education.startDate} - {education.endDate} • {education.location}
            {education.gpa && ` • GPA: ${education.gpa}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Profile Preview Component
function ProfilePreview({ profile }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center pb-6 border-b">
        <Avatar className="w-20 h-20 mx-auto mb-4">
          <AvatarFallback className="text-lg">
            {profile.personalInfo.firstName[0]}{profile.personalInfo.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">
          {profile.personalInfo.firstName} {profile.personalInfo.lastName}
        </h1>
        <p className="text-muted-foreground">{profile.personalInfo.bio}</p>
        <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {profile.personalInfo.location}
          </span>
          <span className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            {profile.personalInfo.email}
          </span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill: string) => (
            <Badge key={skill} variant="secondary">{skill}</Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Experience</h3>
        <div className="space-y-4">
          {profile.experience.map((exp: any) => (
            <div key={exp.id}>
              <h4 className="font-medium">{exp.title}</h4>
              <p className="text-blue-600">{exp.company}</p>
              <p className="text-sm text-muted-foreground">
                {exp.startDate} - {exp.endDate}
              </p>
              <p className="text-sm mt-1">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Education</h3>
        <div className="space-y-4">
          {profile.education.map((edu: any) => (
            <div key={edu.id}>
              <h4 className="font-medium">{edu.degree}</h4>
              <p className="text-blue-600">{edu.school}</p>
              <p className="text-sm text-muted-foreground">
                {edu.startDate} - {edu.endDate}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}