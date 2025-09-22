import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { 
  Bell,
  Plus,
  Search,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Mail,
  Smartphone,
  Edit,
  Trash2,
  Pause,
  Play,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Slider } from './ui/slider';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

interface JobAlert {
  id: string;
  name: string;
  keywords: string;
  location: string;
  salaryRange: [number, number];
  jobType: string;
  company: string;
  frequency: 'instant' | 'daily' | 'weekly';
  isActive: boolean;
  createdAt: string;
  lastMatch: string;
  totalMatches: number;
  emailEnabled: boolean;
  pushEnabled: boolean;
}

interface JobAlertsProps {
  currentSearch?: string;
  currentLocation?: string;
}

const mockAlerts: JobAlert[] = [
  {
    id: '1',
    name: 'Frontend Developer - Remote',
    keywords: 'Frontend Developer, React, TypeScript',
    location: 'Remote',
    salaryRange: [80000, 120000],
    jobType: 'Full-time',
    company: '',
    frequency: 'daily',
    isActive: true,
    createdAt: '2024-01-15',
    lastMatch: '2 hours ago',
    totalMatches: 23,
    emailEnabled: true,
    pushEnabled: true
  },
  {
    id: '2',
    name: 'Senior Software Engineer - SF',
    keywords: 'Senior Software Engineer, JavaScript, Node.js',
    location: 'San Francisco, CA',
    salaryRange: [120000, 180000],
    jobType: 'Full-time',
    company: 'Google, Meta, Apple',
    frequency: 'instant',
    isActive: true,
    createdAt: '2024-01-10',
    lastMatch: '1 day ago',
    totalMatches: 15,
    emailEnabled: true,
    pushEnabled: false
  },
  {
    id: '3',
    name: 'UX Designer - Tech Companies',
    keywords: 'UX Designer, Product Designer, Figma',
    location: 'New York, NY',
    salaryRange: [70000, 110000],
    jobType: 'Full-time',
    company: 'Startup, Tech',
    frequency: 'weekly',
    isActive: false,
    createdAt: '2024-01-05',
    lastMatch: '1 week ago',
    totalMatches: 8,
    emailEnabled: true,
    pushEnabled: true
  }
];

