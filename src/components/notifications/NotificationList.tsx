'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { NotificationCard } from './NotificationCard';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { Notification } from '@/types/notification';

interface NotificationListProps {
  notifications: Notification[];
  selectedIds: Set<string>;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  onMarkAllRead: () => void;
  onDeleteSelected: () => void;
}

export function NotificationList({
  notifications,
  selectedIds,
  onToggleRead,
  onDelete,
  onSelect,
  onMarkAllRead,
  onDeleteSelected
}: NotificationListProps) {
  const unreadCount = notifications.filter(n => n.status === 'unread').length;
  const selectedCount = selectedIds.size;

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="h-8 w-8 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No notifications</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Notifications ({unreadCount} unread)
        </h2>
        <div className="flex gap-2">
          {selectedCount > 0 && (
            <Button variant="outline" size="sm" onClick={onDeleteSelected}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete ({selectedCount})
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onMarkAllRead}>
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <NotificationCard
              notification={notification}
              isSelected={selectedIds.has(notification.id)}
              onToggleRead={onToggleRead}
              onDelete={onDelete}
              onSelect={onSelect}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
