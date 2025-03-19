import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/local-database";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  Clock,
  MapPin,
  Pill,
  Activity,
  Bell,
  User,
  Phone,
  MessageSquare,
  CalendarClock,
  Clipboard,
  Heart,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";

interface FamilyPortalDashboardProps {
  seniorId?: string;
  className?: string;
}

interface Senior {
  id: string;
  name: string;
  avatar: string;
  address: string;
  emergencyContact: string;
  lastActivity: Date;
  status: "active" | "inactive" | "emergency";
}

interface ServiceRequest {
  id: string;
  type: string;
  date: Date;
  status: string;
  helper?: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface MedicationReminder {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  lastTaken?: Date;
  nextDue: Date;
  status: "taken" | "missed" | "upcoming";
}

interface WellnessCheck {
  id: string;
  type: string;
  date: Date;
  result: string;
  status: "normal" | "attention" | "critical";
}

const FamilyPortalDashboard = ({
  seniorId,
  className = "",
}: FamilyPortalDashboardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [senior, setSenior] = useState<Senior | null>(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [medications, setMedications] = useState<MedicationReminder[]>([]);
  const [wellnessChecks, setWellnessChecks] = useState<WellnessCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch data from the API
    const loadData = async () => {
      setLoading(true);
      try {
        // Mock data for demonstration
        const mockSenior: Senior = {
          id: seniorId || "senior-123",
          name: "Martha Johnson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha",
          address: "123 Maple Street, Anytown",
          emergencyContact: "John Johnson (Son) - (555) 123-4567",
          lastActivity: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          status: "active",
        };

        const mockRequests: ServiceRequest[] = [
          {
            id: "req-001",
            type: "Medical Appointment",
            date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
            status: "scheduled",
            helper: {
              id: "helper-123",
              name: "Sarah Wilson",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            },
          },
          {
            id: "req-002",
            type: "Grocery Shopping",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
            status: "completed",
            helper: {
              id: "helper-456",
              name: "Michael Chen",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
            },
          },
          {
            id: "req-003",
            type: "Home Maintenance",
            date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
            status: "pending",
          },
        ];

        const mockMedications: MedicationReminder[] = [
          {
            id: "med-001",
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            time: "8:00 AM",
            lastTaken: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
            nextDue: new Date(Date.now() + 1000 * 60 * 60 * 8), // 8 hours from now
            status: "upcoming",
          },
          {
            id: "med-002",
            name: "Metformin",
            dosage: "500mg",
            frequency: "Twice daily",
            time: "8:00 AM, 8:00 PM",
            lastTaken: new Date(),
            nextDue: new Date(Date.now() + 1000 * 60 * 60 * 12), // 12 hours from now
            status: "taken",
          },
          {
            id: "med-003",
            name: "Vitamin D",
            dosage: "1000 IU",
            frequency: "Once daily",
            time: "12:00 PM",
            lastTaken: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
            nextDue: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            status: "missed",
          },
        ];

        const mockWellnessChecks: WellnessCheck[] = [
          {
            id: "check-001",
            type: "Blood Pressure",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
            result: "130/85",
            status: "normal",
          },
          {
            id: "check-002",
            type: "Blood Sugar",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
            result: "140 mg/dL",
            status: "attention",
          },
          {
            id: "check-003",
            type: "Weight",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
            result: "165 lbs",
            status: "normal",
          },
        ];

        setSenior(mockSenior);
        setServiceRequests(mockRequests);
        setMedications(mockMedications);
        setWellnessChecks(mockWellnessChecks);
      } catch (error) {
        console.error("Error loading family portal data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [seniorId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case "emergency":
        return <Badge className="bg-red-100 text-red-800">Emergency</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "taken":
        return <Badge className="bg-green-100 text-green-800">Taken</Badge>;
      case "missed":
        return <Badge className="bg-red-100 text-red-800">Missed</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case "normal":
        return <Badge className="bg-green-100 text-green-800">Normal</Badge>;
      case "attention":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Needs Attention
          </Badge>
        );
      case "critical":
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!senior) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center p-6">
            <p className="text-lg text-gray-500">No senior profile found</p>
            <Button
              className="mt-4"
              onClick={() => navigate("/family-portal/add-senior")}
            >
              Add Senior Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Senior Profile Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={senior.avatar} alt={senior.name} />
              <AvatarFallback>{senior.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h2 className="text-2xl font-bold">{senior.name}</h2>
              <div className="flex items-center mt-1 text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{senior.address}</span>
              </div>
              <div className="flex items-center mt-1 text-gray-500">
                <Phone className="h-4 w-4 mr-1" />
                <span>Emergency Contact: {senior.emergencyContact}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-sm text-gray-500">
                  Last Activity: {format(senior.lastActivity, "h:mm a, MMM d")}
                </span>
              </div>
              {getStatusBadge(senior.status)}
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/direct-communication/${senior.id}`)}
                >
                  <MessageSquare className="h-4 w-4 mr-1" /> Message
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    navigate(`/service-request?seniorId=${senior.id}`)
                  }
                >
                  <Bell className="h-4 w-4 mr-1" /> Request Service
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Upcoming Services */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Upcoming Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                {serviceRequests.filter(
                  (req) => new Date(req.date) > new Date(),
                ).length > 0 ? (
                  <div className="space-y-3">
                    {serviceRequests
                      .filter((req) => new Date(req.date) > new Date())
                      .slice(0, 2)
                      .map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between border-b pb-2"
                        >
                          <div>
                            <p className="font-medium">{request.type}</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(request.date), "MMM d, h:mm a")}
                            </p>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                      ))}
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => setActiveTab("services")}
                    >
                      View all services
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No upcoming services</p>
                )}
              </CardContent>
            </Card>

            {/* Medication Alerts */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Pill className="h-5 w-5 mr-2 text-primary" />
                  Medication Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {medications.filter(
                  (med) => med.status === "missed" || med.status === "upcoming",
                ).length > 0 ? (
                  <div className="space-y-3">
                    {medications
                      .filter(
                        (med) =>
                          med.status === "missed" || med.status === "upcoming",
                      )
                      .slice(0, 2)
                      .map((med) => (
                        <div
                          key={med.id}
                          className="flex items-center justify-between border-b pb-2"
                        >
                          <div>
                            <p className="font-medium">
                              {med.name} ({med.dosage})
                            </p>
                            <p className="text-sm text-gray-500">
                              {med.status === "missed" ? "Missed: " : "Due: "}
                              {format(new Date(med.nextDue), "h:mm a")}
                            </p>
                          </div>
                          {getStatusBadge(med.status)}
                        </div>
                      ))}
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => setActiveTab("medications")}
                    >
                      View all medications
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No medication alerts</p>
                )}
              </CardContent>
            </Card>

            {/* Wellness Alerts */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-primary" />
                  Wellness Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {wellnessChecks.filter(
                  (check) =>
                    check.status === "attention" || check.status === "critical",
                ).length > 0 ? (
                  <div className="space-y-3">
                    {wellnessChecks
                      .filter(
                        (check) =>
                          check.status === "attention" ||
                          check.status === "critical",
                      )
                      .slice(0, 2)
                      .map((check) => (
                        <div
                          key={check.id}
                          className="flex items-center justify-between border-b pb-2"
                        >
                          <div>
                            <p className="font-medium">{check.type}</p>
                            <p className="text-sm text-gray-500">
                              Result: {check.result} (
                              {format(new Date(check.date), "MMM d")})
                            </p>
                          </div>
                          {getStatusBadge(check.status)}
                        </div>
                      ))}
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => setActiveTab("wellness")}
                    >
                      View all wellness checks
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No wellness alerts</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate(`/service-request?seniorId=${senior.id}`)}
            >
              <Bell className="h-6 w-6" />
              <span>Request Service</span>
            </Button>
            <Button
              className="h-auto py-4 flex flex-col items-center gap-2"
              variant="outline"
              onClick={() =>
                navigate(`/medication-management?seniorId=${senior.id}`)
              }
            >
              <Pill className="h-6 w-6" />
              <span>Manage Medications</span>
            </Button>
            <Button
              className="h-auto py-4 flex flex-col items-center gap-2"
              variant="outline"
              onClick={() => navigate(`/wellness-checks?seniorId=${senior.id}`)}
            >
              <Activity className="h-6 w-6" />
              <span>Wellness Checks</span>
            </Button>
            <Button
              className="h-auto py-4 flex flex-col items-center gap-2"
              variant="outline"
              onClick={() =>
                navigate(`/emergency-contacts?seniorId=${senior.id}`)
              }
            >
              <AlertTriangle className="h-6 w-6" />
              <span>Emergency Contacts</span>
            </Button>
          </div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              Service History & Upcoming
            </h3>
            <Button
              onClick={() => navigate(`/service-request?seniorId=${senior.id}`)}
            >
              <Bell className="h-4 w-4 mr-2" /> Request New Service
            </Button>
          </div>

          <div className="space-y-4">
            {serviceRequests.length > 0 ? (
              serviceRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-semibold">
                            {request.type}
                          </h4>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="flex items-center mt-2 text-gray-500">
                          <CalendarClock className="h-4 w-4 mr-1" />
                          <span>
                            {format(
                              new Date(request.date),
                              "EEEE, MMMM d, yyyy 'at' h:mm a",
                            )}
                          </span>
                        </div>
                      </div>

                      {request.helper && (
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={request.helper.avatar}
                              alt={request.helper.name}
                            />
                            <AvatarFallback>
                              {request.helper.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{request.helper.name}</p>
                            <p className="text-sm text-gray-500">Helper</p>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 ml-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/service-tracking/${request.id}?seniorId=${senior.id}`,
                            )
                          }
                        >
                          <Clipboard className="h-4 w-4 mr-1" /> Details
                        </Button>
                        {new Date(request.date) > new Date() && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500"
                            onClick={() =>
                              alert(`Cancel service ${request.id}`)
                            }
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-gray-500">No service history found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Medication Management</h3>
            <Button
              onClick={() =>
                navigate(`/medication-management?seniorId=${senior.id}`)
              }
            >
              <Pill className="h-4 w-4 mr-2" /> Add Medication
            </Button>
          </div>

          <div className="space-y-4">
            {medications.length > 0 ? (
              medications.map((med) => (
                <Card key={med.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-semibold">{med.name}</h4>
                          {getStatusBadge(med.status)}
                        </div>
                        <p className="text-gray-700 mt-1">
                          {med.dosage} - {med.frequency}
                        </p>
                        <div className="flex items-center mt-2 text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Time: {med.time}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {med.lastTaken && (
                          <p className="text-sm text-gray-500">
                            Last taken:{" "}
                            {format(new Date(med.lastTaken), "MMM d, h:mm a")}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          Next due:{" "}
                          {format(new Date(med.nextDue), "MMM d, h:mm a")}
                        </p>
                      </div>

                      <div className="flex gap-2 ml-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/medication-management/${med.id}?seniorId=${senior.id}`,
                            )
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-500"
                          onClick={() => alert(`Mark ${med.name} as taken`)}
                        >
                          <Heart className="h-4 w-4 mr-1" /> Mark as Taken
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-gray-500">No medications found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Wellness Tab */}
        <TabsContent value="wellness" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Wellness Monitoring</h3>
            <Button
              onClick={() => navigate(`/wellness-checks?seniorId=${senior.id}`)}
            >
              <Activity className="h-4 w-4 mr-2" /> Add Wellness Check
            </Button>
          </div>

          <div className="space-y-4">
            {wellnessChecks.length > 0 ? (
              wellnessChecks.map((check) => (
                <Card key={check.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-semibold">
                            {check.type}
                          </h4>
                          {getStatusBadge(check.status)}
                        </div>
                        <p className="text-gray-700 mt-1">
                          Result: {check.result}
                        </p>
                        <div className="flex items-center mt-2 text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            Date: {format(new Date(check.date), "MMMM d, yyyy")}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/wellness-checks/${check.id}?seniorId=${senior.id}`,
                            )
                          }
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/wellness-checks/add?type=${check.type}&seniorId=${senior.id}`,
                            )
                          }
                        >
                          Add New Reading
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-gray-500">No wellness checks found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FamilyPortalDashboard;
