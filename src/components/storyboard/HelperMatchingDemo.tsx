import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { findMatchingHelpers } from "@/lib/helper-matching";
import { Tables } from "@/types/supabase";
import HelperCard from "@/components/helper/HelperCard";
import { MapPin, Clock, Star, Shield, Award, CheckCircle } from "lucide-react";

type Helper = Tables<"helper_profiles"> & {
  user: Tables<"users">;
  distance?: number;
  matchScore?: number;
};

const mockServiceRequest = {
  id: "req-123",
  customer_id: "cust-123",
  service_type: "shopping",
  status: "pending",
  location: "123 Main St, Anytown",
  scheduled_time: new Date().toISOString(),
  duration_minutes: 60,
  required_skills: ["grocery shopping", "heavy lifting"],
  preferred_language: "en",
};

const HelperMatchingDemo = () => {
  const [matchedHelpers, setMatchedHelpers] = useState<Helper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHelper, setSelectedHelper] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("matches");

  useEffect(() => {
    const fetchHelpers = async () => {
      try {
        setLoading(true);
        const helpers = await findMatchingHelpers(mockServiceRequest, {
          maxDistance: 20,
          minRating: 3.5,
          prioritizeRating: true,
          requiredServices: [mockServiceRequest.service_type],
          useAvailability: true,
          requestDate: new Date(mockServiceRequest.scheduled_time),
        });
        setMatchedHelpers(helpers);
      } catch (error) {
        console.error("Error fetching helpers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHelpers();
  }, []);

  const handleSelectHelper = (helperId: string) => {
    setSelectedHelper(helperId);
  };

  const renderMatchScoreDetails = (helper: Helper) => {
    if (!helper.matchScore) return null;

    // These are approximations based on the algorithm
    const distanceScore = helper.distance
      ? Math.max(0, 25 - (helper.distance / 20) * 25)
      : 12.5;
    const ratingScore = helper.average_rating
      ? (helper.average_rating / 5) * 20
      : 10;
    const serviceScore = helper.services_offered?.includes(
      mockServiceRequest.service_type,
    )
      ? 20
      : helper.services_offered
        ? Math.min(10, helper.services_offered.length * 2)
        : 0;
    const experienceScore = helper.total_reviews
      ? Math.min(10, helper.total_reviews / 5)
      : 0;

    return (
      <div className="mt-4 space-y-3">
        <h4 className="font-medium">Match Score Breakdown</h4>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Distance</span>
            <span className="text-sm font-medium">
              {distanceScore.toFixed(1)}/25
            </span>
          </div>
          <Progress value={(distanceScore / 25) * 100} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Rating</span>
            <span className="text-sm font-medium">
              {ratingScore.toFixed(1)}/20
            </span>
          </div>
          <Progress value={(ratingScore / 20) * 100} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Service Match</span>
            <span className="text-sm font-medium">
              {serviceScore.toFixed(1)}/20
            </span>
          </div>
          <Progress value={(serviceScore / 20) * 100} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Experience</span>
            <span className="text-sm font-medium">
              {experienceScore.toFixed(1)}/10
            </span>
          </div>
          <Progress value={(experienceScore / 10) * 100} className="h-2" />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Enhanced Helper Matching Algorithm</h1>

      <Card>
        <CardHeader>
          <CardTitle>Service Request Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Request Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Service Type</p>
                    <p className="text-gray-600">
                      {mockServiceRequest.service_type.charAt(0).toUpperCase() +
                        mockServiceRequest.service_type.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">
                      {mockServiceRequest.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Scheduled Time</p>
                    <p className="text-gray-600">
                      {new Date(
                        mockServiceRequest.scheduled_time,
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">
                Additional Requirements
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Required Skills</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {mockServiceRequest.required_skills.map(
                        (skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Preferred Language</p>
                    <p className="text-gray-600">
                      {mockServiceRequest.preferred_language === "en"
                        ? "English"
                        : mockServiceRequest.preferred_language}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-gray-600">
                      {mockServiceRequest.duration_minutes} minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Helper Matching Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="matches"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="matches">Matched Helpers</TabsTrigger>
              <TabsTrigger value="algorithm">Algorithm Details</TabsTrigger>
            </TabsList>

            <TabsContent value="matches" className="mt-6">
              {loading ? (
                <div className="text-center py-8">
                  <p>Loading matched helpers...</p>
                </div>
              ) : matchedHelpers.length === 0 ? (
                <div className="text-center py-8">
                  <p>No matching helpers found for this request.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matchedHelpers.slice(0, 4).map((helper) => (
                      <div key={helper.id} className="space-y-2">
                        <HelperCard
                          helper={{
                            id: helper.id,
                            name: helper.user?.full_name || "Unknown Helper",
                            avatar:
                              helper.user?.avatar_url ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${helper.id}`,
                            rating: helper.average_rating || 4.0,
                            reviewCount: helper.total_reviews || 0,
                            specialties: helper.services_offered || [],
                            distance: helper.distance
                              ? `${helper.distance.toFixed(1)} km`
                              : undefined,
                            availability: "Available Now",
                            verificationBadges: {
                              backgroundCheck: true,
                              identityVerified: true,
                              skillsCertified:
                                helper.skills && helper.skills.length > 0,
                              trainingCompleted: helper.training_completed,
                            },
                          }}
                          onSelect={() => handleSelectHelper(helper.id)}
                          selected={selectedHelper === helper.id}
                        />
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                              <span className="font-medium">Match Score</span>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-lg px-3 py-1 bg-primary/10"
                            >
                              {helper.matchScore?.toFixed(1) || "N/A"}/100
                            </Badge>
                          </div>
                          {selectedHelper === helper.id &&
                            renderMatchScoreDetails(helper)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="algorithm" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Enhanced Matching Algorithm
                  </h3>
                  <p className="text-gray-600">
                    Our improved helper matching algorithm considers multiple
                    factors to find the best match for each service request:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Distance & Proximity (25%)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Helpers closer to the service location receive higher
                        scores. The algorithm calculates the distance between
                        the helper's location and the service location using the
                        Haversine formula.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Ratings & Reviews (20%)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Helpers with higher average ratings receive better
                        scores. The algorithm considers both the average rating
                        and the total number of reviews to ensure reliability.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Service Type Match (20%)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Helpers who offer the exact service type requested
                        receive full points. Those who offer related services
                        receive partial points based on their versatility.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Experience & History (10%)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Helpers with more completed services receive higher
                        scores, reflecting their experience and reliability in
                        providing assistance.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Availability & Activity (10%)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        The algorithm checks if helpers are available during the
                        requested time slot and gives preference to those who
                        have been recently active on the platform.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Skills & Specializations (10%)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Helpers with specific skills required for the service
                        receive higher scores. This ensures that helpers have
                        the necessary expertise for specialized tasks.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Language Preference (5%)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Helpers who speak the preferred language of the client
                        receive additional points to ensure effective
                        communication during service delivery.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelperMatchingDemo;
