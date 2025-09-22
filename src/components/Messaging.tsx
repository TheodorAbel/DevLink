import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  MessageSquare,
  Send,
  Paperclip,
  Search,
  Phone,
  Video,
  MoreVertical,
  Circle,
  CheckCheck,
  Check,
  File,
  Image as ImageIcon,
  ArrowLeft
} from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner';

interface MessagingProps {
  onBack?: () => void;
}

// Mock conversations data
const conversations = [
  {
    id: '1',
    participant: {
      name: 'TechCorp HR Team',
      role: 'Human Resources',
      company: 'TechCorp',
      avatar: 'TC',
      online: true
    },
    lastMessage: {
      content: 'Thank you for your application! We\'d like to schedule an interview.',
      timestamp: '2024-01-22 14:30',
      isRead: false,
      sender: 'them'
    },
    unreadCount: 2,
    jobTitle: 'Senior Frontend Developer'
  },
  {
    id: '2',
    participant: {
      name: 'Sarah Johnson',
      role: 'Talent Acquisition',
      company: 'DesignStudio',
      avatar: 'SJ',
      online: false
    },
    lastMessage: {
      content: 'We\'ve reviewed your portfolio and would love to discuss the UX Designer position.',
      timestamp: '2024-01-21 16:45',
      isRead: true,
      sender: 'them'
    },
    unreadCount: 0,
    jobTitle: 'UX Designer'
  },
  {
    id: '3',
    participant: {
      name: 'Mike Chen',
      role: 'Engineering Manager',
      company: 'StartupXYZ',
      avatar: 'MC',
      online: true
    },
    lastMessage: {
      content: 'Looking forward to our call tomorrow!',
      timestamp: '2024-01-20 10:15',
      isRead: true,
      sender: 'you'
    },
    unreadCount: 0,
    jobTitle: 'Product Manager'
  }
];

// Mock messages for selected conversation
const mockMessages = [
  {
    id: '1',
    content: 'Hello! Thank you for applying to the Senior Frontend Developer position at TechCorp.',
    timestamp: '2024-01-22 09:00',
    sender: 'them',
    status: 'delivered'
  },
  {
    id: '2',
    content: 'We\'ve reviewed your application and we\'re impressed with your experience.',
    timestamp: '2024-01-22 09:01',
    sender: 'them',
    status: 'delivered'
  },
  {
    id: '3',
    content: 'Thank you for reaching out! I\'m very excited about this opportunity.',
    timestamp: '2024-01-22 10:30',
    sender: 'you',
    status: 'read'
  },
  {
    id: '4',
    content: 'Could you please share your portfolio link? We\'d love to see some of your recent work.',
    timestamp: '2024-01-22 11:15',
    sender: 'them',
    status: 'delivered'
  },
  {
    id: '5',
    content: 'Of course! Here\'s my portfolio: https://sarahjohnson.dev',
    timestamp: '2024-01-22 11:20',
    sender: 'you',
    status: 'read'
  },
  {
    id: '6',
    content: 'I\'ve also attached my latest project case study.',
    timestamp: '2024-01-22 11:21',
    sender: 'you',
    status: 'read',
    attachment: {
      type: 'file',
      name: 'Project_Case_Study.pdf',
      size: '2.4 MB'
    }
  },
  {
    id: '7',
    content: 'Thank you for your application! We\'d like to schedule an interview for next week. Are you available on Wednesday afternoon?',
    timestamp: '2024-01-22 14:30',
    sender: 'them',
    status: 'delivered'
  }
];

export function Messaging({ onBack }: MessagingProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: 'you',
      status: 'sending'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate message being delivered
    setTimeout(() => {
      setMessages(prev => 
        prev.map(m => 
          m.id === message.id 
            ? { ...m, status: 'delivered' }
            : m
        )
      );
    }, 1000);

    toast.success('Message sent');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const message = {
        id: Date.now().toString(),
        content: `Sent ${file.name}`,
        timestamp: new Date().toISOString(),
        sender: 'you',
        status: 'delivered',
        attachment: {
          type: file.type.startsWith('image/') ? 'image' : 'file',
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
        }
      };

      setMessages(prev => [...prev, message]);
      toast.success('File attached and sent');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participant.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getMessageStatus = (status: string) => {
    switch (status) {
      case 'sending':
        return <Circle className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const ConversationsList = () => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages
          </CardTitle>
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-1 p-4 pt-0">
            {filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedConversation === conversation.id
                    ? 'bg-blue-50 border-blue-200 border'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600">
                        {conversation.participant.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.participant.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium truncate">{conversation.participant.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-blue-500 text-white px-2 py-0.5 text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-blue-600 mb-1">{conversation.jobTitle}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage.sender === 'you' && 'You: '}
                      {conversation.lastMessage.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  const ChatArea = () => {
    if (!currentConversation) {
      return (
        <Card className="h-full flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
            <p className="text-muted-foreground">Choose a conversation to start messaging</p>
          </div>
        </Card>
      );
    }

    return (
      <Card className="h-full flex flex-col">
        {/* Chat Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600">
                    {currentConversation.participant.avatar}
                  </AvatarFallback>
                </Avatar>
                {currentConversation.participant.online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div>
                <h3 className="font-medium">{currentConversation.participant.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentConversation.participant.role} at {currentConversation.participant.company}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Block User</DropdownMenuItem>
                  <DropdownMenuItem>Report</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <Separator />

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {messages.map((message, index) => {
                const isOwn = message.sender === 'you';
                const showAvatar = index === 0 || messages[index - 1].sender !== message.sender;
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 ${showAvatar ? '' : 'invisible'}`}>
                      {!isOwn && showAvatar && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                            {currentConversation.participant.avatar}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    
                    <div className={`flex-1 max-w-[80%] ${isOwn ? 'text-right' : ''}`}>
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          isOwn
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        
                        {message.attachment && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`mt-2 p-2 rounded border ${
                              isOwn ? 'border-blue-400 bg-blue-400/20' : 'border-gray-300 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {message.attachment.type === 'image' ? (
                                <ImageIcon className="h-4 w-4" />
                              ) : (
                                <File className="h-4 w-4" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">
                                  {message.attachment.name}
                                </p>
                                <p className="text-xs opacity-70">
                                  {message.attachment.size}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                      
                      <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                        isOwn ? 'justify-end' : ''
                      }`}>
                        <span>{formatTime(message.timestamp)}</span>
                        {isOwn && getMessageStatus(message.status)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex items-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFileAttachment}
              className="mb-2"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <div className="flex-1">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="resize-none"
              />
            </div>
            
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="mb-2"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx"
        />
      </Card>
    );
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground variant="gradient" />
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Messages
          </h1>
          <p className="text-muted-foreground mt-2">
            Communicate with employers and recruiters
          </p>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="h-[calc(100vh-180px)]"
        >
          {isMobile ? (
            // Mobile Layout
            <div className="h-full">
              {selectedConversation ? (
                <ChatArea />
              ) : (
                <ConversationsList />
              )}
            </div>
          ) : (
            // Desktop Layout
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              <div className="lg:col-span-1">
                <ConversationsList />
              </div>
              <div className="lg:col-span-2">
                <ChatArea />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}