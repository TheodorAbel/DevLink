import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { 
  Search, 
  Grid, 
  List, 
  Filter,
  Eye,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Star
} from "lucide-react";

interface Application {
  id: string;
  candidateName: string;
  candidateTitle: string;
  candidateLocation: string;
  candidateAvatar?: string;
  appliedDate: string;
  status: 'applied' | 'viewed' | 'interview_scheduled' | 'accepted' | 'rejected';
  rating?: number;
  coverLetterSummary: string;
  screeningSummary: string;
  jobTitle: string;
}

interface ApplicationsListProps {
  jobId: string;
  jobTitle: string;
  applications: Application[];
  onViewApplication: (applicationId: string) => void;
  onMessageCandidate: (candidateId: string) => void;
  viewMode?: 'card' | 'table';
}

const statusConfig = {
  applied: { color: 'bg-blue-100 text-blue-800', label: 'Applied', icon: Clock },
  viewed: { color: 'bg-gray-100 text-gray-800', label: 'Viewed', icon: Eye },
  interview_scheduled: { color: 'bg-yellow-100 text-yellow-800', label: 'Interview Scheduled', icon: Calendar },
  accepted: { color: 'bg-green-100 text-green-800', label: 'Accepted', icon: CheckCircle },
  rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected', icon: XCircle }
};

export function ApplicationsList({ 
  jobId, 
  jobTitle, 
  applications, 
  onViewApplication, 
  onMessageCandidate,
  viewMode = 'card'
}: ApplicationsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentViewMode, setCurrentViewMode] = useState<'card' | 'table'>(viewMode);

  const filteredApplications = applications
    .filter(app => {
      const matchesSearch = app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.candidateLocation.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        case 'oldest':
          return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.candidateName.localeCompare(b.candidateName);
        default:
          return 0;
      }
    });

  const statusCounts = {
    all: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    viewed: applications.filter(a => a.status === 'viewed').length,
    interview_scheduled: applications.filter(a => a.status === 'interview_scheduled').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const renderCardView = () => (
    <div className="space-y-4">
      {filteredApplications.map((application) => {
        const statusStyle = statusConfig[application.status];
        const StatusIcon = statusStyle.icon;
        
        return (
          <Card 
            key={application.id} 
            className="hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => onViewApplication(application.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={application.candidateAvatar} alt={application.candidateName} />
                  <AvatarFallback>
                    {application.candidateName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium truncate">{application.candidateName}</h3>
                      <p className="text-sm text-muted-foreground truncate">{application.candidateTitle}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {application.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{application.rating}</span>
                        </div>
                      )}
                      <Badge variant="outline" className={`text-xs ${statusStyle.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusStyle.label}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                    <div>{application.candidateLocation}</div>
                    <div>Applied {application.appliedDate}</div>
                  </div>
                  
                  <p className="text-sm mb-3 line-clamp-2">{application.coverLetterSummary}</p>
                  
                  {application.screeningSummary && (
                    <div className="bg-muted rounded-lg p-2 mb-3">
                      <p className="text-xs text-muted-foreground mb-1">Screening Summary</p>
                      <p className="text-sm line-clamp-1">{application.screeningSummary}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewApplication(application.id);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMessageCandidate(application.id);
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderTableView = () => (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredApplications.map((application) => {
            const statusStyle = statusConfig[application.status];
            const StatusIcon = statusStyle.icon;
            
            return (
              <TableRow 
                key={application.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onViewApplication(application.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={application.candidateAvatar} alt={application.candidateName} />
                      <AvatarFallback className="text-xs">
                        {application.candidateName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{application.candidateName}</div>
                      <div className="text-sm text-muted-foreground">{application.candidateTitle}</div>
                      <div className="text-sm text-muted-foreground">{application.candidateLocation}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{application.appliedDate}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs ${statusStyle.color}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusStyle.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {application.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{application.rating}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewApplication(application.id);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMessageCandidate(application.id);
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium">Applications</h1>
          <p className="text-muted-foreground">{jobTitle}</p>
        </div>
      </div>

      {/* Status Filter Badges */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Badge
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            className="cursor-pointer capitalize"
            onClick={() => setStatusFilter(status)}
          >
            {status.replace('_', ' ')} ({count})
          </Badge>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-md">
                <Button
                  variant={currentViewMode === 'card' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setCurrentViewMode('card')}
                  className="h-10 w-10 rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={currentViewMode === 'table' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setCurrentViewMode('table')}
                  className="h-10 w-10 rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground">
              <p>No applications found</p>
              <p className="text-sm mt-1">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Applications will appear here once candidates apply'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        currentViewMode === 'card' ? renderCardView() : renderTableView()
      )}
    </div>
  );
}