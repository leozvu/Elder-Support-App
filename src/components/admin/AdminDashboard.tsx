import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Home,
  Settings,
  BarChart,
  Bell,
  Calendar,
  Clock,
  FileText,
  HelpCircle,
  MessageSquare,
  Shield,
  Award,
  Megaphone,
  MapPin,
} from "lucide-react";
import HelperCertificationTracker from "./HelperCertificationTracker";
import AutomatedReportingSystem from "./AutomatedReportingSystem";
import HubCommunicationTools from "./HubCommunicationTools";
import ServiceDemandHeatmap from "./ServiceDemandHeatmap";

interface AdminDashboardProps {
  hubId?: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ hubId }) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hub Administration</h1>
          <p className="text-muted-foreground">
            Manage your local senior assistance hub
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <HelpCircle className="mr-2 h-4 w-4" /> Help
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
              alt="Admin"
            />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="text-lg py-3">
            <Home className="mr-2 h-5 w-5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="certifications" className="text-lg py-3">
            <Award className="mr-2 h-5 w-5" />
            Certifications
          </TabsTrigger>
          <TabsTrigger value="reporting" className="text-lg py-3">
            <FileText className="mr-2 h-5 w-5" />
            Reporting
          </TabsTrigger>
          <TabsTrigger value="communication" className="text-lg py-3">
            <Megaphone className="mr-2 h-5 w-5" />
            Communication
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="text-lg py-3">
            <MapPin className="mr-2 h-5 w-5" />
            Demand Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Elderly Users</p>
                    <p className="text-3xl font-bold">128</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Helpers</p>
                    <p className="text-3xl font-bold">48</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Pending Requests</p>
                    <p className="text-3xl font-bold">23</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Service Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                  <BarChart className="h-16 w-16 text-gray-300" />
                  <p className="text-gray-500 ml-4">
                    Activity chart would be displayed here
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Today's Services</p>
                    <p className="text-2xl font-bold mt-1">18</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-500">This Week</p>
                    <p className="text-2xl font-bold mt-1">124</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-500">This Month</p>
                    <p className="text-2xl font-bold mt-1">486</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      type: "request",
                      title: "New Service Request",
                      description:
                        "Martha Wilson requested transportation assistance",
                      time: "10 minutes ago",
                    },
                    {
                      type: "helper",
                      title: "New Helper Application",
                      description:
                        "David Thompson submitted helper application",
                      time: "45 minutes ago",
                    },
                    {
                      type: "certification",
                      title: "Certification Uploaded",
                      description: "Sarah Johnson uploaded CPR certification",
                      time: "2 hours ago",
                    },
                    {
                      type: "message",
                      title: "New Message",
                      description:
                        "Michael Chen sent a message about availability",
                      time: "3 hours ago",
                    },
                    {
                      type: "emergency",
                      title: "Emergency Alert Resolved",
                      description:
                        "Emergency alert from Robert Davis was resolved",
                      time: "5 hours ago",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="mr-3">
                        {activity.type === "request" ? (
                          <Calendar className="h-5 w-5 text-blue-500" />
                        ) : activity.type === "helper" ? (
                          <Users className="h-5 w-5 text-green-500" />
                        ) : activity.type === "certification" ? (
                          <Award className="h-5 w-5 text-purple-500" />
                        ) : activity.type === "message" ? (
                          <MessageSquare className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <Bell className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-gray-600">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-4">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Scheduled Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      user: "Martha Wilson",
                      service: "Medical Appointment",
                      helper: "Sarah Johnson",
                      time: "Today, 2:00 PM",
                      status: "confirmed",
                    },
                    {
                      user: "Robert Davis",
                      service: "Grocery Shopping",
                      helper: "Michael Chen",
                      time: "Today, 4:30 PM",
                      status: "confirmed",
                    },
                    {
                      user: "Elizabeth Brown",
                      service: "Home Maintenance",
                      helper: "Pending Assignment",
                      time: "Tomorrow, 10:00 AM",
                      status: "pending",
                    },
                  ].map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{service.user}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-600">
                            {service.service}
                          </p>
                          <Badge
                            variant={
                              service.status === "confirmed"
                                ? "outline"
                                : "secondary"
                            }
                            className={
                              service.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : ""
                            }
                          >
                            {service.status === "confirmed"
                              ? "Confirmed"
                              : "Pending"}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{service.time}</p>
                        <p className="text-sm text-gray-600">
                          {service.helper}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-4">
                  <Calendar className="mr-2 h-4 w-4" /> View Full Schedule
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Helper Verification Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "David Thompson",
                      email: "david.thompson@example.com",
                      applied: "Today",
                      status: "background_check",
                      avatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
                    },
                    {
                      name: "Jennifer Martinez",
                      email: "jennifer.m@example.com",
                      applied: "Yesterday",
                      status: "interview",
                      avatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer",
                    },
                    {
                      name: "Thomas Wilson",
                      email: "thomas.w@example.com",
                      applied: "2 days ago",
                      status: "document_review",
                      avatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
                    },
                  ].map((helper, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={helper.avatar} alt={helper.name} />
                          <AvatarFallback>
                            {helper.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{helper.name}</p>
                          <p className="text-sm text-gray-600">
                            {helper.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1">
                          {helper.status === "background_check"
                            ? "Background Check"
                            : helper.status === "interview"
                              ? "Interview"
                              : "Document Review"}
                        </Badge>
                        <p className="text-xs text-gray-500">
                          Applied {helper.applied}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-4">
                  <Users className="mr-2 h-4 w-4" /> View All Applicants
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="certifications" className="mt-6">
          <HelperCertificationTracker hubId={hubId} />
        </TabsContent>

        <TabsContent value="reporting" className="mt-6">
          <AutomatedReportingSystem hubId={hubId} />
        </TabsContent>

        <TabsContent value="communication" className="mt-6">
          <HubCommunicationTools hubId={hubId} />
        </TabsContent>

        <TabsContent value="heatmap" className="mt-6">
          <ServiceDemandHeatmap hubId={hubId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
