'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bell, ArrowRight, Briefcase, Clock } from 'lucide-react';
import { mockNotifications, getRelativeTime } from '@/data/mockNotifications';
import { Notification } from '@/types/notification';

interface NotificationWidgetProps {
  onViewAll?: () => void;
}

export function NotificationWidget({ onViewAll }: NotificationWidgetProps) {
  const [notifications] = useState<Notification[]>(mockNotifications);
  const recentNotifications = notifications.slice(0, 4);
  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/30" />
      
      <CardHeader className="relative pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-base">Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs">{unreadCount}</Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-3 pt-0">
        {recentNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className={`p-3 rounded-lg border cursor-pointer ${
              notification.status === 'unread' 
                ? 'bg-blue-50/80 border-blue-200' 
                : 'bg-white/50 border-gray-100'
            }`}
          >
            <div className="flex gap-3">
              <Briefcase className="h-4 w-4 text-blue-500 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-1">
                  {notification.title}
                  {notification.status === 'unread' && (
                    <span className="ml-1 w-1.5 h-1.5 bg-blue-500 rounded-full inline-block" />
                  )}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                  {notification.message}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {getRelativeTime(notification.createdAt)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
