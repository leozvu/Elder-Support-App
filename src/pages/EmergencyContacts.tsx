import React from "react";
import Layout from "@/components/layout/Layout";
import EmergencyContactManager from "@/components/emergency/EmergencyContactManager";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Phone, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const EmergencyContacts = () => {
  const handleAddContact = (contact: any) => {
    console.log("Adding contact:", contact);
    // In a real app, this would call an API to save the contact
  };

  const handleUpdateContact = (contact: any) => {
    console.log("Updating contact:", contact);
    // In a real app, this would call an API to update the contact
  };

  const handleDeleteContact = (id: string) => {
    console.log("Deleting contact:", id);
    // In a real app, this would call an API to delete the contact
  };

  const handleSetPrimary = (id: string) => {
    console.log("Setting primary contact:", id);
    // In a real app, this would call an API to set the primary contact
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Emergency Settings</h1>

        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alert Settings
            </TabsTrigger>
            <TabsTrigger value="medical" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Medical Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="mt-0">
            <EmergencyContactManager
              onAddContact={handleAddContact}
              onUpdateContact={handleUpdateContact}
              onDeleteContact={handleDeleteContact}
              onSetPrimary={handleSetPrimary}
            />
          </TabsContent>

          <TabsContent value="alerts" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Alert Preferences
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Fall Detection</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically detect falls and alert emergency contacts
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Inactivity Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Send alerts if no activity is detected for 24 hours
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Medication Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Alert emergency contacts if medications are missed
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Location Sharing</Label>
                      <p className="text-sm text-muted-foreground">
                        Share your location with emergency contacts during an
                        alert
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="font-medium mb-4">Alert Testing</h3>
                    <div className="flex items-start gap-4 bg-muted p-4 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-amber-500 mt-1" />
                      <div>
                        <p className="mb-2">
                          Test your emergency alert system to ensure your
                          contacts receive notifications properly.
                        </p>
                        <Button variant="outline" size="sm">
                          Send Test Alert
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Medical Information
                </h2>
                <p className="text-muted-foreground mb-6">
                  This information will be shared with emergency responders
                  during an emergency.
                </p>

                <div className="space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="conditions">Medical Conditions</Label>
                    <textarea
                      id="conditions"
                      className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="List any medical conditions..."
                      defaultValue="Hypertension, Type 2 Diabetes"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="medications">Current Medications</Label>
                    <textarea
                      id="medications"
                      className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="List your current medications..."
                      defaultValue="Lisinopril 10mg (morning), Metformin 500mg (twice daily)"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <textarea
                      id="allergies"
                      className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="List any allergies..."
                      defaultValue="Penicillin, Shellfish"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="doctor">Primary Physician</Label>
                    <input
                      id="doctor"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Doctor's name and contact information"
                      defaultValue="Dr. Michael Brown, (555) 456-7890"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button>Save Medical Information</Button>
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

export default EmergencyContacts;
