import React from "react";
import { useAuth } from "@/hooks/useAuth.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                />
                <AvatarFallback>
                  {user.full_name?.charAt(0) || user.email.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{user.full_name || "User"}</CardTitle>
              <p className="text-sm text-gray-500">{user.email}</p>
              <span className="mt-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full mb-2">
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="personal">
            <TabsList className="w-full">
              <TabsTrigger value="personal" className="flex-1">
                Personal Information
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex-1">
                Preferences
              </TabsTrigger>
              <TabsTrigger value="security" className="flex-1">
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Full Name
                      </h3>
                      <p>{user.full_name || "Not provided"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Email
                      </h3>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Role
                      </h3>
                      <p>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Member Since
                      </h3>
                      <p>January 1, 2023</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Preference settings will be available soon.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Security settings will be available soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
