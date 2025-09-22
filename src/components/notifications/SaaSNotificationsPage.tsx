'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Bell, 
  Settings, 
  CheckCheck,
  Briefcase,
  FileText,
  Shield,
  MessageSquare,
  CreditCard,
  Sparkles,
  Clock,
  ArrowRight,
  ExternalLink,
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  ChevronDown,
  X,
  Grid3X3,
  List,
  Trash2,
  MoreHorizontal,
  CheckSquare,
  Square,
  Loader2,
  RefreshCw,
  Archive,
  Star,
  Zap
} from 'lucide-react';
import { mockNotifications, getRelativeTime } from '@/data/mockNotifications';
import { Notification } from '@/types/notification';
import { cn } from '@/lib/utils';
import { NotificationDetailDrawer } from './NotificationDetailDrawer';

interface SaaSNotificationsPageProps {
  onNavigateToSettings?: () => void;
}

// Category configuration with icons and colors
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
    label: 'Application'
  },
  system_alert: {
    icon: Shield,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    label: 'System'
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
    label: 'Security'
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
    label: 'Feature'
  }
};

// Get category configuration
const getCategoryConfig = (type: string) => {
  return categoryConfig[type as keyof typeof categoryConfig] || categoryConfig.system_alert;
};

// Loading Skeleton Component
const NotificationSkeleton = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
  >
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
              </div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
            </div>
            <div className="flex items-center justify-between">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
              <div className="h-8 bg-gray-200 rounded animate-pulse w-24" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// Priority indicator component
const PriorityIndicator = ({ priority }: { priority: string }) => {
  const colors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-blue-500',
    low: 'bg-gray-400'
  };
  
  if (priority === 'low') return null;
  
  return (
    <div className={cn("w-1 h-full rounded-full absolute left-0 top-0", colors[priority as keyof typeof colors])} />
  );
};

// Notification Card Component
const NotificationCard = ({ 
  notification, 
  index,
  onClick,
  isSelected,
  onSelect,
  showCheckbox
}: { 
  notification: Notification; 
  index: number;
  onClick: () => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
  showCheckbox: boolean;
}) => {
  const config = getCategoryConfig(notification.type);
  const IconComponent = config.icon;
  const isUnread = notification.status === 'unread';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card 
        className={cn(
          "relative overflow-hidden transition-all duration-200 cursor-pointer group hover:shadow-md",
          isUnread ? "bg-blue-50/30 border-l-4 border-l-blue-500" : "hover:bg-gray-50/50",
          notification.priority === 'critical' && "border-l-red-500 bg-red-50/20"
        )}
        onClick={onClick}
      >
        <PriorityIndicator priority={notification.priority} />
        
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Selection Checkbox */}
            {showCheckbox && (
              <div className="flex-shrink-0 pt-1">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onSelect(notification.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
              </div>
            )}
            
            {/* Category Icon */}
            <div className={cn(
              "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
              config.bgColor,
              config.borderColor,
              "border"
            )}>
              <IconComponent className={cn("h-5 w-5", config.color)} />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <h3 className={cn(
                    "font-semibold text-base leading-tight",
                    isUnread ? "text-gray-900" : "text-gray-700"
                  )}>
                    {notification.title}
                  </h3>
                  {isUnread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                  )}
                </div>
                
                {/* Category Badge */}
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs font-medium",
                    config.color,
                    config.borderColor
                  )}
                >
                  {config.label}
                </Badge>
              </div>
              
              {/* Message Preview */}
              <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                {notification.message}
              </p>
              
              {/* Bottom Row: Timestamp + CTA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {getRelativeTime(notification.createdAt)}
                  {notification.priority === 'critical' && (
                    <>
                      <span className="mx-1">•</span>
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                      <span className="text-red-600 font-medium">Critical</span>
                    </>
                  )}
                </div>
                
                {/* CTA Button */}
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClick();
                    }}
                  >
                    View Details
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                  
                  {notification.actionUrl && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(notification.actionUrl, '_blank');
                      }}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Filter and search types
type CategoryFilter = 'all' | 'job_update' | 'application_status' | 'system_alert' | 'message' | 'security' | 'billing' | 'feature_update';
type TimeFilter = 'all' | '24h' | '7d' | '30d';
type ViewMode = 'grid' | 'list';

