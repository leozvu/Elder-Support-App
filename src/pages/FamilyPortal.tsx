import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Calendar,
  Clock,
  Pill,
  AlertTriangle,
  Heart,
  MessageSquare,
  Phone,
  Settings,
  User,
  Bell,
  Video,
  FileText,
  MapPin,
} from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface ElderlyUser {
  id: string;
  name: string;
  avatar: string;
  age: number;
  address: string;
  phone: string;
  emergencyContact: string;
  lastActive: string;
  status: "active" | "inactive" | "emergency";
}

const FamilyPortal = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<ElderlyUser | null>(null);
  const [notificationCount, setNotificationCount] = useState(3);

  // Sample data - in a real app, this would come from an API
  const elderlyUsers: ElderlyUser[] = [
    {
      id: "1",
      name: "Martha Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha",
      age: 78,
      address: "123 Maple Street, Anytown",
      phone: "(555) 123-4567",
      emergencyContact: "John Johnson (Son) - (555) 987-6543",
      lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      status: "active",
    },
    {
      id: "2",
      name: "Robert Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      age: 82,
      address: "456 Oak Avenue, Anytown",
      phone: "(555) 234-5678",
      emergencyContact: "Mary Smith (Daughter) - (555) 876-5432",
      lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      status: "inactive",
    },
    {
      id: "3",
      name: "Eleanor Davis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eleanor",
      age: 75,
      address: "789 Pine Road, Anytown",
      phone: "(555) 345-6789",
      emergencyContact: "James Davis (Son) - (555) 765-4321",
      lastActive: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      status: "active",
    },
  ];

  // Set the first user as selected by default
  React.useEffect(() => {
    if (elderlyUsers.length > 0 && !selectedUser) {
      setSelectedUser(elderlyUsers[0]);
    }
  }, [elderlyUsers, selectedUser]);

  const getTimeSince = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    }
  };

  const handleVideoCall = () => {
    alert("Video call feature would be initiated here");
  };

  const handleEmergencyAlert = () => {
    alert("Emergency alert would be sent to relevant services");
  };

  return (
    <Layout
      userName="John Johnson"
      userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
    >
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Family Portal</h1>
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button onClick={() => navigate("/caregiver-settings")}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with elderly users */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Family Members</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {elderlyUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 ${selectedUser?.id === user.id ? "bg-gray-50" : ""}`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.status === "active" ? "bg-green-500" : user.status === "emergency" ? "bg-red-500" : "bg-yellow-500"}`}
                        ></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-sm text-gray-500">
                          Last active: {getTimeSince(user.lastActive)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <Button variant="outline" className="w-full">
                    <User className="h-4 w-4 mr-2" />
                    Add Family Member
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleVideoCall}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Start Video Call
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    View Care Plan
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Check Location
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={handleEmergencyAlert}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Emergency Alert
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3">
            {selectedUser ? (
              <div className="space-y-6">
                {/* User profile card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={selectedUser.avatar}
                          alt={selectedUser.name}
                        />
                        <AvatarFallback>
                          {selectedUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div>
                            <h2 className="text-2xl font-bold">
                              {selectedUser.name}
                            </h2>
                            <p className="text-gray-500">
                              {selectedUser.age} years old
                            </p>
                          </div>
                          <Badge
                            className={`mt-2 md:mt-0 ${selectedUser.status === "active" ? "bg-green-100 text-green-800" : selectedUser.status === "emergency" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}
                          >
                            {selectedUser.status === "active"
                              ? "Active"
                              : selectedUser.status === "emergency"
                                ? "Emergency"
                                : "Inactive"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p>{selectedUser.address}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p>{selectedUser.phone}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-500">
                              Emergency Contact
                            </p>
                            <p>{selectedUser.emergencyContact}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          <Button size="sm" variant="outline">
                            <Video className="h-4 w-4 mr-2" />
                            Video Call
                          </Button>
                          <Button size="sm" variant="destructive">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Emergency
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tabs for different monitoring aspects */}
                <Tabs defaultValue="activity">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="activity">
                      <Activity className="h-4 w-4 mr-2" />
                      Activity
                    </TabsTrigger>
                    <TabsTrigger value="medications">
                      <Pill className="h-4 w-4 mr-2" />
                      Medications
                    </TabsTrigger>
                    <TabsTrigger value="services">
                      <Heart className="h-4 w-4 mr-2" />
                      Services
                    </TabsTrigger>
                    <TabsTrigger value="wellness">
                      <Calendar className="h-4 w-4 mr-2" />
                      Wellness
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="activity" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <Clock className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">App Login</p>
                              <p className="text-sm text-gray-500">
                                {getTimeSince(selectedUser.lastActive)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="bg-green-100 p-2 rounded-full">
                              <Heart className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">Service Completed</p>
                              <p className="text-sm text-gray-500">
                                2 hours ago
                              </p>
                              <p className="text-sm">
                                Shopping Assistance with Michael Chen
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="bg-purple-100 p-2 rounded-full">
                              <Pill className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">Medication Taken</p>
                              <p className="text-sm text-gray-500">
                                3 hours ago
                              </p>
                              <p className="text-sm">Lisinopril 10mg</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="bg-amber-100 p-2 rounded-full">
                              <Activity className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                Wellness Check Completed
                              </p>
                              <p className="text-sm text-gray-500">Yesterday</p>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                          View All Activity
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="medications" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Medication Schedule</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                            <div>
                              <p className="font-medium">Lisinopril 10mg</p>
                              <p className="text-sm text-gray-500">
                                For blood pressure
                              </p>
                              <div className="flex items-center mt-1">
                                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                <span className="text-sm">
                                  8:00 AM, 8:00 PM
                                </span>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              Taken
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                            <div>
                              <p className="font-medium">Metformin 500mg</p>
                              <p className="text-sm text-gray-500">
                                For diabetes
                              </p>
                              <div className="flex items-center mt-1">
                                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                <span className="text-sm">
                                  With breakfast and dinner
                                </span>
                              </div>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Due Soon
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                            <div>
                              <p className="font-medium">Vitamin D 1000 IU</p>
                              <p className="text-sm text-gray-500">
                                Daily supplement
                              </p>
                              <div className="flex items-center mt-1">
                                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                <span className="text-sm">Morning</span>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              Taken
                            </Badge>
                          </div>
                          <div className="flex justify-between mt-4">
                            <Button variant="outline">Add Medication</Button>
                            <Button variant="outline">
                              Medication History
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="services" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Services</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-3 bg-gray-50 rounded-lg border">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">
                                  Shopping Assistance
                                </p>
                                <p className="text-sm text-gray-500">
                                  Today, 1:00 PM - 2:30 PM
                                </p>
                              </div>
                              <Badge className="bg-green-100 text-green-800">
                                Completed
                              </Badge>
                            </div>
                            <div className="flex items-center mt-2">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" />
                                <AvatarFallback>MC</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">
                                Helper: Michael Chen
                              </span>
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg border">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">
                                  Medical Appointment
                                </p>
                                <p className="text-sm text-gray-500">
                                  Tomorrow, 10:00 AM - 12:00 PM
                                </p>
                              </div>
                              <Badge className="bg-blue-100 text-blue-800">
                                Scheduled
                              </Badge>
                            </div>
                            <div className="flex items-center mt-2">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" />
                                <AvatarFallback>SJ</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">
                                Helper: Sarah Johnson
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between mt-4">
                            <Button variant="outline">
                              Request New Service
                            </Button>
                            <Button variant="outline">
                              View Service History
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="wellness" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Wellness Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg border">
                              <p className="text-sm text-gray-500">
                                Blood Pressure
                              </p>
                              <p className="text-xl font-medium">128/82 mmHg</p>
                              <p className="text-sm text-gray-500">
                                Last checked: Yesterday
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border">
                              <p className="text-sm text-gray-500">
                                Heart Rate
                              </p>
                              <p className="text-xl font-medium">72 bpm</p>
                              <p className="text-sm text-gray-500">
                                Last checked: Yesterday
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border">
                              <p className="text-sm text-gray-500">
                                Blood Sugar
                              </p>
                              <p className="text-xl font-medium">110 mg/dL</p>
                              <p className="text-sm text-gray-500">
                                Last checked: This morning
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border">
                              <p className="text-sm text-gray-500">Weight</p>
                              <p className="text-xl font-medium">165 lbs</p>
                              <p className="text-sm text-gray-500">
                                Last checked: 3 days ago
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between mt-4">
                            <Button variant="outline">
                              Add Wellness Check
                            </Button>
                            <Button variant="outline">
                              View Health Records
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">
                    Select a family member to view their details
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

export default FamilyPortal;
