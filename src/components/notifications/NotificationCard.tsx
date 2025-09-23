'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Check, 
  X, 
  ExternalLink,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle,
  Briefcase,
  MessageSquare,
  Shield,
  CreditCard,
  Sparkles,
  Settings
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Notification } from '@/types/notification';
import { getRelativeTime } from '@/data/mockNotifications';
import { cn } from '@/lib/utils';

interface NotificationCardProps {
  notification: Notification;
  isSelected?: boolean;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  onAction?: (id: string, action: string) => void;
}

// Icon mapping for notification types
const getTypeIcon = (type: string, priority: string) => {
  const iconClass = cn(
    "h-5 w-5",
    priority === 'critical' && "text-red-500",
    priority === 'high' && "text-orange-500", 
    priority === 'medium' && "text-blue-500",
    priority === 'low' && "text-gray-500"
  );

  const iconMap: Record<string, React.ReactNode> = {
    job_update: <Briefcase className={iconClass} />,
    application_status: <CheckCircle className={iconClass} />,
    system_alert: <Settings className={iconClass} />,
    message: <MessageSquare className={iconClass} />,
    security: <Shield className={iconClass} />,
    billing: <CreditCard className={iconClass} />,
    feature_update: <Sparkles className={iconClass} />
  };

  return iconMap[type] || <Info className={iconClass} />;
};

// Priority indicator
const getPriorityIndicator = (priority: string) => {
  const colors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-blue-500',
    low: 'bg-gray-400'
  };
  
  return (
    <div className={cn("w-1 h-full rounded-full", colors[priority as keyof typeof colors] || colors.low)} />
  );
};

export function NotificationCard({ 
  notification, 
  isSelected = false,
  onToggleRead, 
  onDelete, 
  onSelect,
  onAction 
}: NotificationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isUnread = notification.status === 'unread';
  const shouldTruncate = notification.message.length > 120;
  const displayMessage = isExpanded || !shouldTruncate 
    ? notification.message 
    : `${notification.message.substring(0, 120)}...`;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button, [role="menuitem"]')) return;
    
    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank');
      onAction?.(notification.id, 'clicked');
    }
  };

  const handleToggleRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleRead(notification.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  // removed unused handleSelect

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card 
        className={cn(
          "relative overflow-hidden transition-all duration-200 cursor-pointer group",
          isUnread && "border-l-4 border-l-blue-500 bg-blue-50/30",
          isSelected && "ring-2 ring-blue-500 ring-offset-2",
          isHovered && "shadow-md",
          notification.priority === 'critical' && "border-l-red-500 bg-red-50/30"
        )}
        onClick={handleCardClick}
      >
        <div className="flex">
          {/* Priority Indicator */}
          {getPriorityIndicator(notification.priority)}
          
          <CardContent className="flex-1 p-4">
            <div className="flex items-start justify-between gap-3">
              {/* Selection Checkbox */}
              <div className="flex items-start gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    onSelect(notification.id);
                  }}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  aria-label={`Select notification: ${notification.title}`}
                />
                
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {getTypeIcon(notification.type, notification.priority)}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className={cn(
                      "font-medium text-sm leading-5",
                      isUnread ? "text-gray-900" : "text-gray-700"
                    )}>
                      {notification.title}
                      {isUnread && (
                        <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block" />
                      )}
                    </h3>
                    
                    {/* Priority Badge */}
                    {notification.priority === 'critical' && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Critical
                      </Badge>
                    )}
                  </div>
                  
                  <p className={cn(
                    "text-sm leading-relaxed mb-3",
                    isUnread ? "text-gray-800" : "text-gray-600"
                  )}>
                    {displayMessage}
                  </p>
                  
                  {shouldTruncate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                      }}
                      className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal text-sm"
                    >
                      {isExpanded ? 'Show less' : 'Read more'}
                    </Button>
                  )}
                  
                  {/* Metadata */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getRelativeTime(notification.createdAt)}
                      </div>
                      
                      {notification.actionUrl && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <ExternalLink className="h-3 w-3" />
                          View Details
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className={cn(
                      "flex items-center gap-1 transition-opacity duration-200",
                      isHovered ? "opacity-100" : "opacity-0"
                    )}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleRead}
                        className="h-8 w-8 p-0"
                        title={isUnread ? "Mark as read" : "Mark as unread"}
                      >
                        {isUnread ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-gray-600" />
                        )}
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={handleToggleRead}>
                            {isUnread ? "Mark as read" : "Mark as unread"}
                          </DropdownMenuItem>
                          {notification.actionUrl && (
                            <DropdownMenuItem 
                              onClick={() => {
                                window.open(notification.actionUrl, '_blank');
                                onAction?.(notification.id, 'clicked');
                              }}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open Link
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={handleDelete}
                            className="text-red-600 focus:text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
        
        {/* Hover Effect */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-200",
          isHovered && "opacity-100"
        )} />
      </Card>
    </motion.div>
  );
}