// Time filter options
const timeFilterOptions = [
  { value: 'all', label: 'All Time' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' }
];

// Category filter options
const categoryFilterOptions = [
  { value: 'all', label: 'All Categories', icon: Grid3X3, count: 0 },
  { value: 'job_update', label: 'Job Alerts', icon: Briefcase, count: 0 },
  { value: 'application_status', label: 'Applications', icon: FileText, count: 0 },
  { value: 'system_alert', label: 'System', icon: Shield, count: 0 },
  { value: 'message', label: 'Messages', icon: MessageSquare, count: 0 },
  { value: 'security', label: 'Security', icon: Shield, count: 0 },
  { value: 'billing', label: 'Billing', icon: CreditCard, count: 0 },
  { value: 'feature_update', label: 'Features', icon: Sparkles, count: 0 }
];

export function SaaSNotificationsPage({ onNavigateToSettings }: SaaSNotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Filter notifications based on search, category, and time
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(notification => notification.type === categoryFilter);
    }

    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const timeThresholds = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      };
      
      const threshold = timeThresholds[timeFilter];
      filtered = filtered.filter(notification => {
        const notificationTime = new Date(notification.createdAt).getTime();
        return now.getTime() - notificationTime <= threshold;
      });
    }

    return filtered;
  }, [notifications, searchQuery, categoryFilter, timeFilter]);

  // Calculate counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    notifications.forEach(notification => {
      counts[notification.type] = (counts[notification.type] || 0) + 1;
    });
    counts.all = notifications.length;
    return counts;
  }, [notifications]);

  const unreadCount = filteredNotifications.filter(n => n.status === 'unread').length;
  const totalCount = filteredNotifications.length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'read' as const })));
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDrawerOpen(true);
    
    // Auto-mark as read when opened
    if (notification.status === 'unread') {
      setNotifications(prev => prev.map(n => 
        n.id === notification.id ? { ...n, status: 'read' as const } : n
      ));
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, status: n.status === 'read' ? 'unread' : 'read' } : n
    ));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationAction = (notification: Notification) => {
    // Handle different notification actions
    switch (notification.type) {
      case 'job_update':
        console.log('Navigate to job details:', notification.id);
        break;
      case 'application_status':
        console.log('Navigate to application:', notification.id);
        break;
      case 'message':
        console.log('Navigate to messages:', notification.id);
        break;
      default:
        console.log('Default action for:', notification.id);
    }
    setIsDrawerOpen(false);
  };

  // Bulk selection handlers
  const handleSelectAll = () => {
    if (selectedIds.size === filteredNotifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredNotifications.map(n => n.id)));
    }
  };

  const handleSelectNotification = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Bulk actions
  const handleBulkMarkAsRead = async () => {
    setBulkActionLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    setNotifications(prev => prev.map(n => 
      selectedIds.has(n.id) ? { ...n, status: 'read' as const } : n
    ));
    setSelectedIds(new Set());
    setBulkActionLoading(false);
  };

  const handleBulkMarkAsUnread = async () => {
    setBulkActionLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    setNotifications(prev => prev.map(n => 
      selectedIds.has(n.id) ? { ...n, status: 'unread' as const } : n
    ));
    setSelectedIds(new Set());
    setBulkActionLoading(false);
  };

  const handleBulkDelete = async () => {
    setBulkActionLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    setNotifications(prev => prev.filter(n => !selectedIds.has(n.id)));
    setSelectedIds(new Set());
    setShowDeleteDialog(false);
    setBulkActionLoading(false);
  };

  const handleBulkArchive = async () => {
    setBulkActionLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    // In a real app, this would archive notifications
    console.log('Archiving notifications:', Array.from(selectedIds));
    setSelectedIds(new Set());
    setBulkActionLoading(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setTimeFilter('all');
  };

  const hasActiveFilters = searchQuery.trim() || categoryFilter !== 'all' || timeFilter !== 'all';
  const hasSelectedNotifications = selectedIds.size > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-1">
                  Stay up to date with your job alerts, application updates, and system messages.
                </p>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <Button 
                  variant="outline"
                  onClick={handleMarkAllRead}
                  className="hover:bg-green-50 hover:border-green-200 hover:text-green-700"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all as read
                </Button>
              )}
              <Button 
                variant="outline"
                onClick={onNavigateToSettings}
                className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
              >
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </Button>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>{unreadCount} unread</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
              <span>{totalCount - unreadCount} read</span>
            </div>
            <div className="text-gray-500">
              Total: {totalCount} notifications
            </div>
          </div>
        </motion.div>

        {/* Search and Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 h-10"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Time Filter */}
              <div className="w-full lg:w-48">
                <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
                  <SelectTrigger className="h-10">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeFilterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-10 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-10 px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden h-10"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-gray-600">Active filters:</span>
                {categoryFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {categoryFilterOptions.find(opt => opt.value === categoryFilter)?.label}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setCategoryFilter('all')}
                    />
                  </Badge>
                )}
                {timeFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {timeFilterOptions.find(opt => opt.value === timeFilter)?.label}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setTimeFilter('all')}
                    />
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: "{searchQuery}"
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setSearchQuery('')}
                    />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="ml-2 h-6 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Bulk Actions Bar */}
        {hasSelectedNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {selectedIds.size} notification{selectedIds.size !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedIds(new Set())}
                    className="text-blue-700 hover:text-blue-800 hover:bg-blue-100"
                  >
                    Clear selection
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkMarkAsRead}
                    disabled={bulkActionLoading}
                    className="gap-2"
                  >
                    {bulkActionLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <CheckCheck className="h-3 w-3" />
                    )}
                    Mark as Read
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkMarkAsUnread}
                    disabled={bulkActionLoading}
                    className="gap-2"
                  >
                    {bulkActionLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3 w-3" />
                    )}
                    Mark as Unread
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkArchive}
                    disabled={bulkActionLoading}
                    className="gap-2"
                  >
                    {bulkActionLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Archive className="h-3 w-3" />
                    )}
                    Archive
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={bulkActionLoading}
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Delete Selected
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Main Content Area */}
        <div className="flex gap-6">
          {/* Left Filter Panel - Desktop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block w-64 flex-shrink-0"
          >
            <Card className="p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4" />
                <h3 className="font-semibold">Categories</h3>
              </div>
              
              <div className="space-y-2">
                {categoryFilterOptions.map((option) => {
                  const IconComponent = option.icon;
                  const count = categoryCounts[option.value] || 0;
                  const isActive = categoryFilter === option.value;
                  
                  return (
                    <Button
                      key={option.value}
                      variant={isActive ? 'default' : 'ghost'}
                      onClick={() => setCategoryFilter(option.value as CategoryFilter)}
                      className="w-full justify-between h-10 px-3"
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm">{option.label}</span>
                      </div>
                      <Badge 
                        variant={isActive ? 'secondary' : 'outline'} 
                        className="text-xs"
                      >
                        {count}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Mobile Filter Panel */}
          {showMobileFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden fixed inset-x-4 top-4 z-50 bg-white rounded-xl shadow-lg border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filter Categories</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {categoryFilterOptions.map((option) => {
                  const IconComponent = option.icon;
                  const count = categoryCounts[option.value] || 0;
                  const isActive = categoryFilter === option.value;
                  
                  return (
                    <Button
                      key={option.value}
                      variant={isActive ? 'default' : 'outline'}
                      onClick={() => {
                        setCategoryFilter(option.value as CategoryFilter);
                        setShowMobileFilters(false);
                      }}
                      className="justify-start h-12 px-3"
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm">{option.label}</span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {count}
                        </Badge>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Notifications List */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {filteredNotifications.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedIds.size === filteredNotifications.length && filteredNotifications.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <span className="text-sm text-gray-600">
                      Select all
                    </span>
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  Showing {totalCount} of {notifications.length} notifications
                  {hasActiveFilters && ' (filtered)'}
                </div>
              </div>
              
              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 1000);
                }}
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
                Refresh
              </Button>
            </div>

            {/* Notifications Grid/List */}
            <div className={cn(
              "space-y-4",
              viewMode === 'grid' && "grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0"
            )}>
              {isLoading ? (
                // Loading Skeletons
                Array.from({ length: 6 }).map((_, index) => (
                  <NotificationSkeleton key={`skeleton-${index}`} index={index} />
                ))
              ) : filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification, index) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    index={index}
                    onClick={() => handleNotificationClick(notification)}
                    isSelected={selectedIds.has(notification.id)}
                    onSelect={handleSelectNotification}
                    showCheckbox={hasSelectedNotifications || selectedIds.has(notification.id)}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    {hasActiveFilters ? (
                      <Search className="h-10 w-10 text-blue-500" />
                    ) : (
                      <Bell className="h-10 w-10 text-blue-500" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {hasActiveFilters ? 'No matching notifications' : 'All caught up!'}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {hasActiveFilters 
                      ? 'We couldn\'t find any notifications matching your current filters. Try adjusting your search criteria.'
                      : 'You\'re all up to date! New notifications will appear here when they arrive.'
                    }
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    {hasActiveFilters ? (
                      <>
                        <Button onClick={clearFilters} variant="outline">
                          <X className="h-4 w-4 mr-2" />
                          Clear filters
                        </Button>
                        <Button onClick={() => setSearchQuery('')} variant="default">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reset search
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => {
                          setIsLoading(true);
                          setTimeout(() => setIsLoading(false), 1000);
                        }}
                        variant="outline"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Check for updates
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Notification Detail Drawer */}
        <NotificationDetailDrawer
          notification={selectedNotification}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDeleteNotification}
          onAction={handleNotificationAction}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Delete Notifications
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedIds.size} notification{selectedIds.size !== 1 ? 's' : ''}? 
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={bulkActionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={bulkActionLoading}
                className="gap-2"
              >
                {bulkActionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete {selectedIds.size} notification{selectedIds.size !== 1 ? 's' : ''}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
