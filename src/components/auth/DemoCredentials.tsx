import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DemoCredentials = () => {
  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg mt-4">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-primary">
          Demo Credentials
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-1">Senior User</h3>
            <p className="text-sm">Email: martha@example.com</p>
            <p className="text-sm">Password: password123</p>
          </div>

          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-1">Helper User</h3>
            <p className="text-sm">Email: helper@example.com</p>
            <p className="text-sm">Password: password123</p>
          </div>

          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-1">Admin User</h3>
            <p className="text-sm">Email: admin@example.com</p>
            <p className="text-sm">Password: password123</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoCredentials;
