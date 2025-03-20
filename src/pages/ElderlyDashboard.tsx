import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Calendar, Clock, Users, MapPin, Bell, Settings, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import DashboardMain from "@/components/dashboard/DashboardMain";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/local-database";
import { Tables } from "@/types/supabase";
import SOSButton from "@/components/emergency/SOSButton";
import { useToast } from "@/components/ui/use-toast";

type UserDetails = Tables<"users">;

const ElderlyDashboard = () => {
  const { userDetails, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [activeTab, setActiveTab] = useState("main");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    async function loadUserData() {
      try {
        setIsLoading(true);
        // Try to get user details from auth context first
        if (userDetails) {
          setUser(userDetails);
          return;
        }
        
        // Fall back to database if auth context doesn't have details
        const userData = await db.getUserDetails();
        setUser(userData);
      } catch (error) {
        console.error("Error loading user data:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [userDetails]);
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const handleEmergencyContact = () => {
    toast({
      title: "Emergency Contacts",
      description: "Opening your emergency contacts list",
    });
    navigate("/emergency-contacts");
  };
  
  const handleAppointments = () => {
    toast({
      title: "Appointments",
      description: "Opening your appointments calendar",
    });
    navigate("/appointments");
  };
  
  const handleMedicalInfo = () => {
    toast({
      title: "Medical Information",
      description: "Opening your medical information",
    });
    navigate("/medical-info");
  };
  
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">An error occurred while loading the dashboard:</p>
              <div className="bg-red-50 p-3 rounded-md mb-4">
                <p className="text-red-700">{error.message}</p>
              </div>
              <Button onClick={() => window.location.reload()}>Refresh Page</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Welcome, {user?.full_name || "Senior"}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/profile")}>
              <Settings className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="main">Main Dashboard</TabsTrigger>
            <TabsTrigger value="health">Health & Wellness</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
          </TabsList>
          
          <TabsContent value="main">
            <DashboardMain />
          </TabsContent>
          
          <TabsContent value="health">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">View and manage your upcoming medical and personal appointments.</p>
                  <Button onClick={handleAppointments}>View Appointments</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Medical Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Access your medical information, medications, and health history.</p>
                  <Button onClick={handleMedicalInfo}>View Medical Info</Button>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Medication Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Set up and manage reminders for your medications.</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-blue-700">No medication reminders set up yet. Click below to add your first reminder.</p>
                  </div>
                  <Button onClick={() => navigate("/medication-reminders")}>
                    Set Up Medication Reminders
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="emergency">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">View and manage your emergency contacts who will be notified in case of an emergency.</p>
                  <Button onClick={handleEmergencyContact}>Manage Emergency Contacts</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Emergency Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Quick access to emergency services and local resources.</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <span className="font-medium">Emergency Services</span>
                      <Button size="sm" variant="destructive" onClick={() => window.open('tel:911')}>
                        Call 911
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <span className="font-medium">Poison Control</span>
                      <Button size="sm" variant="outline" onClick={() => window.open('tel:1-800-222-1222')}>
                        Call
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <span className="font-medium">Local Hospital</span>
                      <Button size="sm" variant="outline" onClick={() => window.open('tel:555-123-4567')}>
                        Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-red-600">Emergency SOS</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-6">In case of emergency, press the SOS button to alert your emergency contacts and get immediate assistance.</p>
                  <div className="flex justify-center">
                    <div className="p-4">
                      <SOSButton userRole="customer" onActivate={() => {
                        toast({
                          title: "SOS Activated",
                          description: "Your emergency contacts have been notified and help is on the way.",
                          variant: "destructive",
                        });
                      }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ElderlyDashboard;