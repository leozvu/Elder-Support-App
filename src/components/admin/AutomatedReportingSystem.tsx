import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  FileText,
  Mail,
  Plus,
  Settings,
  Trash,
  Users,
  Edit,
  BarChart,
  PieChart,
  LineChart,
  Activity,
  Heart,
  Pill,
} from "lucide-react";

interface AutomatedReportingSystemProps {
  hubId?: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  type: "service" | "wellness" | "medication" | "activity";
  frequency: "daily" | "weekly" | "monthly";
  recipients: Recipient[];
  lastSent?: string;
  nextScheduled?: string;
  metrics: string[];
  active: boolean;
}

interface Recipient {
  id: string;
  name: string;
  email: string;
  relationship: string;
  avatar?: string;
}

const AutomatedReportingSystem: React.FC<AutomatedReportingSystemProps> = ({
  hubId,
}) => {
  const [activeTab, setActiveTab] = useState("templates");
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ReportTemplate | null>(null);
  const [showAddRecipient, setShowAddRecipient] = useState(false);

  // Mock data for demonstration
  const reportTemplates: ReportTemplate[] = [
    {
      id: "report-1",
      name: "Weekly Service Summary",
      type: "service",
      frequency: "weekly",
      recipients: [
        {
          id: "rec-1",
          name: "Jennifer Smith",
          email: "jennifer.smith@example.com",
          relationship: "Daughter",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer",
        },
        {
          id: "rec-2",
          name: "Robert Johnson",
          email: "robert.johnson@example.com",
          relationship: "Son",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
        },
      ],
      lastSent: "2023-05-15",
      nextScheduled: "2023-05-22",
      metrics: ["Service Completion", "Helper Ratings", "Service Duration"],
      active: true,
    },
    {
      id: "report-2",
      name: "Monthly Wellness Check Report",
      type: "wellness",
      frequency: "monthly",
      recipients: [
        {
          id: "rec-1",
          name: "Jennifer Smith",
          email: "jennifer.smith@example.com",
          relationship: "Daughter",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer",
        },
        {
          id: "rec-3",
          name: "Dr. Michael Brown",
          email: "dr.brown@example.com",
          relationship: "Physician",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        },
      ],
      lastSent: "2023-04-30",
      nextScheduled: "2023-05-31",
      metrics: ["Blood Pressure", "Weight", "Sleep Quality", "Mood"],
      active: true,
    },
    {
      id: "report-3",
      name: "Daily Medication Adherence",
      type: "medication",
      frequency: "daily",
      recipients: [
        {
          id: "rec-1",
          name: "Jennifer Smith",
          email: "jennifer.smith@example.com",
          relationship: "Daughter",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer",
        },
      ],
      lastSent: "2023-05-16",
      nextScheduled: "2023-05-17",
      metrics: ["Medication Taken", "Missed Doses", "Refill Reminders"],
      active: false,
    },
  ];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getReportTypeIcon = (type: ReportTemplate["type"]) => {
    switch (type) {
      case "service":
        return <Users className="h-5 w-5 text-blue-500" />;
      case "wellness":
        return <Heart className="h-5 w-5 text-red-500" />;
      case "medication":
        return <Pill className="h-5 w-5 text-green-500" />;
      case "activity":
        return <Activity className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getReportTypeLabel = (type: ReportTemplate["type"]) => {
    switch (type) {
      case "service":
        return <Badge className="bg-blue-100 text-blue-800">Service</Badge>;
      case "wellness":
        return <Badge className="bg-red-100 text-red-800">Wellness</Badge>;
      case "medication":
        return (
          <Badge className="bg-green-100 text-green-800">Medication</Badge>
        );
      case "activity":
        return (
          <Badge className="bg-purple-100 text-purple-800">Activity</Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getFrequencyLabel = (frequency: ReportTemplate["frequency"]) => {
    switch (frequency) {
      case "daily":
        return <Badge variant="outline">Daily</Badge>;
      case "weekly":
        return <Badge variant="outline">Weekly</Badge>;
      case "monthly":
        return <Badge variant="outline">Monthly</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleCreateTemplate = () => {
    // In a real app, this would save the new template
    setShowCreateTemplate(false);
  };

  const handleAddRecipient = () => {
    // In a real app, this would add a new recipient
    setShowAddRecipient(false);
  };

  const handleEditTemplate = (template: ReportTemplate) => {
    setSelectedTemplate(template);
  };

  const handleDeleteTemplate = (templateId: string) => {
    // In a real app, this would delete the template
    console.log(`Delete template: ${templateId}`);
  };

  const handleToggleActive = (templateId: string, active: boolean) => {
    // In a real app, this would toggle the active status
    console.log(
      `Toggle template ${templateId} to ${active ? "active" : "inactive"}`,
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Automated Reporting System</h2>
        <Button onClick={() => setShowCreateTemplate(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Report Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Reports</p>
                <p className="text-3xl font-bold">
                  {reportTemplates.filter((t) => t.active).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Reports Sent (This Month)
                </p>
                <p className="text-3xl font-bold">24</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Scheduled Today</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="templates"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates" className="text-lg py-3">
            <FileText className="mr-2 h-5 w-5" />
            Report Templates
          </TabsTrigger>
          <TabsTrigger value="schedule" className="text-lg py-3">
            <Calendar className="mr-2 h-5 w-5" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-lg py-3">
            <BarChart className="mr-2 h-5 w-5" />
            Report Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <div className="space-y-4">
            {reportTemplates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gray-100 rounded-full">
                        {getReportTypeIcon(template.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {template.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {getReportTypeLabel(template.type)}
                          {getFrequencyLabel(template.frequency)}
                          <Badge
                            variant="outline"
                            className={
                              template.active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {template.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              Last sent:{" "}
                              {template.lastSent
                                ? formatDate(template.lastSent)
                                : "Never"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Next scheduled:{" "}
                              {template.nextScheduled
                                ? formatDate(template.nextScheduled)
                                : "Not scheduled"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Recipients:</span>
                        <div className="flex -space-x-2">
                          {template.recipients.map((recipient) => (
                            <Avatar
                              key={recipient.id}
                              className="h-6 w-6 border-2 border-white"
                            >
                              <AvatarImage
                                src={recipient.avatar}
                                alt={recipient.name}
                              />
                              <AvatarFallback>
                                {recipient.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={() => {
                              setSelectedTemplate(template);
                              setShowAddRecipient(true);
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleToggleActive(template.id, !template.active)
                          }
                        >
                          {template.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Metrics Included</h4>
                    <div className="flex flex-wrap gap-2">
                      {template.metrics.map((metric, index) => (
                        <Badge key={index} variant="secondary">
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Schedule Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Today's Reports</h3>
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" /> View Full Calendar
                  </Button>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      name: "Daily Medication Adherence",
                      time: "8:00 AM",
                      type: "medication",
                      recipients: 1,
                      status: "sent",
                    },
                    {
                      name: "Morning Wellness Check",
                      time: "9:30 AM",
                      type: "wellness",
                      recipients: 2,
                      status: "sent",
                    },
                    {
                      name: "Evening Medication Adherence",
                      time: "6:00 PM",
                      type: "medication",
                      recipients: 1,
                      status: "pending",
                    },
                  ].map((report, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-gray-100">
                          {report.type === "medication" ? (
                            <Pill className="h-5 w-5 text-green-500" />
                          ) : (
                            <Heart className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{report.time}</span>
                            <span>•</span>
                            <Users className="h-4 w-4" />
                            <span>{report.recipients} recipient(s)</span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={
                          report.status === "sent"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {report.status === "sent" ? "Sent" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-6">
                  <h3 className="font-semibold">Upcoming Reports</h3>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      name: "Weekly Service Summary",
                      date: "May 22, 2023",
                      time: "9:00 AM",
                      type: "service",
                      recipients: 2,
                    },
                    {
                      name: "Weekly Wellness Summary",
                      date: "May 22, 2023",
                      time: "10:00 AM",
                      type: "wellness",
                      recipients: 3,
                    },
                    {
                      name: "Monthly Medication Review",
                      date: "May 31, 2023",
                      time: "9:00 AM",
                      type: "medication",
                      recipients: 2,
                    },
                  ].map((report, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-gray-100">
                          {report.type === "service" ? (
                            <Users className="h-5 w-5 text-blue-500" />
                          ) : report.type === "wellness" ? (
                            <Heart className="h-5 w-5 text-red-500" />
                          ) : (
                            <Pill className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{report.date}</span>
                            <span>•</span>
                            <Clock className="h-4 w-4" />
                            <span>{report.time}</span>
                            <span>•</span>
                            <Users className="h-4 w-4" />
                            <span>{report.recipients} recipient(s)</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Delivery Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Delivery Success Rate</span>
                      <span>98.5%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: "98.5%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Open Rate</span>
                      <span>76.2%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: "76.2%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Click-through Rate</span>
                      <span>42.8%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{ width: "42.8%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Reports by Type</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="flex justify-center mb-2">
                        <Users className="h-8 w-8 text-blue-500" />
                      </div>
                      <p className="font-medium">Service Reports</p>
                      <p className="text-2xl font-bold mt-1">42</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="flex justify-center mb-2">
                        <Heart className="h-8 w-8 text-red-500" />
                      </div>
                      <p className="font-medium">Wellness Reports</p>
                      <p className="text-2xl font-bold mt-1">36</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="flex justify-center mb-2">
                        <Pill className="h-8 w-8 text-green-500" />
                      </div>
                      <p className="font-medium">Medication Reports</p>
                      <p className="text-2xl font-bold mt-1">93</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="flex justify-center mb-2">
                        <Activity className="h-8 w-8 text-purple-500" />
                      </div>
                      <p className="font-medium">Activity Reports</p>
                      <p className="text-2xl font-bold mt-1">28</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recipient Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Most Engaged Recipients</h3>
                    <Button variant="outline" size="sm">
                      <BarChart className="mr-2 h-4 w-4" /> View Full Report
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        name: "Jennifer Smith",
                        email: "jennifer.smith@example.com",
                        relationship: "Daughter",
                        openRate: 98,
                        avatar:
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer",
                      },
                      {
                        name: "Robert Johnson",
                        email: "robert.johnson@example.com",
                        relationship: "Son",
                        openRate: 85,
                        avatar:
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
                      },
                      {
                        name: "Dr. Michael Brown",
                        email: "dr.brown@example.com",
                        relationship: "Physician",
                        openRate: 92,
                        avatar:
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
                      },
                    ].map((recipient, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={recipient.avatar}
                              alt={recipient.name}
                            />
                            <AvatarFallback>
                              {recipient.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{recipient.name}</p>
                            <p className="text-sm text-gray-600">
                              {recipient.relationship}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{recipient.openRate}%</p>
                          <p className="text-sm text-gray-600">Open Rate</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Feedback Summary</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium">Report Usefulness</span>
                        <span className="font-bold">4.7/5</span>
                      </div>
                      <div className="flex gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-5 w-5 ${star <= 4.7 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        Based on feedback from 28 recipients over the last 30
                        days.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Template Dialog */}
      <Dialog open={showCreateTemplate} onOpenChange={setShowCreateTemplate}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Report Template</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Template Name</Label>
              <Input
                id="name"
                placeholder="e.g. Weekly Service Summary"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Report Type</Label>
              <Select defaultValue="service">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service">Service Usage</SelectItem>
                  <SelectItem value="wellness">Wellness Checks</SelectItem>
                  <SelectItem value="medication">
                    Medication Adherence
                  </SelectItem>
                  <SelectItem value="activity">Activity Tracking</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Frequency</Label>
              <Select defaultValue="weekly">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Metrics to Include</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="metric1" defaultChecked />
                  <label
                    htmlFor="metric1"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Service Completion
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="metric2" defaultChecked />
                  <label
                    htmlFor="metric2"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Helper Ratings
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="metric3" defaultChecked />
                  <label
                    htmlFor="metric3"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Service Duration
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="metric4" />
                  <label
                    htmlFor="metric4"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Cost Summary
                  </label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Recipients</Label>
              <div className="col-span-3">
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Recipients
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCreateTemplate(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate}>Create Template</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Recipient Dialog */}
      <Dialog open={showAddRecipient} onOpenChange={setShowAddRecipient}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Recipient to {selectedTemplate?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Name</Label>
              <Input
                id="recipientName"
                placeholder="e.g. John Smith"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Email</Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="e.g. john.smith@example.com"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Relationship</Label>
              <Select defaultValue="family">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="family">Family Member</SelectItem>
                  <SelectItem value="caregiver">Caregiver</SelectItem>
                  <SelectItem value="physician">Physician</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddRecipient(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddRecipient}>Add Recipient</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AutomatedReportingSystem;
