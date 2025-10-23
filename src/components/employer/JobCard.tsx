import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  MoreHorizontal, 
  Eye, 
  Users, 
  MapPin, 
  Clock,
  Edit,
  Pause,
  Trash2,
  Zap,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  applicants: number;
  views: number;
  status: 'active' | 'draft' | 'paused' | 'closed';
  isBoosted?: boolean;
  postedAt: string;
  updatedAt?: string; // Last edited timestamp
  onEdit?: (id: string) => void;
  onPause?: (id: string) => void;
  onDelete?: (id: string) => void;
  onBoost?: (id: string) => void;
}

const statusConfig = {
  active: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Active' },
  draft: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Draft' },
  paused: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Paused' },
  closed: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Closed' }
};

export function JobCard({
  id,
  title,
  company,
  location,
  jobType,
  salary,
  applicants,
  views,
  status,
  isBoosted = false,
  postedAt,
  updatedAt,
  onEdit,
  onPause,
  onDelete,
  onBoost
}: JobCardProps) {
  const statusStyle = statusConfig[status];

  return (
    <Card className="group hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          {/* Left side: Avatar + Job Info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src="" alt={`${company} logo`} />
              <AvatarFallback>{company.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-medium text-base break-words">{title}</h3>
                {isBoosted && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex-shrink-0">
                    <Zap className="h-3 w-3 mr-1" />
                    Boosted
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2 break-words">{company}</p>
              
              {/* Status badge below company name */}
              <Badge 
                variant="outline" 
                className={`text-xs mb-2 ${statusStyle.color}`}
              >
                {statusStyle.label}
              </Badge>
              
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{postedAt}</span>
                </div>
                {updatedAt && updatedAt !== postedAt && (
                  <div className="flex items-center gap-1 text-xs">
                    <RefreshCw className="h-3 w-3 flex-shrink-0" />
                    <span title="Last edited" className="truncate">Edited {updatedAt}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right side: Three-dot menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(id)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPause?.(id)}>
                <Pause className="h-4 w-4 mr-2" />
                {status === 'paused' ? 'Resume' : 'Pause'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBoost?.(id)}>
                <Zap className="h-4 w-4 mr-2" />
                {isBoosted ? 'Stop Boosting' : 'Boost Job'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete?.(id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <Badge variant="secondary">{jobType}</Badge>
            <span className="text-muted-foreground mx-2">•</span>
            <span className="font-medium">{salary}</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {applicants}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {views}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}