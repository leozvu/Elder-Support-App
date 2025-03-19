import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Heart,
  Pill,
  Activity,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  FileText,
  User,
} from "lucide-react";

interface SeniorDetailViewProps {
  seniorId: string;
  onBack: () => void;
}

const SeniorDetailView = ({ seniorId, onBack }: SeniorDetailViewProps) => {
  // In a real app, you would fetch the senior's details based on the ID
  // This is mock data for demonstration
  const senior = {
    id: seniorId,
    name: "Martha Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha",
    status: "active",
    lastCheckIn: "Today, 9:30 AM",
    address: "123 Main St, Anytown, USA",
    phone: "(555) 123-4567",
    email: "martha@example.com",
    dateOfBirth: "May 15, 1945",
    emergencyContact: {
      name: "John Johnson",
      relationship: "Son",
      phone: "(555) 987-6543",
    },
    upcomingServices: [
      {
        id: "s1",
        type: "Shopping Assistance",
        date: "Today",
        time: "2:00 PM",
        status: "scheduled",
        helper: "Henry Helper",
        helperAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Henry",
      },
      {
        id: "s2",
        type: "Medical Appointment",
        date: "May 25, 2023",
        time: "10:30 AM",
        status: "scheduled",
        helper: "Sarah Smith",
        helperAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
    ],
    pastServices: [
      {
        id: "ps1",
        type: "Companionship",
        date: "May 18, 2023",
        time: "3:00 PM",
        status: "completed",
        helper: "Henry Helper",
        helperAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Henry",
        rating: 5,
      },
      {
        id: "ps2",
        type: "Home Maintenance",
        date: "May 10, 2023",
        time: "11:00 AM",
        status: "completed",
        helper: "David Davis",
        helperAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        rating: 4,
      },
    ],
    medications: [
      {
        id: "m1",
        name: "Lisinopril",
        dosage: "10mg",
        schedule: "Daily, 8:00 AM",
        lastTaken: "Today, 8:15 AM",
        nextDue: "Tomorrow, 8:00 AM",
        adherence: 95,
      },
      {
        id: "m2",
        name: "Metformin",
        dosage: "500mg",
        schedule: "Twice daily",
        lastTaken: "Today, 8:15 AM",
        nextDue: "Today, 8:00 PM",
        adherence: 90,
      },
      {
        id: "m3",
        name: "Vitamin D",
        dosage: "1000 IU",
        schedule: "Daily",
        lastTaken: "Today, 8:15 AM",
        nextDue: "Tomorrow, 8:00 AM",
        adherence: 100,
      },
    ],
    wellnessMetrics: [
      {
        id: "w1",
        name: "Blood Pressure",
        value: "120/80 mmHg",
        status: "normal",
        lastUpdated: "Today, 9:30 AM",
        history: [
          { date: "May 20", value: "120/80" },
          { date: "May 19", value: "118/79" },
          { date: "May 18", value: "122/82" },
          { date: "May 17", value: "125/83" },
          { date: "May 16", value: "121/81" },
        ],
      },
      {
        id: "w2",
        name: "Heart Rate",
        value: "72 bpm",
        status: "normal",
        lastUpdated: "Today, 9:30 AM",
        history: [
          { date: "May 20", value: "72" },
          { date: "May 19", value: "75" },
          { date: "May 18", value: "70" },
          { date: "May 17", value: "73" },
          { date: "May 16", value: "71" },
        ],
      },
      {
        id: "w3",
        name: "Hydration",
        value: "65%",
        status: "warning",
        lastUpdated: "Today, 9:30 AM",
        history: [
          { date: "May 20", value: "65%" },
          { date: "May 19", value: "70%" },
          { date: "May 18", value: "68%" },
          { date: "May 17", value: "72%" },
          { date: "May 16", value: "75%" },
        ],
      },
      {
        id: "w4",
        name: "Sleep Quality",
        value: "Good",
        status: "normal",
        lastUpdated: "Today, 9:30 AM",
        hours: 7.5,
        history: [
          { date: "May 20", value: "7.5 hrs" },
          { date: "May 19", value: "6.8 hrs" },
          { date: "May 18", value: "7.2 hrs" },
          { date: "May 17", value: "7.0 hrs" },
          { date: "May 16", value: "7.5 hrs" },
        ],
      },
    ],
    notes: [
      {
        id: "n1",
        date: "May 20, 2023",
        author: "Dr. Smith",
        content:
          "Martha is doing well with her new medication regimen. Blood pressure is stable.",
      },
      {
        id: "n2",
        date: "May 15, 2023",
        author: "Caregiver Jane",
        content:
          "Martha mentioned feeling dizzy in the morning. Recommended to take blood pressure medication after breakfast instead of before.",
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" /> Active
          </Badge>
        );
      case "needs_attention":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="h-3 w-3 mr-1" /> Needs Attention
          </Badge>
        );
      case "emergency":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" /> Emergency
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to List
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageCircle className="h-4 w-4 mr-2" /> Message
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" /> Add Note
          </Button>
          <Button>
            <Calendar className="h-4 w-4 mr-2" /> Schedule Service
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start gap-4">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={senior.avatar} alt={senior.name} />
                <AvatarFallback>{senior.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {getStatusBadge(senior.status)}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{senior.name}</h2>
                <p className="text-muted-foreground">
                  Last check-in: {senior.lastCheckIn}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>DOB: {senior.dateOfBirth}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{senior.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{senior.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{senior.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Emergency Contact</h3>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {senior.emergencyContact.name} (
                      {senior.emergencyContact.relationship})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{senior.emergencyContact.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upcoming Services */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Services</CardTitle>
              </CardHeader>
              <CardContent>
                {senior.upcomingServices.length > 0 ? (
                  <div className="space-y-3">
                    {senior.upcomingServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex justify-between items-center p-3 bg-muted rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{service.type}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{service.date}</span>
                            <Clock className="h-3 w-3 ml-1" />
                            <span>{service.time}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <span>Helper:</span>
                            <div className="flex items-center">
                              <Avatar className="h-4 w-4 mr-1">
                                <AvatarImage
                                  src={service.helperAvatar}
                                  alt={service.helper}
                                />
                              </Avatar>
                              <span>{service.helper}</span>
                            </div>
                          </div>
                        </div>
                        <Badge>{service.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No upcoming services
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Wellness Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Wellness Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {senior.wellnessMetrics.map((metric) => (
                    <div key={metric.id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {metric.name}
                        </span>
                        <span
                          className={`text-sm font-medium ${getStatusColor(
                            metric.status,
                          )}`}
                        >
                          {metric.value}
                        </span>
                      </div>
                      {metric.name === "Hydration" && (
                        <Progress
                          value={parseInt(metric.value)}
                          className="h-2"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Medication Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Medication Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {senior.medications.map((med) => (
                    <div
                      key={med.id}
                      className="flex justify-between items-center p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {med.name} ({med.dosage})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {med.schedule}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            med.nextDue.includes("Tomorrow")
                              ? "outline"
                              : "secondary"
                          }
                        >
                          Next: {med.nextDue}
                        </Badge>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Adherence: {med.adherence}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Notes */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {senior.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 bg-muted rounded-lg space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{note.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {note.date}
                        </span>
                      </div>
                      <p className="text-sm">{note.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Service History</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming">
                <TabsList className="mb-4">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past Services</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4">
                  {senior.upcomingServices.length > 0 ? (
                    <div className="space-y-4">
                      {senior.upcomingServices.map((service) => (
                        <div
                          key={service.id}
                          className="border rounded-lg p-4 space-y-3"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium">
                                {service.type}
                              </h3>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{service.date}</span>
                                <Clock className="h-4 w-4 ml-2" />
                                <span>{service.time}</span>
                              </div>
                            </div>
                            <Badge>{service.status}</Badge>
                          </div>

                          <div className="flex items-center gap-2 bg-muted p-3 rounded-md">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={service.helperAvatar}
                                alt={service.helper}
                              />
                              <AvatarFallback>
                                {service.helper.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{service.helper}</p>
                              <p className="text-sm text-muted-foreground">
                                Assigned Helper
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                            <Button variant="outline" size="sm">
                              Cancel
                            </Button>
                            <Button size="sm">Details</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No upcoming services scheduled
                      </p>
                      <Button className="mt-4">
                        <Calendar className="h-4 w-4 mr-2" /> Schedule New
                        Service
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="past" className="space-y-4">
                  {senior.pastServices.length > 0 ? (
                    <div className="space-y-4">
                      {senior.pastServices.map((service) => (
                        <div
                          key={service.id}
                          className="border rounded-lg p-4 space-y-3"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium">
                                {service.type}
                              </h3>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{service.date}</span>
                                <Clock className="h-4 w-4 ml-2" />
                                <span>{service.time}</span>
                              </div>
                            </div>
                            <Badge variant="outline">{service.status}</Badge>
                          </div>

                          <div className="flex items-center gap-2 bg-muted p-3 rounded-md">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={service.helperAvatar}
                                alt={service.helper}
                              />
                              <AvatarFallback>
                                {service.helper.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{service.helper}</p>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill={
                                      i < service.rating
                                        ? "currentColor"
                                        : "none"
                                    }
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`h-3 w-3 ${i < service.rating ? "text-yellow-500" : "text-gray-300"}`}
                                  >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                  </svg>
                                ))}
                                <span className="text-sm ml-1">
                                  {service.rating}/5
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No past services found
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Wellness Metrics */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Wellness Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {senior.wellnessMetrics.map((metric) => (
                    <div key={metric.id} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{metric.name}</h3>
                        <span
                          className={`font-medium ${getStatusColor(
                            metric.status,
                          )}`}
                        >
                          {metric.value}
                        </span>
                      </div>

                      {/* Simple chart visualization */}
                      <div className="h-24 bg-muted rounded-md p-2">
                        <div className="h-full flex items-end justify-between">
                          {metric.history.map((item, index) => (
                            <div
                              key={index}
                              className="flex flex-col items-center"
                            >
                              <div
                                className="w-6 bg-primary rounded-t"
                                style={{
                                  height: `${Math.random() * 50 + 30}%`,
                                }}
                              ></div>
                              <span className="text-xs mt-1">{item.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Last updated: {metric.lastUpdated}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Medications */}
            <Card>
              <CardHeader>
                <CardTitle>Medications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {senior.medications.map((med) => (
                    <div key={med.id} className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            {med.name} ({med.dosage})
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {med.schedule}
                          </p>
                        </div>
                        <Badge
                          variant={
                            med.nextDue.includes("Tomorrow")
                              ? "outline"
                              : "secondary"
                          }
                        >
                          Next: {med.nextDue}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Adherence</span>
                          <span>{med.adherence}%</span>
                        </div>
                        <Progress value={med.adherence} className="h-2" />
                      </div>

                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Last taken: {med.lastTaken}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Health Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-800">
                          Hydration Alert
                        </h3>
                        <p className="text-sm text-yellow-700">
                          Martha's hydration levels have been declining over the
                          past week. Encourage more fluid intake, especially in
                          the morning.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <Heart className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-green-800">
                          Blood Pressure Stable
                        </h3>
                        <p className="text-sm text-green-700">
                          Blood pressure readings have been consistent and
                          within normal range. Continue current medication
                          regimen.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-800">
                          Activity Recommendation
                        </h3>
                        <p className="text-sm text-blue-700">
                          Consider scheduling a daily 15-minute walk to improve
                          circulation and overall health.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Care Notes</CardTitle>
              <Button>
                <FileText className="h-4 w-4 mr-2" /> Add Note
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {senior.notes.map((note) => (
                  <div
                    key={note.id}
                    className="border-b pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {note.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{note.author}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {note.date}
                      </span>
                    </div>
                    <p className="text-gray-700">{note.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SeniorDetailView;
