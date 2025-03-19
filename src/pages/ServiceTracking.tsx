import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import GoogleMapWrapper from "@/components/maps/GoogleMapWrapper";

const ServiceTracking = () => {
  const [progress, setProgress] = useState(20);
  const [status, setStatus] = useState<
    "confirmed" | "en-route" | "arrived" | "in-progress" | "completed"
  >("en-route");
  const [estimatedArrival, setEstimatedArrival] = useState("15 minutes");
  const [helperLocation, setHelperLocation] =
    useState<google.maps.LatLngLiteral>({
      lat: 40.7128, // Starting position
      lng: -74.006,
    });
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral>({
    lat: 40.7138, // Destination position
    lng: -74.006,
  });

  // Simulate helper progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("arrived");
          return 100;
        }
        return prev + 5;
      });

      // Update estimated arrival time
      if (progress < 100) {
        const minutes = Math.max(1, Math.floor((100 - progress) / 10));
        setEstimatedArrival(`${minutes} minute${minutes > 1 ? "s" : ""}`);
      }

      // Simulate helper movement
      setHelperLocation((prev) => {
        // Move helper closer to user location
        const lat = prev.lat + (userLocation.lat - prev.lat) * 0.1;
        const lng = prev.lng + (userLocation.lng - prev.lng) * 0.1;
        return { lat, lng };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [progress, userLocation]);

  // Helper information
  const helper = {
    id: "helper-123",
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    rating: 4.8,
    phone: "(555) 123-4567",
    currentLocation: "0.5 miles away",
  };

  // Service details
  const service = {
    id: "REQ-12345",
    type: "shopping",
    title: "Grocery Shopping Assistance",
    scheduledTime: "Today, 2:00 PM",
    location: "123 Main Street, Apt 4B",
    details:
      "Need help with weekly grocery shopping. Please bring items up to the 4th floor apartment.",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "en-route":
        return "bg-amber-100 text-amber-800";
      case "arrived":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "en-route":
        return "Helper On The Way";
      case "arrived":
        return "Helper Has Arrived";
      case "in-progress":
        return "Service In Progress";
      case "completed":
        return "Service Completed";
      default:
        return "Unknown Status";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Track Your Service</h1>
          <Button variant="outline" className="gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Report Issue
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">
                {service.title}
              </CardTitle>
              <Badge className={`text-lg px-4 py-1 ${getStatusColor(status)}`}>
                {getStatusText(status)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Helper Information */}
              <div className="flex flex-col items-center p-4 border rounded-lg bg-gray-50">
                <Avatar className="h-24 w-24 mb-3">
                  <AvatarImage src={helper.avatar} alt={helper.name} />
                  <AvatarFallback className="text-2xl">
                    {helper.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold mb-1">{helper.name}</h3>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500">★</span>
                  <span className="text-lg ml-1">{helper.rating}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Phone className="h-5 w-5" />
                    <span>Call</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Message</span>
                  </Button>
                </div>
              </div>

              {/* Status Information */}
              <div className="col-span-2 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-6 w-6 text-gray-500 mt-1" />
                    <div>
                      <p className="text-lg font-medium">Estimated Arrival</p>
                      <p className="text-2xl">{estimatedArrival}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-6 w-6 text-gray-500 mt-1" />
                    <div>
                      <p className="text-lg font-medium">Scheduled Time</p>
                      <p className="text-xl">{service.scheduledTime}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-6 w-6 text-gray-500 mt-1" />
                    <div>
                      <p className="text-lg font-medium">Location</p>
                      <p className="text-xl">{service.location}</p>
                    </div>
                  </div>
                </div>

                {status === "en-route" && (
                  <div className="mt-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-lg font-medium">
                        Helper's Progress
                      </span>
                      <span className="text-lg">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold mb-2">Service Details</h3>
              <p className="text-lg">{service.details}</p>
            </div>

            {status === "arrived" && (
              <div className="mt-6 text-center">
                <Button className="text-lg px-6 py-2">
                  Confirm Service Started
                </Button>
              </div>
            )}

            {status === "completed" && (
              <div className="mt-6 text-center">
                <Button className="text-lg px-6 py-2">
                  Rate Your Experience
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Map with real-time tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Helper Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px] rounded-md">
              <GoogleMapWrapper
                center={userLocation}
                zoom={15}
                height="300px"
                showDirections={true}
                origin={helperLocation}
                destination={userLocation}
                locations={[
                  {
                    id: "helper",
                    name: helper.name,
                    address: "En route to your location",
                    position: helperLocation,
                    type: "helper",
                    details: {
                      eta: estimatedArrival,
                    },
                  },
                  {
                    id: "user",
                    name: "Your Location",
                    address: service.location,
                    position: userLocation,
                    type: "home",
                  },
                ]}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ServiceTracking;
