import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Calendar, Clock, HeartPulse, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ElderlyDashboard = () => {
  const { userDetails, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
    }
  };
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
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
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Welcome, {userDetails?.full_name || "User"}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">How can we assist you today?</p>
            <Button onClick={handleLogout} variant="outline" className="mt-2">Logout</Button>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Request Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Need help with daily tasks? Request assistance from our helpers.</p>
              <Button onClick={() => navigate("/request")}>Request Service</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Upcoming Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 italic">No upcoming services scheduled.</p>
              <Button variant="outline" className="mt-4" onClick={() => navigate("/service-history")}>
                View Service History
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-primary" />
                Health & Wellness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Track your medications and wellness activities.</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate("/medications")}>
                  Medications
                </Button>
                <Button variant="outline" onClick={() => navigate("/wellness")}>
                  Wellness
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Nearby Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Find support hubs and community resources near you.</p>
              <Button variant="outline" onClick={() => navigate("/hub-finder")}>
                Find Support Hubs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ElderlyDashboard;