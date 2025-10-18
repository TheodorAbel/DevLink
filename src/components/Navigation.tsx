"use client";

import React, { useEffect, useState } from 'react';
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
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from './ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { fetchProfileStepsStatus, fetchSeekerProfile, fetchProfileCompletion, fetchPrimaryResume } from '@/lib/seekerProfile';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'saved-jobs', label: 'Saved Jobs', icon: Bookmark },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'messaging', label: 'Messaging', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'recommendations', label: 'AI Recommendations', icon: Target },
];

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const qc = useQueryClient();
  // Desktop collapse state
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const v = window.localStorage.getItem('seeker_sidebar_collapsed');
      return v === '1';
    } catch {
      return false;
    }
  });

  const toggleMenu = () => setIsOpen(!isOpen);

  // Track desktop breakpoint to avoid using window directly during render
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const update = () => setIsDesktop(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleItemClick = (itemId: string) => {
    onPageChange(itemId);
    setIsOpen(false);
  };

  const prefetchFor = async (itemId: string) => {
    try {
      if (itemId === 'dashboard') {
        await qc.prefetchQuery({ queryKey: ['profileStepsStatus'], queryFn: fetchProfileStepsStatus, staleTime: 1000 * 60 * 5 });
      }
      if (itemId === 'profile') {
        await Promise.all([
          qc.prefetchQuery({ queryKey: ['profileEdit','profile'], queryFn: fetchSeekerProfile, staleTime: 1000 * 60 * 5 }),
          qc.prefetchQuery({ queryKey: ['primaryResume'], queryFn: fetchPrimaryResume, staleTime: 1000 * 60 * 5 }),
          qc.prefetchQuery({ queryKey: ['profileCompletion'], queryFn: fetchProfileCompletion, staleTime: 1000 * 60 * 5 }),
        ]);
      }
    } catch {}
  };

  const handleTopButtonClick = () => {
    if (isDesktop) {
      // Desktop: collapse/expand sidebar
      toggleCollapsed();
    } else {
      // Mobile/Tablet: open/close slide-in menu
      toggleMenu();
    }
  };

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem('seeker_sidebar_collapsed', next ? '1' : '0');
      } catch {}
      return next;
    });
  };

  // Expose sidebar width via CSS var for responsive padding on pages
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const val = isDesktop ? (collapsed ? '4rem' : '16rem') : '0px';
      document.documentElement.style.setProperty('--seeker-sidebar-width', val);
    }
  }, [collapsed, isDesktop]);

  return (
    <>
      {/* Hamburger Menu Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleTopButtonClick}
        className="fixed left-4 z-50 top-4 lg:top-[calc(var(--header-height,4rem)+0.5rem)]"
        aria-label="Toggle menu"
        title={isDesktop ? (collapsed ? 'Expand sidebar' : 'Collapse sidebar') : (isOpen ? 'Close menu' : 'Open menu')}
      >
        {isDesktop
          ? (collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />)
          : (isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />)
        }
      </Button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar (Mobile/Tablet slide-in) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 lg:hidden"
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Menu</h2>
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors
                        ${isActive 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                      onClick={() => handleItemClick(item.id)}
                      onMouseEnter={() => prefetchFor(item.id)}
                      onFocus={() => prefetchFor(item.id)}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden md:inline">{item.label}</span>
                    </button>
                  );
                })}
                
                <hr className="my-4" />
                
                <button
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-red-600 hover:bg-red-50 transition-colors"
                  onClick={() => handleItemClick('logout')}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flow spacer to offset content on desktop */}
      <div
        aria-hidden
        className="hidden lg:block"
        style={{ width: collapsed ? '4rem' : '16rem', height: 0, transition: 'width 200ms ease' }}
      />

      {/* Persistent Desktop Sidebar (visible on lg and above) */}
      <div className="hidden lg:block">
        <div
          className={`fixed left-0 bg-white shadow-lg z-40 ${collapsed ? 'w-16' : 'w-64'}`}
          style={{
            transition: 'width 200ms ease',
            top: 'var(--header-height, 4rem)',
            height: 'calc(100vh - var(--header-height, 4rem))'
          }}
        >
          <div className={`p-4 ${collapsed ? 'px-2' : 'px-6'} pt-4 h-full flex flex-col`}> 
            <div className="mb-3">
              {!collapsed && <h2 className="text-lg font-semibold">Menu</h2>}
            </div>
            <nav className="space-y-1.5 mt-1 overflow-y-auto pr-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <button
                    key={item.id}
                    className={`
                      w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-md text-left transition-colors
                      ${isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                    title={collapsed ? item.label : undefined}
                    onClick={() => handleItemClick(item.id)}
                    onMouseEnter={() => prefetchFor(item.id)}
                    onFocus={() => prefetchFor(item.id)}
                  >
                    <Icon className="h-4 w-4" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}

              <hr className="my-4" />

              <button
                className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-md text-left text-red-600 hover:bg-red-50 transition-colors`}
                title={collapsed ? 'Logout' : undefined}
                onClick={() => handleItemClick('logout')}
              >
                <LogOut className="h-4 w-4" />
                {!collapsed && <span>Logout</span>}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}