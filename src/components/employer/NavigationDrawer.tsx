import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { 
  LayoutDashboard, 
  Plus, 
  FileText, 
  Building, 
  MessageSquare, 
  BarChart, 
  Settings, 
  LogOut,
  Briefcase,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Simple class name concatenation helper
const classNames = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  onNavigate: (view: string) => void;
  companyName: string;
  userEmail: string;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'post-job', label: 'Post Job', icon: Plus },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'job-management', label: 'Job Management', icon: Briefcase },
  { id: 'messaging', label: 'Messaging', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart },
  { id: 'company-profile', label: 'Company Profile', icon: Building },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function NavigationDrawer({ 
  isOpen, 
  onClose, 
  activeView, 
  onNavigate, 
  companyName,
  userEmail 
}: NavigationDrawerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="left" 
        className={classNames(
          "p-0 transition-all duration-300 ease-in-out overflow-hidden",
          isCollapsed ? "w-20" : "w-80"
        )}
      >
        <div className="relative h-full">
          {/* Collapse Toggle Button */}
          <button
            onClick={toggleCollapse}
            className="absolute -right-3 top-6 z-10 rounded-full border bg-background p-1 shadow-md hover:bg-accent"
            aria-label={isCollapsed ? "Expand menu" : "Collapse menu"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
          
          {/* Header */}
          <SheetHeader className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src="" alt="Company logo" />
                <AvatarFallback className="text-sm">
                  {isCollapsed 
                    ? companyName.split(' ').map(n => n[0]).join('').toUpperCase()
                    : companyName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <SheetTitle className="text-base truncate">{companyName}</SheetTitle>
                  <SheetDescription className="text-xs truncate">{userEmail}</SheetDescription>
                </div>
              )}
            </div>
          </SheetHeader>
          
          <Separator />
          
          {/* Navigation Items */}
          <nav className="p-2 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={classNames(
                    "w-full h-12 transition-all duration-200",
                    isCollapsed ? "justify-center px-0" : "justify-start gap-3 px-4"
                  )}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Button>
              );
            })}
          </nav>
          
          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <Separator className="mb-2" />
            <Button 
              variant="ghost" 
              className={classNames(
                "w-full h-12 text-destructive hover:text-destructive hover:bg-destructive/10",
                isCollapsed ? "justify-center px-0" : "justify-start gap-3 px-4"
              )}
              title={isCollapsed ? "Logout" : undefined}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}