import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Calendar,
  Clock,
  MessageSquare,
  Phone,
  Heart,
  Activity,
  Pill,
  CheckCircle,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import ActivityTimeline from "./ActivityTimeline";
import MedicationMonitoring from "./MedicationMonitoring";
import NotificationSystem from "./NotificationSystem";

interface Senior {
  id: string;
  name: string;
  avatar?: string;
  status: "active" | "inactive" | "emergency";
  lastActive?: string;
  address?: string;
  phone?: string;
  emergencyContacts?: {
    name: string;
    relationship: string;
    phone: string;
  }[];
}

interface ServiceRequest {
  id: string;
  seniorId: string;
  type: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  date: string;
  time: string;
  helper?: {
    id: string;
    name: string;
    avatar?: string;
    phone?: string;
    rating?: number;
  };
  notes?: string;
}

interface HealthUpdate {
  id: string;
  seniorId: string;
  type: "medication" | "wellness" | "vital" | "appointment";
  date: string;
  title: string;
  description: string;
  status?: "normal" | "warning" | "critical";
  value?: string;
}

interface Message {
  id: string;
  seniorId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface FamilyPortalProps {
  seniors?: Senior[];
  serviceRequests?: ServiceRequest[];
  healthUpdates?: HealthUpdate[];
  messages?: Message[];
  onAddSenior?: (senior: Omit<Senior, "id">) => void;
  onScheduleService?: (service: Omit<ServiceRequest, "id">) => void;
  onSendMessage?: (
    message: Omit<Message, "id" | "timestamp" | "isRead">,
  ) => void;
}

const FamilyPortal = ({
  seniors = [
    {
      id: "senior_1",
      name: "Martha Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha",
      status: "active",
      lastActive: "10 minutes ago",
      address: "123 Main St, Anytown, USA",
      phone: "(555) 123-4567",
      emergencyContacts: [
        {
          name: "John Johnson",
          relationship: "Son",
          phone: "(555) 987-6543",
        },
        {
          name: "Sarah Williams",
          relationship: "Daughter",
          phone: "(555) 456-7890",
        },
      ],
    },
    {
      id: "senior_2",
      name: "Robert Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      status: "inactive",
      lastActive: "2 hours ago",
      address: "456 Oak Ave, Somewhere, USA",
      phone: "(555) 234-5678",
      emergencyContacts: [
        {
          name: "Mary Smith",
          relationship: "Daughter",
          phone: "(555) 876-5432",
        },
      ],
    },
  ],
  serviceRequests = [
    {
      id: "service_1",
      seniorId: "senior_1",
      type: "Grocery Shopping",
      status: "scheduled",
      date: "2023-05-20",
      time: "10:00 AM",
      helper: {
        id: "helper_1",
        name: "David Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        phone: "(555) 345-6789",
        rating: 4.8,
      },
      notes: "Please get items from the shopping list on the refrigerator.",
    },
    {
      id: "service_2",
      seniorId: "senior_1",
      type: "Medical Appointment",
      status: "in-progress",
      date: "2023-05-18",
      time: "2:30 PM",
      helper: {
        id: "helper_2",
        name: "Susan Brown",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Susan",
        phone: "(555) 456-7890",
        rating: 4.9,
      },
      notes: "Appointment with Dr. Johnson for routine checkup.",
    },
    {
      id: "service_3",
      seniorId: "senior_2",
      type: "Home Maintenance",
      status: "completed",
      date: "2023-05-15",
      time: "11:00 AM",
      helper: {
        id: "helper_3",
        name: "Michael Davis",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        phone: "(555) 567-8901",
        rating: 4.7,
      },
      notes: "Fixed leaky faucet in kitchen and replaced light bulbs.",
    },
  ],
  healthUpdates = [
    {
      id: "health_1",
      seniorId: "senior_1",
      type: "medication",
      date: "2023-05-18",
      title: "Medication Reminder",
      description: "Took morning medications as scheduled",
      status: "normal",
    },
    {
      id: "health_2",
      seniorId: "senior_1",
      type: "vital",
      date: "2023-05-18",
      title: "Blood Pressure Check",
      description: "Blood pressure reading: 128/82",
      status: "normal",
      value: "128/82",
    },
    {
      id: "health_3",
      seniorId: "senior_1",
      type: "wellness",
      date: "2023-05-17",
      title: "Wellness Check",
      description: "Reported feeling tired and having slight headache",
      status: "warning",
    },
    {
      id: "health_4",
      seniorId: "senior_2",
      type: "appointment",
      date: "2023-05-25",
      title: "Upcoming Doctor Appointment",
      description: "Cardiology follow-up with Dr. Smith at 2:00 PM",
    },
  ],
  messages = [
    {
      id: "msg_1",
      seniorId: "senior_1",
      senderId: "helper_1",
      senderName: "David Wilson (Helper)",
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      content:
        "I've completed the grocery shopping for Martha. All items were available and have been put away in the kitchen.",
      timestamp: "2023-05-18T14:30:00",
      isRead: true,
    },
    {
      id: "msg_2",
      seniorId: "senior_1",
      senderId: "senior_1",
      senderName: "Martha Johnson",
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha",
      content:
        "I'm feeling a bit better today. The headache is gone but still feeling tired.",
      timestamp: "2023-05-18T09:15:00",
      isRead: true,
    },
    {
      id: "msg_3",
      seniorId: "senior_2",
      senderId: "helper_3",
      senderName: "Michael Davis (Helper)",
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      content:
        "Just finished fixing the leaky faucet and replacing the light bulbs. Everything is working properly now.",
      timestamp: "2023-05-15T13:45:00",
      isRead: false,
    },
  ],
  onAddSenior = () => {},
  onScheduleService = () => {},
  onSendMessage = () => {},
}: FamilyPortalProps) => {
  const [selectedSeniorId, setSelectedSeniorId] = useState<string | null>(
    seniors.length > 0 ? seniors[0].id : null,
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [isAddSeniorDialogOpen, setIsAddSeniorDialogOpen] = useState(false);
  const [isScheduleServiceDialogOpen, setIsScheduleServiceDialogOpen] =
    useState(false);
  const [newSenior, setNewSenior] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [newService, setNewService] = useState({
    type: "",
    date: "",
    time: "",
    notes: "",
  });
  const [newMessage, setNewMessage] = useState("");

  const selectedSenior = seniors.find((s) => s.id === selectedSeniorId);
  const filteredServiceRequests = serviceRequests.filter(
    (sr) => sr.seniorId === selectedSeniorId,
  );
  const filteredHealthUpdates = healthUpdates.filter(
    (hu) => hu.seniorId === selectedSeniorId,
  );
  const filteredMessages = messages.filter(
    (m) => m.seniorId === selectedSeniorId,
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("newSenior.")) {
      const field = name.split(".")[1];
      setNewSenior((prev) => ({ ...prev, [field]: value }));
    } else if (name.startsWith("newService.")) {
      const field = name.split(".")[1];
      setNewService((prev) => ({ ...prev, [field]: value }));
    } else if (name === "newMessage") {
      setNewMessage(value);
    }
  };

  const handleAddSenior = () => {
    const senior = {
      name: newSenior.name,
      status: "inactive" as const,
      address: newSenior.address,
      phone: newSenior.phone,
      emergencyContacts: [],
    };

    onAddSenior(senior);
    setIsAddSeniorDialogOpen(false);
    setNewSenior({ name: "", phone: "", address: "" });
  };

  const handleScheduleService = () => {
    if (!selectedSeniorId) return;

    const service = {
      seniorId: selectedSeniorId,
      type: newService.type,
      status: "scheduled" as const,
      date: newService.date,
      time: newService.time,
      notes: newService.notes,
    };

    onScheduleService(service);
    setIsScheduleServiceDialogOpen(false);
    setNewService({ type: "", date: "", time: "", notes: "" });
  };

  const handleSendMessage = () => {
    if (!selectedSeniorId || !newMessage.trim()) return;

    const message = {
      seniorId: selectedSeniorId,
      senderId: "family_member_1", // This would be the logged-in family member's ID
      senderName: "You", // This would be the logged-in family member's name
      content: newMessage,
    };

    onSendMessage(message);
    setNewMessage("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-0">
            <CheckCircle className="h-3 w-3 mr-1" /> Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-0">
            <Clock className="h-3 w-3 mr-1" /> Inactive
          </Badge>
        );
      case "emergency":
        return (
          <Badge className="bg-red-100 text-red-800 border-0">
            <AlertTriangle className="h-3 w-3 mr-1" /> Emergency
          </Badge>
        );
      default:
        return null;
    }
  };