export function JobAlerts({ currentSearch, currentLocation }: JobAlertsProps) {
  const [alerts, setAlerts] = useState<JobAlert[]>(mockAlerts);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAlert, setEditingAlert] = useState<JobAlert | null>(null);
  
  // Form state for creating/editing alerts
  const [formData, setFormData] = useState({
    name: '',
    keywords: currentSearch || '',
    location: currentLocation || '',
    salaryRange: [50000, 150000] as [number, number],
    jobType: 'all',
    company: '',
    frequency: 'daily' as 'instant' | 'daily' | 'weekly',
    emailEnabled: true,
    pushEnabled: true
  });

  const handleCreateAlert = () => {
    const newAlert: JobAlert = {
      id: Date.now().toString(),
      name: formData.name || `${formData.keywords} - ${formData.location}`,
      keywords: formData.keywords,
      location: formData.location,
      salaryRange: formData.salaryRange,
      jobType: formData.jobType,
      company: formData.company,
      frequency: formData.frequency,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      lastMatch: 'Never',
      totalMatches: 0,
      emailEnabled: formData.emailEnabled,
      pushEnabled: formData.pushEnabled
    };

    setAlerts([newAlert, ...alerts]);
    setShowCreateDialog(false);
    resetForm();
    toast.success('Job alert created successfully!');
  };

  const handleEditAlert = (alert: JobAlert) => {
    setEditingAlert(alert);
    setFormData({
      name: alert.name,
      keywords: alert.keywords,
      location: alert.location,
      salaryRange: alert.salaryRange,
      jobType: alert.jobType,
      company: alert.company,
      frequency: alert.frequency,
      emailEnabled: alert.emailEnabled,
      pushEnabled: alert.pushEnabled
    });
    setShowCreateDialog(true);
  };

  const handleUpdateAlert = () => {
    if (!editingAlert) return;

    const updatedAlert: JobAlert = {
      ...editingAlert,
      name: formData.name || `${formData.keywords} - ${formData.location}`,
      keywords: formData.keywords,
      location: formData.location,
      salaryRange: formData.salaryRange,
      jobType: formData.jobType,
      company: formData.company,
      frequency: formData.frequency,
      emailEnabled: formData.emailEnabled,
      pushEnabled: formData.pushEnabled
    };

    setAlerts(alerts.map(alert => 
      alert.id === editingAlert.id ? updatedAlert : alert
    ));
    setShowCreateDialog(false);
    setEditingAlert(null);
    resetForm();
    toast.success('Job alert updated successfully!');
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
    const alert = alerts.find(a => a.id === id);
    toast.success(`Alert ${alert?.isActive ? 'paused' : 'activated'}`);
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast.success('Job alert deleted');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      keywords: currentSearch || '',
      location: currentLocation || '',
      salaryRange: [50000, 150000],
      jobType: 'all',
      company: '',
      frequency: 'daily',
      emailEnabled: true,
      pushEnabled: true
    });
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'instant': return <Bell className="h-4 w-4" />;
      case 'daily': return <Clock className="h-4 w-4" />;
      case 'weekly': return <Target className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'instant': return 'bg-red-100 text-red-700';
      case 'daily': return 'bg-blue-100 text-blue-700';
      case 'weekly': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Job Alerts</h2>
          <p className="text-muted-foreground">
            Stay updated with new opportunities matching your preferences
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAlert(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAlert ? 'Edit Job Alert' : 'Create Job Alert'}
              </DialogTitle>
              <DialogDescription>
                Set up notifications for jobs matching your criteria
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Alert Name */}
              <div className="space-y-2">
                <Label>Alert Name</Label>
                <Input
                  placeholder="e.g., Frontend Developer - Remote"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                <Label>Keywords</Label>
                <Input
                  placeholder="e.g., React, TypeScript, Frontend Developer"
                  value={formData.keywords}
                  onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                />
                <p className="text-sm text-muted-foreground">
                  Separate multiple keywords with commas
                </p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="e.g., San Francisco, CA or Remote"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>

              {/* Job Type */}
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select value={formData.jobType} onValueChange={(value) => setFormData({...formData, jobType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Salary Range */}
              <div className="space-y-3">
                <Label>Salary Range</Label>
                <Slider
                  value={formData.salaryRange}
                  onValueChange={(value) => setFormData({...formData, salaryRange: value as [number, number]})}
                  min={30000}
                  max={300000}
                  step={5000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${formData.salaryRange[0].toLocaleString()}</span>
                  <span>${formData.salaryRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Company */}
              <div className="space-y-2">
                <Label>Company (Optional)</Label>
                <Input
                  placeholder="e.g., Google, Meta, Apple"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>

              {/* Frequency */}
              <div className="space-y-2">
                <Label>Notification Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value: 'instant' | 'daily' | 'weekly') => setFormData({...formData, frequency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notification Methods */}
              <div className="space-y-4">
                <Label>Notification Methods</Label>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Email Notifications</span>
                  </div>
                  <Switch
                    checked={formData.emailEnabled}
                    onCheckedChange={(checked) => setFormData({...formData, emailEnabled: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span>Push Notifications</span>
                  </div>
                  <Switch
                    checked={formData.pushEnabled}
                    onCheckedChange={(checked) => setFormData({...formData, pushEnabled: checked})}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowCreateDialog(false);
                setEditingAlert(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={editingAlert ? handleUpdateAlert : handleCreateAlert}>
                {editingAlert ? 'Update Alert' : 'Create Alert'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Create from Current Search */}
      {(currentSearch || currentLocation) && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Create alert from current search</h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new &quot;{currentSearch}&quot; jobs in &quot;{currentLocation}&quot;
                  </p>
                </div>
              </div>
              <Button size="sm" onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Alerts */}
      <div className="grid gap-4">
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No job alerts yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first job alert to get notified about new opportunities
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Alert
              </Button>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              layout
            >
              <Card className={`${!alert.isActive ? 'opacity-60' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold">{alert.name}</h3>
                        <Badge className={`${getFrequencyColor(alert.frequency)} flex items-center gap-1`}>
                          {getFrequencyIcon(alert.frequency)}
                          {alert.frequency}
                        </Badge>
                        {!alert.isActive && (
                          <Badge variant="secondary">Paused</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Search className="h-4 w-4" />
                          <span className="truncate">{alert.keywords}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{alert.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>${alert.salaryRange[0]/1000}k - ${alert.salaryRange[1]/1000}k</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          <span>{alert.jobType}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{alert.totalMatches} matches</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Last match: {alert.lastMatch}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {alert.emailEnabled && <Mail className="h-4 w-4 text-blue-500" />}
                          {alert.pushEnabled && <Smartphone className="h-4 w-4 text-green-500" />}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAlert(alert.id)}
                      >
                        {alert.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAlert(alert)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAlert(alert.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Alert Statistics */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Alert Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{alerts.length}</div>
                <div className="text-sm text-muted-foreground">Total Alerts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {alerts.filter(a => a.isActive).length}
                </div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {alerts.reduce((sum, alert) => sum + alert.totalMatches, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(alerts.reduce((sum, alert) => sum + alert.totalMatches, 0) / alerts.length) || 0}
                </div>
                <div className="text-sm text-muted-foreground">Avg per Alert</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
