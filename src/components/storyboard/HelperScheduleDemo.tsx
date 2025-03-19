import React from "react";
import HelperAvailabilityCalendar from "@/components/helper/HelperAvailabilityCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HelperScheduleDemo = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Helper Schedule Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Availability Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <HelperAvailabilityCalendar />
        </CardContent>
      </Card>
    </div>
  );
};

export default HelperScheduleDemo;
