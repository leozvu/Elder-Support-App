import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import HubPerformanceMetrics from "@/components/hub/HubPerformanceMetrics";
import HubStaffChat from "@/components/hub/HubStaffChat";
import {
  Search,
  Filter,
  UserCheck,
  UserX,
  Clock,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Activity,
  BarChart3,
  Building,
  Settings,
  Briefcase,
  GraduationCap,
  Heart,
  Award,
  MessageSquare,
} from "lucide-react";

interface ServiceRequest {
  id: string;
  type: string;
  clientName: string;
  clientAvatar: string;
  helperName?: string;
  helperAvatar?: string;
  date: string;
  time: string;
  location: string;
  status: "pending" | "assigned" | "in-progress" | "completed" | "cancelled";
  priority: "normal" | "high" | "urgent";
}

interface VerificationRequest {
  id: string;
  name: string;
  avatar: string;
  type: "helper" | "elderly";
  submittedDate: string;
  documents: string[];
  status: "pending" | "approved" | "rejected";
}

const HubDashboard = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Sample data - in a real app, this would come from an API
  const serviceRequests: ServiceRequest[] = [
    {
      id: "REQ-1001",
      type: "Shopping Assistance",
      clientName: "Martha Johnson",
      clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha",
      date: "Today",
      time: "2:00 PM - 3:30 PM",
      location: "123 Maple Street, Anytown",
      status: "pending",
      priority: "normal",
    },
    {
      id: "REQ-1002",
      type: "Medical Appointment",
      clientName: "Robert Smith",
      clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      helperName: "Sarah Johnson",
      helperAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      date: "Tomorrow",
      time: "10:00 AM - 12:00 PM",
      location: "456 Oak Avenue, Anytown",
      status: "assigned",
      priority: "high",
    },
    {
      id: "REQ-1003",
      type: "Companionship",
      clientName: "Eleanor Davis",
      clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eleanor",
      helperName: "Michael Chen",
      helperAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      date: "Today",
      time: "3:00 PM - 5:00 PM",
      location: "789 Pine Road, Anytown",
      status: "in-progress",
      priority: "normal",
    },
    {
      id: "REQ-1004",
      type: "Home Assistance",
      clientName: "George Brown",
      clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=George",
      date: "Tomorrow",
      time: "9:00 AM - 11:00 AM",
      location: "567 Birch Lane, Anytown",
      status: "pending",
      priority: "urgent",
    },
  ];

  const verificationRequests: VerificationRequest[] = [
    {
      id: "VER-1001",
      name: "James Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      type: "helper",
      submittedDate: "May 18, 2023",
      documents: ["ID Verification", "Background Check", "References"],
      status: "pending",
    },
    {
      id: "VER-1002",
      name: "Emily Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      type: "helper",
      submittedDate: "May 17, 2023",
      documents: [
        "ID Verification",
        "Background Check",
        "References",
        "Certifications",
      ],
      status: "pending",
    },
    {
      id: "VER-1003",
      name: "Dorothy Clark",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dorothy",
      type: "elderly",
      submittedDate: "May 16, 2023",
      documents: ["ID Verification", "Medical Information"],
      status: "pending",
    },
  ];

  const handleAssignHelper = (requestId: string) => {
    console.log(`Assigning helper to request: ${requestId}`);
    // In a real app, this would open a modal to select a helper
  };

  const handleApproveVerification = (requestId: string) => {
    console.log(`Approved verification: ${requestId}`);
    // In a real app, this would update the verification status
  };

  const handleRejectVerification = (requestId: string) => {
    console.log(`Rejected verification: ${requestId}`);
    // In a real app, this would update the verification status
  };

  const getStatusBadge = (status: ServiceRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "assigned":
        return <Badge className="bg-blue-100 text-blue-800">Assigned</Badge>;
      case "in-progress":
        return (
          <Badge className="bg-purple-100 text-purple-800">In Progress</Badge>
        );
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: ServiceRequest["priority"]) => {
    switch (priority) {
      case "normal":
        return <Badge variant="outline">Normal</Badge>;
      case "high":
        return (
          <Badge
            variant="outline"
            className="border-orange-500 text-orange-700"
          >
            High
          </Badge>
        );
      case "urgent":
        return (
          <Badge variant="outline" className="border-red-500 text-red-700">
            Urgent
          </Badge>
        );
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <Layout
      userName="Admin User"
      userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
    >
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Hub Dashboard</h1>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-lg px-4 py-2 bg-green-100 text-green-800"
            >
              Sunshine Community Hub
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Requests</p>
                  <p className="text-3xl font-bold">12</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Verified Helpers</p>
                  <p className="text-3xl font-bold">28</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Verifications</p>
                  <p className="text-3xl font-bold">
                    {verificationRequests.length}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <UserX className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Hub Admin Tools */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 border-2"
            onClick={() => navigate("/user-verification")}
          >
            <UserCheck className="h-6 w-6 text-primary" />
            <span className="font-medium">User Verification</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 border-2"
            onClick={() => navigate("/emergency-response")}
          >
            <AlertTriangle className="h-6 w-6 text-primary" />
            <span className="font-medium">Emergency Response</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 border-2"
            onClick={() => navigate("/community-management")}
          >
            <Building className="h-6 w-6 text-primary" />
            <span className="font-medium">Community Events</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 border-2"
            onClick={() => navigate("/hub-settings")}
          >
            <Settings className="h-6 w-6 text-primary" />
            <span className="font-medium">Hub Settings</span>
          </Button>
        </div>

        <Tabs
          defaultValue="requests"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requests" className="text-lg py-3">
              <Activity className="mr-2 h-5 w-5" />
              Service Requests
            </TabsTrigger>
            <TabsTrigger value="verifications" className="text-lg py-3">
              <UserCheck className="mr-2 h-5 w-5" />
              Verifications
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-lg py-3">
              <BarChart3 className="mr-2 h-5 w-5" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="communication" className="text-lg py-3">
              <MessageSquare className="mr-2 h-5 w-5" />
              Communication
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Service Requests</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search requests..."
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

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">Client</th>
                    <th className="text-left p-3">Service Type</th>
                    <th className="text-left p-3">Date & Time</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Priority</th>
                    <th className="text-left p-3">Helper</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceRequests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{request.id}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={request.clientAvatar}
                              alt={request.clientName}
                            />
                            <AvatarFallback>
                              {request.clientName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{request.clientName}</span>
                        </div>
                      </td>
                      <td className="p-3">{request.type}</td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{request.date}</span>
                          <span className="text-sm text-gray-500">
                            {request.time}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">{getStatusBadge(request.status)}</td>
                      <td className="p-3">
                        {getPriorityBadge(request.priority)}
                      </td>
                      <td className="p-3">
                        {request.helperName ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={request.helperAvatar}
                                alt={request.helperName}
                              />
                              <AvatarFallback>
                                {request.helperName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{request.helperName}</span>
                          </div>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100">
                            Unassigned
                          </Badge>
                        )}
                      </td>
                      <td className="p-3">
                        {request.status === "pending" ? (
                          <Button
                            size="sm"
                            onClick={() => handleAssignHelper(request.id)}
                          >
                            Assign Helper
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="verifications" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                Helper Skills & Certifications
              </h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search helpers by skills..."
                    className="pl-10 w-[250px]"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                        alt="Sarah Johnson"
                      />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">Sarah Johnson</h3>
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800"
                      >
                        Helper
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">
                      Skills & Certifications
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 flex items-center gap-1"
                      >
                        <Heart className="h-3 w-3" /> CPR Certified
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800 flex items-center gap-1"
                      >
                        <GraduationCap className="h-3 w-3" /> Elder Care
                        Training
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-purple-100 text-purple-800 flex items-center gap-1"
                      >
                        <Briefcase className="h-3 w-3" /> 5+ Years Experience
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">Cooking</Badge>
                      <Badge variant="outline">Medication Management</Badge>
                      <Badge variant="outline">Mobility Assistance</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1" size="sm">
                      <Award className="mr-2 h-4 w-4" /> Add Certification
                    </Button>
                    <Button variant="outline" className="flex-1" size="sm">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
                        alt="Michael Chen"
                      />
                      <AvatarFallback>MC</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">Michael Chen</h3>
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800"
                      >
                        Helper
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">
                      Skills & Certifications
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 flex items-center gap-1"
                      >
                        <Heart className="h-3 w-3" /> First Aid Certified
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-800 flex items-center gap-1"
                      >
                        <Briefcase className="h-3 w-3" /> 3+ Years Experience
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">Transportation</Badge>
                      <Badge variant="outline">Technology Assistance</Badge>
                      <Badge variant="outline">Companionship</Badge>
                      <Badge variant="outline">Multilingual</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1" size="sm">
                      <Award className="mr-2 h-4 w-4" /> Add Certification
                    </Button>
                    <Button variant="outline" className="flex-1" size="sm">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=David"
                        alt="David Wilson"
                      />
                      <AvatarFallback>DW</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">David Wilson</h3>
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800"
                      >
                        Helper
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">
                      Skills & Certifications
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800 flex items-center gap-1"
                      >
                        <GraduationCap className="h-3 w-3" /> Nursing Assistant
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-purple-100 text-purple-800 flex items-center gap-1"
                      >
                        <Briefcase className="h-3 w-3" /> 7+ Years Experience
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">Home Maintenance</Badge>
                      <Badge variant="outline">Meal Preparation</Badge>
                      <Badge variant="outline">Personal Care</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1" size="sm">
                      <Award className="mr-2 h-4 w-4" /> Add Certification
                    </Button>
                    <Button variant="outline" className="flex-1" size="sm">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Pending Verifications</h2>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Pending Verifications</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search verifications..."
                    className="pl-10 w-[250px]"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {verificationRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={request.avatar} alt={request.name} />
                        <AvatarFallback>
                          {request.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {request.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={
                            request.type === "helper"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {request.type === "helper" ? "Helper" : "Senior"}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Submitted</p>
                      <p className="font-medium">{request.submittedDate}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Documents</p>
                      <div className="flex flex-wrap gap-1">
                        {request.documents.map((doc, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-gray-100"
                          >
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        className="flex-1"
                        onClick={() => handleApproveVerification(request.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" /> Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleRejectVerification(request.id)}
                      >
                        <XCircle className="mr-2 h-4 w-4" /> Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <HubPerformanceMetrics hubId="hub-1" timeRange="week" />
          </TabsContent>

          <TabsContent value="communication" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              <HubStaffChat hubId="hub-1" currentUserId="staff-1" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default HubDashboard;
