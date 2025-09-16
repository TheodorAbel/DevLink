import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Clock, Star, MapPin, Eye } from "lucide-react";

interface Applicant {
  id: string;
  name: string;
  title: string;
  location: string;
  appliedTo: string;
  appliedAt: string;
  rating?: number;
  avatar?: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected';
}

interface ApplicantFeedProps {
  applicants: Applicant[];
  onViewProfile: (id: string) => void;
}

const statusConfig = {
  new: { color: 'bg-blue-100 text-blue-800', label: 'New' },
  reviewed: { color: 'bg-gray-100 text-gray-800', label: 'Reviewed' },
  shortlisted: { color: 'bg-green-100 text-green-800', label: 'Shortlisted' },
  rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' }
};

export function ApplicantFeed({ applicants, onViewProfile }: ApplicantFeedProps) {
  if (applicants.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Applicants</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-muted-foreground">
            <p>No recent applicants</p>
            <p className="text-sm mt-1">New applications will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Recent Applicants</CardTitle>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {applicants.slice(0, 5).map((applicant, index) => {
            const statusStyle = statusConfig[applicant.status];
            
            return (
              <div 
                key={applicant.id}
                className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                  index !== applicants.length - 1 && index !== 4 ? 'border-b border-border' : ''
                }`}
                onClick={() => onViewProfile(applicant.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={applicant.avatar} alt={applicant.name} />
                    <AvatarFallback>
                      {applicant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium truncate">{applicant.name}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${statusStyle.color}`}
                      >
                        {statusStyle.label}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2 truncate">
                      {applicant.title}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {applicant.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {applicant.appliedAt}
                      </div>
                      {applicant.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {applicant.rating}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      Applied to: <span className="font-medium">{applicant.appliedTo}</span>
                    </p>
                  </div>
                  
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}