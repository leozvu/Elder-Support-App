import React, { useEffect, useState } from "react";
import { db } from "@/lib/local-database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tables } from "@/types/supabase";
import {
  CalendarClock,
  MapPin,
  Clock,
  User,
  Star,
  MessageSquare,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { useVoiceGuidance } from "@/hooks/useVoiceGuidance";
import VoiceGuidedElement from "@/components/voice-guidance/VoiceGuidedElement";

type ServiceRequest = Tables<"service_requests"> & {
  service_type: Tables<"service_types">;
  helper?: Tables<"users">;
};

interface EnhancedServiceHistoryProps {
  simplified?: boolean;
  className?: string;
}

const EnhancedServiceHistory = ({
  simplified = false,
  className = "",
}: EnhancedServiceHistoryProps) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const { speak } = useVoiceGuidance();

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        const user = await db.getCurrentUser();

        if (!user) {
          setError("User not authenticated");
          return;
        }

        // Get all requests for history view
        const { data, error } = await db
          .from("service_requests")
          .select(
            `*, 
            service_type:service_type_id(id, name, icon), 
            helper:helper_id(id, full_name, avatar_url)`,
          )
          .eq("customer_id", user.id)
          .order("scheduled_time", { ascending: false });

        if (error) throw error;
        setRequests(data || []);
      } catch (err: any) {
        console.error("Error loading service history:", err);
        setError(err.message || "Failed to load service history");
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  const getFilteredRequests = () => {
    switch (activeTab) {
      case "completed":
        return requests.filter((req) => req.status === "completed");
      case "cancelled":
        return requests.filter((req) => req.status === "cancelled");
      case "upcoming":
        return requests.filter((req) =>
          ["pending", "accepted", "in_progress"].includes(req.status),
        );
      default:
        return requests;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="secondary"
            className="text-lg py-1 px-3 bg-green-100 text-green-800 border-green-300"
          >
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="secondary"
            className="text-lg py-1 px-3 bg-red-100 text-red-800 border-red-300"
          >
            Cancelled
          </Badge>
        );
      case "in_progress":
        return (
          <Badge
            variant="secondary"
            className="text-lg py-1 px-3 bg-blue-100 text-blue-800 border-blue-300"
          >
            In Progress
          </Badge>
        );
      case "accepted":
        return (
          <Badge
            variant="secondary"
            className="text-lg py-1 px-3 bg-purple-100 text-purple-800 border-purple-300"
          >
            Accepted
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="text-lg py-1 px-3 bg-yellow-100 text-yellow-800 border-yellow-300"
          >
            Pending
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="text-lg py-1 px-3 bg-gray-100 text-gray-800 border-gray-300"
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
          </Badge>
        );
    }
  };

  const handleViewDetails = (request: ServiceRequest) => {
    // In a real app, this would navigate to a details page
    console.log("View details for request:", request.id);
    speak(
      `Viewing details for ${request.service_type?.name} service on ${format(new Date(request.scheduled_time), "PPPP")}`,
    );
  };

  const handleContactHelper = (helper: any) => {
    // In a real app, this would open a chat or call interface
    console.log("Contact helper:", helper.id);
    speak(`Contacting ${helper.full_name}`);
  };

  if (loading) {
    return (
      <Card className={`w-full bg-white shadow-md ${className}`}>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p className="text-xl text-gray-500">Loading service history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`w-full bg-white shadow-md ${className}`}>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40 flex-col gap-4">
            <p className="text-xl text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className={`w-full bg-white shadow-md ${className}`}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Service History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p className="text-xl text-gray-500">No services found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // For simplified view, just show a list of past services without tabs
  if (simplified) {
    const completedRequests = requests.filter(
      (req) => req.status === "completed",
    );

    return (
      <Card className={`w-full bg-white shadow-md ${className}`}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Service History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {completedRequests.length === 0 ? (
              <p className="text-xl text-center text-gray-500">
                No past services found
              </p>
            ) : (
              completedRequests.slice(0, 5).map((request) => (
                <VoiceGuidedElement
                  key={request.id}
                  description={`${request.service_type?.name} service on ${format(new Date(request.scheduled_time), "PPPP")}`}
                >
                  <div
                    className="border-2 rounded-lg p-5 hover:border-primary transition-colors cursor-pointer bg-gray-50"
                    onClick={() => handleViewDetails(request)}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                        <h3 className="font-bold text-xl md:text-2xl mb-2">
                          {request.service_type?.name || "Unknown Service"}
                        </h3>
                        <div className="flex items-center text-gray-700 mb-2">
                          <MapPin className="h-5 w-5 mr-2" />
                          <span className="text-lg">{request.address}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-700 mb-2">
                          <div className="flex items-center">
                            <CalendarClock className="h-5 w-5 mr-2" />
                            <span className="text-lg">
                              {format(new Date(request.scheduled_time), "PPP")}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 mr-2" />
                            <span className="text-lg">
                              {format(new Date(request.scheduled_time), "p")}
                            </span>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    {request.helper && (
                      <div className="mt-4 flex items-center border-t pt-4 border-gray-200">
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3 border border-gray-300">
                          <img
                            src={
                              request.helper.avatar_url ||
                              "https://api.dicebear.com/7.x/avataaars/svg?seed=Helper"
                            }
                            alt="Helper"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-lg">
                          Helped by: <strong>{request.helper.full_name}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                </VoiceGuidedElement>
              ))
            )}

            {completedRequests.length > 5 && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg"
                  onClick={() => speak("View all past services")}
                >
                  View All Services
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full view with tabs
  return (
    <Card className={`w-full bg-white shadow-md ${className}`}>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-2xl font-bold">Service History</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="all"
              className="text-lg py-2"
              onClick={() => speak("All services tab")}
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="text-lg py-2"
              onClick={() => speak("Upcoming services tab")}
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="text-lg py-2"
              onClick={() => speak("Completed services tab")}
            >
              Completed
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="text-lg py-2"
              onClick={() => speak("Cancelled services tab")}
            >
              Cancelled
            </TabsTrigger>
          </TabsList>

          {["all", "upcoming", "completed", "cancelled"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-6">
              <div className="space-y-6">
                {getFilteredRequests().length === 0 ? (
                  <p className="text-xl text-center text-gray-500 py-8">
                    No {tab !== "all" ? tab : ""} services found
                  </p>
                ) : (
                  getFilteredRequests().map((request) => (
                    <VoiceGuidedElement
                      key={request.id}
                      description={`${request.service_type?.name} service on ${format(new Date(request.scheduled_time), "PPPP")}, status: ${request.status}`}
                    >
                      <div className="border-2 rounded-lg p-5 hover:border-primary transition-colors bg-gray-50">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                          <div>
                            <h3 className="font-bold text-xl md:text-2xl mb-2">
                              {request.service_type?.name || "Unknown Service"}
                            </h3>
                            <div className="flex items-center text-gray-700 mb-2">
                              <MapPin className="h-5 w-5 mr-2" />
                              <span className="text-lg">{request.address}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-700 mb-2">
                              <div className="flex items-center">
                                <CalendarClock className="h-5 w-5 mr-2" />
                                <span className="text-lg">
                                  {format(
                                    new Date(request.scheduled_time),
                                    "PPP",
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-5 w-5 mr-2" />
                                <span className="text-lg">
                                  {format(
                                    new Date(request.scheduled_time),
                                    "p",
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            {getStatusBadge(request.status)}
                          </div>
                        </div>

                        {request.helper && (
                          <div className="mt-4 flex items-center border-t pt-4 border-gray-200">
                            <div className="h-10 w-10 rounded-full overflow-hidden mr-3 border border-gray-300">
                              <img
                                src={
                                  request.helper.avatar_url ||
                                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Helper"
                                }
                                alt="Helper"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <span className="text-lg flex-1">
                              Helped by:{" "}
                              <strong>{request.helper.full_name}</strong>
                            </span>

                            <div className="flex gap-2">
                              {request.status === "completed" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => speak("Rate this service")}
                                >
                                  <Star className="h-4 w-4" />
                                  <span>Rate</span>
                                </Button>
                              )}

                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() =>
                                  handleContactHelper(request.helper)
                                }
                              >
                                <MessageSquare className="h-4 w-4" />
                                <span>Contact</span>
                              </Button>

                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleViewDetails(request)}
                              >
                                Details
                              </Button>
                            </div>
                          </div>
                        )}

                        {!request.helper && request.status !== "cancelled" && (
                          <div className="mt-4 flex justify-end border-t pt-4 border-gray-200">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleViewDetails(request)}
                            >
                              View Details
                            </Button>
                          </div>
                        )}
                      </div>
                    </VoiceGuidedElement>
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedServiceHistory;
