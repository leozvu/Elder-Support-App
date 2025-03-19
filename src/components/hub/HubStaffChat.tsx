import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  Users,
  Bell,
  Search,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isUrgent?: boolean;
}

interface StaffMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: "online" | "offline" | "away" | "busy";
  lastActive?: Date;
}

interface HubStaffChatProps {
  hubId?: string;
  currentUserId?: string;
}

// Mock data - in a real app, this would come from an API
const mockStaffMembers: StaffMember[] = [
  {
    id: "staff-1",
    name: "John Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    role: "Hub Manager",
    status: "online",
  },
  {
    id: "staff-2",
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    role: "Coordinator",
    status: "online",
  },
  {
    id: "staff-3",
    name: "Michael Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    role: "Helper Supervisor",
    status: "away",
    lastActive: new Date(Date.now() - 30 * 60000), // 30 minutes ago
  },
  {
    id: "staff-4",
    name: "Emily Davis",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    role: "Verification Specialist",
    status: "offline",
    lastActive: new Date(Date.now() - 120 * 60000), // 2 hours ago
  },
  {
    id: "staff-5",
    name: "Robert Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    role: "Emergency Response",
    status: "busy",
  },
];

const mockMessages: Message[] = [
  {
    id: "msg-1",
    senderId: "staff-1",
    senderName: "John Smith",
    senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    content: "Good morning team! Let's review our priorities for today.",
    timestamp: new Date(Date.now() - 120 * 60000), // 2 hours ago
    isRead: true,
  },
  {
    id: "msg-2",
    senderId: "staff-2",
    senderName: "Sarah Johnson",
    senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content:
      "We have 5 new service requests that need to be assigned to helpers.",
    timestamp: new Date(Date.now() - 115 * 60000),
    isRead: true,
  },
  {
    id: "msg-3",
    senderId: "staff-3",
    senderName: "Michael Chen",
    senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    content:
      "I'll take care of the assignments. We have 8 helpers available today.",
    timestamp: new Date(Date.now() - 110 * 60000),
    isRead: true,
  },
  {
    id: "msg-4",
    senderId: "staff-5",
    senderName: "Robert Wilson",
    senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    content:
      "Alert: We have an emergency request from Mrs. Thompson. She needs immediate assistance with a medical situation.",
    timestamp: new Date(Date.now() - 30 * 60000),
    isRead: false,
    isUrgent: true,
  },
  {
    id: "msg-5",
    senderId: "staff-1",
    senderName: "John Smith",
    senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    content:
      "Robert, please coordinate with the nearest helper and contact emergency services if needed. Keep us updated.",
    timestamp: new Date(Date.now() - 25 * 60000),
    isRead: false,
  },
];

const HubStaffChat: React.FC<HubStaffChatProps> = ({
  hubId,
  currentUserId = "staff-1",
}) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [staffMembers, setStaffMembers] =
    useState<StaffMember[]>(mockStaffMembers);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const currentUser = staffMembers.find(
      (staff) => staff.id === currentUserId,
    );
    if (!currentUser) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content: newMessage,
      timestamp: new Date(),
      isRead: false,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const getStatusColor = (status: StaffMember["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "busy":
        return "bg-red-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: StaffMember["status"]) => {
    switch (status) {
      case "online":
        return "Online";
      case "away":
        return "Away";
      case "busy":
        return "Busy";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString();
  };

  const filteredStaffMembers = staffMembers.filter((staff) =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>Hub Staff Communication</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs
          defaultValue="chat"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat" className="text-lg py-3">
              <Send className="h-4 w-4 mr-2" />
              Team Chat
            </TabsTrigger>
            <TabsTrigger value="staff" className="text-lg py-3">
              <Users className="h-4 w-4 mr-2" />
              Staff Directory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="m-0">
            <div className="flex flex-col h-[500px]">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex max-w-[80%] ${message.senderId === currentUserId ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <Avatar className="h-10 w-10 mt-1">
                          <AvatarImage
                            src={message.senderAvatar}
                            alt={message.senderName}
                          />
                          <AvatarFallback>
                            {message.senderName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`mx-2 ${message.senderId === currentUserId ? "text-right" : "text-left"}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`font-medium ${message.senderId === currentUserId ? "order-2" : "order-1"}`}
                            >
                              {message.senderName}
                            </span>
                            <span
                              className={`text-xs text-gray-500 ${message.senderId === currentUserId ? "order-1" : "order-2"}`}
                            >
                              {formatTime(message.timestamp)}
                            </span>
                            {message.isUrgent && (
                              <Badge
                                variant="outline"
                                className="bg-red-100 text-red-800 text-xs"
                              >
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <div
                            className={`p-3 rounded-lg ${message.senderId === currentUserId ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                          >
                            {message.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={newMessage.trim() === ""}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="staff" className="m-0">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search staff members..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <ScrollArea className="h-[440px]">
              <div className="p-4 space-y-4">
                {filteredStaffMembers.map((staff) => (
                  <div
                    key={staff.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={staff.avatar} alt={staff.name} />
                          <AvatarFallback>
                            {staff.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${getStatusColor(staff.status)} ring-2 ring-white`}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{staff.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {staff.role}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {getStatusText(staff.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8"
                      >
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HubStaffChat;
