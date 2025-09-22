import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import { 
  Search, 
  Send, 
  Paperclip, 
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Clock,
  Check,
  CheckCheck,
  MessageSquare
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Conversation {
  id: string;
  candidateName: string;
  candidateAvatar?: string;
  candidateTitle: string;
  jobTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderType: 'employer' | 'candidate';
  content: string;
  timestamp: string;
  readStatus: 'sent' | 'delivered' | 'read';
  type: 'text' | 'template' | 'attachment';
  templateType?: 'interview' | 'acceptance' | 'rejection';
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    candidateName: 'Alex Johnson',
    candidateTitle: 'Senior React Developer',
    jobTitle: 'Senior Frontend Developer',
    lastMessage: 'Thank you for the interview invitation! I can confirm my availability for Wednesday at 2 PM.',
    lastMessageTime: '2 hours ago',
    unreadCount: 2,
    isOnline: true
  },
  {
    id: '2',
    candidateName: 'Sarah Chen',
    candidateTitle: 'Full Stack Engineer',
    jobTitle: 'Senior Frontend Developer',
    lastMessage: 'I have a question about the technical requirements mentioned in the job description.',
    lastMessageTime: '1 day ago',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '3',
    candidateName: 'Michael Brown',
    candidateTitle: 'Product Strategy Lead',
    jobTitle: 'Product Manager',
    lastMessage: 'Looking forward to our interview tomorrow!',
    lastMessageTime: '2 days ago',
    unreadCount: 1,
    isOnline: true
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'candidate_1',
    senderType: 'candidate',
    content: 'Hi! Thank you for considering my application for the Senior Frontend Developer position. I\'m excited about the opportunity to work with your team.',
    timestamp: '2024-01-10T10:00:00Z',
    readStatus: 'read',
    type: 'text'
  },
  {
    id: '2',
    senderId: 'employer_1',
    senderType: 'employer',
    content: 'Hi Alex! Thank you for your interest in the position. We were impressed by your background and would like to schedule an interview. Are you available this Wednesday at 2 PM PST?',
    timestamp: '2024-01-10T14:00:00Z',
    readStatus: 'read',
    type: 'text'
  },
  {
    id: '3',
    senderId: 'candidate_1',
    senderType: 'candidate',
    content: 'Thank you for the interview invitation! I can confirm my availability for Wednesday at 2 PM. Should I prepare anything specific for the interview?',
    timestamp: '2024-01-10T16:30:00Z',
    readStatus: 'delivered',
    type: 'text'
  }
];

const messageTemplates = [
  {
    id: 'interview',
    title: 'Interview Invitation',
    content: 'Hi [CandidateName], we\'d like to invite you for an interview for the [JobTitle] position. Are you available on [Date] at [Time]?'
  },
  {
    id: 'follow_up',
    title: 'Follow Up',
    content: 'Hi [CandidateName], just following up on your application for [JobTitle]. We\'d love to learn more about your experience.'
  },
  {
    id: 'rejection',
    title: 'Application Update',
    content: 'Hi [CandidateName], thank you for your interest in [JobTitle]. While we won\'t be moving forward with your application, we appreciate your time.'
  }
];

export function MessagingInterface() {
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const selectedConv = mockConversations.find(c => c.id === selectedConversation);
  
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    // In real app, send message via API
    console.log('Sending message:', messageInput);
    setMessageInput('');
  };

  const handleTemplateSelect = (template: typeof messageTemplates[0]) => {
    setMessageInput(template.content);
    setShowTemplates(false);
  };

  const getReadStatusIcon = (status: Message['readStatus']) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
    }
  };

  const filteredConversations = mockConversations.filter(conv =>
    conv.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Conversations List */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedConversation === conversation.id 
                    ? 'bg-accent' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.candidateAvatar} alt={conversation.candidateName} />
                      <AvatarFallback>
                        {conversation.candidateName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium truncate">{conversation.candidateName}</h4>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">{conversation.lastMessageTime}</span>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="h-5 w-5 text-xs p-0 flex items-center justify-center">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate mb-1">
                      {conversation.candidateTitle}
                    </p>
                    
                    <p className="text-xs text-muted-foreground truncate mb-2">
                      Applied for: {conversation.jobTitle}
                    </p>
                    
                    <p className="text-sm line-clamp-2">{conversation.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Message Thread */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConv.candidateAvatar} alt={selectedConv.candidateName} />
                    <AvatarFallback>
                      {selectedConv.candidateName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConv.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium">{selectedConv.candidateName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedConv.isOnline ? 'Online' : 'Last seen 2 hours ago'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Application</DropdownMenuItem>
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Mark as Unread</DropdownMenuItem>
                    <DropdownMenuItem>Archive Conversation</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {mockMessages.map((message) => {
                  const isFromEmployer = message.senderType === 'employer';
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isFromEmployer ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md ${isFromEmployer ? 'order-2' : 'order-1'}`}>
                        {!isFromEmployer && (
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={selectedConv.candidateAvatar} alt={selectedConv.candidateName} />
                              <AvatarFallback className="text-xs">
                                {selectedConv.candidateName.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">{selectedConv.candidateName}</span>
                          </div>
                        )}
                        
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            isFromEmployer
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          
                          {message.templateType && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              {message.templateType} template
                            </Badge>
                          )}
                        </div>
                        
                        <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                          isFromEmployer ? 'justify-end' : 'justify-start'
                        }`}>
                          <Clock className="h-3 w-3" />
                          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isFromEmployer && getReadStatusIcon(message.readStatus)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              {showTemplates && (
                <Card className="mb-4">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Quick Templates</span>
                      <Button variant="ghost" size="sm" onClick={() => setShowTemplates(false)}>
                        Close
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid gap-2">
                      {messageTemplates.map((template) => (
                        <Button
                          key={template.id}
                          variant="outline"
                          className="justify-start h-auto p-3 text-left"
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <div>
                            <div className="font-medium text-sm">{template.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {template.content}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Textarea
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    rows={3}
                    className="resize-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowTemplates(!showTemplates)}
                      >
                        Templates
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}