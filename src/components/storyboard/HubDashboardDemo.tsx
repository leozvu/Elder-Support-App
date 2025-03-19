import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HubPerformanceMetrics from "@/components/hub/HubPerformanceMetrics";
import HubStaffChat from "@/components/hub/HubStaffChat";

const HubDashboardDemo = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Hub Dashboard Enhancements</h1>

      <Card>
        <CardHeader>
          <CardTitle>Hub Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <HubPerformanceMetrics hubId="hub-1" timeRange="week" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hub Staff Communication</CardTitle>
        </CardHeader>
        <CardContent>
          <HubStaffChat hubId="hub-1" currentUserId="staff-1" />
        </CardContent>
      </Card>
    </div>
  );
};

export default HubDashboardDemo;
