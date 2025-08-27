import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Briefcase, 
  Bookmark, 
  FileText, 
  User, 
  Settings, 
  MessageSquare, 
  BarChart3, 
  Target,
  LogOut 
} from 'lucide-react';
import { Button } from './ui/button';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hasNotification?: boolean;
  notificationCount?: number;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'saved-jobs', label: 'Saved Jobs', icon: Bookmark },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'messaging', label: 'Messaging', icon: MessageSquare, hasNotification: true, notificationCount: 3 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'recommendations', label: 'Job Recommendations', icon: Target },
  { id: 'logout', label: 'Logout', icon: LogOut },
];

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleItemClick = (itemId: string) => {
    onPageChange(itemId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200"
      >
        <motion.div
          animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </motion.div>
      </Button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-md shadow-2xl z-50 border-r border-border"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/40 to-pink-50/60" />
            
            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-border/50">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                  JobSeeker Pro
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-sm text-muted-foreground mt-1"
                >
                  Find your dream job
                </motion.p>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  const isLogout = item.id === 'logout';
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start gap-3 h-12 transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                            : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:scale-[1.02]'
                        } ${isLogout ? 'mt-4 border-t border-border/50 pt-6' : ''}`}
                        onClick={() => handleItemClick(item.id)}
                      >
                        <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                        <span className={isActive ? 'text-white' : ''}>{item.label}</span>
                        
                        {/* Notification Badge */}
                        {item.hasNotification && item.notificationCount && item.notificationCount > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium"
                          >
                            {item.notificationCount > 9 ? '9+' : item.notificationCount}
                          </motion.div>
                        )}
                        
                        {isActive && !item.hasNotification && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute right-2 w-2 h-2 bg-white rounded-full"
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                          />
                        )}
                      </Button>
                    </motion.div>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}