import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import WellnessCheckSystem from "@/components/wellness/WellnessCheckSystem";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Calendar, Bell, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface WellnessCheck {
  id: string;
  type: string;
  frequency: string;
  lastCompleted?: string;
  nextDue: string;
  status: "completed" | "upcoming" | "overdue";
  questions: string[];
}

interface WellnessMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  date: string;
  target?: {
    min?: number;
    max?: number;
  };
  trend: "up" | "down" | "stable";
}

const WellnessChecks = () => {
  const [wellnessChecks, setWellnessChecks] = useState<WellnessCheck[]>([
    {
      id: "1",
      type: "Daily Health Check",
      frequency: "Daily",
      lastCompleted: "2023-05-15",
      nextDue: "2023-05-16",
      status: "overdue",
      questions: [
        "How are you feeling today?",
        "Did you take all your medications?",
        "Did you experience any new symptoms?",
        "Rate your energy level (1-10)",
        "Rate your pain level (1-10)",
      ],
    },
    {
      id: "2",
      type: "Weekly Mood Assessment",
      frequency: "Weekly",
      lastCompleted: "2023-05-10",
      nextDue: "2023-05-17",
      status: "upcoming",
      questions: [
        "Rate your overall mood this week (1-10)",
        "Have you felt anxious or depressed?",
        "Have you been able to enjoy activities?",
        "How has your sleep been this week?",
        "Do you have any concerns you'd like to share?",
      ],
    },
    {
      id: "3",
      type: "Monthly Health Review",
      frequency: "Monthly",
      lastCompleted: "2023-04-20",
      nextDue: "2023-05-20",
      status: "upcoming",
      questions: [
        "Have you noticed any changes in your health this month?",
        "Have you been able to maintain your daily routines?",
        "Do you have any new health concerns?",
        "Have you had any difficulties with your medications?",
        "Would you like to schedule a check-up with your doctor?",
      ],
    },
  ]);

  const [wellnessMetrics, setWellnessMetrics] = useState<WellnessMetric[]>([
    {
      id: "1",
      name: "Blood Pressure",
      value: 128,
      unit: "mmHg",
      date: "2023-05-15",
      target: {
        min: 110,
        max: 130,
      },
      trend: "stable",
    },
    {
      id: "2",
      name: "Weight",
      value: 165,
      unit: "lbs",
      date: "2023-05-15",
      target: {
        min: 160,
        max: 175,
      },
      trend: "down",
    },
    {
      id: "3",
      name: "Blood Sugar",
      value: 110,
      unit: "mg/dL",
      date: "2023-05-15",
      target: {
        min: 80,
        max: 130,
      },
      trend: "up",
    },
    {
      id: "4",
      name: "Steps",
      value: 3500,
      unit: "steps",
      date: "2023-05-15",
      target: {
        min: 3000,
        max: null,
      },
      trend: "up",
    },
  ]);

  const handleCompleteCheck = (
    id: string,
    responses: Record<string, string | number>,
  ) => {
    console.log("Completed check:", id, responses);
    // In a real app, this would call an API to save the check responses

    // Update the check status
    const updatedChecks = wellnessChecks.map((check) =>
      check.id === id
        ? {
            ...check,
            status: "completed" as const,
            lastCompleted: new Date().toISOString().split("T")[0],
          }
        : check,
    );

    setWellnessChecks(updatedChecks);
  };

  const handleAddMetric = (metric: Omit<WellnessMetric, "id" | "trend">) => {
    console.log("Adding metric:", metric);
    // In a real app, this would call an API to save the metric

    // Find previous metric to determine trend
    const previousMetric = wellnessMetrics.find((m) => m.name === metric.name);
    const trend = previousMetric
      ? metric.value > previousMetric.value
        ? "up"
        : metric.value < previousMetric.value
          ? "down"
          : "stable"
      : "stable";

    const newMetric: WellnessMetric = {
      id: Date.now().toString(),
      ...metric,
      trend: trend as "up" | "down" | "stable",
    };

    setWellnessMetrics([newMetric, ...wellnessMetrics]);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Wellness Monitoring</h1>

        <Tabs defaultValue="checks" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="checks" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Wellness Checks
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              History & Trends
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notification Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checks" className="mt-0">
            <WellnessCheckSystem
              wellnessChecks={wellnessChecks.map((check) => ({
                ...check,
                questions: check.questions.map((q, i) => ({
                  id: `q${i + 1}`,
                  text: q,
                  type: q.toLowerCase().includes("rate")
                    ? "scale"
                    : q.toLowerCase().includes("did") ||
                        q.toLowerCase().includes("have")
                      ? "yesno"
                      : "text",
                })),
              }))}
              wellnessMetrics={wellnessMetrics}
              onCompleteCheck={handleCompleteCheck}
              onAddMetric={handleAddMetric}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Health History & Trends
                </h2>
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <LineChart className="h-5 w-5 text-primary" />
                      Recent Trends
                    </h3>
                    <div className="h-64 flex items-center justify-center border rounded bg-gray-50">
                      <p className="text-gray-500">
                        Health trend charts will appear here
                      </p>
                    </div>
                    <div className="mt-4 flex gap-2 flex-wrap">
                      <Button variant="outline" size="sm">
                        Blood Pressure
                      </Button>
                      <Button variant="outline" size="sm">
                        Weight
                      </Button>
                      <Button variant="outline" size="sm">
                        Blood Sugar
                      </Button>
                      <Button variant="outline" size="sm">
                        Activity Level
                      </Button>
                      <Button variant="outline" size="sm">
                        Sleep Quality
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      Completed Wellness Checks
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">Daily Health Check</p>
                          <p className="text-sm text-gray-600">
                            Completed on May 15, 2023
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">Weekly Mood Assessment</p>
                          <p className="text-sm text-gray-600">
                            Completed on May 10, 2023
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">Monthly Health Review</p>
                          <p className="text-sm text-gray-600">
                            Completed on April 20, 2023
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Wellness Check Settings
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Daily Check Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive daily reminders to complete your health check
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        Weekly Assessment Reminders
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when your weekly mood assessment is due
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        Monthly Review Reminders
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive monthly reminders for your health review
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        Caregiver Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Alert your caregiver if you miss wellness checks
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Health Metric Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get alerts when health metrics are outside target ranges
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="font-medium mb-4">Reminder Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base">
                          Preferred Reminder Time
                        </Label>
                        <select className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                          <option>8:00 AM</option>
                          <option>9:00 AM</option>
                          <option>10:00 AM</option>
                          <option>11:00 AM</option>
                          <option>12:00 PM</option>
                          <option>1:00 PM</option>
                          <option>2:00 PM</option>
                          <option>3:00 PM</option>
                          <option>4:00 PM</option>
                          <option>5:00 PM</option>
                          <option>6:00 PM</option>
                          <option>7:00 PM</option>
                          <option>8:00 PM</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-base">Reminder Method</Label>
                        <select className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                          <option>App Notification</option>
                          <option>SMS Text</option>
                          <option>Email</option>
                          <option>Voice Call</option>
                          <option>All Methods</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default WellnessChecks;
