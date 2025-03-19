import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  User,
  Star,
  Bell,
  Filter,
  Search,
  Sliders,
  Wallet,
  MessageSquare,
  Phone,
  AlertTriangle,
  Navigation,
  LogIn,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import QuickAccessPanel from "@/components/dashboard/QuickAccessPanel";
import { useToast } from "@/components/ui/use-toast";
import ChatInterface from "@/components/communication/ChatInterface";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ServiceRequest {
  id: string;
  type: string;
  clientName: string;
  clientAvatar: string;
  date: string;
  time: string;
  location: string;
  distance: string;
  status: "pending" | "accepted" | "completed" | "cancelled";
  details: string;
  priority?: "normal" | "high" | "urgent";
}

const HelperDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("available");
  const [availabilityStatus, setAvailabilityStatus] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount, setNotificationCount] = useState(2);
  const [showEmergencyChat, setShowEmergencyChat] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [safetyAlertTimeout, setSafetyAlertTimeout] =
    useState<NodeJS.Timeout | null>(null);

  // Sample data - in a real app, this would come from an API
  const availableRequests: ServiceRequest[] = [
    {
      id: "REQ-1001",
      type: "Shopping Assistance",
      clientName: "Martha Johnson",
      clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha",
      date: "Today",
      time: "2:00 PM - 3:30 PM",
      location: "123 Maple Street, Anytown",
      distance: "0.8 miles away",
      status: "pending",
      details:
        "Need help with grocery shopping at Whole Foods. List will be provided.",
      priority: "normal",
    },
    {
      id: "REQ-1002",
      type: "Medical Appointment",
      clientName: "Robert Smith",
      clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      date: "Tomorrow",
      time: "10:00 AM - 12:00 PM",
      location: "456 Oak Avenue, Anytown",
      distance: "1.2 miles away",
      status: "pending",
      details: "Accompaniment to doctor's appointment at City Medical Center.",
      priority: "high",
    },
    {
      id: "REQ-1003",
      type: "Companionship",
      clientName: "Eleanor Davis",
      clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eleanor",
      date: "Friday, May 20",
      time: "3:00 PM - 5:00 PM",
      location: "789 Pine Road, Anytown",
      distance: "1.5 miles away",
      status: "pending",
      details:
        "Looking for someone to play chess with and have a conversation.",
      priority: "normal",
    },
  ];

  const upcomingRequests: ServiceRequest[] = [
    {
      id: "REQ-1004",
      type: "Shopping Assistance",
      clientName: "Dorothy Wilson",
      clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dorothy",
      date: "Tomorrow",
      time: "1:00 PM - 2:30 PM",
      location: "234 Elm Street, Anytown",
      distance: "0.5 miles away",
      status: "accepted",
      details:
        "Weekly grocery shopping at Safeway. Client has mobility issues.",
      priority: "normal",
    },
    {
      id: "REQ-1005",
      type: "Home Assistance",
      clientName: "George Brown",
      clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=George",
      date: "Friday, May 20",
      time: "10:00 AM - 11:30 AM",
      location: "567 Birch Lane, Anytown",
      distance: "1.8 miles away",
      status: "accepted",
      details: "Help with organizing kitchen cabinets and light cleaning.",
      priority: "normal",
    },
  ];

  const completedRequests: ServiceRequest[] = [
    {
      id: "REQ-1006",
      type: "Medical Appointment",
      clientName: "Martha Johnson",
      clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha",
      date: "May 15, 2023",
      time: "9:00 AM - 11:00 AM",
      location: "123 Maple Street, Anytown",
      distance: "0.8 miles away",
      status: "completed",
      details: "Accompanied to regular checkup at Dr. Smith's office.",
      priority: "normal",
    },
    {
      id: "REQ-1007",
      type: "Shopping Assistance",
      clientName: "Robert Smith",
      clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      date: "May 10, 2023",
      time: "2:00 PM - 3:30 PM",
      location: "456 Oak Avenue, Anytown",
      distance: "1.2 miles away",
      status: "completed",
      details: "Grocery shopping at local market. Client was very satisfied.",
      priority: "normal",
    },
  ];

  const handleAcceptRequest = (requestId: string) => {
    console.log(`Accepted request: ${requestId}`);
    // In a real app, this would update the request status in the database
  };

  const handleDeclineRequest = (requestId: string) => {
    console.log(`Declined request: ${requestId}`);
    // In a real app, this would remove the request from the available list
  };

  const handleAvailabilityToggle = () => {
    setAvailabilityStatus(!availabilityStatus);
    // In a real app, this would update the helper's availability status in the database
  };

  const handleNavigate = (location: string) => {
    console.log(`Navigating to: ${location}`);
    // In a real app, this would open a map with navigation to the location
  };

  const handleContactClient = (clientName: string) => {
    console.log(`Contacting client: ${clientName}`);
    // In a real app, this would open a chat or call interface
  };

  const handleEmergencyChat = () => {
    setShowEmergencyChat(true);
  };

  const handleCheckIn = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setCheckInTime(timeString);
    toast({
      title: "Check-in Successful",
      description: `You've checked in at ${timeString}. Remember to check out when you complete the service.`,
    });
  };

  const handleCheckOut = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setCheckOutTime(timeString);
    toast({
      title: "Check-out Successful",
      description: `You've checked out at ${timeString}. Thank you for completing the service safely.`,
    });

    // Clear any safety alert timeouts
    if (safetyAlertTimeout) {
      clearTimeout(safetyAlertTimeout);
      setSafetyAlertTimeout(null);
    }
  };

  // Set up safety alert if checked in but not checked out after a certain time
  useEffect(() => {
    if (checkInTime && !checkOutTime) {
      // Set a timeout for 2 hours (in a real app, this would be based on the expected service duration)
      const timeout = setTimeout(
        () => {
          toast({
            title: "Safety Alert",
            description:
              "You haven't checked out from your current service. Are you okay? Please check out or contact support.",
            variant: "destructive",
          });
        },
        2 * 60 * 60 * 1000,
      ); // 2 hours

      setSafetyAlertTimeout(timeout);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [checkInTime, checkOutTime]);

  const getPriorityBadge = (priority: ServiceRequest["priority"]) => {
    if (!priority || priority === "normal") return null;

    return priority === "high" ? (
      <Badge
        variant="outline"
        className="ml-2 border-orange-500 text-orange-700"
      >
        High Priority
      </Badge>
    ) : (
      <Badge variant="outline" className="ml-2 border-red-500 text-red-700">
        Urgent
      </Badge>
    );
  };

  const renderRequestCard = (
    request: ServiceRequest,
    showActions: boolean = false,
  ) => (
    <Card key={request.id} className="mb-4 overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 bg-primary/5 border-b">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h3 className="text-xl font-semibold">{request.type}</h3>
                {getPriorityBadge(request.priority)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {request.date}, {request.time}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{request.distance}</span>
              </div>
            </div>
            <Badge
              variant={request.status === "completed" ? "outline" : "default"}
              className={`${request.status === "pending" ? "bg-yellow-100 text-yellow-800" : request.status === "accepted" ? "bg-green-100 text-green-800" : request.status === "completed" ? "bg-gray-100 text-gray-800" : "bg-red-100 text-red-800"}`}
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar>
              <AvatarImage
                src={request.clientAvatar}
                alt={request.clientName}
              />
              <AvatarFallback>{request.clientName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{request.clientName}</div>
              <div className="text-sm text-gray-500">{request.location}</div>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{request.details}</p>

          {showActions && (
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => handleAcceptRequest(request.id)}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Accept
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleDeclineRequest(request.id)}
              >
                <XCircle className="mr-2 h-4 w-4" /> Decline
              </Button>
            </div>
          )}

          {request.status === "accepted" && (
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => handleNavigate(request.location)}
              >
                <Navigation className="mr-2 h-4 w-4" /> Navigate
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleContactClient(request.clientName)}
              >
                <MessageSquare className="mr-2 h-4 w-4" /> Contact Client
              </Button>
            </div>
          )}

          {/* Safety Check-in/Check-out for Helpers */}
          {request.status === "accepted" && (
            <div className="flex gap-2 mt-2">
              <Button
                className={`flex-1 ${checkInTime ? "bg-green-600 hover:bg-green-700" : ""}`}
                onClick={handleCheckIn}
                disabled={checkInTime !== null}
              >
                <LogIn className="mr-2 h-4 w-4" />{" "}
                {checkInTime ? `Checked In at ${checkInTime}` : "Check In"}
              </Button>
              <Button
                className={`flex-1 ${checkOutTime ? "bg-green-600 hover:bg-green-700" : ""}`}
                onClick={handleCheckOut}
                disabled={!checkInTime || checkOutTime !== null}
              >
                <LogOut className="mr-2 h-4 w-4" />{" "}
                {checkOutTime ? `Checked Out at ${checkOutTime}` : "Check Out"}
              </Button>
            </div>
          )}

          {request.status === "completed" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2">Client Rating:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < 5 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout
      userName="Sarah Johnson"
      userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    >
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">Helper Dashboard</h1>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
              <Switch
                id="availability"
                checked={availabilityStatus}
                onCheckedChange={handleAvailabilityToggle}
              />
              <Label htmlFor="availability" className="font-medium">
                {availabilityStatus ? "Available" : "Unavailable"}
              </Label>
            </div>
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
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" /> Set Schedule
            </Button>
            <Button variant="outline">
              <Wallet className="mr-2 h-4 w-4" /> Earnings
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Available Requests</p>
                  <p className="text-3xl font-bold">
                    {availableRequests.length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Upcoming Services</p>
                  <p className="text-3xl font-bold">
                    {upcomingRequests.length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="text-3xl font-bold">4.8</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Star className="h-6 w-6 text-blue-600 fill-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Earnings</p>
                  <p className="text-3xl font-bold">$420</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Wallet className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Panel */}
        <div className="mb-6">
          <QuickAccessPanel role="helper" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Tabs
              defaultValue="available"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="available" className="text-lg py-3">
                  Available
                  <Badge className="ml-2 bg-primary/10 text-primary">
                    {availableRequests.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="text-lg py-3">
                  Upcoming
                  <Badge className="ml-2 bg-primary/10 text-primary">
                    {upcomingRequests.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-lg py-3">
                  Completed
                </TabsTrigger>
              </TabsList>

              <TabsContent value="available" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">
                    Available Service Requests
                  </h2>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search requests..."
                        className="pl-10 w-[200px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Filter requests</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Sliders className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Adjust preferences</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <div className="space-y-4">
                  {availableRequests.map((request) =>
                    renderRequestCard(request, true),
                  )}
                </div>
              </TabsContent>

              <TabsContent value="upcoming" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Upcoming Services</h2>
                </div>
                <div className="space-y-4">
                  {upcomingRequests.map((request) =>
                    renderRequestCard(request),
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Completed Services</h2>
                </div>
                <div className="space-y-4">
                  {completedRequests.map((request) =>
                    renderRequestCard(request),
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Helper Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-4">
                  <Avatar className="h-20 w-20 mb-2">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">Sarah Johnson</h3>
                  <p className="text-gray-500">Helper ID: H-12345</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 4 ? "text-yellow-500 fill-yellow-500" : i < 5 ? "text-yellow-500 fill-yellow-500 opacity-50" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="ml-1 text-sm font-medium">
                      4.8 (42 reviews)
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Completed Services
                    </span>
                    <span className="font-semibold">128</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">This Month</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Response Rate</span>
                    <span className="font-semibold">95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Avg. Response Time
                    </span>
                    <span className="font-semibold">12 min</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Service Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Downtown</Badge>
                    <Badge variant="outline">Westside</Badge>
                    <Badge variant="outline">Northpark</Badge>
                    <Badge variant="outline">+2 more</Badge>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Medical Appointments</Badge>
                    <Badge variant="outline">Shopping</Badge>
                    <Badge variant="outline">Companionship</Badge>
                  </div>
                </div>

                <Button className="w-full mt-4">
                  <User className="mr-2 h-4 w-4" /> View Full Profile
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="font-medium">Shopping Assistance</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>1:00 PM - 2:30 PM</span>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>234 Elm Street</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="font-medium">Medical Appointment</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>4:00 PM - 5:30 PM</span>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>City Medical Center</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Calendar className="mr-2 h-4 w-4" /> View Full Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Emergency Chat Dialog */}
      <Dialog open={showEmergencyChat} onOpenChange={setShowEmergencyChat}>
        <DialogContent className="sm:max-w-[500px] p-0">
          <ChatInterface
            recipientId="hub-1"
            recipientName="Emergency Support Hub"
            recipientAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Hub"
            recipientType="hub"
            initialMessages={[
              {
                id: `emergency-${Date.now()}`,
                senderId: "hub-1",
                receiverId: "current-user-id",
                content:
                  "This is an emergency chat line. How can we help you? If this is a life-threatening emergency, please call 911 immediately.",
                timestamp: new Date(),
                read: true,
                type: "system",
              },
            ]}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default HelperDashboard;
