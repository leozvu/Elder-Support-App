import React from "react";
import ChatInterface from "@/components/communication/ChatInterface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DirectCommunicationDemo = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Direct Communication System</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Chat with Helper</CardTitle>
          </CardHeader>
          <CardContent>
            <ChatInterface
              recipientId="helper-1"
              recipientName="John Smith"
              recipientAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
              recipientType="helper"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chat with Hub</CardTitle>
          </CardHeader>
          <CardContent>
            <ChatInterface
              recipientId="hub-1"
              recipientName="Sunshine Community Hub"
              recipientAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Hub"
              recipientType="hub"
              simplified={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DirectCommunicationDemo;
