import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Mail, MessageSquare, Eye } from "lucide-react";

interface MessageTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'interview' | 'acceptance' | 'rejection';
  candidateName: string;
  jobTitle: string;
  companyName?: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewLink?: string;
  onSend: (message: string, sendEmail: boolean) => void;
}

const templates = {
  interview: `Hello [CandidateName],

Thank you for applying for the [JobTitle] position at [CompanyName]. We'd like to invite you to an interview.

📅 Date: [InterviewDate]
🕐 Time: [InterviewTime]  
🔗 Meeting Link: [InterviewLink]

Please confirm your availability by replying to this message.

We look forward to speaking with you!

Best regards,
[CompanyName] Team`,

  acceptance: `Hi [CandidateName],

Congratulations! We're excited to offer you the [JobTitle] position at [CompanyName].

We were impressed by your skills and experience, and we believe you'll be a great addition to our team.

Our HR team will reach out within the next 24-48 hours with the formal offer details and next steps.

Welcome to [CompanyName]!

Best regards,
[CompanyName] Team`,

  rejection: `Dear [CandidateName],

Thank you for your interest in the [JobTitle] position at [CompanyName] and for taking the time to interview with us.

After careful consideration, we have decided to move forward with another candidate whose background more closely aligns with our current needs.

We were impressed by your qualifications and encourage you to apply for future opportunities that match your skills.

We wish you success in your job search.

Best regards,
[CompanyName] Team`
};

export function MessageTemplateModal({
  isOpen,
  onClose,
  type,
  candidateName,
  jobTitle,
  companyName = "TechCorp",
  interviewDate = "",
  interviewTime = "",
  interviewLink = "",
  onSend
}: MessageTemplateModalProps) {
  const [message, setMessage] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Populate template with actual values
      let template = templates[type];
      template = template.replace(/\[CandidateName\]/g, candidateName);
      template = template.replace(/\[JobTitle\]/g, jobTitle);
      template = template.replace(/\[CompanyName\]/g, companyName);
      template = template.replace(/\[InterviewDate\]/g, interviewDate);
      template = template.replace(/\[InterviewTime\]/g, interviewTime);
      template = template.replace(/\[InterviewLink\]/g, interviewLink);
      
      setMessage(template);
    }
  }, [isOpen, type, candidateName, jobTitle, companyName, interviewDate, interviewTime, interviewLink]);

  const handleSend = () => {
    onSend(message, sendEmail);
  };

  const getTitle = () => {
    switch (type) {
      case 'interview': return 'Schedule Interview';
      case 'acceptance': return 'Accept Candidate';
      case 'rejection': return 'Reject Application';
      default: return 'Send Message';
    }
  };

  const getActionButtonText = () => {
    switch (type) {
      case 'interview': return 'Send Interview Invitation';
      case 'acceptance': return 'Send Acceptance Message';
      case 'rejection': return 'Send Rejection Message';
      default: return 'Send Message';
    }
  };

  const getBadgeColor = () => {
    switch (type) {
      case 'interview': return 'bg-blue-100 text-blue-800';
      case 'acceptance': return 'bg-green-100 text-green-800';
      case 'rejection': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{getTitle()}</DialogTitle>
            <Badge variant="outline" className={getBadgeColor()}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          </div>
          <DialogDescription>
            Sending to {candidateName} for {jobTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Message Composition */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="message">Message</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Edit' : 'Preview'}
              </Button>
            </div>
            
            {showPreview ? (
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <strong>To:</strong> {candidateName}
                      <strong>Subject:</strong> {getTitle()} - {jobTitle}
                    </div>
                    <div className="whitespace-pre-wrap text-sm bg-muted p-3 rounded">
                      {message}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={12}
                className="resize-none"
                placeholder="Edit your message..."
              />
            )}
          </div>

          {/* Delivery Options */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Delivery Options</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Send in-app notification</span>
                  </div>
                  <Badge variant="secondary">Always sent</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Send email notification</span>
                  </div>
                  <Switch
                    checked={sendEmail}
                    onCheckedChange={setSendEmail}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Placeholders Help */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Available Placeholders</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-1">
                  <code className="text-xs bg-muted px-1 rounded">[CandidateName]</code>
                  <code className="text-xs bg-muted px-1 rounded">[JobTitle]</code>
                  <code className="text-xs bg-muted px-1 rounded">[CompanyName]</code>
                </div>
                <div className="space-y-1">
                  <code className="text-xs bg-muted px-1 rounded">[InterviewDate]</code>
                  <code className="text-xs bg-muted px-1 rounded">[InterviewTime]</code>
                  <code className="text-xs bg-muted px-1 rounded">[InterviewLink]</code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSend} className="flex-1">
              {getActionButtonText()}
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