import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Activity,
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  Phone,
  User,
  MapPin,
  AlertCircle,
  Pill,
  HeartPulse,
  Bell,
} from "lucide-react";
import SeniorDetailView from "./SeniorDetailView";

interface ElderlyUser {
  id: string;
  name: string;
  avatar: string;
  age: number;
  address: string;
  phone: string;
  emergencyContact: string;
  lastActive: string;
  status: "active" | "inactive" | "emergency";
}

interface ServiceActivity {
  id: string;
  type: string;
  date: string;
  helper: string;
  status: string;
  notes?: string;
}

interface WellnessData {
  id: string;
  date: string;
  feeling: number;
  medicationsTaken: boolean;
  mealsEaten: boolean;
  notes?: string;
}

interface MedicationData {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  lastTaken?: string;
  status: "taken" | "missed" | "upcoming";
}

const CaregiverPortal = () => {
  const [elderlyUsers, setElderlyUsers] = useState<ElderlyUser[]>([
    {
      id: "1",
      name: "Martha Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha",
      age: 78,
      address: "123 Maple Street, Anytown",
      phone: "(555) 123-4567",
      emergencyContact: "John Johnson (Son) - (555) 987-6543",
      lastActive: new Date().toISOString(),
      status: "active",
    },
    {
      id: "2",
      name: "Robert Williams",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      age: 82,
      address: "456 Oak Avenue, Anytown",
      phone: "(555) 234-5678",
      emergencyContact: "Sarah Williams (Daughter) - (555) 876-5432",
      lastActive: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      status: "inactive",
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<ElderlyUser | null>(
    elderlyUsers[0],
  );
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showDetailView, setShowDetailView] = useState(false);

  const [serviceActivities, setServiceActivities] = useState<ServiceActivity[]>(
    [
      {
        id: "1",
        type: "Medical Appointment",
        date: new Date().toISOString(),
        helper: "Henry Helper",
        status: "scheduled",
        notes: "Doctor appointment at 2:00 PM",
      },
      {
        id: "2",
        type: "Grocery Shopping",
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        helper: "Susan Smith",
        status: "completed",
        notes: "Purchased weekly groceries",
      },
      {
        id: "3",
        type: "Home Maintenance",
        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        helper: "Mike Mechanic",
        status: "completed",
        notes: "Fixed leaky faucet in kitchen",
      },
    ],
  );

  const [wellnessData, setWellnessData] = useState<WellnessData[]>([
    {
      id: "1",
      date: new Date().toISOString(),
      feeling: 4,
      medicationsTaken: true,
      mealsEaten: true,
      notes: "Feeling good today",
    },
    {
      id: "2",
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      feeling: 3,
      medicationsTaken: true,
      mealsEaten: true,
    },
    {
      id: "3",
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      feeling: 2,
      medicationsTaken: false,
      mealsEaten: true,
      notes: "Not feeling well, missed morning medication",
    },
  ]);

  const [medications, setMedications] = useState<MedicationData[]>([
    {
      id: "1",
      name: "Blood Pressure Medication",
      dosage: "10mg",
      schedule: "Daily at 8:00 AM",
      lastTaken: new Date().toISOString(),
      status: "taken",
    },
    {
      id: "2",
      name: "Vitamin D",
      dosage: "1000 IU",
      schedule: "Daily at 9:00 AM",
      lastTaken: new Date().toISOString(),
      status: "taken",
    },
    {
      id: "3",
      name: "Arthritis Medication",
      dosage: "20mg",
      schedule: "Twice daily at 8:00 AM and 8:00 PM",
      lastTaken: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      status: "upcoming",
    },
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    missedMedications: true,
    missedWellnessChecks: true,
    serviceUpdates: true,
    emergencyAlerts: true,
    dailySummary: false,
  });

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedUser) return;

    // In a real app, we would send the message to the backend
    console.log(`Message sent to ${selectedUser.name}: ${messageText}`);
    setMessageText("");
    setIsMessageDialogOpen(false);

    // Show a success message
    alert(`Message sent to ${selectedUser.name}`);
  };

  const handleEmergencyCall = () => {
    if (!selectedUser) return;

    // In a real app, we would initiate a call
    console.log(`Initiating emergency call to ${selectedUser.name}`);

    // Show a confirmation
    alert(`Initiating call to ${selectedUser.name} at ${selectedUser.phone}`);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDateTime = (dateStr: string) => {
    return `${formatDate(dateStr)} at ${formatTime(dateStr)}`;
  };

  const getTimeSince = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const getFeelingEmoji = (feeling: number) => {
    switch (feeling) {
      case 1:
        return "😞";
      case 2:
        return "😐";
      case 3:
        return "🙂";
      case 4:
        return "😀";
      case 5:
        return "😄";
      default:
        return "😐";
    }
  };

  const handleViewDetails = (user: ElderlyUser) => {
    setSelectedUser(user);
    setShowDetailView(true);
  };

  if (showDetailView && selectedUser) {
    return (
      <SeniorDetailView
        seniorId={selectedUser.id}
        onBack={() => setShowDetailView(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Caregiver Portal</h2>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Notification Settings</DialogTitle>
                <DialogDescription>
                  Configure how you want to receive notifications about your
                  loved ones.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Missed Medications</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when medications are missed
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.missedMedications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        missedMedications: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Missed Wellness Checks</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when wellness checks are missed
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.missedWellnessChecks}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        missedWellnessChecks: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Service Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Updates about scheduled services
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.serviceUpdates}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        serviceUpdates: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Emergency Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Immediate notification for emergencies
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emergencyAlerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emergencyAlerts: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Summary</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a daily summary report
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.dailySummary}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        dailySummary: checked,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Elderly Users Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Your Loved Ones</CardTitle>
              <CardDescription>Select a person to view details</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {elderlyUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 ${selectedUser?.id === user.id ? "bg-gray-50" : ""}`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.status === "active" ? "bg-green-500" : user.status === "emergency" ? "bg-red-500" : "bg-yellow-500"}`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-sm text-gray-500">
                        Last active: {getTimeSince(user.lastActive)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedUser ? (
            <div className="space-y-6">
              {/* User Profile Card */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <CardTitle>{selectedUser.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {selectedUser.age} years old
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog
                        open={isMessageDialogOpen}
                        onOpenChange={setIsMessageDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MessageCircle className="h-5 w-5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Send Message</DialogTitle>
                            <DialogDescription>
                              Send a message to {selectedUser.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <Textarea
                              placeholder="Type your message here..."
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              className="min-h-[100px]"
                            />
                          </div>
                          <DialogFooter>
                            <Button onClick={handleSendMessage}>
                              Send Message
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleEmergencyCall}
                      >
                        <Phone className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{selectedUser.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{selectedUser.phone}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-gray-500" />
                        <span>Emergency Contact:</span>
                      </div>
                      <div className="pl-6">
                        {selectedUser.emergencyContact}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={() => handleViewDetails(selectedUser)}>
                      View Detailed Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs for different sections */}
              <Tabs defaultValue="overview">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activities">Activities</TabsTrigger>
                  <TabsTrigger value="wellness">Wellness</TabsTrigger>
                  <TabsTrigger value="medications">Medications</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Activity className="h-4 w-4 text-primary" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          {serviceActivities.slice(0, 2).map((activity) => (
                            <div
                              key={activity.id}
                              className="flex items-center gap-2"
                            >
                              <div className="w-2 h-2 rounded-full bg-primary"></div>
                              <span>{activity.type}</span>
                              <span className="text-gray-500 ml-auto">
                                {getTimeSince(activity.date)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <HeartPulse className="h-4 w-4 text-primary" />
                          Wellness Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span>Feeling:</span>
                            <span className="font-medium flex items-center">
                              {getFeelingEmoji(wellnessData[0].feeling)}{" "}
                              {wellnessData[0].feeling >= 4
                                ? "Great"
                                : wellnessData[0].feeling >= 3
                                  ? "Good"
                                  : "Not well"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Medications:</span>
                            <span
                              className={`font-medium ${wellnessData[0].medicationsTaken ? "text-green-600" : "text-red-600"}`}
                            >
                              {wellnessData[0].medicationsTaken
                                ? "Taken"
                                : "Missed"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Meals:</span>
                            <span
                              className={`font-medium ${wellnessData[0].mealsEaten ? "text-green-600" : "text-red-600"}`}
                            >
                              {wellnessData[0].mealsEaten ? "Eaten" : "Missed"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Pill className="h-4 w-4 text-primary" />
                          Medication Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>Taken today:</span>
                            <span className="font-medium">
                              {
                                medications.filter((m) => m.status === "taken")
                                  .length
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <span>Upcoming:</span>
                            <span className="font-medium">
                              {
                                medications.filter(
                                  (m) => m.status === "upcoming",
                                ).length
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span>Missed:</span>
                            <span className="font-medium">
                              {
                                medications.filter((m) => m.status === "missed")
                                  .length
                              }
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {serviceActivities
                          .filter((activity) => activity.status === "scheduled")
                          .map((activity) => (
                            <div
                              key={activity.id}
                              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                            >
                              <div>
                                <h4 className="font-medium">{activity.type}</h4>
                                <div className="text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(activity.date)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatTime(activity.date)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    Helper: {activity.helper}
                                  </div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                Details
                              </Button>
                            </div>
                          ))}

                        {serviceActivities.filter(
                          (activity) => activity.status === "scheduled",
                        ).length === 0 && (
                          <div className="text-center py-4 text-gray-500">
                            No upcoming services scheduled
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Activities Tab */}
                <TabsContent value="activities" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Service History</CardTitle>
                      <CardDescription>
                        Recent services and activities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {serviceActivities.map((activity) => (
                          <div
                            key={activity.id}
                            className="border-b pb-6 last:border-0 last:pb-0"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{activity.type}</h4>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${activity.status === "completed" ? "bg-green-100 text-green-800" : activity.status === "scheduled" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                              >
                                {activity.status.charAt(0).toUpperCase() +
                                  activity.status.slice(1)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 space-y-1">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {formatDate(activity.date)}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {formatTime(activity.date)}
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Helper: {activity.helper}
                              </div>
                              {activity.notes && (
                                <div className="mt-2 bg-gray-50 p-2 rounded">
                                  {activity.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Wellness Tab */}
                <TabsContent value="wellness" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Wellness Checks</CardTitle>
                      <CardDescription>
                        Daily wellness check history
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {wellnessData.map((check) => (
                          <div
                            key={check.id}
                            className="border-b pb-6 last:border-0 last:pb-0"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">
                                Wellness Check - {formatDate(check.date)}
                              </h4>
                              <span className="text-2xl">
                                {getFeelingEmoji(check.feeling)}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Heart
                                    className={`h-4 w-4 ${check.feeling >= 4 ? "text-green-500" : check.feeling >= 3 ? "text-yellow-500" : "text-red-500"}`}
                                  />
                                  <span>Feeling:</span>
                                  <span className="font-medium">
                                    {check.feeling >= 4
                                      ? "Great"
                                      : check.feeling >= 3
                                        ? "Good"
                                        : "Not well"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Pill
                                    className={`h-4 w-4 ${check.medicationsTaken ? "text-green-500" : "text-red-500"}`}
                                  />
                                  <span>Medications:</span>
                                  <span
                                    className={`font-medium ${check.medicationsTaken ? "text-green-600" : "text-red-600"}`}
                                  >
                                    {check.medicationsTaken
                                      ? "Taken"
                                      : "Missed"}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Clock
                                    className={`h-4 w-4 ${check.mealsEaten ? "text-green-500" : "text-red-500"}`}
                                  />
                                  <span>Meals:</span>
                                  <span
                                    className={`font-medium ${check.mealsEaten ? "text-green-600" : "text-red-600"}`}
                                  >
                                    {check.mealsEaten ? "Eaten" : "Missed"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span>Time:</span>
                                  <span className="font-medium">
                                    {formatTime(check.date)}
                                  </span>
                                </div>
                              </div>
                              {check.notes && (
                                <div className="col-span-2 mt-2 bg-gray-50 p-2 rounded">
                                  {check.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Medications Tab */}
                <TabsContent value="medications" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Medication Tracking</CardTitle>
                      <CardDescription>
                        Monitor medication adherence
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {medications.map((medication) => (
                          <div
                            key={medication.id}
                            className="border-b pb-4 last:border-0 last:pb-0"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{medication.name}</h4>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${medication.status === "taken" ? "bg-green-100 text-green-800" : medication.status === "upcoming" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}
                              >
                                {medication.status.charAt(0).toUpperCase() +
                                  medication.status.slice(1)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Dosage:</span>
                                <span>{medication.dosage}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Schedule:</span>
                                <span>{medication.schedule}</span>
                              </div>
                              {medication.lastTaken && (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    Last taken:
                                  </span>
                                  <span>
                                    {formatDateTime(medication.lastTaken)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Select a person to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaregiverPortal;
