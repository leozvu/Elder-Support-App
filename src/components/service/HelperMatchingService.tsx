import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Star,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
} from "lucide-react";
import { findMatchingHelpers } from "@/lib/helper-matching";
import { Tables } from "@/types/supabase";

type Helper = Tables<"helper_profiles"> & {
  user: Tables<"users">;
  distance?: number;
  matchScore?: number;
};

interface HelperMatchingServiceProps {
  serviceRequestId?: string;
  serviceType?: string;
  location?: string;
  scheduledTime?: string;
  onHelperSelect?: (helperId: string) => void;
  className?: string;
}

const HelperMatchingService = ({
  serviceRequestId,
  serviceType = "Shopping Assistance",
  location = "123 Main St, Anytown",
  scheduledTime = "2023-06-15T14:00:00",
  onHelperSelect,
  className,
}: HelperMatchingServiceProps) => {
  const [loading, setLoading] = useState(false);
  const [matchedHelpers, setMatchedHelpers] = useState<Helper[]>([]);
  const [selectedHelper, setSelectedHelper] = useState<string | null>(null);
  const [matchView, setMatchView] = useState<"best" | "all">("best");
  const [filterOptions, setFilterOptions] = useState({
    maxDistance: 20,
    minRating: 3.5,
    prioritizeRating: false,
    requiredServices: [] as string[],
    preferredGender: undefined as string | undefined,
  });

  useEffect(() => {
    if (serviceRequestId) {
      findMatches();
    }
  }, [serviceRequestId, filterOptions]);

  const findMatches = async () => {
    if (!serviceRequestId) return;

    setLoading(true);
    try {
      const requestDate = new Date(scheduledTime);
      const helpers = await findMatchingHelpers(serviceRequestId, {
        ...filterOptions,
        requestDate,
        useAvailability: true,
      });

      setMatchedHelpers(helpers);
      // Auto-select the best match
      if (helpers.length > 0 && !selectedHelper) {
        setSelectedHelper(helpers[0].id);
      }
    } catch (error) {
      console.error("Error finding matching helpers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHelperSelect = (helperId: string) => {
    setSelectedHelper(helperId);
    if (onHelperSelect) {
      onHelperSelect(helperId);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedHelper && onHelperSelect) {
      onHelperSelect(selectedHelper);
    }
  };

  const renderHelperCard = (helper: Helper) => {
    const isSelected = selectedHelper === helper.id;
    const user = helper.user || {};
    const avatarUrl =
      user.avatar_url ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name || helper.id}`;

    return (
      <Card
        key={helper.id}
        className={`mb-4 ${isSelected ? "border-primary border-2" : ""}`}
        onClick={() => handleHelperSelect(helper.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatarUrl} alt={user.full_name || "Helper"} />
              <AvatarFallback>
                {user.full_name?.charAt(0) || "H"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">
                    {user.full_name || "Helper"}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span>
                      {helper.distance
                        ? `${helper.distance.toFixed(1)} km away`
                        : "Distance unknown"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  {helper.matchScore !== undefined && (
                    <Badge variant="outline" className="mb-1">
                      Match Score: {Math.round(helper.matchScore)}%
                    </Badge>
                  )}

                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < (helper.average_rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="text-sm ml-1">
                      {helper.average_rating?.toFixed(1) || "New"}
                      {helper.total_reviews ? ` (${helper.total_reviews})` : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-sm">{helper.bio || "No bio available"}</p>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {helper.services_offered?.map((service, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>

              {isSelected && (
                <div className="mt-3 flex justify-end">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm text-primary ml-1">Selected</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Helper Matching</span>
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mb-4 p-4 bg-muted rounded-md">
            <h3 className="font-medium mb-2">Service Request Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{new Date(scheduledTime).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {new Date(scheduledTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center col-span-2">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{location}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Matching Options</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={findMatches}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding Matches...
                  </>
                ) : (
                  "Refresh Matches"
                )}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium block mb-1">
                  Max Distance (km)
                </label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filterOptions.maxDistance}
                  onChange={(e) =>
                    setFilterOptions({
                      ...filterOptions,
                      maxDistance: Number(e.target.value),
                    })
                  }
                >
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={20}>20 km</option>
                  <option value={50}>50 km</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Min Rating
                </label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filterOptions.minRating}
                  onChange={(e) =>
                    setFilterOptions({
                      ...filterOptions,
                      minRating: Number(e.target.value),
                    })
                  }
                >
                  <option value={0}>Any rating</option>
                  <option value={3}>3+ stars</option>
                  <option value={3.5}>3.5+ stars</option>
                  <option value={4}>4+ stars</option>
                  <option value={4.5}>4.5+ stars</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium block mb-1">
                  Required Service
                </label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filterOptions.requiredServices[0] || ""}
                  onChange={(e) => {
                    const service = e.target.value;
                    setFilterOptions({
                      ...filterOptions,
                      requiredServices: service ? [service] : [],
                    });
                  }}
                >
                  <option value="">Any service</option>
                  <option value="Shopping Assistance">
                    Shopping Assistance
                  </option>
                  <option value="Medical Appointments">
                    Medical Appointments
                  </option>
                  <option value="Companionship">Companionship</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Home Care">Home Care</option>
                  <option value="Meal Preparation">Meal Preparation</option>
                </select>
              </div>
            </div>

            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="prioritizeRating"
                checked={filterOptions.prioritizeRating}
                onChange={(e) =>
                  setFilterOptions({
                    ...filterOptions,
                    prioritizeRating: e.target.checked,
                  })
                }
                className="mr-2"
              />
              <label htmlFor="prioritizeRating" className="text-sm">
                Prioritize rating over distance
              </label>
            </div>
          </div>

          <Tabs
            defaultValue="best"
            onValueChange={(value) => setMatchView(value as "best" | "all")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="best">Best Matches</TabsTrigger>
              <TabsTrigger value="all">All Matches</TabsTrigger>
            </TabsList>

            <TabsContent value="best">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : matchedHelpers.length > 0 ? (
                <div>{matchedHelpers.slice(0, 3).map(renderHelperCard)}</div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No matching helpers found. Try adjusting your filters.
                </div>
              )}
            </TabsContent>

            <TabsContent value="all">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : matchedHelpers.length > 0 ? (
                <div>{matchedHelpers.map(renderHelperCard)}</div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No matching helpers found. Try adjusting your filters.
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button
              className="w-full"
              disabled={!selectedHelper || loading}
              onClick={handleConfirmSelection}
            >
              Confirm Helper Selection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelperMatchingService;
