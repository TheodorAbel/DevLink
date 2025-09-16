import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Menu, Bell, MessageSquare } from "lucide-react";
import { Badge } from "./ui/badge";

interface MobileHeaderProps {
  onMenuClick: () => void;
  companyName: string;
  notificationCount?: number;
  messageCount?: number;
}

export function MobileHeader({ 
  onMenuClick, 
  companyName,
  notificationCount = 0,
  messageCount = 0 
}: MobileHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-border sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="h-10 w-10"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-medium">{companyName}</h1>
          <p className="text-sm text-muted-foreground">Employer Dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative h-10 w-10">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
            >
              {notificationCount > 9 ? '9+' : notificationCount}
            </Badge>
          )}
        </Button>
        
        <Button variant="ghost" size="icon" className="relative h-10 w-10">
          <MessageSquare className="h-5 w-5" />
          {messageCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
            >
              {messageCount > 9 ? '9+' : messageCount}
            </Badge>
          )}
        </Button>

        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt="Company logo" />
          <AvatarFallback>{companyName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}