import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Calendar,
  Coffee,
  BookOpen,
  MapPin,
  Clock,
  Search,
  MessageSquare,
  UserPlus,
  Heart,
  Star,
  Check,
} from "lucide-react";

interface SocialConnectionHubProps {
  className?: string;
}

interface SocialEvent {
  id: string;
  title: string;
  type: "coffee" | "book" | "walking" | "game" | "other";
  description: string;
  date: Date;
  time: string;
  location: string;
  isVirtual: boolean;
  organizer: {
    id: string;
    name: string;
    avatar: string;
  };
  participants: number;
  maxParticipants?: number;
  isJoined: boolean;
}

interface SeniorConnection {
  id: string;
  name: string;
  avatar: string;
  interests: string[];
  location: string;
  distance: string;
  age: number;
  bio: string;
  isConnected: boolean;
}

const SocialConnectionHub = ({ className = "" }: SocialConnectionHubProps) => {
  const [activeTab, setActiveTab] = useState("events");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for demonstration
  const socialEvents: SocialEvent[] = [
    {
      id: "event-1",
      title: "Morning Coffee Chat",
      type: "coffee",
      description: "Join us for a casual morning coffee and conversation.",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
      time: "10:00 AM - 11:30 AM",
      location: "Community Center Cafe",
      isVirtual: false,
      organizer: {
        id: "user-1",
        name: "Sarah Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
      participants: 8,
      maxParticipants: 12,
      isJoined: true,
    },
    {
      id: "event-2",
      title: "Virtual Book Club",
      type: "book",
      description: "Discussing 'The Thursday Murder Club' by Richard Osman.",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
      time: "3:00 PM - 4:30 PM",
      location: "Zoom Meeting",
      isVirtual: true,
      organizer: {
        id: "user-2",
        name: "Robert Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      },
      participants: 15,
      maxParticipants: 20,
      isJoined: false,
    },
    {
      id: "event-3",
      title: "Walking Group",
      type: "walking",
      description: "Gentle walk in the park followed by refreshments.",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // Tomorrow
      time: "9:00 AM - 10:30 AM",
      location: "Sunshine Park (Main Entrance)",
      isVirtual: false,
      organizer: {
        id: "user-3",
        name: "Eleanor Davis",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eleanor",
      },
      participants: 6,
      maxParticipants: 10,
      isJoined: false,
    },
    {
      id: "event-4",
      title: "Board Game Afternoon",
      type: "game",
      description: "Playing classic board games and card games.",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
      time: "2:00 PM - 4:00 PM",
      location: "Community Center, Room 3",
      isVirtual: false,
      organizer: {
        id: "user-4",
        name: "James Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      },
      participants: 12,
      maxParticipants: 16,
      isJoined: true,
    },
  ];

  const seniorConnections: SeniorConnection[] = [
    {
      id: "senior-1",
      name: "Margaret Thompson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Margaret",
      interests: ["Reading", "Gardening", "Classical Music"],
      location: "Anytown",
      distance: "0.5 miles",
      age: 72,
      bio: "Retired librarian who loves mystery novels and tending to my garden.",
      isConnected: true,
    },
    {
      id: "senior-2",
      name: "Harold Jenkins",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harold",
      interests: ["Chess", "History", "Walking"],
      location: "Anytown",
      distance: "1.2 miles",
      age: 78,
      bio: "Former history teacher who enjoys a good game of chess and daily walks.",
      isConnected: false,
    },
    {
      id: "senior-3",
      name: "Dorothy Clark",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dorothy",
      interests: ["Cooking", "Knitting", "Movies"],
      location: "Anytown",
      distance: "0.8 miles",
      age: 70,
      bio: "I love trying new recipes and hosting small dinner parties for friends.",
      isConnected: false,
    },
    {
      id: "senior-4",
      name: "Walter Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Walter",
      interests: ["Photography", "Travel", "Jazz"],
      location: "Anytown",
      distance: "1.5 miles",
      age: 75,
      bio: "Retired photographer who still loves capturing beautiful moments and listening to jazz.",
      isConnected: true,
    },
  ];

  const getEventIcon = (type: SocialEvent["type"]) => {
    switch (type) {
      case "coffee":
        return <Coffee className="h-5 w-5 text-amber-500" />;
      case "book":
        return <BookOpen className="h-5 w-5 text-blue-500" />;
      case "walking":
        return <MapPin className="h-5 w-5 text-green-500" />;
      case "game":
        return <Users className="h-5 w-5 text-purple-500" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredEvents = socialEvents.filter(
    (event) =>
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredConnections = seniorConnections.filter(
    (connection) =>
      searchQuery === "" ||
      connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.interests.some((interest) =>
        interest.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      connection.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Social Connection Hub
          </CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events or people..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="events" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" /> Community Events
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex items-center">
              <Users className="h-4 w-4 mr-2" /> Connect with Seniors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-lg overflow-hidden flex flex-col bg-white"
                  >
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold flex items-center">
                            {getEventIcon(event.type)}
                            <span className="ml-2">{event.title}</span>
                          </h3>
                          <div className="flex items-center mt-1 text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              {event.date.toLocaleDateString(undefined, {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center mt-1 text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center mt-1 text-gray-500">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>
                              {event.location}
                              {event.isVirtual && (
                                <Badge className="ml-2 bg-blue-100 text-blue-800">
                                  Virtual
                                </Badge>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={event.organizer.avatar}
                              alt={event.organizer.name}
                            />
                            <AvatarFallback>
                              {event.organizer.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>

                      <p className="mt-3 text-gray-600">{event.description}</p>

                      <div className="mt-3 flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>
                          {event.participants} attending
                          {event.maxParticipants
                            ? ` (${event.maxParticipants - event.participants} spots left)`
                            : ""}
                        </span>
                      </div>

                      <div className="mt-auto pt-4 flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" /> Chat
                        </Button>
                        {event.isJoined ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center text-green-600 border-green-200 bg-green-50"
                          >
                            <Check className="h-4 w-4 mr-1" /> Joined
                          </Button>
                        ) : (
                          <Button size="sm" className="flex items-center">
                            <UserPlus className="h-4 w-4 mr-1" /> Join Event
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-gray-500 bg-white rounded-lg">
                  No events found matching your criteria
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <Button>
                <Calendar className="h-4 w-4 mr-2" /> View All Events
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="connections" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredConnections.length > 0 ? (
                filteredConnections.map((connection) => (
                  <div
                    key={connection.id}
                    className="border rounded-lg overflow-hidden flex flex-col bg-white"
                  >
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src={connection.avatar}
                            alt={connection.name}
                          />
                          <AvatarFallback>
                            {connection.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">
                            {connection.name}
                          </h3>
                          <div className="flex items-center mt-1 text-gray-500">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>
                              {connection.location} ({connection.distance})
                            </span>
                          </div>
                          <div className="flex items-center mt-1 text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{connection.age} years old</span>
                          </div>
                        </div>
                      </div>

                      <p className="mt-3 text-gray-600">{connection.bio}</p>

                      <div className="mt-3">
                        <h4 className="text-sm font-medium flex items-center">
                          <Heart className="h-4 w-4 mr-1 text-red-500" />
                          Interests
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {connection.interests.map((interest, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-blue-50"
                            >
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-auto pt-4 flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" /> Message
                        </Button>
                        {connection.isConnected ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center text-green-600 border-green-200 bg-green-50"
                          >
                            <Check className="h-4 w-4 mr-1" /> Connected
                          </Button>
                        ) : (
                          <Button size="sm" className="flex items-center">
                            <UserPlus className="h-4 w-4 mr-1" /> Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-gray-500 bg-white rounded-lg">
                  No connections found matching your criteria
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <Button>
                <Users className="h-4 w-4 mr-2" /> Find More Connections
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SocialConnectionHub;
