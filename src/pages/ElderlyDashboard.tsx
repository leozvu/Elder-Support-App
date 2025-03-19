import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import ServiceRequestCard from "@/components/dashboard/ServiceRequestCard";
import ActiveRequestStatus from "@/components/dashboard/ActiveRequestStatus";
import NearbyHubsMap from "@/components/dashboard/NearbyHubsMap";
import ServiceRequestFlow from "@/components/service/ServiceRequestFlow";
import SOSButton from "@/components/emergency/SOSButton";
import { Button } from "@/components/ui/button";
import {
  Plus,
  X,
  HelpCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import QuickAccessPanel from "@/components/dashboard/QuickAccessPanel";
import FloatingMenu from "@/components/navigation/FloatingMenu";
import { useAuth } from "@/lib/auth";

interface ElderlyDashboardProps {
  userName?: string;
  userAvatar?: string;
  hasActiveRequest?: boolean;
}

const ElderlyDashboard = ({
  userName,
  userAvatar,
  hasActiveRequest = false,
}: ElderlyDashboardProps) => {
  const navigate = useNavigate();
  const [showRequestFlow, setShowRequestFlow] = useState(false);
  const [activeRequest, setActiveRequest] = useState(hasActiveRequest);
  const { userDetails } = useAuth();
  
  // Use provided values or fall back to user details from auth
  const displayName = userName || userDetails?.full_name || "Guest";
  const avatarUrl =
    userAvatar ||
    userDetails?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;

  const handleServiceSelect = (serviceId: string) => {
    setShowRequestFlow(true);
  };

  const handleRequestComplete = (data: any) => {
    setShowRequestFlow(false);
    setActiveRequest(true);
  };

  const handleCloseRequestFlow = () => {
    setShowRequestFlow(false);
  };

  return (
    <Layout userName={displayName} userAvatar={avatarUrl}>
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Main Dashboard Content */}
        {!showRequestFlow ? (
          <>
            {/* Active Request Status (if any) */}
            {activeRequest && (
              <section className="mb-8">
                <ActiveRequestStatus />
              </section>
            )}

            {/* Service Request Card */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Request Services</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="simplified-ui"
                      >
                        <HelpCircle className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click on a service to request assistance</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <ServiceRequestCard
                onServiceSelect={handleServiceSelect}
                simplified={false}
              />
            </section>

            {/* Health Monitoring Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Medication Reminders */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold">Medications</h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="simplified-ui"
                        >
                          <HelpCircle className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Track your medication schedule</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <React.Suspense
                  fallback={
                    <div className="p-4 border rounded-lg">
                      Loading medication reminders...
                    </div>
                  }
                >
                  {React.createElement(
                    React.lazy(
                      () =>
                        import(
                          "@/components/medication/MedicationReminderCard"
                        ),
                    ),
                    {
                      onMarkTaken: (id) =>
                        console.log(`Medication ${id} marked as taken`),
                      onAddMedication: () =>
                        console.log("Add medication clicked"),
                    },
                  )}
                </React.Suspense>
              </section>

              {/* Wellness Checks */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold">Wellness</h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="simplified-ui"
                        >
                          <HelpCircle className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Monitor your health metrics</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <React.Suspense
                  fallback={
                    <div className="p-4 border rounded-lg">
                      Loading wellness checks...
                    </div>
                  }
                >
                  {React.createElement(
                    React.lazy(
                      () => import("@/components/wellness/WellnessCheckCard"),
                    ),
                    {
                      onCheckIn: () => console.log("Wellness check-in clicked"),
                    },
                  )}
                </React.Suspense>
              </section>
            </div>

            {/* Nearby Hubs Map */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Nearby Support Hubs</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="simplified-ui"
                      >
                        <HelpCircle className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>These are support centers near your location</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <NearbyHubsMap />
            </section>

            {/* Community Events Section */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Community Events</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="simplified-ui"
                      >
                        <HelpCircle className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Local events you might be interested in</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <React.Suspense
                fallback={
                  <div className="p-4 border rounded-lg">
                    Loading community events...
                  </div>
                }
              >
                {React.createElement(
                  React.lazy(
                    () =>
                      import("@/components/dashboard/CommunityEventsSection"),
                  ),
                  {
                    onViewAll: () =>
                      (window.location.href = "/community-events"),
                    onRegister: (id) =>
                      console.log(`Registered for event ${id}`),
                    maxEvents: 2,
                  },
                )}
              </React.Suspense>
            </section>

            {/* Quick Access Feature Navigation */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Quick Access</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="simplified-ui"
                      >
                        <HelpCircle className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Quick access to important features</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <QuickAccessPanel role="elderly" />
            </section>

            {/* Fixed SOS Button (Mobile Only) */}
            <div className="fixed bottom-6 right-6 md:hidden z-10">
              <SOSButton userRole="customer" />
            </div>
            
            {/* Floating Menu */}
            <FloatingMenu />
          </>
        ) : (
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="absolute top-0 right-0 z-10"
              onClick={handleCloseRequestFlow}
            >
              <X className="h-6 w-6" />
            </Button>
            <ServiceRequestFlow onComplete={handleRequestComplete} />
          </div>
        )}

        {/* Quick Action Button (when no active flow) */}
        {!showRequestFlow && !activeRequest && (
          <div className="fixed bottom-6 left-6 z-10">
            <Button
              size="lg"
              className="rounded-full h-14 w-14 shadow-lg"
              onClick={() => setShowRequestFlow(true)}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ElderlyDashboard;