  const getServiceStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-0">
            <Calendar className="h-3 w-3 mr-1" /> Scheduled
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-0">
            <Clock className="h-3 w-3 mr-1" /> In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-0">
            <CheckCircle className="h-3 w-3 mr-1" /> Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-0">
            <AlertTriangle className="h-3 w-3 mr-1" /> Cancelled
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getHealthUpdateIcon = (type: string) => {
    switch (type) {
      case "medication":
        return <Pill className="h-5 w-5 text-blue-500" />;
      case "wellness":
        return <Heart className="h-5 w-5 text-pink-500" />;
      case "vital":
        return <Activity className="h-5 w-5 text-green-500" />;
      case "appointment":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Family Portal</h2>
        <div className="flex items-center gap-2">
          <NotificationSystem userId="family_member_1" role="caregiver" />
          <Dialog
            open={isAddSeniorDialogOpen}
            onOpenChange={setIsAddSeniorDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Senior
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a Senior</DialogTitle>
                <DialogDescription>
                  Add a senior family member to monitor and assist
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="newSenior.name">Full Name</Label>
                  <Input
                    id="newSenior.name"
                    name="newSenior.name"
                    value={newSenior.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newSenior.phone">Phone Number</Label>
                  <Input
                    id="newSenior.phone"
                    name="newSenior.phone"
                    value={newSenior.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newSenior.address">Address</Label>
                  <Input
                    id="newSenior.address"
                    name="newSenior.address"
                    value={newSenior.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St, Anytown, USA"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddSeniorDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddSenior}>Add Senior</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seniors</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {seniors.map((senior) => (
                  <div
                    key={senior.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedSeniorId === senior.id ? "bg-primary/5 border-l-4 border-primary" : ""}`}
                    onClick={() => setSelectedSeniorId(senior.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={senior.avatar} alt={senior.name} />
                        <AvatarFallback>{senior.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{senior.name}</p>
                        <div className="text-sm text-muted-foreground">
                          {getStatusBadge(senior.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedSenior && (
          <div className="md:col-span-3 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={selectedSenior.avatar}
                        alt={selectedSenior.name}
                      />
                      <AvatarFallback>
                        {selectedSenior.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">
                        {selectedSenior.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Last active: {selectedSenior.lastActive}
                      </p>
                    </div>
                  </div>
                  <Dialog
                    open={isScheduleServiceDialogOpen}
                    onOpenChange={setIsScheduleServiceDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" /> Schedule Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Schedule a Service</DialogTitle>
                        <DialogDescription>
                          Schedule a service for {selectedSenior.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="newService.type">Service Type</Label>
                          <select
                            id="newService.type"
                            name="newService.type"
                            value={newService.type}
                            onChange={handleInputChange as any}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                          >
                            <option value="">Select a service type</option>
                            <option value="Grocery Shopping">
                              Grocery Shopping
                            </option>
                            <option value="Medical Appointment">
                              Medical Appointment
                            </option>
                            <option value="Home Maintenance">
                              Home Maintenance
                            </option>
                            <option value="Transportation">
                              Transportation
                            </option>
                            <option value="Technology Assistance">
                              Technology Assistance
                            </option>
                            <option value="Companionship">Companionship</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="newService.date">Date</Label>
                            <Input
                              id="newService.date"
                              name="newService.date"
                              type="date"
                              value={newService.date}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newService.time">Time</Label>
                            <Input
                              id="newService.time"
                              name="newService.time"
                              type="time"
                              value={newService.time}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newService.notes">Notes</Label>
                          <Textarea
                            id="newService.notes"
                            name="newService.notes"
                            value={newService.notes}
                            onChange={handleInputChange}
                            placeholder="Any special instructions or notes"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsScheduleServiceDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleScheduleService}>
                          Schedule
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedSenior.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Address</p>
                    <p className="font-medium">{selectedSenior.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="overview">
                  <User className="h-4 w-4 mr-2" /> Overview
                </TabsTrigger>
                <TabsTrigger value="services">
                  <Calendar className="h-4 w-4 mr-2" /> Services
                </TabsTrigger>
                <TabsTrigger value="medications">
                  <Pill className="h-4 w-4 mr-2" /> Medications
                </TabsTrigger>
                <TabsTrigger value="messages">
                  <MessageSquare className="h-4 w-4 mr-2" /> Messages
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Emergency Contacts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedSenior.emergencyContacts?.length ? (
                        <div className="space-y-4">
                          {selectedSenior.emergencyContacts.map(
                            (contact, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center"
                              >
                                <div>
                                  <p className="font-medium">{contact.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {contact.relationship}
                                  </p>
                                </div>
                                <Button variant="outline" size="sm">
                                  <Phone className="h-4 w-4 mr-2" />{" "}
                                  {contact.phone}
                                </Button>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          No emergency contacts added
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Recent Health Updates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {filteredHealthUpdates.length ? (
                        <div className="space-y-4">
                          {filteredHealthUpdates.slice(0, 3).map((update) => (
                            <div
                              key={update.id}
                              className="flex items-start space-x-3"
                            >
                              <div className="mt-0.5">
                                {getHealthUpdateIcon(update.type)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{update.title}</p>
                                  {update.status && (
                                    <Badge
                                      className={`${update.status === "normal" ? "bg-green-100 text-green-800" : update.status === "warning" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"} border-0`}
                                    >
                                      {update.status}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm">{update.description}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(update.date)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          No recent health updates
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <ActivityTimeline seniorId={selectedSeniorId} limit={5} />

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upcoming Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredServiceRequests.filter(
                      (sr) => sr.status === "scheduled",
                    ).length ? (
                      <div className="space-y-4">
                        {filteredServiceRequests
                          .filter((sr) => sr.status === "scheduled")
                          .slice(0, 2)
                          .map((service) => (
                            <div
                              key={service.id}
                              className="flex justify-between items-center"
                            >
                              <div>
                                <p className="font-medium">{service.type}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(service.date)} at {service.time}
                                </p>
                              </div>
                              {getServiceStatusBadge(service.status)}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No upcoming services
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="medications" className="space-y-4 pt-4">
                <MedicationMonitoring seniorId={selectedSeniorId} />
              </TabsContent>

              <TabsContent value="services" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Service History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredServiceRequests.length ? (
                      <div className="space-y-4">
                        {filteredServiceRequests.map((service) => (
                          <div
                            key={service.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{service.type}</p>
                                  {getServiceStatusBadge(service.status)}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(service.date)} at {service.time}
                                </p>
                              </div>
                            </div>
                            {service.helper && (
                              <div className="mt-4 flex items-center space-x-3">
                                <Avatar>
                                  <AvatarImage
                                    src={service.helper.avatar}
                                    alt={service.helper.name}
                                  />
                                  <AvatarFallback>
                                    {service.helper.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">
                                    {service.helper.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Helper • {service.helper.phone}
                                  </p>
                                </div>
                              </div>
                            )}
                            {service.notes && (
                              <div className="mt-2 text-sm">
                                <p className="text-muted-foreground">Notes:</p>
                                <p>{service.notes}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No service history
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="messages" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredMessages.length ? (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto">
                          {filteredMessages.map((message) => (
                            <div
                              key={message.id}
                              className="flex items-start space-x-3"
                            >
                              <Avatar>
                                <AvatarImage
                                  src={message.senderAvatar}
                                  alt={message.senderName}
                                />
                                <AvatarFallback>
                                  {message.senderName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <p className="font-medium">
                                    {message.senderName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatTime(message.timestamp)}
                                  </p>
                                </div>
                                <p className="text-sm">{message.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground mb-4">
                          No messages yet
                        </p>
                      )}

                      <div className="flex space-x-2">
                        <Textarea
                          name="newMessage"
                          value={newMessage}
                          onChange={handleInputChange}
                          placeholder="Type a message..."
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage}>Send</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyPortal;
