import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { 
  Shield,
  Eye,
  User,
  Calendar,
  Mail,
  Smartphone,
  BellRing,
  Lock,
  Key,
  Download,
  Trash2,
  Volume,
  VolumeX,
  BarChart3,
  Accessibility
} from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { Separator } from './ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { toast } from 'sonner';
import { useJobPostingDefaults } from '../hooks/useJobPostingDefaults';

interface SettingsProps {
  onBack?: () => void;
}

export function Settings({ onBack: _onBack }: SettingsProps) {
  const { defaults: jobDefaults, saveDefaults } = useJobPostingDefaults();
  void _onBack;
  
  const [settings, setSettings] = useState({
    autoAttachResume: true,
    defaultCoverLetter: false,
    emailNotifications: {
      jobAlerts: true,
      applicationUpdates: true,
      messages: true,
      weeklyDigest: false
    },
    pushNotifications: {
      jobAlerts: true,
      applicationUpdates: true,
      messages: true,
      interviews: true
    },
    inAppNotifications: {
      jobAlerts: true,
      applicationUpdates: true,
      messages: true,
      interviews: true
    },
    accessibility: {
      fontSize: 14,
      highContrast: false,
      screenReader: false,
      reduceMotion: false
    },
    privacy: {
      profileVisibility: 'public',
      showSalaryPreferences: true,
      allowMessages: true,
      showOnlineStatus: true
    },
    doNotDisturb: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00',
      weekendsOnly: false
    },
    calendarIntegration: {
      googleCalendar: false,
      outlookCalendar: false,
      reminderMinutes: 15
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [category]: { ...(prev[category as keyof typeof prev] as any), [key]: value }
    }));
    toast.success('Setting updated');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateTopLevelSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key]: value as any
    }));
    toast.success('Setting updated');
  };

  const exportData = () => {
    toast.success('Data export started - check your downloads');
  };

  const deleteAccount = () => {
    toast.error('Account deletion requested - confirmation email sent');
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground variant="gradient" />
      
      <div className="relative z-10 p-6 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Customize your JobSeeker experience
          </p>
        </motion.div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <div className="space-y-6">
              {/* Application Preferences */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Application Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Auto-attach resume</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically attach your resume to applications
                        </p>
                      </div>
                      <Switch
                        checked={settings.autoAttachResume}
                        onCheckedChange={(checked) => updateTopLevelSetting('autoAttachResume', checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Default cover letter</Label>
                        <p className="text-sm text-muted-foreground">
                          Use a default cover letter template for quick applications
                        </p>
                      </div>
                      <Switch
                        checked={settings.defaultCoverLetter}
                        onCheckedChange={(checked) => updateTopLevelSetting('defaultCoverLetter', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Job Posting Defaults (for Employers) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Job Posting Defaults
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label>Default Salary Type</Label>
                      <Select
                        value={jobDefaults.salaryType}
                        onValueChange={(value) => {
                          saveDefaults({ salaryType: value as 'range' | 'fixed' | 'custom' });
                          toast.success('Default salary type updated');
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="range">Salary Range</SelectItem>
                          <SelectItem value="fixed">Fixed Salary</SelectItem>
                          <SelectItem value="custom">Custom Message</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        This will be pre-selected when creating new job postings
                      </p>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Default Remote Work</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable remote work option by default
                        </p>
                      </div>
                      <Switch
                        checked={jobDefaults.remoteWork}
                        onCheckedChange={(checked) => {
                          saveDefaults({ remoteWork: checked });
                          toast.success('Default remote work setting updated');
                        }}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>Custom Salary Message</Label>
                      <Input
                        value={jobDefaults.customSalaryMessage}
                        onChange={(e) => saveDefaults({ customSalaryMessage: e.target.value })}
                        onBlur={() => toast.success('Custom salary message updated')}
                        placeholder="e.g., Competitive salary based on experience"
                      />
                      <p className="text-sm text-muted-foreground">
                        Default message when custom salary type is selected
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Do Not Disturb */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {settings.doNotDisturb.enabled ? <VolumeX className="h-5 w-5" /> : <Volume className="h-5 w-5" />}
                      Do Not Disturb
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Enable Do Not Disturb</Label>
                        <p className="text-sm text-muted-foreground">
                          Disable notifications during specified hours
                        </p>
                      </div>
                      <Switch
                        checked={settings.doNotDisturb.enabled}
                        onCheckedChange={(checked) => updateSetting('doNotDisturb', 'enabled', checked)}
                      />
                    </div>

                    {settings.doNotDisturb.enabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Start Time</Label>
                            <Input
                              type="time"
                              value={settings.doNotDisturb.startTime}
                              onChange={(e) => updateSetting('doNotDisturb', 'startTime', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Time</Label>
                            <Input
                              type="time"
                              value={settings.doNotDisturb.endTime}
                              onChange={(e) => updateSetting('doNotDisturb', 'endTime', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Label>Weekends only</Label>
                          <Switch
                            checked={settings.doNotDisturb.weekendsOnly}
                            onCheckedChange={(checked) => updateSetting('doNotDisturb', 'weekendsOnly', checked)}
                          />
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <div className="space-y-6">
              {/* Email Notifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(settings.emailNotifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</Label>
                          <p className="text-sm text-muted-foreground">
                            {getNotificationDescription(key)}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => updateSetting('emailNotifications', key, checked)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Push Notifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Push Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(settings.pushNotifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</Label>
                          <p className="text-sm text-muted-foreground">
                            {getNotificationDescription(key)}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => updateSetting('pushNotifications', key, checked)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* In-App Notifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BellRing className="h-5 w-5" />
                      In-App Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(settings.inAppNotifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</Label>
                          <p className="text-sm text-muted-foreground">
                            {getNotificationDescription(key)}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => updateSetting('inAppNotifications', key, checked)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Privacy & Security */}
          <TabsContent value="privacy">
            <div className="space-y-6">
              {/* Privacy Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Profile Visibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label>Who can view your profile</Label>
                      <Select
                        value={settings.privacy.profileVisibility}
                        onValueChange={(value) => updateSetting('privacy', 'profileVisibility', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Everyone</SelectItem>
                          <SelectItem value="recruiters">Recruiters only</SelectItem>
                          <SelectItem value="private">No one</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Show salary preferences</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow employers to see your salary expectations
                        </p>
                      </div>
                      <Switch
                        checked={settings.privacy.showSalaryPreferences}
                        onCheckedChange={(checked) => updateSetting('privacy', 'showSalaryPreferences', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Allow messages from employers</Label>
                        <p className="text-sm text-muted-foreground">
                          Let employers contact you directly
                        </p>
                      </div>
                      <Switch
                        checked={settings.privacy.allowMessages}
                        onCheckedChange={(checked) => updateSetting('privacy', 'allowMessages', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Show online status</Label>
                        <p className="text-sm text-muted-foreground">
                          Display when you&#39;re active on the platform
                        </p>
                      </div>
                      <Switch
                        checked={settings.privacy.showOnlineStatus}
                        onCheckedChange={(checked) => updateSetting('privacy', 'showOnlineStatus', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Security Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label>Change Password</Label>
                      <div className="flex gap-2">
                        <Input type="password" placeholder="Current password" className="flex-1" />
                        <Button variant="outline">
                          <Key className="h-4 w-4 mr-2" />
                          Update
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>Two-Factor Authentication</Label>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                        <Button variant="outline">
                          <Lock className="h-4 w-4 mr-2" />
                          Enable 2FA
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>Change Email</Label>
                      <div className="flex gap-2">
                        <Input type="email" placeholder="New email address" className="flex-1" />
                        <Button variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Update
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Accessibility */}
          <TabsContent value="accessibility">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Accessibility className="h-5 w-5" />
                    Accessibility Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Font Size</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[settings.accessibility.fontSize]}
                        onValueChange={([value]) => updateSetting('accessibility', 'fontSize', value)}
                        min={12}
                        max={20}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Small (12px)</span>
                        <span>Current: {settings.accessibility.fontSize}px</span>
                        <span>Large (20px)</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>High contrast mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Increase contrast for better visibility
                      </p>
                    </div>
                    <Switch
                      checked={settings.accessibility.highContrast}
                      onCheckedChange={(checked) => updateSetting('accessibility', 'highContrast', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Screen reader support</Label>
                      <p className="text-sm text-muted-foreground">
                        Enhanced support for screen readers
                      </p>
                    </div>
                    <Switch
                      checked={settings.accessibility.screenReader}
                      onCheckedChange={(checked) => updateSetting('accessibility', 'screenReader', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Reduce motion</Label>
                      <p className="text-sm text-muted-foreground">
                        Minimize animations and transitions
                      </p>
                    </div>
                    <Switch
                      checked={settings.accessibility.reduceMotion}
                      onCheckedChange={(checked) => updateSetting('accessibility', 'reduceMotion', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations">
            <div className="space-y-6">
              {/* Calendar Integration */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Calendar Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Google Calendar</Label>
                        <p className="text-sm text-muted-foreground">
                          Sync interview schedules with Google Calendar
                        </p>
                      </div>
                      <Switch
                        checked={settings.calendarIntegration.googleCalendar}
                        onCheckedChange={(checked) => updateSetting('calendarIntegration', 'googleCalendar', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Outlook Calendar</Label>
                        <p className="text-sm text-muted-foreground">
                          Sync interview schedules with Outlook Calendar
                        </p>
                      </div>
                      <Switch
                        checked={settings.calendarIntegration.outlookCalendar}
                        onCheckedChange={(checked) => updateSetting('calendarIntegration', 'outlookCalendar', checked)}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>Reminder Time</Label>
                      <Select
                        value={settings.calendarIntegration.reminderMinutes.toString()}
                        onValueChange={(value) => updateSetting('calendarIntegration', 'reminderMinutes', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 minutes before</SelectItem>
                          <SelectItem value="15">15 minutes before</SelectItem>
                          <SelectItem value="30">30 minutes before</SelectItem>
                          <SelectItem value="60">1 hour before</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Profile Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Profile Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Analytics Dashboard</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        View detailed insights about your profile performance
                      </p>
                      <Button variant="outline">
                        View Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Account Management */}
          <TabsContent value="account">
            <div className="space-y-6">
              {/* Data Management */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Data Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Export your data</Label>
                        <p className="text-sm text-muted-foreground">
                          Download a copy of all your data
                        </p>
                      </div>
                      <Button variant="outline" onClick={exportData}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Danger Zone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <Trash2 className="h-5 w-5" />
                      Danger Zone
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-red-600">Delete Account</Label>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all associated data
                        </p>
                      </div>
                      <Button variant="destructive" onClick={deleteAccount}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function getNotificationDescription(key: string): string {
  const descriptions: Record<string, string> = {
    jobAlerts: 'Get notified about new job opportunities matching your preferences',
    applicationUpdates: 'Updates on your job application status',
    messages: 'New messages from employers',
    weeklyDigest: 'Weekly summary of your job search activity',
    interviews: 'Interview reminders and updates'
  };
  return descriptions[key] || 'Notification settings';
}