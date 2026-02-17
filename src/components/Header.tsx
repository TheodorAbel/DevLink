'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bell, User, Briefcase, Bookmark, Clock, ArrowRight, Settings } from 'lucide-react';
import { mockNotifications, getRelativeTime } from '@/data/mockNotifications';
import { supabase } from '@/lib/supabaseClient';

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unreadCount = mockNotifications.filter(n => n.status === 'unread').length;
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load authenticated user's name and email
  useEffect(() => {
    let isMounted = true;

    const applyFromAuth = (u: { email?: string; user_metadata?: { name?: string } } | null) => {
      if (!isMounted) return;
      const email = u?.email ?? null;
      const metaName = u?.user_metadata?.name as string | undefined;
      const fallbackName = email ? email.split('@')[0] : null;
      setUserEmail(email);
      setUserName(metaName || fallbackName);
    };

    const hydrateFromProfile = async (uid: string) => {
      try {
        const { data: profile } = await supabase
          .from('users')
          .select('name, email')
          .eq('id', uid)
          .single();
        if (!isMounted) return;
        if (profile) {
          if (profile.email) setUserEmail(profile.email);
          if (profile.name) setUserName(profile.name);
        }
      } catch {}
    };

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        applyFromAuth(user);
        hydrateFromProfile(user.id);
      }
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const u = session?.user ?? null;
        applyFromAuth(u);
        if (u?.id) hydrateFromProfile(u.id);
      });
      return () => subscription?.unsubscribe();
    };

    const cleanupPromise = init();
    return () => {
      isMounted = false;
      // Ensure subscription cleanup
      cleanupPromise.then((cleanup) => {
        try { cleanup?.(); } catch {}
      });
    };
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              JobMarket
            </span>
          </Link>

          {/* Navigation - Removed as requested since they're in dashboard */}

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                }}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                    {unreadCount}
                  </Badge>
                )}
              </Button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <Link 
                        href="/seeker?page=notifications" 
                        onClick={() => setShowNotifications(false)}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        View All <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {mockNotifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                          notification.status === 'unread' ? 'bg-blue-50/50' : ''
                        }`}
                        onClick={() => {
                          if (notification.actionUrl) {
                            window.open(notification.actionUrl, '_blank');
                          }
                          setShowNotifications(false);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <Bell className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {notification.title}
                              {notification.status === 'unread' && (
                                <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block" />
                              )}
                            </p>
                            <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {getRelativeTime(notification.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <Link 
                        href="/seeker?page=notifications"
                        onClick={() => setShowNotifications(false)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View All Notifications
                      </Link>
                      <Link 
                        href="/seeker?page=settings&tab=notifications"
                        onClick={() => setShowNotifications(false)}
                      >
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-xs"
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Settings
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <Button variant="ghost" onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium">{userName ?? '...'}</span>
              </Button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{userName ?? '...'}</p>
                    <p className="text-xs text-gray-600">{userEmail ?? ''}</p>
                  </div>
                  <Link href="/notifications" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Bell className="h-4 w-4 mr-3" />
                    Notifications
                  </Link>
                  <Link href="/saved-jobs" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Bookmark className="h-4 w-4 mr-3" />
                    Saved Jobs
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
