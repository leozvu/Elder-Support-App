import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  mockUsers,
  mockHelperProfiles,
  mockServiceRequests,
  mockHubs,
  mockEmergencyContacts,
} from "../../lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";

const MockDataDemo = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Mock Data Demonstration
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        This component displays the mock data used when Supabase connection is
        unavailable
      </p>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="helpers">Helper Profiles</TabsTrigger>
          <TabsTrigger value="services">Service Requests</TabsTrigger>
          <TabsTrigger value="hubs">Community Hubs</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <ScrollArea className="h-[500px]">
            {mockUsers.map((user) => (
              <Card key={user.id} className="mb-4">
                <CardHeader>
                  <CardTitle>
                    {user.first_name} {user.last_name}
                  </CardTitle>
                  <CardDescription>Role: {user.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {user.address}
                  </p>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="helpers">
          <ScrollArea className="h-[500px]">
            {mockHelperProfiles.map((profile) => (
              <Card key={profile.id} className="mb-4">
                <CardHeader>
                  <CardTitle>Helper Profile #{profile.id}</CardTitle>
                  <CardDescription>User ID: {profile.user_id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Bio:</strong> {profile.bio}
                  </p>
                  <p>
                    <strong>Services:</strong> {profile.services.join(", ")}
                  </p>
                  <p>
                    <strong>Verification:</strong> {profile.verification_status}
                  </p>
                  <p>
                    <strong>Rating:</strong> {profile.rating} (
                    {profile.review_count} reviews)
                  </p>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="services">
          <ScrollArea className="h-[500px]">
            {mockServiceRequests.map((request) => (
              <Card key={request.id} className="mb-4">
                <CardHeader>
                  <CardTitle>{request.service_type} Request</CardTitle>
                  <CardDescription>Status: {request.status}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Description:</strong> {request.description}
                  </p>
                  <p>
                    <strong>Scheduled:</strong>{" "}
                    {new Date(request.scheduled_time).toLocaleString()}
                  </p>
                  <p>
                    <strong>Location:</strong> {request.location}
                  </p>
                  <p>
                    <strong>Elderly ID:</strong> {request.elderly_id}
                  </p>
                  {request.helper_id && (
                    <p>
                      <strong>Helper ID:</strong> {request.helper_id}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="hubs">
          <ScrollArea className="h-[500px]">
            {mockHubs.map((hub) => (
              <Card key={hub.id} className="mb-4">
                <CardHeader>
                  <CardTitle>{hub.name}</CardTitle>
                  <CardDescription>{hub.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Phone:</strong> {hub.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {hub.email}
                  </p>
                  <p>
                    <strong>Coordinates:</strong> {hub.latitude},{" "}
                    {hub.longitude}
                  </p>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="emergency">
          <ScrollArea className="h-[500px]">
            {mockEmergencyContacts.map((contact) => (
              <Card key={contact.id} className="mb-4">
                <CardHeader>
                  <CardTitle>{contact.name}</CardTitle>
                  <CardDescription>
                    {contact.relationship} {contact.is_primary && "(Primary)"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>User ID:</strong> {contact.user_id}
                  </p>
                  <p>
                    <strong>Phone:</strong> {contact.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {contact.email}
                  </p>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MockDataDemo;
