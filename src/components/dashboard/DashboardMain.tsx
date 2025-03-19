import React, { useEffect, useState } from "react";
import { db } from "@/lib/local-database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ServiceRequestList from "./ServiceRequestList";
import NearbyHubsMap from "./NearbyHubsMap";
import SOSButton from "../emergency/SOSButton";
import BillPaymentReminders from "../financial/BillPaymentReminders";
import FinancialResourcesPanel from "../financial/FinancialResourcesPanel";
import { Tables } from "@/types/supabase";
import { DollarSign, Wrench, Info } from "lucide-react";

type UserDetails = Tables<"users"> & {
  helperProfile?: Tables<"helper_profiles">;
};

const DashboardMain = () => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("services");

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true);
        const userDetails = await db.getUserDetails();
        setUser(userDetails);
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Welcome, {user?.full_name || "User"}
        </h1>
        {user?.role === "customer" && (
          <div className="fixed bottom-6 right-6 z-10">
            <SOSButton />
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          {user?.role === "helper" && (
            <TabsTrigger value="helper">Helper Profile</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ServiceRequestList />
            <NearbyHubsMap />
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <BillPaymentReminders />
            <FinancialResourcesPanel />
          </div>
        </TabsContent>

        {user?.role === "helper" && (
          <TabsContent value="helper" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Helper Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Verification Status</h3>
                    <p className="text-sm">
                      {user.helperProfile?.verification_status ===
                      "approved" ? (
                        <span className="text-green-600">Approved</span>
                      ) : user.helperProfile?.verification_status ===
                        "pending" ? (
                        <span className="text-yellow-600">Pending Review</span>
                      ) : (
                        <span className="text-red-600">Not Verified</span>
                      )}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium">Services Offered</h3>
                    {user.helperProfile?.services_offered &&
                    user.helperProfile.services_offered.length > 0 ? (
                      <ul className="list-disc list-inside text-sm">
                        {user.helperProfile.services_offered.map(
                          (service, index) => (
                            <li key={index}>{service}</li>
                          ),
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No services specified yet
                      </p>
                    )}
                  </div>

                  {user.helperProfile?.average_rating && (
                    <div>
                      <h3 className="font-medium">Rating</h3>
                      <div className="flex items-center">
                        <div className="text-yellow-500 text-lg font-bold">
                          {user.helperProfile.average_rating.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-500 ml-2">
                          ({user.helperProfile.total_reviews || 0} reviews)
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Skill Verification</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="mr-3 mt-0.5">
                          <Wrench className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-800">
                            Home Maintenance Skills
                          </h4>
                          <p className="text-sm text-blue-700 mt-1">
                            You can now add home maintenance skills to your
                            profile. Helpers with verified maintenance skills
                            can assist seniors with home repairs and maintenance
                            tasks.
                          </p>
                          <Button className="mt-3" size="sm">
                            Add Maintenance Skills
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="mr-3 mt-0.5">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-green-800">
                            Financial Assistance Verification
                          </h4>
                          <p className="text-sm text-green-700 mt-1">
                            Helpers can now assist seniors with bill payments
                            and financial management. Additional verification is
                            required for this sensitive role.
                          </p>
                          <Button className="mt-3" size="sm">
                            Apply for Financial Assistance Role
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {activeTab === "services" && (
        <Card className="mt-6 border-dashed border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-800">
                  New Services Available
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  We've expanded our services to include home maintenance and
                  financial assistance. Check out the new options when
                  requesting help or explore the Financial tab for bill payment
                  reminders and resources.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardMain;
