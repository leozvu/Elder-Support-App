import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertCircle, Users, MapPin, BarChart, Settings, 
  Search, FileText, CheckCircle, XCircle, Clock,
  Shield, Bell, Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/local-database";
import { Tables } from "@/types/supabase";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import DatabaseStatusDashboard from "@/components/database/DatabaseStatusDashboard";

type UserDetails = Tables<"users">;

const HubDashboard = () => {
  const { userDetails, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock data for pending verifications
  const pendingVerifications = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      role: "helper",
      verificationType: "Background Check",
      submittedDate: "2023-06-10",
      status: "pending"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      role: "helper",
      verificationType: "ID Verification",
      submittedDate: "2023-06-12",
      status: "pending"
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "michael.b@example.com",
      role: "helper",
      verificationType: "Financial Assistance Qualification",
      submittedDate: "2023-06-13",
      status: "pending"
    }
  ];
  
  // Mock data for service requests
  const serviceRequests = [
    {
      id: "1",
      customerName: "Martha Johnson",
      helperName: "John Smith",
      serviceType: "Grocery Shopping",
      date: "2023-06-15",
      time: "10:00 AM",
      status: "scheduled"
    },
    {
      id: "2",
      customerName: "Robert Smith",
      helperName: "Sarah Johnson",
      serviceType: "Medical Appointment",
      date: "2023-06-16",
      time: "2:30 PM",
      status: "scheduled"
    },
    {
      id: "3",
      customerName: "Dorothy Brown",
      helperName: null,
      serviceType: "Home Maintenance",
      date: "2023-06-18",
      time: "9:00 AM",
      status: "unassigned"
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

  const handleApproveVerification = (id: string) => {
    toast({
      title: "Verification Approved",
      description: "The verification has been approved successfully.",
      variant: "default",
    });
  };
  
  const handleRejectVerification = (id: string) => {
    toast({
      title: "Verification Rejected",
      description: "The verification has been rejected.",
      variant: "destructive",
    });
  };
  
  const handleAssignHelper = (requestId: string) => {
    toast({
      title: "Helper Assignment",
      description: "Opening helper assignment interface for this request.",
    });
    navigate(`/admin/assign-helper/${requestId}`);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "unassigned":
        return <Badge className="bg-yellow-100 text-yellow-800">Unassigned</Badge>;
      case "in_progress":
        return <Badge className="bg-purple-100 text-purple-800">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
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
          <h1 className="text-3xl font-bold">Welcome, {user?.full_name || "Admin"}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/profile")}>
              <Settings className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="verifications">Verifications</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-500">Total Users</h3>
                    <p className="text-3xl font-bold mt-2">124</p>
                    <div className="flex justify-center gap-4 mt-2">
                      <div className="text-sm">
                        <span className="font-medium">78</span> Customers
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">46</span> Helpers
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-500">Active Services</h3>
                    <p className="text-3xl font-bold mt-2">18</p>
                    <p className="text-sm text-green-600 mt-1">+3 from yesterday</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-500">Pending Verifications</h3>
                    <p className="text-3xl font-bold mt-2">7</p>
                    <Button 
                      variant="link" 
                      className="text-sm mt-1"
                      onClick={() => setActiveTab("verifications")}
                    >
                      View All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="bg-blue-100 text-blue-800 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">New user registered:</span> James Wilson
                        </p>
                        <p className="text-xs text-gray-500">10 minutes ago</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="bg-green-100 text-green-800 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Service completed:</span> Grocery Shopping for Martha Johnson
                        </p>
                        <p className="text-xs text-gray-500">1 hour ago</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="bg-yellow-100 text-yellow-800 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">New verification submitted:</span> Background Check for Michael Brown
                        </p>
                        <p className="text-xs text-gray-500">3 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="bg-purple-100 text-purple-800 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">New service request:</span> Home Maintenance from Dorothy Brown
                        </p>
                        <p className="text-xs text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Service Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] bg-gray-100 rounded-md flex items-center justify-center mb-4">
                    <p className="text-gray-500">Service Coverage Map</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-3">
                      <h3 className="font-medium">Top Areas</h3>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li className="flex justify-between">
                          <span>Downtown</span>
                          <span className="font-medium">32 services</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Westside</span>
                          <span className="font-medium">28 services</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Northpark</span>
                          <span className="font-medium">21 services</span>
                        </li>
                      </ul>
                    </div>
                    <div className="border rounded-md p-3">
                      <h3 className="font-medium">Underserved Areas</h3>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li className="flex justify-between">
                          <span>Eastside</span>
                          <span className="font-medium">5 services</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Southbay</span>
                          <span className="font-medium">3 services</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Hillcrest</span>
                          <span className="font-medium">2 services</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    User Management
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-[250px]"
                      />
                    </div>
                    <Button onClick={() => navigate("/admin/add-user")}>
                      Add User
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr className="hover:bg-muted/30">
                          <td className="px-4 py-3">Martha Johnson</td>
                          <td className="px-4 py-3">martha@example.com</td>
                          <td className="px-4 py-3">Customer</td>
                          <td className="px-4 py-3">
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate("/admin/user/1")}
                            >
                              View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate("/admin/user/1/edit")}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="px-4 py-3">John Smith</td>
                          <td className="px-4 py-3">helper@example.com</td>
                          <td className="px-4 py-3">Helper</td>
                          <td className="px-4 py-3">
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate("/admin/user/2")}
                            >
                              View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate("/admin/user/2/edit")}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="px-4 py-3">James Wilson</td>
                          <td className="px-4 py-3">james.w@example.com</td>
                          <td className="px-4 py-3">Customer</td>
                          <td className="px-4 py-3">
                            <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate("/admin/user/3")}
                            >
                              View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate("/admin/user/3/edit")}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Showing 3 of 124 users
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Service Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{request.serviceType}</h3>
                          <p className="text-gray-600">Customer: {request.customerName}</p>
                          {request.helperName ? (
                            <p className="text-gray-600">Helper: {request.helperName}</p>
                          ) : (
                            <p className="text-yellow-600">No helper assigned</p>
                          )}
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                      
                      <div className="mt-3 flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">{request.date}</span>
                        <Clock className="h-4 w-4 ml-3 mr-1" />
                        <span className="text-sm">{request.time}</span>
                      </div>
                      
                      <div className="mt-4 flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/admin/service/${request.id}`)}
                        >
                          View Details
                        </Button>
                        {!request.helperName && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleAssignHelper(request.id)}
                          >
                            Assign Helper
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => navigate("/admin/services")}>
                    View All Services
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="verifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Pending Verifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingVerifications.map((verification) => (
                    <div key={verification.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{verification.verificationType}</h3>
                          <p className="text-gray-600">{verification.name} ({verification.email})</p>
                          <p className="text-gray-500 text-sm">Role: {verification.role}</p>
                        </div>
                        {getStatusBadge(verification.status)}
                      </div>
                      
                      <div className="mt-3 flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">Submitted: {verification.submittedDate}</span>
                      </div>
                      
                      <div className="mt-4 flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/admin/verification/${verification.id}`)}
                        >
                          View Documents
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRejectVerification(verification.id)}
                        >
                          Reject
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleApproveVerification(verification.id)}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DatabaseStatusDashboard />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    System Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <h3 className="font-medium">Maintenance Mode</h3>
                        <p className="text-sm text-gray-500">Temporarily disable the application for maintenance</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <h3 className="font-medium">Database Backup</h3>
                        <p className="text-sm text-gray-500">Create a backup of the database</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Run Backup
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <h3 className="font-medium">System Diagnostics</h3>
                        <p className="text-sm text-gray-500">Runsystem diagnostics to check for issues</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate("/system-diagnostics")}
                      >
                        Run Diagnostics
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <h3 className="font-medium">Database Integration Test</h3>
                        <p className="text-sm text-gray-500">Test database connections and queries</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate("/database-integration-test")}
                      >
                        Run Tests
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button onClick={() => navigate("/admin/settings")}>
                      Advanced Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-primary" />
                    System Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">User Growth</h3>
                      <div className="h-[150px] bg-gray-100 rounded-md flex items-center justify-center">
                        <p className="text-gray-500">User Growth Chart</p>
                      </div>
                      <div className="mt-2 text-sm text-gray-500 flex justify-between">
                        <span>+12% this month</span>
                        <span>124 total users</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">Service Requests</h3>
                      <div className="h-[150px] bg-gray-100 rounded-md flex items-center justify-center">
                        <p className="text-gray-500">Service Requests Chart</p>
                      </div>
                      <div className="mt-2 text-sm text-gray-500 flex justify-between">
                        <span>+8% this month</span>
                        <span>87 total requests</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">System Performance</h3>
                      <div className="h-[150px] bg-gray-100 rounded-md flex items-center justify-center">
                        <p className="text-gray-500">Performance Chart</p>
                      </div>
                      <div className="mt-2 text-sm text-gray-500 flex justify-between">
                        <span>98.7% uptime</span>
                        <span>320ms avg response</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={() => navigate("/admin/analytics")}>
                      View Detailed Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default HubDashboard;