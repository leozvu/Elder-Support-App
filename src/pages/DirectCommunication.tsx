import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import ChatInterface from "@/components/communication/ChatInterface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, Phone, Clock, Star } from "lucide-react";
import { useVoiceGuidance } from "@/hooks/useVoiceGuidance";
import { useNavigate } from "react-router-dom";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  type: "helper" | "hub" | "elderly" | "caregiver";
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  status?: "online" | "offline" | "away";
  rating?: number;
}

const DirectCommunication = () => {
  const [activeTab, setActiveTab] = useState("messages");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { speak } = useVoiceGuidance();
  const navigate = useNavigate();

  // Mock contacts data
  const contacts: Contact[] = [
    {
      id: "helper-1",
      name: "John Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      type: "helper",
      lastMessage: "I'll be there in 10 minutes.",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      unreadCount: 2,
      status: "online",
      rating: 4.8,
    },
    {
      id: "hub-1",
      name: "Sunshine Community Hub",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hub",
      type: "hub",
      lastMessage: "Your request has been received and assigned.",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      unreadCount: 0,
      status: "online",
    },
    {
      id: "helper-2",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      type: "helper",
      lastMessage: "The groceries have been delivered to your doorstep.",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      unreadCount: 0,
      status: "offline",
      rating: 4.9,
    },
    {
      id: "caregiver-1",
      name: "Michael Brown",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      type: "caregiver",
      lastMessage: "I've updated your medication schedule.",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      unreadCount: 1,
      status: "away",
    },
  ];

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    speak(`Opening chat with ${contact.name}`, true);
  };

  const handleSendMessage = (message: string) => {
    console.log(`Sending message to ${selectedContact?.name}: ${message}`);
    // In a real app, this would send the message to the backend
  };

  const handleCallInitiate = () => {
    speak(`Initiating call with ${selectedContact?.name}`, true);
    // In a real app, this would initiate a call
  };

  const formatTime = (date?: Date) => {
    if (!date) return "";

    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 1000 * 60 * 60 * 24) {
      // Less than 24 hours, show time
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diff < 1000 * 60 * 60 * 24 * 7) {
      // Less than a week, show day name
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      // More than a week, show date
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Messages & Communication</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contacts and Messages List */}
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Contacts</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/emergency-contacts")}
                  >
                    Manage
                  </Button>
                </div>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search contacts..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="messages"
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                    <TabsTrigger value="calls">Calls</TabsTrigger>
                  </TabsList>
                  <TabsContent value="messages" className="mt-4">
                    <div className="space-y-2">
                      {filteredContacts.length > 0 ? (
                        filteredContacts.map((contact) => (
                          <div
                            key={contact.id}
                            className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-gray-100 ${selectedContact?.id === contact.id ? "bg-gray-100" : ""}`}
                            onClick={() => handleContactSelect(contact)}
                          >
                            <div className="relative">
                              <Avatar>
                                <AvatarImage
                                  src={contact.avatar}
                                  alt={contact.name}
                                />
                                <AvatarFallback>
                                  {contact.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span
                                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}
                              ></span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium truncate">
                                  {contact.name}
                                </h3>
                                <span className="text-xs text-gray-500">
                                  {formatTime(contact.lastMessageTime)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-500 truncate">
                                  {contact.lastMessage}
                                </p>
                                {contact.unreadCount ? (
                                  <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {contact.unreadCount}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No contacts found
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="calls" className="mt-4">
                    <div className="space-y-2">
                      {filteredContacts.slice(0, 2).map((contact) => (
                        <div
                          key={`call-${contact.id}`}
                          className="p-3 rounded-lg flex items-center gap-3 hover:bg-gray-100"
                        >
                          <Avatar>
                            <AvatarImage
                              src={contact.avatar}
                              alt={contact.name}
                            />
                            <AvatarFallback>
                              {contact.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium">{contact.name}</h3>
                              <span className="text-xs text-gray-500">
                                {formatTime(
                                  new Date(
                                    Date.now() -
                                      1000 * 60 * 60 * Math.random() * 24,
                                  ),
                                )}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="h-3 w-3 mr-1" />
                              {Math.random() > 0.5
                                ? "Incoming"
                                : "Outgoing"}{" "}
                              call
                              {Math.random() > 0.7 ? " (Missed)" : ""}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCallInitiate()}
                          >
                            <Phone className="h-5 w-5" />
                          </Button>
                        </div>
                      ))}
                      <div className="text-center py-4 text-gray-500">
                        No more call history
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="md:col-span-2">
            {selectedContact ? (
              <ChatInterface
                recipientId={selectedContact.id}
                recipientName={selectedContact.name}
                recipientAvatar={selectedContact.avatar}
                recipientType={selectedContact.type}
                onSendMessage={handleSendMessage}
                onCallInitiate={handleCallInitiate}
              />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    Select a contact to start messaging
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    You can communicate with your helpers, caregivers, and
                    community hubs directly through this messaging system.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DirectCommunication;
