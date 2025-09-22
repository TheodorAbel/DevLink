import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Bookmark, 
  Share2, 
  Eye,
  Building2,
  Calendar,
  ExternalLink
} from 'lucide-react';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyId?: string; // Added companyId to link to company profile
  location: string;
  salary: string;
  type: string;
  postedDate: string;
  description: string;
  skills: string[];
  logo?: string;
  featured?: boolean;
}

interface JobCardProps {
  job: Job;
  variant?: 'default' | 'compact' | 'detailed';
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
  onShare?: (jobId: string) => void;
  onView?: (jobId: string) => void;
  isSaved?: boolean;
  className?: string;
}

export function JobCard({ 
  job, 
  variant = 'default', 
  onApply, 
  onSave, 
  onShare,
  onView,
  isSaved = false,
  className = ''
}: JobCardProps) {
  const handleCardClick = () => {
    onView?.(job.id);
  };

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={className}
      >
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 relative overflow-hidden group"
          onClick={handleCardClick}
        >
          {job.featured && (
            <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-bl-lg">
              Featured
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/30 group-hover:to-purple-50/30 transition-all duration-300" />
          
          <CardContent className="p-4 relative">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium line-clamp-1">{job.title}</h4>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSave?.(job.id);
                  }}
                >
                  <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {job.salary}
              </div>
            </div>
            
            <Badge variant="secondary" className="text-xs">
              {job.type}
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={className}
    >
      <Card className="cursor-pointer relative overflow-hidden group border-2 border-transparent hover:border-blue-200/50 transition-all duration-300">
        {job.featured && (
          <motion.div
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-3 py-1 rounded-bl-lg shadow-lg"
          >
            ⭐ Featured
          </motion.div>
        )}
        
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/40 group-hover:via-purple-50/20 group-hover:to-pink-50/40"
          transition={{ duration: 0.3 }}
        />
        
        <CardHeader className="relative" onClick={handleCardClick}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              {job.logo ? (
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-gray-400" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <CardTitle className="line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {job.title}
                </CardTitle>
                <div className="flex items-center space-x-2 group">
                  <Building2 className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <Link 
                      href={`/company/${job.companyId || '1'}`} 
                      className="text-sm text-gray-600 hover:text-blue-600 hover:underline flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {job.company}
                      <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {job.postedDate}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onSave?.(job.id);
                }}
                className="hover:bg-white/80"
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare?.(job.id);
                }}
                className="hover:bg-white/80"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative" onClick={handleCardClick}>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {job.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{job.type}</Badge>
            {job.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills.length - 3} more
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Posted {job.postedDate}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView?.(job.id);
                }}
                className="hover:bg-blue-50 hover:border-blue-200"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onApply?.(job.id);
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}