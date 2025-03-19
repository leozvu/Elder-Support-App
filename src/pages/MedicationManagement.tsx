import React from "react";
import Layout from "@/components/layout/Layout";
import MedicationManager from "@/components/medication/MedicationManager";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pill, Clock, Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const MedicationManagement = () => {
  const handleAddMedication = (medication: any) => {
    console.log("Adding medication:", medication);
    // In a real app, this would call an API to save the medication
  };

  const handleUpdateMedication = (medication: any) => {
    console.log("Updating medication:", medication);
    // In a real app, this would call an API to update the medication
  };

  const handleDeleteMedication = (id: string) => {
    console.log("Deleting medication:", id);
    // In a real app, this would call an API to delete the medication
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Medication Management</h1>

        <Tabs defaultValue="medications" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger
              value="medications"
              className="flex items-center gap-2"
            >
              <Pill className="h-4 w-4" />
              Medications
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Reminder Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="medications" className="mt-0">
            <MedicationManager
              onAddMedication={handleAddMedication}
              onUpdateMedication={handleUpdateMedication}
              onDeleteMedication={handleDeleteMedication}
            />
          </TabsContent>

          <TabsContent value="schedule" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Medication Schedule
                </h2>
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      Today's Medications
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">Lisinopril 10mg</p>
                          <p className="text-sm text-gray-600">
                            Morning with breakfast
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Mark as Taken
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">Metformin 500mg</p>
                          <p className="text-sm text-gray-600">
                            Morning with breakfast
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Mark as Taken
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">Vitamin D 1000 IU</p>
                          <p className="text-sm text-gray-600">Morning</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Mark as Taken
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">Metformin 500mg</p>
                          <p className="text-sm text-gray-600">
                            Evening with dinner
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" disabled>
                          Upcoming
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      Tomorrow's Medications
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">Lisinopril 10mg</p>
                          <p className="text-sm text-gray-600">
                            Morning with breakfast
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" disabled>
                          Upcoming
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">Metformin 500mg</p>
                          <p className="text-sm text-gray-600">
                            Morning with breakfast
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" disabled>
                          Upcoming
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">Vitamin D 1000 IU</p>
                          <p className="text-sm text-gray-600">Morning</p>
                        </div>
                        <Button variant="ghost" size="sm" disabled>
                          Upcoming
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">Metformin 500mg</p>
                          <p className="text-sm text-gray-600">
                            Evening with dinner
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" disabled>
                          Upcoming
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reminders" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Reminder Settings
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Medication Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when it's time to take your
                        medications
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Refill Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when you need to refill your prescriptions
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Missed Dose Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts if you miss taking your medication
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
                        Alert your caregiver if you miss taking medications
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="font-medium mb-4">Reminder Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base">
                          Reminder Time Before Due
                        </Label>
                        <select className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                          <option>5 minutes</option>
                          <option>15 minutes</option>
                          <option>30 minutes</option>
                          <option>1 hour</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-base">Reminder Sound</Label>
                        <select className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                          <option>Gentle Chime</option>
                          <option>Bell</option>
                          <option>Alert</option>
                          <option>None</option>
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

export default MedicationManagement;
