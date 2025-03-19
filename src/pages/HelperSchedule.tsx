import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import HelperAvailabilityCalendar from "@/components/helper/HelperAvailabilityCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  MessageSquare,
  Navigation,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useVoiceGuidance } from "@/hooks/useVoiceGuidance";

interface ScheduledService {
  id: string;
  customerName: string;
  customerAvatar?: string;
  serviceType: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  status: "upcoming" | "in-progress" | "completed" | "cancelled";
  notes?: string;
}

const HelperSchedule = () => {
  const [activeTab, setActiveTab] = useState("schedule");
  const navigate = useNavigate();
  const { speak } = useVoiceGuidance();

  // Mock scheduled services
  const scheduledServices: ScheduledService[] = [
    {
      id: "service-1",
      customerName: "Martha Johnson",
      customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha",
      serviceType: "Shopping Assistance",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
      startTime: "10:00",
      endTime: "11:30",
      location: "123 Maple Street, Anytown",
      status: "upcoming",
      notes:
        "Need help with grocery shopping at Whole Foods. List will be provided.",
    },
    {
      id: "service-2",
      customerName: "Robert Smith",
      customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      serviceType: "Medical Appointment",
      date: new Date(Date.now() + 1000 * 60 * 60 * 48), // Day after tomorrow
      startTime: "13:00",
      endTime: "15:00",
      location: "City Medical Center, 456 Oak Avenue, Anytown",
      status: "upcoming",
      notes:
        "Accompaniment to doctor's appointment. Need assistance with transportation and note-taking.",
    },
    {
      id: "service-3",
      customerName: "Eleanor Davis",
      customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eleanor",
      serviceType: "Companionship",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
      startTime: "14:00",
      endTime: "16:00",
      location: "789 Pine Road, Anytown",
      status: "completed",
      notes:
        "Spent time playing chess and having conversation. Eleanor enjoyed the visit.",
    },
  ];

  const handleNavigateToCustomer = (location: string) => {
    speak(`Navigating to ${location}`, true);
    // In a real app, this would open a map with navigation
  };

  const handleContactCustomer = (customerName: string) => {
    speak(`Contacting ${customerName}`, true);
    navigate("/direct-communication");
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Upcoming
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/helper-dashboard")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Helper Schedule</h1>
        </div>

        <Tabs
          defaultValue="schedule"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="schedule">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="availability">
              <Clock className="mr-2 h-4 w-4" />
              Availability
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upcoming Services */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {scheduledServices
                      .filter((service) => service.status === "upcoming")
                      .map((service) => (
                        <div
                          key={service.id}
                          className="mb-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {service.serviceType}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">
                                  {service.date.toLocaleDateString([], {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">
                                  {formatTime(service.startTime)} -{" "}
                                  {formatTime(service.endTime)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">
                                  {service.location}
                                </span>
                              </div>
                            </div>
                            {getStatusBadge(service.status)}
                          </div>

                          <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full overflow-hidden">
                                <img
                                  src={service.customerAvatar}
                                  alt={service.customerName}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <span className="font-medium">
                                {service.customerName}
                              </span>
                            </div>
                          </div>

                          {service.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
                              <p className="text-gray-700">{service.notes}</p>
                            </div>
                          )}

                          <div className="mt-4 flex gap-2">
                            <Button
                              onClick={() =>
                                handleNavigateToCustomer(service.location)
                              }
                              className="flex-1"
                            >
                              <Navigation className="mr-2 h-4 w-4" /> Navigate
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() =>
                                handleContactCustomer(service.customerName)
                              }
                              className="flex-1"
                            >
                              <MessageSquare className="mr-2 h-4 w-4" /> Contact
                            </Button>
                          </div>
                        </div>
                      ))}

                    {scheduledServices.filter(
                      (service) => service.status === "upcoming",
                    ).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No upcoming services scheduled
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Completed Services */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Completed Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {scheduledServices
                      .filter((service) => service.status === "completed")
                      .map((service) => (
                        <div
                          key={service.id}
                          className="mb-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {service.serviceType}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">
                                  {service.date.toLocaleDateString([], {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">
                                  {formatTime(service.startTime)} -{" "}
                                  {formatTime(service.endTime)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">
                                  {service.customerName}
                                </span>
                              </div>
                            </div>
                            {getStatusBadge(service.status)}
                          </div>

                          {service.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
                              <p className="text-gray-700">{service.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}

                    {scheduledServices.filter(
                      (service) => service.status === "completed",
                    ).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No completed services
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="lg:col-span-1">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Schedule Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                          <span>Upcoming Services</span>
                        </div>
                        <span className="font-bold text-lg">
                          {
                            scheduledServices.filter(
                              (s) => s.status === "upcoming",
                            ).length
                          }
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-green-600 mr-2" />
                          <span>Hours This Week</span>
                        </div>
                        <span className="font-bold text-lg">12</span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-purple-600 mr-2" />
                          <span>Unique Customers</span>
                        </div>
                        <span className="font-bold text-lg">3</span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-gray-600 mr-2" />
                          <span>Service Areas</span>
                        </div>
                        <span className="font-bold text-lg">2</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="w-full">
                          <Phone className="mr-2 h-4 w-4" /> Contact Hub
                        </Button>
                        <Button variant="outline" className="w-full">
                          <MessageSquare className="mr-2 h-4 w-4" /> Messages
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Today's Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      No services scheduled for today
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="availability" className="mt-6">
            <HelperAvailabilityCalendar />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default HelperSchedule;
