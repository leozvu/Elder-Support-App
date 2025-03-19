import React from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ElderlyDashboard = () => {
  const { userDetails, signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Elderly Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Welcome, {userDetails?.full_name || "User"}!</p>
            <p>Role: {userDetails?.role || "Unknown"}</p>
            <div className="mt-4">
              <Button onClick={handleLogout}>Logout</Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Request Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Click here to request assistance with daily tasks.</p>
              <Button className="mt-2">Request Service</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Track your medication schedule and get reminders.</p>
              <Button className="mt-2">View Medications</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ElderlyDashboard;