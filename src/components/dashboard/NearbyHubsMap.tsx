import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  List,
  Map,
  Navigation,
  Info,
  Phone,
  Clock,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MapIntegration from "@/components/maps/MapIntegration";
import GoogleMapWrapper, {
  MapLocation,
} from "@/components/maps/GoogleMapWrapper";

interface Hub {
  id: string;
  name: string;
  address: string;
  distance: string;
  services: string[];
  coordinates: [number, number];
  phone: string;
  hours?: string;
  description?: string;
  image?: string;
}

interface NearbyHubsMapProps {
  hubs?: Hub[];
  userLocation?: [number, number];
  onHubSelect?: (hub: Hub) => void;
}

const NearbyHubsMap = ({
  hubs = [
    {
      id: "1",
      name: "Sunshine Community Hub",
      address: "123 Elder Street, Careville",
      distance: "0.8 miles",
      services: [
        "Shopping Assistance",
        "Medical Appointments",
        "Companionship",
      ],
      coordinates: [40.7128, -74.006],
      phone: "(555) 123-4567",
      hours: "9:00 AM - 5:00 PM",
      description:
        "A welcoming community center offering various assistance services for seniors.",
      image:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80",
    },
    {
      id: "2",
      name: "Golden Years Center",
      address: "456 Senior Avenue, Careville",
      distance: "1.2 miles",
      services: ["Home Maintenance", "Transportation", "Meal Delivery"],
      coordinates: [40.7135, -74.0046],
      phone: "(555) 987-6543",
      hours: "8:00 AM - 6:00 PM",
      description:
        "Specialized in home services and transportation for elderly residents.",
      image:
        "https://images.unsplash.com/photo-1566125882500-87e10f726cdc?w=600&q=80",
    },
    {
      id: "3",
      name: "Silver Helpers Station",
      address: "789 Assistance Road, Careville",
      distance: "1.5 miles",
      services: ["Technology Help", "Grocery Delivery", "Wellness Checks"],
      coordinates: [40.712, -74.008],
      phone: "(555) 456-7890",
      hours: "10:00 AM - 4:00 PM",
      description:
        "Focused on technology assistance and regular wellness checks for seniors.",
      image:
        "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600&q=80",
    },
  ],
  userLocation = [40.7128, -74.006],
  onHubSelect = () => {},
}: NearbyHubsMapProps) => {
  const [activeTab, setActiveTab] = useState("map");
  const [selectedHub, setSelectedHub] = useState<Hub | null>(null);
  const [showHubDetails, setShowHubDetails] = useState(false);

  const handleHubSelect = (hub: Hub) => {
    setSelectedHub(hub);
    onHubSelect(hub);
  };

  const handleViewDetails = (hub: Hub) => {
    setSelectedHub(hub);
    setShowHubDetails(true);
  };

  // Convert hubs to locations for MapIntegration
  const mapLocations = hubs.map((hub) => ({
    id: hub.id,
    name: hub.name,
    address: hub.address,
    coordinates: hub.coordinates,
    type: "hub" as const,
    details: {
      phone: hub.phone,
      services: hub.services,
      hours: hub.hours,
      distance: hub.distance,
      eta: `${Math.round(parseFloat(hub.distance) * 20)} min walk`,
    },
  }));

  // Add home location
  mapLocations.unshift({
    id: "home",
    name: "Your Home",
    address: "123 Main Street, Anytown",
    coordinates: userLocation,
    type: "home" as const,
    details: {
      distance: "0 miles",
    },
  });

  // Convert hubs to Google Maps format for direct use with GoogleMapWrapper
  const mapHubLocations: MapLocation[] = hubs.map((hub) => ({
    id: hub.id,
    name: hub.name,
    address: hub.address,
    position: { lat: hub.coordinates[0], lng: hub.coordinates[1] },
    type: "hub",
    details: {
      phone: hub.phone,
      services: hub.services,
      hours: hub.hours,
      distance: hub.distance,
      eta: `${Math.round(parseFloat(hub.distance) * 20)} min walk`,
    },
  }));

  // Add home location
  mapHubLocations.unshift({
    id: "home",
    name: "Your Home",
    address: "123 Main Street, Anytown",
    position: { lat: userLocation[0], lng: userLocation[1] },
    type: "home",
    details: {
      distance: "0 miles",
    },
  });

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold flex items-center">
          <MapPin className="mr-2 h-6 w-6 text-primary" />
          Nearby Community Hubs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="map"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="map" className="text-lg py-3">
              <Map className="mr-2 h-5 w-5" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="list" className="text-lg py-3">
              <List className="mr-2 h-5 w-5" />
              List View
            </TabsTrigger>
          </TabsList>
          <TabsContent value="map" className="mt-0">
            <GoogleMapWrapper
              center={{ lat: userLocation[0], lng: userLocation[1] }}
              zoom={14}
              locations={mapHubLocations}
              height="300px"
              onLocationSelect={(location) => {
                if (location.type === "hub") {
                  const hub = hubs.find((h) => h.id === location.id);
                  if (hub) handleHubSelect(hub);
                }
              }}
            />
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <div className="space-y-3">
              {hubs.map((hub) => (
                <div
                  key={hub.id}
                  className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => handleHubSelect(hub)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{hub.name}</h3>
                      <p className="text-gray-600">{hub.address}</p>
                      <p className="text-sm text-primary font-medium">
                        {hub.distance} away
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {hub.services.slice(0, 2).map((service, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-sm"
                          >
                            {service}
                          </Badge>
                        ))}
                        {hub.services.length > 2 && (
                          <Badge variant="outline" className="text-sm">
                            +{hub.services.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(hub);
                      }}
                    >
                      <Info className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-sm">
                      <span className="font-medium">Phone:</span> {hub.phone}
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // In a real app, this would open directions
                        console.log(`Get directions to ${hub.name}`);
                      }}
                    >
                      <Navigation className="mr-2 h-4 w-4" />
                      Directions
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Hub Details Dialog */}
        {selectedHub && showHubDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                {selectedHub.image && (
                  <div className="h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={selectedHub.image}
                      alt={selectedHub.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 bg-white rounded-full"
                  onClick={() => setShowHubDetails(false)}
                >
                  ×
                </Button>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{selectedHub.name}</h2>
                <p className="text-gray-600 mb-4">{selectedHub.address}</p>

                {selectedHub.description && (
                  <p className="text-gray-700 mb-4">
                    {selectedHub.description}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Contact</h3>
                      <p>{selectedHub.phone}</p>
                    </div>
                  </div>

                  {selectedHub.hours && (
                    <div className="flex items-start gap-2">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Hours</h3>
                        <p>{selectedHub.hours}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Distance</h3>
                      <p>{selectedHub.distance} from your location</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Availability</h3>
                      <p>Available for assistance</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">Services Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedHub.services.map((service, index) => (
                      <Badge key={index} variant="outline">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowHubDetails(false)}
                  >
                    Close
                  </Button>
                  <Button>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Hub
                  </Button>
                  <Button variant="default">
                    <Navigation className="mr-2 h-4 w-4" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NearbyHubsMap;
