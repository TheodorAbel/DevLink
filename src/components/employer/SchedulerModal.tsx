import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Calendar, Clock, Link, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface SchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  jobTitle: string;
  onSchedule: (data: InterviewData) => void;
}

interface InterviewData {
  date: string;
  time: string;
  duration: number;
  timezone: string;
  meetingType: 'in-person' | 'video' | 'phone';
  meetingLink?: string;
  location?: string;
  interviewers: string[];
  assessmentTasks: string[];
  notes: string;
}

export function SchedulerModal({ 
  isOpen, 
  onClose, 
  candidateName, 
  jobTitle, 
  onSchedule 
}: SchedulerModalProps) {
  const [formData, setFormData] = useState<InterviewData>({
    date: '',
    time: '',
    duration: 60,
    timezone: 'PST',
    meetingType: 'video',
    meetingLink: '',
    location: '',
    interviewers: [''],
    assessmentTasks: [],
    notes: ''
  });

  const [newTask, setNewTask] = useState('');

  const handleSubmit = () => {
    if (!formData.date || !formData.time) {
      toast.error('Please select a date and time');
      return;
    }

    if (formData.meetingType === 'video' && !formData.meetingLink) {
      toast.error('Please provide a meeting link for video interviews');
      return;
    }

    if (formData.meetingType === 'in-person' && !formData.location) {
      toast.error('Please provide a location for in-person interviews');
      return;
    }

    onSchedule(formData);
    toast.success('Interview scheduled successfully!');
  };

  const addInterviewer = () => {
    setFormData(prev => ({
      ...prev,
      interviewers: [...prev.interviewers, '']
    }));
  };

  const updateInterviewer = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      interviewers: prev.interviewers.map((interviewer, i) => 
        i === index ? value : interviewer
      )
    }));
  };

  const removeInterviewer = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interviewers: prev.interviewers.filter((_, i) => i !== index)
    }));
  };

  const addTask = () => {
    if (newTask.trim()) {
      setFormData(prev => ({
        ...prev,
        assessmentTasks: [...prev.assessmentTasks, newTask.trim()]
      }));
      setNewTask('');
    }
  };

  const removeTask = (index: number) => {
    setFormData(prev => ({
      ...prev,
      assessmentTasks: prev.assessmentTasks.filter((_, i) => i !== index)
    }));
  };

  // Get suggested time slots (mock data)
  const suggestedSlots = [
    { date: '2024-01-15', time: '10:00', label: 'Tomorrow 10:00 AM' },
    { date: '2024-01-15', time: '14:00', label: 'Tomorrow 2:00 PM' },
    { date: '2024-01-16', time: '09:00', label: 'Wednesday 9:00 AM' },
    { date: '2024-01-16', time: '11:00', label: 'Wednesday 11:00 AM' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <DialogDescription>
            Scheduling interview with {candidateName} for {jobTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Time Slots */}
          <div className="space-y-3">
            <Label>Suggested Time Slots</Label>
            <div className="grid grid-cols-2 gap-2">
              {suggestedSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto p-3"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      date: slot.date,
                      time: slot.time
                    }));
                  }}
                >
                  <div className="text-left">
                    <div className="font-medium">{slot.label}</div>
                    <div className="text-xs text-muted-foreground">Available</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Manual Date/Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select 
                value={formData.duration.toString()} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Meeting Type */}
          <div className="space-y-3">
            <Label>Meeting Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'video', label: 'Video Call', icon: '📹' },
                { value: 'in-person', label: 'In Person', icon: '🏢' },
                { value: 'phone', label: 'Phone Call', icon: '📞' }
              ].map((type) => (
                <Button
                  key={type.value}
                  variant={formData.meetingType === type.value ? 'default' : 'outline'}
                  className="h-auto p-3"
                  onClick={() => setFormData(prev => ({ ...prev, meetingType: type.value as any }))}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">{type.icon}</div>
                    <div className="text-sm">{type.label}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Meeting Details */}
          {formData.meetingType === 'video' && (
            <div className="space-y-2">
              <Label htmlFor="meetingLink">Meeting Link</Label>
              <Input
                id="meetingLink"
                placeholder="https://zoom.us/j/123456789 or https://teams.microsoft.com/..."
                value={formData.meetingLink}
                onChange={(e) => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
              />
            </div>
          )}

          {formData.meetingType === 'in-person' && (
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Office address or meeting room"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          )}

          {/* Interviewers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Interviewers</Label>
              <Button size="sm" variant="outline" onClick={addInterviewer}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {formData.interviewers.map((interviewer, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Interviewer email"
                    value={interviewer}
                    onChange={(e) => updateInterviewer(index, e.target.value)}
                  />
                  {formData.interviewers.length > 1 && (
                    <Button 
                      size="icon" 
                      variant="outline"
                      onClick={() => removeInterviewer(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Assessment Tasks */}
          <div className="space-y-3">
            <Label>Assessment Tasks (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a task or assessment link..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <Button onClick={addTask}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.assessmentTasks.length > 0 && (
              <div className="space-y-2">
                {formData.assessmentTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{task}</span>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => removeTask(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information for the candidate..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Calendar Integration */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Calendar Integration</h4>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Add to Google Calendar
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Add to Outlook
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSubmit} className="flex-1">
              Schedule Interview
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}