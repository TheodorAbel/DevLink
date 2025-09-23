import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  Clock, 
  Eye, 
  Calendar, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  Bot
} from "lucide-react";

interface TimelineEntry {
  id: string;
  type: 'applied' | 'viewed' | 'interview_scheduled' | 'message_sent' | 'accepted' | 'rejected';
  timestamp: string;
  actor: 'system' | 'employer';
  actorName?: string;
  actorEmail?: string;
  details?: {
    message?: string;
    interviewDate?: string;
    interviewTime?: string;
    interviewType?: string;
    meetingLink?: string;
  };
}

interface ApplicationTimelineProps {
  entries: TimelineEntry[];
  candidateName: string;
}

const timelineConfig = {
  applied: {
    icon: Clock,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    title: 'Application Submitted'
  },
  viewed: {
    icon: Eye,
    color: 'bg-gray-500',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    title: 'Application Viewed'
  },
  interview_scheduled: {
    icon: Calendar,
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    title: 'Interview Scheduled'
  },
  message_sent: {
    icon: MessageSquare,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    title: 'Message Sent'
  },
  accepted: {
    icon: CheckCircle,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    title: 'Application Accepted'
  },
  rejected: {
    icon: XCircle,
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    title: 'Application Rejected'
  }
};

export function ApplicationTimeline({ entries, candidateName }: ApplicationTimelineProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes} minutes ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      if (days === 1) return 'Yesterday';
      if (days < 7) return `${days} days ago`;
      return date.toLocaleDateString();
    }
  };

  const renderEntryDetails = (entry: TimelineEntry) => {
    
    switch (entry.type) {
      case 'applied':
        return (
          <p className="text-sm text-muted-foreground">
            {candidateName} submitted their application
          </p>
        );
      
      case 'viewed':
        return (
          <p className="text-sm text-muted-foreground">
            {entry.actorName || 'Employer'} viewed the application
          </p>
        );
      
      case 'interview_scheduled':
        return (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Interview scheduled by {entry.actorName || 'Employer'}
            </p>
            {entry.details && (
              <div className="text-sm bg-muted rounded-lg p-3">
                <div className="space-y-1">
                  <div><strong>Date:</strong> {entry.details.interviewDate}</div>
                  <div><strong>Time:</strong> {entry.details.interviewTime}</div>
                  <div><strong>Type:</strong> {entry.details.interviewType}</div>
                  {entry.details.meetingLink && (
                    <div><strong>Meeting Link:</strong> <a href={entry.details.meetingLink} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Join Meeting</a></div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'message_sent':
        return (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Message sent by {entry.actorName || 'Employer'}
            </p>
            {entry.details?.message && (
              <div className="text-sm bg-muted rounded-lg p-3 max-w-md">
                <p className="line-clamp-3">{entry.details.message}</p>
              </div>
            )}
          </div>
        );
      
      case 'accepted':
        return (
          <p className="text-sm text-muted-foreground">
            Application accepted by {entry.actorName || 'Employer'}
          </p>
        );
      
      case 'rejected':
        return (
          <p className="text-sm text-muted-foreground">
            Application declined by {entry.actorName || 'Employer'}
          </p>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Application Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {entries.map((entry, index) => {
            const config = timelineConfig[entry.type];
            const Icon = config.icon;
            const isLast = index === entries.length - 1;
            
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline line */}
                {!isLast && (
                  <div className="absolute left-6 top-12 w-0.5 h-6 bg-border" />
                )}
                
                <div className="flex items-start gap-4">
                  {/* Timeline icon */}
                  <div className={`flex-shrink-0 w-12 h-12 ${config.bgColor} rounded-full flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${config.textColor}`} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{config.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          {entry.actor === 'system' ? (
                            <div className="flex items-center gap-1">
                              <Bot className="h-3 w-3" />
                              <span>System</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Avatar className="h-4 w-4">
                                <AvatarFallback className="text-xs">
                                  {entry.actorName?.charAt(0) || 'E'}
                                </AvatarFallback>
                              </Avatar>
                              <span>{entry.actorEmail || entry.actorName || 'Employer'}</span>
                            </div>
                          )}
                          <span>•</span>
                          <span>{formatTimestamp(entry.timestamp)}</span>
                        </div>
                      </div>
                      
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${config.textColor} border-current`}
                      >
                        {entry.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    {renderEntryDetails(entry)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}