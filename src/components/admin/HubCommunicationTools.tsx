import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Filter,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  Plus,
  Search,
  Send,
  Settings,
  Users,
  AlertTriangle,
  Info,
  Megaphone,
} from "lucide-react";

interface HubCommunicationToolsProps {
  hubId?: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "general" | "policy" | "emergency" | "event";
  audience: "all" | "elderly" | "helpers";
  date: string;
  status: "draft" | "scheduled" | "sent";
  scheduledDate?: string;
  readCount?: number;
  totalRecipients?: number;
}

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    role: "admin" | "helper" | "elderly";
  };
  recipient: {
    id: string;
    name: string;
    avatar?: string;
    role: "admin" | "helper" | "elderly";
  };
  content: string;
  date: string;
  read: boolean;
  urgent?: boolean;
}

const HubCommunicationTools: React.FC<HubCommunicationToolsProps> = ({
  hubId,
}) => {
  const [activeTab, setActiveTab] = useState("announcements");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  // Mock data for demonstration
  const announcements: Announcement[] = [
    {
      id: "ann-1",
      title: "New Helper Verification Process",
      content:
        "We've updated our helper verification process to include additional background checks. This change will take effect starting June 1, 2023.",
      type: "policy",
      audience: "helpers",
      date: "2023-05-15",
      status: "sent",
      readCount: 42,
      totalRecipients: 56,
    },
    {
      id: "ann-2",
      title: "Community Wellness Workshop",
      content:
        "Join us for a free wellness workshop at the community center on Saturday, June 10, from 10 AM to 12 PM. Learn about healthy aging, nutrition, and exercise.",
      type: "event",
      audience: "all",
      date: "2023-05-20",
      status: "scheduled",
      scheduledDate: "2023-05-25",
    },
    {
      id: "ann-3",
      title: "Service Interruption Notice",
      content:
        "Due to scheduled system maintenance, the platform will be unavailable on Sunday, May 28, from 2 AM to 4 AM. We apologize for any inconvenience.",
      type: "general",
      audience: "all",
      date: "2023-05-22",
      status: "draft",
    },
  ];

  const messages: Message[] = [
    {
      id: "msg-1",
      sender: {
        id: "admin-1",
        name: "Hub Admin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
        role: "admin",
      },
      recipient: {
        id: "helper-1",
        name: "Sarah Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        role: "helper",
      },
      content:
        "Hi Sarah, could you please confirm your availability for the training session next Tuesday at 3 PM?",
      date: "2023-05-15T14:30:00",
      read: true,
    },
    {
      id: "msg-2",
      sender: {
        id: "elderly-1",
        name: "Martha Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha",
        role: "elderly",
      },
      recipient: {
        id: "admin-1",
        name: "Hub Admin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
        role: "admin",
      },
      content:
        "I'm having trouble scheduling a service for next week. Can someone help me with this?",
      date: "2023-05-16T09:15:00",
      read: false,
      urgent: true,
    },
    {
      id: "msg-3",
      sender: {
        id: "helper-2",
        name: "Michael Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        role: "helper",
      },
      recipient: {
        id: "admin-1",
        name: "Hub Admin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
        role: "admin",
      },
      content:
        "I've completed the CPR certification course. Where should I upload the certificate?",
      date: "2023-05-16T11:45:00",
      read: false,
    },
  ];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const getAnnouncementTypeBadge = (type: Announcement["type"]) => {
    switch (type) {
      case "general":
        return <Badge className="bg-blue-100 text-blue-800">General</Badge>;
      case "policy":
        return <Badge className="bg-purple-100 text-purple-800">Policy</Badge>;
      case "emergency":
        return <Badge className="bg-red-100 text-red-800">Emergency</Badge>;
      case "event":
        return <Badge className="bg-green-100 text-green-800">Event</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getAnnouncementStatusBadge = (status: Announcement["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Scheduled
          </Badge>
        );
      case "sent":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Sent
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getAnnouncementAudienceBadge = (audience: Announcement["audience"]) => {
    switch (audience) {
      case "all":
        return <Badge variant="secondary">All Users</Badge>;
      case "elderly":
        return <Badge variant="secondary">Elderly Users</Badge>;
      case "helpers":
        return <Badge variant="secondary">Helpers</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleCreateAnnouncement = () => {
    // In a real app, this would save the new announcement
    setShowCreateAnnouncement(false);
  };

  const handleSendMessage = () => {
    // In a real app, this would send the message
    setShowSendMessage(false);
  };

  const handleViewAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Hub Communication Tools</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSendMessage(true)}>
            <MessageCircle className="mr-2 h-4 w-4" /> Send Message
          </Button>
          <Button onClick={() => setShowCreateAnnouncement(true)}>
            <Megaphone className="mr-2 h-4 w-4" /> Create Announcement
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unread Messages</p>
                <p className="text-3xl font-bold">
                  {messages.filter((m) => !m.read).length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Recent Announcements</p>
                <p className="text-3xl font-bold">{announcements.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Megaphone className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Urgent Matters</p>
                <p className="text-3xl font-bold">
                  {messages.filter((m) => m.urgent).length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="announcements"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="announcements" className="text-lg py-3">
            <Megaphone className="mr-2 h-5 w-5" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="messages" className="text-lg py-3">
            <MessageSquare className="mr-2 h-5 w-5" />
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search announcements..."
                  className="pl-10 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getAnnouncementTypeBadge(announcement.type)}
                        {getAnnouncementStatusBadge(announcement.status)}
                        {getAnnouncementAudienceBadge(announcement.audience)}
                      </div>
                      <h3 className="text-lg font-semibold">
                        {announcement.title}
                      </h3>
                      <p className="text-gray-600 mt-2 line-clamp-2">
                        {announcement.content}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {announcement.status === "scheduled"
                              ? `Scheduled for ${formatDate(announcement.scheduledDate || "")}`
                              : announcement.status === "sent"
                                ? `Sent on ${formatDate(announcement.date)}`
                                : `Created on ${formatDate(announcement.date)}`}
                          </span>
                        </div>
                        {announcement.status === "sent" && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>
                              {announcement.readCount} of{" "}
                              {announcement.totalRecipients} read
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleViewAnnouncement(announcement)}
                      >
                        View Details
                      </Button>
                      {announcement.status === "draft" && (
                        <Button>
                          <Send className="mr-2 h-4 w-4" /> Send
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search messages..."
                  className="pl-10 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {messages.map((message) => (
              <Card
                key={message.id}
                className={message.read ? "" : "border-blue-500"}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={message.sender.avatar}
                          alt={message.sender.name}
                        />
                        <AvatarFallback>
                          {message.sender.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {message.sender.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className={
                              message.sender.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : message.sender.role === "helper"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                            }
                          >
                            {message.sender.role === "admin"
                              ? "Admin"
                              : message.sender.role === "helper"
                                ? "Helper"
                                : "Senior"}
                          </Badge>
                          {message.urgent && (
                            <Badge className="bg-red-100 text-red-800">
                              Urgent
                            </Badge>
                          )}
                          {!message.read && (
                            <Badge className="bg-blue-100 text-blue-800">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mt-2">{message.content}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{formatDateTime(message.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Button variant="outline">
                        <MessageCircle className="mr-2 h-4 w-4" /> Reply
                      </Button>
                      {!message.read && (
                        <Button variant="secondary">
                          <CheckCircle className="mr-2 h-4 w-4" /> Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Announcement Dialog */}
      <Dialog
        open={showCreateAnnouncement}
        onOpenChange={setShowCreateAnnouncement}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Title</Label>
              <Input
                id="title"
                placeholder="Enter announcement title"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Content</Label>
              <Textarea
                id="content"
                placeholder="Enter announcement content"
                className="col-span-3"
                rows={5}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Type</Label>
              <Select defaultValue="general">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select announcement type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="policy">Policy Update</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Audience</Label>
              <Select defaultValue="all">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="elderly">Elderly Users</SelectItem>
                  <SelectItem value="helpers">Helpers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Delivery</Label>
              <Select defaultValue="now">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select delivery option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="now">Send Immediately</SelectItem>
                  <SelectItem value="schedule">Schedule for Later</SelectItem>
                  <SelectItem value="draft">Save as Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Notification</Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox id="push" defaultChecked />
                <label
                  htmlFor="push"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Send Push Notification
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCreateAnnouncement(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateAnnouncement}>
              Create Announcement
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Message Dialog */}
      <Dialog open={showSendMessage} onOpenChange={setShowSendMessage}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Recipient</Label>
              <Select defaultValue="individual">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select recipient type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual User</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Select User</Label>
              <Select defaultValue="sarah">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah">Sarah Johnson (Helper)</SelectItem>
                  <SelectItem value="michael">Michael Chen (Helper)</SelectItem>
                  <SelectItem value="martha">Martha Wilson (Senior)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here"
                className="col-span-3"
                rows={5}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Priority</Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox id="urgent" />
                <label
                  htmlFor="urgent"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mark as Urgent
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowSendMessage(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage}>Send Message</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Announcement Dialog */}
      {selectedAnnouncement && (
        <Dialog
          open={!!selectedAnnouncement}
          onOpenChange={() => setSelectedAnnouncement(null)}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedAnnouncement.title}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center gap-2 mb-4">
                {getAnnouncementTypeBadge(selectedAnnouncement.type)}
                {getAnnouncementStatusBadge(selectedAnnouncement.status)}
                {getAnnouncementAudienceBadge(selectedAnnouncement.audience)}
              </div>
              <p className="text-gray-600 mb-4">
                {selectedAnnouncement.content}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {selectedAnnouncement.status === "scheduled"
                      ? `Scheduled for ${formatDate(selectedAnnouncement.scheduledDate || "")}`
                      : selectedAnnouncement.status === "sent"
                        ? `Sent on ${formatDate(selectedAnnouncement.date)}`
                        : `Created on ${formatDate(selectedAnnouncement.date)}`}
                  </span>
                </div>
                {selectedAnnouncement.status === "sent" && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {selectedAnnouncement.readCount} of{" "}
                      {selectedAnnouncement.totalRecipients} read
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedAnnouncement(null)}
              >
                Close
              </Button>
              {selectedAnnouncement.status === "draft" && (
                <Button>
                  <Send className="mr-2 h-4 w-4" /> Send
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default HubCommunicationTools;
