import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertCircle, Calendar, Clock, Users, MapPin, 
  CheckCircle, Settings, Star, FileText, Briefcase, 
  DollarSign, Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/local-database";
import { Tables } from "@/types/supabase";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

type UserDetails = Tables<"users"> & {
  helperProfile?: Tables<"helper_profiles">;
};

const HelperDashboard = () => {
  const { userDetails, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [activeTab, setActiveTab] = useState("assignments");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock data for assignments
  const assignments = [
    {
      id: "1",
      customerName: "Martha Johnson",
      serviceType: "Grocery Shopping",
      date: "2023-06-15",
      time: "10:00 AM",
      status: "scheduled",
      address: "123 Elder Street, Careville"
    },
    {
      id: "2",
      customerName: "Robert Smith",
      serviceType: "Medical Appointment",
      date: "2023-06-16",
      time: "2:30 PM",
      status: "scheduled",
      address: "456 Senior Avenue, Careville"
    },
    {
      id: "3",
      customerName: "Martha Johnson",
      serviceType: "Home Maintenance",
      date: "2023-06-14",
      time: "11:00 AM",
      status: "completed",
      address: "123 Elder Street, Careville"
    }
  ];
  
  useEffect(() => {
    async function loadUserData() {
      try {
        setIsLoading(true);
        // Try to get user details from auth context first
        if (userDetails) {
          setUser(userDetails);
          return;
        }
        
        // Fall back to database if auth context doesn't have details
        const userData = await db.getUserDetails();
        setUser(userData);
      } catch (error) {
        console.error("Error loading user data:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [userDetails]);
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const handleAcceptAssignment = (id: string) => {
    toast({
      title: "Assignment Accepted",
      description: "You have accepted this assignment.",
      variant: "default",
    });
  };
  
  const handleRejectAssignment = (id: string) => {
    toast({
      title: "Assignment Rejected",
      description: "You have rejected this assignment.",
      variant: "destructive",
    });
  };
  
  const handleViewDetails = (id: string) => {
    navigate(`/assignment/${id}`);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">An error occurred while loading the dashboard:</p>
              <div className="bg-red-50 p-3 rounded-md mb-4">
                <p className="text-red-700">{error.message}</p>
              </div>
              <Button onClick={() => window.location.reload()}>Refresh Page</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Welcome, {user?.full_name || "Helper"}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/profile")}>
              <Settings className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assignments">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Upcoming Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {assignments.filter(a => a.status === "scheduled").length > 0 ? (
                    <div className="space-y-4">
                      {assignments.filter(a => a.status === "scheduled").map((assignment) => (
                        <div key={assignment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{assignment.serviceType}</h3>
                              <p className="text-gray-600">Customer: {assignment.customerName}</p>
                              <div className="flex items-center text-gray-500 mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="text-sm">{assignment.address}</span>
                              </div>
                            </div>
                            {getStatusBadge(assignment.status)}
                          </div>
                          
                          <div className="mt-3 flex items-center text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="text-sm">{assignment.date}</span>
                            <Clock className="h-4 w-4 ml-3 mr-1" />
                            <span className="text-sm">{assignment.time}</span>
                          </div>
                          
                          <div className="mt-4 flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(assignment.id)}
                            >
                              View Details
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => navigate(`/service-tracking/${assignment.id}`)}
                            >
                              Start Service
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No upcoming assignments</p>
                      <Button variant="outline" className="mt-4" onClick={() => setActiveTab("schedule")}>
                        View Schedule
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    New Assignment Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">Home Maintenance</h3>
                          <p className="text-gray-600">Customer: James Wilson</p>
                          <div className="flex items-center text-gray-500 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">789 Assistance Road, Careville</span>
                          </div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      </div>
                      
                      <div className="mt-3 flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">2023-06-18</span>
                        <Clock className="h-4 w-4 ml-3 mr-1" />
                        <span className="text-sm">9:00 AM</span>
                      </div>
                      
                      <div className="mt-4 flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRejectAssignment("new1")}
                        >
                          Decline
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleAcceptAssignment("new1")}
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">Technology Assistance</h3>
                          <p className="text-gray-600">Customer: Dorothy Brown</p>
                          <div className="flex items-center text-gray-500 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">567 Tech Lane, Careville</span>
                          </div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      </div>
                      
                      <div className="mt-3 flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">2023-06-19</span>
                        <Clock className="h-4 w-4 ml-3 mr-1" />
                        <span className="text-sm">2:00 PM</span>
                      </div>
                      
                      <div className="mt-4 flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRejectAssignment("new2")}
                        >
                          Decline
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleAcceptAssignment("new2")}
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Weekly Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-4">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="border rounded-md p-2">
                      <h3 className="font-medium text-center border-b pb-1 mb-2">{day}</h3>
                      <div className="min-h-[100px] text-center">
                        {day === "Wed" && (
                          <div className="bg-blue-50 p-2 rounded text-xs mb-1">
                            <p className="font-medium">10:00 AM</p>
                            <p>Grocery Shopping</p>
                          </div>
                        )}
                        {day === "Thu" && (
                          <div className="bg-blue-50 p-2 rounded text-xs">
                            <p className="font-medium">2:30 PM</p>
                            <p>Medical Appointment</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => navigate("/helper-schedule")}>
                    Manage Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Your Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                        <img 
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Martha" 
                          alt="Martha Johnson" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Martha Johnson</h3>
                        <p className="text-gray-600">123 Elder Street, Careville</p>
                        <div className="flex items-center mt-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm ml-2 text-gray-600">5.0 (12 services)</span>
                        </div>
                      </div>
                      <div className="ml-auto">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate("/customer/1")}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                        <img 
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Robert" 
                          alt="Robert Smith" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Robert Smith</h3>
                        <p className="text-gray-600">456 Senior Avenue, Careville</p>
                        <div className="flex items-center mt-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-gray-300" />
                          <span className="text-sm ml-2 text-gray-600">4.0 (8 services)</span>
                        </div>
                      </div>
                      <div className="ml-auto">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate("/customer/2")}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="earnings">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-500">This Week</h3>
                    <p className="text-3xl font-bold mt-2">$245.00</p>
                    <p className="text-sm text-green-600 mt-1">+$45.00 from last week</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-500">This Month</h3>
                    <p className="text-3xl font-bold mt-2">$980.00</p>
                    <p className="text-sm text-green-600 mt-1">+$120.00 from last month</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-500">Total Earnings</h3>
                    <p className="text-3xl font-bold mt-2">$4,250.00</p>
                    <p className="text-sm text-gray-500 mt-1">Since joining</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Earnings History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Grocery Shopping</h3>
                        <p className="text-gray-600">Martha Johnson</p>
                        <p className="text-sm text-gray-500">June 14, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">$35.00</p>
                        <Badge className="bg-green-100 text-green-800 mt-1">Paid</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Home Maintenance</h3>
                        <p className="text-gray-600">Robert Smith</p>
                        <p className="text-sm text-gray-500">June 12, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">$75.00</p>
                        <Badge className="bg-green-100 text-green-800 mt-1">Paid</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Medical Appointment</h3>
                        <p className="text-gray-600">Martha Johnson</p>
                        <p className="text-sm text-gray-500">June 10, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">$50.00</p>
                        <Badge className="bg-green-100 text-green-800 mt-1">Paid</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button variant="outline" onClick={() => navigate("/earnings-history")}>
                    View Full History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default HelperDashboard;