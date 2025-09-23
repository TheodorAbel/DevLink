'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  X,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  Trash2,
  Share2,
  BookmarkPlus,
  Calendar,
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  FileText,
  Shield,
  MessageSquare,
  CreditCard,
  Sparkles,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Notification } from '@/types/notification';
import { getRelativeTime } from '@/data/mockNotifications';
import { cn } from '@/lib/utils';

interface NotificationDetailDrawerProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onAction?: (notification: Notification) => void;
}

// Category configuration
const categoryConfig = {
  job_update: {
    icon: Briefcase,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    label: 'Job Alert'
  },
  application_status: {
    icon: FileText,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    label: 'Application Update'
  },
  system_alert: {
    icon: Shield,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    label: 'System Alert'
  },
  message: {
    icon: MessageSquare,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    label: 'Message'
  },
  security: {
    icon: Shield,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Security Alert'
  },
  billing: {
    icon: CreditCard,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    label: 'Billing'
  },
  feature_update: {
    icon: Sparkles,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    label: 'Feature Update'
  }
};

// Priority configuration
const priorityConfig = {
  critical: {
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: AlertTriangle,
    label: 'Critical'
  },
  high: {
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: AlertTriangle,
    label: 'High Priority'
  },
  medium: {
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Info,
    label: 'Medium Priority'
  },
  low: {
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: Info,
    label: 'Low Priority'
  }
};

// Get category configuration
const getCategoryConfig = (type: string) => {
  return categoryConfig[type as keyof typeof categoryConfig] || categoryConfig.system_alert;
};

// Get priority configuration
const getPriorityConfig = (priority: string) => {
  return priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.low;
};

// Generate contextual action buttons based on notification type
const getActionButtons = (notification: Notification, onAction?: (notification: Notification) => void) => {
  const actions = [];

  switch (notification.type) {
    case 'job_update':
      actions.push({
        label: 'View Job Details',
        icon: Briefcase,
        variant: 'default' as const,
        onClick: () => onAction?.(notification)
      });
      actions.push({
        label: 'Save Job',
        icon: BookmarkPlus,
        variant: 'outline' as const,
        onClick: () => console.log('Save job:', notification.id)
      });
      break;

    case 'application_status':
      actions.push({
        label: 'View Application',
        icon: FileText,
        variant: 'default' as const,
        onClick: () => onAction?.(notification)
      });
      if (notification.title.toLowerCase().includes('interview')) {
        actions.push({
          label: 'Schedule Interview',
          icon: Calendar,
          variant: 'outline' as const,
          onClick: () => console.log('Schedule interview:', notification.id)
        });
      }
      break;

    case 'message':
      actions.push({
        label: 'Reply',
        icon: MessageSquare,
        variant: 'default' as const,
        onClick: () => onAction?.(notification)
      });
      break;

    case 'system_alert':
    case 'security':
      actions.push({
        label: 'Review Settings',
        icon: Shield,
        variant: 'default' as const,
        onClick: () => onAction?.(notification)
      });
      break;

    case 'billing':
      actions.push({
        label: 'View Billing',
        icon: CreditCard,
        variant: 'default' as const,
        onClick: () => onAction?.(notification)
      });
      break;

    case 'feature_update':
      actions.push({
        label: 'Learn More',
        icon: ExternalLink,
        variant: 'default' as const,
        onClick: () => onAction?.(notification)
      });
      break;
  }

  return actions;
};

export function NotificationDetailDrawer({
  notification,
  isOpen,
  onClose,
  onMarkAsRead,
  onDelete,
  onAction
}: NotificationDetailDrawerProps) {
  if (!notification) return null;

  const config = getCategoryConfig(notification.type);
  const priorityConf = getPriorityConfig(notification.priority);
  const IconComponent = config.icon;
  const PriorityIcon = priorityConf.icon;
  const isUnread = notification.status === 'unread';
  const actionButtons = getActionButtons(notification, onAction);

  const handleMarkAsRead = () => {
    onMarkAsRead(notification.id);
  };

  const handleDelete = () => {
    onDelete(notification.id);
    onClose();
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: notification.title,
        text: notification.message,
        url: window.location.href
      });
    } catch {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${notification.title}\n\n${notification.message}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    config.bgColor,
                    config.borderColor,
                    "border"
                  )}>
                    <IconComponent className={cn("h-5 w-5", config.color)} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Notification Details</h2>
                    <p className="text-sm text-gray-600">{config.label}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Read/Unread Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAsRead}
                    className="gap-2"
                  >
                    {isUnread ? (
                      <>
                        <Eye className="h-4 w-4" />
                        Mark as Read
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Mark as Unread
                      </>
                    )}
                  </Button>

                  {/* Share Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>

                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Priority Badge */}
                  {notification.priority !== 'low' && (
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg border",
                      priorityConf.bgColor,
                      priorityConf.borderColor
                    )}>
                      <PriorityIcon className={cn("h-4 w-4", priorityConf.color)} />
                      <span className={cn("text-sm font-medium", priorityConf.color)}>
                        {priorityConf.label}
                      </span>
                    </div>
                  )}

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      isUnread ? "bg-blue-500" : "bg-gray-400"
                    )} />
                    <span className="text-sm text-gray-600">
                      {isUnread ? 'Unread' : 'Read'}
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                      {notification.title}
                    </h1>
                  </div>

                  {/* Metadata */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Received</span>
                          <span className="font-medium">{getRelativeTime(notification.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Date</span>
                          <span className="font-medium">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Message Content */}
                  <Card>
                    <CardHeader>
                      <h3 className="font-semibold">Message</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {notification.message}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Additional Details for Job Updates */}
                  {notification.type === 'job_update' && (
                    <Card>
                      <CardHeader>
                        <h3 className="font-semibold">Job Details</h3>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Company:</span>
                          <span className="font-medium">TechCorp Inc.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">San Francisco, CA</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Salary:</span>
                          <span className="font-medium">$120k - $150k</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  {actionButtons.length > 0 && (
                    <Card>
                      <CardHeader>
                        <h3 className="font-semibold">Actions</h3>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-3">
                          {actionButtons.map((action, index) => {
                            const ActionIcon = action.icon;
                            return (
                              <Button
                                key={index}
                                variant={action.variant}
                                onClick={action.onClick}
                                className="gap-2"
                              >
                                <ActionIcon className="h-4 w-4" />
                                {action.label}
                              </Button>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t p-6 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Notification ID: {notification.id}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={handleDelete}
                      className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                    
                    <Button onClick={onClose}>
                      Done
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
