import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  Pill,
  Plus,
  Search,
  User,
} from "lucide-react";
import SeniorDetailView from "./SeniorDetailView";

interface CaregiverPortalProps {
  userId?: string;
}

const CaregiverPortal = ({
  userId = "demo-caregiver-1",
}: CaregiverPortalProps) => {
  const [selectedSenior, setSelectedSenior] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - in a real app, this would come from the database
  const caregiverData = {
    id: userId,
    name: "John Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    seniors: [
      {
        id: "senior-1",
        name: "Martha Johnson",
        relation: "Mother",
        age: 78,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha",
        status: "active",
        lastActive: "10 minutes ago",
        alerts: 2,
      },
      {
        id: "senior-2",
        name: "Robert Johnson",
        relation: "Father",
        age: 82,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
        status: "away",
        lastActive: "3 hours ago",
        alerts: 0,
      },
      {
        id: "senior-3",
        name: "Elizabeth Smith",
        relation: "Aunt",
        age: 75,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elizabeth",
        status: "needs-attention",
        lastActive: "Yesterday",
        alerts: 3,
      },
    ],
    recentNotifications: [
      {
        id: "notif1",
        message: "Martha missed her evening medication",
        time: "2 hours ago",
        read: false,
      },
      {
        id: "notif2",
        message: "Elizabeth's blood pressure reading is high",
        time: "Yesterday",
        read: false,
      },
      {
        id: "notif3",
        message: "Robert's transportation service is confirmed",
        time: "Yesterday",
        read: true,
      },
      {
        id: "notif4",
        message: "Martha completed her wellness check",
        time: "2 days ago",
        read: true,
      },
    ],
    upcomingEvents: [
      {
        id: "event1",
        title: "Doctor's Appointment",
        senior: "Martha Johnson",
        date: "Tomorrow, 10:00 AM",
      },
      {
        id: "event2",
        title: "Medication Refill",
        senior: "Robert Johnson",
        date: "Friday, 2:00 PM",
      },
      {
        id: "event3",
        title: "Physical Therapy",
        senior: "Elizabeth Smith",
        date: "Next Monday, 11:30 AM",
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "needs-attention":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredSeniors = caregiverData.seniors.filter((senior) =>
    senior.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectSenior = (seniorId: string) => {
    setSelectedSenior(seniorId);
  };

  const handleBackToList = () => {
    setSelectedSenior(null);
  };

  if (selectedSenior) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={handleBackToList} className="mb-4">
          ← Back to Family Members
        </Button>
        <SeniorDetailView seniorId={selectedSenior} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Caregiver Portal</h1>
          <p className="text-gray-500">
            Monitor and support your family members
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
            {caregiverData.recentNotifications.filter((n) => !n.read).length >
              0 && (
              <Badge className="ml-1">
                {
                  caregiverData.recentNotifications.filter((n) => !n.read)
                    .length
                }
              </Badge>
            )}
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Family Member</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="family">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="family">Family Members</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        {/* Family Members Tab */}
        <TabsContent value="family" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search family members..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSeniors.map((senior) => (
              <Card
                key={senior.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${senior.status === "needs-attention" ? "border-red-300" : ""}`}
                onClick={() => handleSelectSenior(senior.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary">
                      <AvatarImage src={senior.avatar} alt={senior.name} />
                      <AvatarFallback>{senior.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{senior.name}</h3>
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${getStatusColor(senior.status)}`}
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        {senior.relation}, {senior.age}
                      </p>
                      <div className="flex items-center gap-1 text-gray-500 mt-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-xs">{senior.lastActive}</span>
                      </div>
                    </div>
                    {senior.alerts > 0 && (
                      <Badge variant="destructive">{senior.alerts}</Badge>
                    )}
                  </div>
                  <div className="mt-3 flex justify-between">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex items-center gap-1 text-xs"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Contact
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex items-center gap-1 text-xs"
                    >
                      <Heart className="h-3.5 w-3.5" />
                      Wellness
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex items-center gap-1 text-xs"
                    >
                      <Pill className="h-3.5 w-3.5" />
                      Meds
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                Stay updated on your family members' activities and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {caregiverData.recentNotifications.length > 0 ? (
                  caregiverData.recentNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border rounded-md ${!notification.read ? "bg-blue-50 border-blue-200" : ""}`}
                    >
                      <div className="flex justify-between">
                        <p
                          className={`font-medium ${!notification.read ? "text-blue-800" : ""}`}
                        >
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <Badge variant="outline">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No notifications at this time
                  </p>
                )}
              </div>
              <div className="mt-4 flex justify-center">
                <Button variant="outline">View All Notifications</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Schedule and manage appointments for your family members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {caregiverData.upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 border rounded-md"
                  >
                    <div className="bg-blue-100 p-2 rounded-md text-blue-700">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="flex items-center gap-1 text-gray-500 mt-1">
                        <User className="h-3.5 w-3.5" />
                        <span className="text-sm">{event.senior}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 mt-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <Button className="w-full">Schedule New Event</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaregiverPortal;
