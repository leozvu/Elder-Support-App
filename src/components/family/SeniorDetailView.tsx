import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Calendar,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Pill,
  ShieldAlert,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SeniorDetailViewProps {
  seniorId?: string;
}

const SeniorDetailView = ({
  seniorId = "demo-senior-1",
}: SeniorDetailViewProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in a real app, this would come from the database
  const seniorData = {
    id: seniorId,
    name: "Martha Johnson",
    age: 78,
    address: "123 Maple Street, Anytown, USA",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha",
    emergencyContact: "John Johnson (Son) - (555) 123-4567",
    lastActive: "10 minutes ago",
    status: "active", // active, away, needs-attention
    medications: [
      {
        id: "med1",
        name: "Lisinopril",
        dosage: "10mg",
        schedule: "Daily, 8:00 AM",
        adherence: 92,
        lastTaken: "Today, 8:05 AM",
        nextDose: "Tomorrow, 8:00 AM",
      },
      {
        id: "med2",
        name: "Metformin",
        dosage: "500mg",
        schedule: "Twice daily",
        adherence: 85,
        lastTaken: "Today, 12:30 PM",
        nextDose: "Today, 8:00 PM",
      },
      {
        id: "med3",
        name: "Simvastatin",
        dosage: "20mg",
        schedule: "Daily, 9:00 PM",
        adherence: 78,
        lastTaken: "Yesterday, 9:15 PM",
        nextDose: "Today, 9:00 PM",
      },
    ],
    activities: [
      {
        id: "act1",
        type: "Medication",
        description: "Took Lisinopril",
        time: "Today, 8:05 AM",
      },
      {
        id: "act2",
        type: "Service",
        description: "Grocery delivery completed",
        time: "Today, 10:30 AM",
      },
      {
        id: "act3",
        type: "Wellness",
        description: "Completed morning exercise",
        time: "Today, 9:15 AM",
      },
      {
        id: "act4",
        type: "Medication",
        description: "Took Metformin",
        time: "Today, 12:30 PM",
      },
      {
        id: "act5",
        type: "Location",
        description: "Visited Community Center",
        time: "Yesterday, 2:00 PM",
      },
    ],
    upcomingServices: [
      {
        id: "serv1",
        type: "Transportation",
        description: "Doctor's appointment",
        date: "Tomorrow, 10:00 AM",
        status: "scheduled",
      },
      {
        id: "serv2",
        type: "Home Maintenance",
        description: "Plumbing repair",
        date: "Friday, 1:00 PM",
        status: "scheduled",
      },
      {
        id: "serv3",
        type: "Meal Delivery",
        description: "Weekly meal prep",
        date: "Saturday, 11:00 AM",
        status: "pending",
      },
    ],
    wellnessChecks: [
      {
        id: "well1",
        type: "Blood Pressure",
        value: "128/82",
        date: "Today, 9:00 AM",
        status: "normal",
      },
      {
        id: "well2",
        type: "Blood Sugar",
        value: "112 mg/dL",
        date: "Today, 7:30 AM",
        status: "normal",
      },
      {
        id: "well3",
        type: "Weight",
        value: "142 lbs",
        date: "Yesterday",
        status: "normal",
      },
      {
        id: "well4",
        type: "Mood",
        value: "Good",
        date: "Today, 12:00 PM",
        status: "normal",
      },
    ],
    alerts: [
      {
        id: "alert1",
        type: "medication",
        message: "Missed evening dose of Simvastatin yesterday",
        time: "Yesterday, 9:00 PM",
        severity: "medium",
      },
      {
        id: "alert2",
        type: "wellness",
        message: "Blood pressure reading higher than usual",
        time: "3 days ago",
        severity: "low",
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

  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 90) return "bg-green-500";
    if (adherence >= 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const handleContactSenior = () => {
    toast({
      title: "Contacting Senior",
      description: "Initiating call to Martha Johnson...",
    });
  };

  const handleSendReminder = (medicationId: string) => {
    const medication = seniorData.medications.find(
      (med) => med.id === medicationId,
    );
    toast({
      title: "Reminder Sent",
      description: `Reminder for ${medication?.name} has been sent to Martha Johnson.`,
    });
  };

  const handleDismissAlert = (alertId: string) => {
    toast({
      title: "Alert Dismissed",
      description: "The alert has been dismissed and will not appear again.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Senior Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={seniorData.avatar} alt={seniorData.name} />
              <AvatarFallback>{seniorData.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{seniorData.name}</h2>
                <div
                  className={`h-3 w-3 rounded-full ${getStatusColor(seniorData.status)}`}
                />
              </div>
              <p className="text-gray-500">{seniorData.age} years old</p>
              <div className="flex items-center gap-1 text-gray-500 mt-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{seniorData.address}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 mt-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  Last active: {seniorData.lastActive}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
              <Button
                onClick={handleContactSenior}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Contact
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Set Alert
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Section */}
      {seniorData.alerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-800 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Alerts Requiring Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {seniorData.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 border rounded-md flex justify-between items-start ${getAlertSeverityColor(alert.severity)}`}
                >
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm opacity-80">{alert.time}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismissAlert(alert.id)}
                    className="text-gray-700 hover:text-gray-900 hover:bg-white/50"
                  >
                    Dismiss
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent Activities */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {seniorData.activities.slice(0, 3).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 pb-3 border-b last:border-0"
                    >
                      <Badge variant="outline" className="mt-0.5">
                        {activity.type}
                      </Badge>
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="link"
                  className="mt-2 p-0"
                  onClick={() => setActiveTab("activities")}
                >
                  View all activities
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Services */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {seniorData.upcomingServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-start gap-3 pb-3 border-b last:border-0"
                    >
                      <div className="bg-blue-100 p-2 rounded-md text-blue-700">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">{service.type}</p>
                          <Badge
                            variant={
                              service.status === "scheduled"
                                ? "default"
                                : "outline"
                            }
                          >
                            {service.status}
                          </Badge>
                        </div>
                        <p className="text-sm">{service.description}</p>
                        <p className="text-sm text-gray-500">{service.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="link"
                  className="mt-2 p-0"
                  onClick={() => setActiveTab("services")}
                >
                  View all services
                </Button>
              </CardContent>
            </Card>

            {/* Medication Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Medication Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {seniorData.medications.slice(0, 2).map((medication) => (
                    <div
                      key={medication.id}
                      className="pb-3 border-b last:border-0"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Pill className="h-5 w-5 text-blue-600" />
                          <p className="font-medium">
                            {medication.name} ({medication.dosage})
                          </p>
                        </div>
                        <Badge variant="outline">{medication.adherence}%</Badge>
                      </div>
                      <p className="text-sm mt-1">
                        Next dose: {medication.nextDose}
                      </p>
                      <Progress
                        value={medication.adherence}
                        className={`h-2 mt-2 ${getAdherenceColor(medication.adherence)}`}
                      />
                    </div>
                  ))}
                </div>
                <Button
                  variant="link"
                  className="mt-2 p-0"
                  onClick={() => setActiveTab("medications")}
                >
                  View all medications
                </Button>
              </CardContent>
            </Card>

            {/* Wellness Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Wellness Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {seniorData.wellnessChecks.slice(0, 3).map((check) => (
                    <div
                      key={check.id}
                      className="flex items-start gap-3 pb-3 border-b last:border-0"
                    >
                      <div className="bg-green-100 p-2 rounded-md text-green-700">
                        <Heart className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{check.type}</p>
                        <p className="text-sm">{check.value}</p>
                        <p className="text-sm text-gray-500">{check.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="link"
                  className="mt-2 p-0"
                  onClick={() => setActiveTab("wellness")}
                >
                  View all wellness data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medication Schedule & Adherence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {seniorData.medications.map((medication) => (
                  <div
                    key={medication.id}
                    className="border-b pb-4 last:border-0"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-medium">
                          {medication.name}
                        </h3>
                        <p className="text-gray-500">
                          {medication.dosage} - {medication.schedule}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            medication.adherence >= 90
                              ? "bg-green-100 text-green-800"
                              : medication.adherence >= 75
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {medication.adherence}% Adherence
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendReminder(medication.id)}
                        >
                          Send Reminder
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Last Taken</p>
                        <p className="text-sm">{medication.lastTaken}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Next Dose</p>
                        <p className="text-sm">{medication.nextDose}</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-medium mb-1">
                        Adherence Trend
                      </p>
                      <Progress
                        value={medication.adherence}
                        className={`h-2 ${getAdherenceColor(medication.adherence)}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Service Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seniorData.upcomingServices.map((service) => (
                  <div key={service.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge>{service.type}</Badge>
                          <Badge variant="outline">{service.status}</Badge>
                        </div>
                        <h3 className="text-lg font-medium mt-2">
                          {service.description}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-500 mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>{service.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm">Manage</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button className="w-full">Request New Service</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wellness Tab */}
        <TabsContent value="wellness" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wellness Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {seniorData.wellnessChecks.map((check) => (
                  <Card key={check.id} className="border shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{check.type}</h3>
                          <p className="text-2xl font-bold mt-1">
                            {check.value}
                          </p>
                        </div>
                        <Badge
                          variant={
                            check.status === "normal"
                              ? "outline"
                              : "destructive"
                          }
                        >
                          {check.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{check.date}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="font-medium mb-2">Wellness Trends</h3>
                <p className="text-gray-500 text-sm">
                  Detailed wellness trends and charts would be displayed here,
                  showing patterns over time.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SeniorDetailView;
