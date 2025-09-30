import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { X, Plus, Save, Eye, Trash2, HelpCircle, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "../../lib/utils";

interface ScreeningQuestion {
  id: string;
  text: string;
  type: 'yes-no' | 'multiple-choice' | 'checkbox' | 'short-answer';
  options?: string[];
  required: boolean;
  autoFilter: boolean;
}

interface JobFormData {
  title: string;
  location: string;
  jobType: string;
  isRemote: boolean;
  salaryType: 'range' | 'fixed' | 'custom';
  salary: string;
  salaryMin: string;
  salaryMax: string;
  currency: string;
  customSalaryMessage: string;
  deadline: Date | null;
  description: string;
  skills: string[];
  screeningQuestions: ScreeningQuestion[];
  applicationMethod: 'platform' | 'website' | 'email';
  applicationUrl?: string;
  applicationEmail?: string;
  requirements: string[];
}

interface PostJobFormProps {
  onSaveDraft: (data: JobFormData) => void;
  onPublish: (data: JobFormData) => void;
  onPreview: (data: JobFormData) => void;
  initialData?: Partial<JobFormData>;
}

export function PostJobForm({ 
  onSaveDraft, 
  onPublish, 
  onPreview,
  initialData = {} 
}: PostJobFormProps) {
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    location: '',
    jobType: '',
    isRemote: false,
    salaryType: 'range',
    salary: '',
    salaryMin: '',
    salaryMax: '',
    currency: 'ETB',
    customSalaryMessage: 'Competitive salary based on experience',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
    description: '',
    skills: [],
    screeningQuestions: [],
    applicationMethod: 'platform',
    applicationUrl: '',
    applicationEmail: '',
    requirements: [],
    ...initialData
  });

  const [newSkill, setNewSkill] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<ScreeningQuestion>({
    id: '',
    text: '',
    type: 'yes-no',
    options: [],
    required: false,
    autoFilter: false
  });
  const [newOption, setNewOption] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (reqToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(r => r !== reqToRemove)
    }));
  };

  const handleAddQuestion = () => {
    if (currentQuestion.text.trim()) {
      const newQuestion: ScreeningQuestion = {
        ...currentQuestion,
        id: Date.now().toString(),
        text: currentQuestion.text.trim(),
        options: currentQuestion.type === 'yes-no' 
          ? ['Yes', 'No'] 
          : currentQuestion.options?.filter(opt => opt.trim() !== '') || []
      };
      
      setFormData(prev => ({
        ...prev,
        screeningQuestions: [...prev.screeningQuestions, newQuestion]
      }));
      
      setCurrentQuestion({
        id: '',
        text: '',
        type: 'yes-no',
        options: [],
        required: false,
        autoFilter: false
      });
    }
  };

  const handleRemoveQuestion = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      screeningQuestions: prev.screeningQuestions.filter(q => q.id !== questionId)
    }));
  };

  const handleAddOption = () => {
    if (newOption.trim()) {
      setCurrentQuestion(prev => ({
        ...prev,
        options: [...(prev.options || []), newOption.trim()]
      }));
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSaveDraft = () => {
    onSaveDraft(formData);
    toast.success("Job saved as draft");
  };

  const handlePublish = () => {
    if (!formData.title || !formData.description || !formData.jobType) {
      toast.error("Please fill in all required fields");
      return;
    }
    // Validate application method specifics
    if (formData.applicationMethod === 'website') {
      const url = (formData.applicationUrl || '').trim();
      const isValidUrl = /^https?:\/\//i.test(url);
      if (!url || !isValidUrl) {
        toast.error("Please provide a valid application URL starting with http or https");
        return;
      }
    }
    if (formData.applicationMethod === 'email') {
      const email = (formData.applicationEmail || '').trim();
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!email || !isValidEmail) {
        toast.error("Please provide a valid application email address");
        return;
      }
    }
    onPublish(formData);
    toast.success("Job published successfully!");
  };

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-medium">Post New Job</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onPreview(formData)}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handlePublish}>
              Publish Job
            </Button>
          </div>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Senior Software Engineer"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. San Francisco, CA"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type *</Label>
              <Select 
                value={formData.jobType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, jobType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="remote"
                checked={formData.isRemote}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRemote: checked }))}
              />
              <Label htmlFor="remote">Remote Work Available</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground ml-1" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-sm">
                      Enable this if the position can be performed remotely (fully or partially). 
                      This will be visible to job seekers.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Salary Type</Label>
              <Select 
                value={formData.salaryType} 
                onValueChange={(value: 'range' | 'fixed' | 'custom') => {
                  setFormData(prev => ({
                    ...prev, 
                    salaryType: value,
                    // Clear salary fields when switching to custom message
                    ...(value === 'custom' ? { 
                      salary: '',
                      salaryMin: '',
                      salaryMax: ''
                    } : {})
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="range">Salary Range</SelectItem>
                  <SelectItem value="fixed">Fixed Salary</SelectItem>
                  <SelectItem value="custom">Custom Salary Message</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.salaryType === 'range' && (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Input
                    value={formData.salaryMin}
                    onChange={(e) => setFormData(prev => ({ ...prev, salaryMin: e.target.value }))}
                    placeholder="Min salary"
                    type="number"
                  />
                </div>
                <div>
                  <Input
                    value={formData.salaryMax}
                    onChange={(e) => setFormData(prev => ({ ...prev, salaryMax: e.target.value }))}
                    placeholder="Max salary"
                    type="number"
                  />
                </div>
                <div>
                  <Select 
                    value={formData.currency} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETB">ETB</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {formData.salaryType === 'fixed' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    value={formData.salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                    placeholder="Salary amount"
                    type="number"
                  />
                </div>
                <div>
                  <Select 
                    value={formData.currency} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETB">ETB</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}


            {formData.salaryType === 'custom' && (
              <div className="space-y-2">
                <Label>Custom Salary Message</Label>
                <Input
                  value={formData.customSalaryMessage}
                  onChange={(e) => setFormData(prev => ({ ...prev, customSalaryMessage: e.target.value }))}
                  placeholder="e.g., Competitive salary, Negotiable based on experience"
                />
                <p className="text-xs text-muted-foreground">
                  This message will be displayed instead of a specific salary range
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Application Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deadline ? (
                      format(formData.deadline, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.deadline || undefined}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, deadline: date }))}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={8}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Required Skills</Label>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              />
              <Button type="button" onClick={handleAddSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Job Requirements</Label>
            <div className="flex gap-2">
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Add a requirement..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddRequirement()}
              />
              <Button type="button" onClick={handleAddRequirement}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.requirements.map((req) => (
                <Badge key={req} variant="secondary" className="gap-1">
                  {req}
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(req)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicationMethod">How should candidates apply?</Label>
              <Select
                value={formData.applicationMethod}
                onValueChange={(value: 'platform' | 'website' | 'email') =>
                  setFormData(prev => ({
                    ...prev,
                    applicationMethod: value,
                    applicationUrl: value === 'website' ? prev.applicationUrl || '' : '',
                    applicationEmail: value === 'email' ? prev.applicationEmail || '' : '',
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select application method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="platform">Through this platform</SelectItem>
                  <SelectItem value="website">Company website</SelectItem>
                  <SelectItem value="email">By email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.applicationMethod === 'website' && (
              <div className="space-y-2">
                <Label htmlFor="applicationUrl">Application URL *</Label>
                <Input
                  id="applicationUrl"
                  value={formData.applicationUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicationUrl: e.target.value }))}
                  placeholder="https://company.com/careers/apply"
                />
              </div>
            )}

            {formData.applicationMethod === 'email' && (
              <div className="space-y-2">
                <Label htmlFor="applicationEmail">Application Email *</Label>
                <Input
                  id="applicationEmail"
                  type="email"
                  value={formData.applicationEmail || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicationEmail: e.target.value }))}
                  placeholder="jobs@company.com"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Screening Questions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add questions to help filter and evaluate candidates
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Existing Questions */}
          {formData.screeningQuestions.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Added Questions</h4>
              {formData.screeningQuestions.map((question) => (
                <Card key={question.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{question.text}</span>
                        <Badge variant={question.type === 'yes-no' ? 'default' : 'secondary'}>
                          {question.type === 'yes-no' ? 'Yes/No' : 
                           question.type === 'multiple-choice' ? 'Multiple Choice' :
                           question.type === 'checkbox' ? 'Checkbox' : 'Short Answer'}
                        </Badge>
                        {question.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                        {question.autoFilter && (
                          <Badge variant="outline" className="text-xs">Auto-filter</Badge>
                        )}
                      </div>
                      {question.options && question.options.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {question.options.map((option, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {option}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveQuestion(question.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Add New Question */}
          <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
            <h4 className="font-medium">Add New Question</h4>
            
            <div className="space-y-2">
              <Label>Question Text</Label>
              <Input
                value={currentQuestion.text}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                placeholder="e.g., Do you have 3+ years of React experience?"
              />
            </div>

            <div className="space-y-2">
              <Label>Answer Type</Label>
              <Select 
                value={currentQuestion.type} 
                onValueChange={(value: 'yes-no' | 'multiple-choice' | 'checkbox' | 'short-answer') => 
                  setCurrentQuestion(prev => ({ 
                    ...prev, 
                    type: value,
                    options: value === 'yes-no' ? ['Yes', 'No'] : []
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes-no">✅ Yes / No</SelectItem>
                  <SelectItem value="multiple-choice">🔘 Multiple Choice (Single Select)</SelectItem>
                  <SelectItem value="checkbox">☑️ Checkbox (Multi Select)</SelectItem>
                  <SelectItem value="short-answer">✍️ Short Answer (Text)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'checkbox') && (
              <div className="space-y-2">
                <Label>Answer Options</Label>
                <div className="flex gap-2">
                  <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Add an option..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                  />
                  <Button type="button" onClick={handleAddOption}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentQuestion.options?.map((option, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {option}
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="required"
                  checked={currentQuestion.required}
                  onCheckedChange={(checked) => setCurrentQuestion(prev => ({ ...prev, required: checked }))}
                />
                <Label htmlFor="required" className="text-sm">Required</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoFilter"
                  checked={currentQuestion.autoFilter}
                  onCheckedChange={(checked) => setCurrentQuestion(prev => ({ ...prev, autoFilter: checked }))}
                />
                <Label htmlFor="autoFilter" className="text-sm">Auto-filter</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">
                        Mark if this question should be used to automatically filter applications
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <Button 
              type="button" 
              onClick={handleAddQuestion}
              disabled={!currentQuestion.text.trim()}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </CardContent>
      </Card>

      </div>
    </TooltipProvider>
  );
}