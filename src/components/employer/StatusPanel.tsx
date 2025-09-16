import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { 
  Clock, 
  Eye, 
  Calendar, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  FileText,
  Plus
} from "lucide-react";
import { SchedulerModal } from "./SchedulerModal";
import { MessageTemplateModal } from "./MessageTemplateModal";

interface StatusPanelProps {
  applicationId: string;
  currentStatus: 'applied' | 'viewed' | 'interview_scheduled' | 'accepted' | 'rejected';
  candidateName: string;
  jobTitle: string;
  internalNotes: string;
  onUpdateNotes: (notes: string) => void;
  onScheduleInterview: (data: any) => void;
  onAcceptCandidate: (message: string) => void;
  onRejectCandidate: (message: string) => void;
}

const statusConfig = {
  applied: { 
    color: 'bg-blue-100 text-blue-800', 
    label: 'Applied', 
    icon: Clock,
    description: 'Candidate has submitted their application'
  },
  viewed: { 
    color: 'bg-gray-100 text-gray-800', 
    label: 'Viewed', 
    icon: Eye,
    description: 'You have viewed this application'
  },
  interview_scheduled: { 
    color: 'bg-yellow-100 text-yellow-800', 
    label: 'Interview Scheduled', 
    icon: Calendar,
    description: 'Interview has been scheduled with the candidate'
  },
  accepted: { 
    color: 'bg-green-100 text-green-800', 
    label: 'Accepted', 
    icon: CheckCircle,
    description: 'Candidate has been accepted for the position'
  },
  rejected: { 
    color: 'bg-red-100 text-red-800', 
    label: 'Rejected', 
    icon: XCircle,
    description: 'Application has been declined'
  }
};

export function StatusPanel({
  applicationId,
  currentStatus,
  candidateName,
  jobTitle,
  internalNotes,
  onUpdateNotes,
  onScheduleInterview,
  onAcceptCandidate,
  onRejectCandidate
}: StatusPanelProps) {
  const [notes, setNotes] = useState(internalNotes);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const statusStyle = statusConfig[currentStatus];
  const StatusIcon = statusStyle.icon;

  const handleNotesChange = (value: string) => {
    setNotes(value);
    onUpdateNotes(value);
  };

  const canScheduleInterview = currentStatus === 'applied' || currentStatus === 'viewed';
  const canAcceptOrReject = currentStatus !== 'accepted' && currentStatus !== 'rejected';

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Application Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-muted">
              <StatusIcon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <Badge variant="outline" className={`${statusStyle.color} mb-1`}>
                {statusStyle.label}
              </Badge>
              <p className="text-sm text-muted-foreground">{statusStyle.description}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <p className="text-sm font-medium">System-Generated Statuses</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Applied - Automatically set when application submitted
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-3 w-3" />
                Viewed - Automatically set when employer opens application
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {canScheduleInterview && (
            <Button 
              className="w-full justify-start"
              onClick={() => setIsSchedulerOpen(true)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
          )}
          
          {canAcceptOrReject && (
            <>
              <Button 
                className="w-full justify-start"
                variant="outline"
                onClick={() => setIsAcceptModalOpen(true)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept Candidate
              </Button>
              
              <Button 
                className="w-full justify-start"
                variant="outline"
                onClick={() => setIsRejectModalOpen(true)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Application
              </Button>
            </>
          )}
          
          <Separator />
          
          <Button 
            className="w-full justify-start"
            variant="ghost"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </CardContent>
      </Card>

      {/* Internal Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Internal Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add your private notes about this candidate..."
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2">
            These notes are private and only visible to your team
          </p>
        </CardContent>
      </Card>

      {/* Application Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Application Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Application ID</span>
            <span className="font-mono text-xs">{applicationId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Position</span>
            <span>{jobTitle}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Candidate</span>
            <span>{candidateName}</span>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <SchedulerModal
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
        candidateName={candidateName}
        jobTitle={jobTitle}
        onSchedule={(data) => {
          onScheduleInterview(data);
          setIsSchedulerOpen(false);
        }}
      />

      <MessageTemplateModal
        isOpen={isAcceptModalOpen}
        onClose={() => setIsAcceptModalOpen(false)}
        type="acceptance"
        candidateName={candidateName}
        jobTitle={jobTitle}
        onSend={(message) => {
          onAcceptCandidate(message);
          setIsAcceptModalOpen(false);
        }}
      />

      <MessageTemplateModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        type="rejection"
        candidateName={candidateName}
        jobTitle={jobTitle}
        onSend={(message) => {
          onRejectCandidate(message);
          setIsRejectModalOpen(false);
        }}
      />
    </div>
  );
}