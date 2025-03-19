import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Users, Star, Search, Map } from "lucide-react";
import AddressAutocomplete from "@/components/maps/AddressAutocomplete";
import GoogleMapWrapper, {
  MapLocation,
} from "@/components/maps/GoogleMapWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistance, calculateDistance } from "@/lib/maps-config";

interface CommunityHub {
  id: string;
  name: string;
  address: string;
  distance?: string;
  phone: string;
  hours: string;
  services: string[];
  rating: number;
  reviews: number;
  image?: string;
  position?: google.maps.LatLngLiteral;
}

interface HubFinderProps {
  onSelectHub?: (hub: CommunityHub) => void;
  className?: string;
}

const HubFinder = ({
  onSelectHub = () => {},
  className = "",
}: HubFinderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [hubs, setHubs] = useState<CommunityHub[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHub, setSelectedHub] = useState<CommunityHub | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  // Mock data for community hubs with positions
  const mockHubs: CommunityHub[] = [
    {
      id: "hub1",
      name: "Sunshine Senior Center",
      address: "123 Main St, Anytown, USA",
      distance: "1.2 miles",
      phone: "(555) 123-4567",
      hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-2PM",
      services: [
        "Transportation",
        "Meals",
        "Social Activities",
        "Health Screenings",
      ],
      rating: 4.8,
      reviews: 42,
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
      position: { lat: 40.7128, lng: -74.006 }, // New York
    },
    {
      id: "hub2",
      name: "Golden Years Community Hub",
      address: "456 Oak Ave, Somewhere, USA",
      distance: "2.5 miles",
      phone: "(555) 987-6543",
      hours: "Mon-Fri: 9AM-5PM",
      services: ["Companionship", "Home Maintenance", "Technology Help"],
      rating: 4.6,
      reviews: 38,
      image:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800&q=80",
      position: { lat: 40.7282, lng: -73.9942 }, // Nearby location
    },
    {
      id: "hub3",
      name: "Silver Linings Care Center",
      address: "789 Pine Rd, Elsewhere, USA",
      distance: "3.8 miles",
      phone: "(555) 456-7890",
      hours: "Mon-Sun: 7AM-8PM",
      services: [
        "Medical Assistance",
        "Transportation",
        "Meals",
        "Wellness Programs",
      ],
      rating: 4.9,
      reviews: 56,
      image:
        "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80",
      position: { lat: 40.7112, lng: -74.0134 }, // Another nearby location
    },
  ];

  // Convert hubs to map locations
  const mapLocations: MapLocation[] = hubs.map((hub) => ({
    id: hub.id,
    name: hub.name,
    address: hub.address,
    position: hub.position || { lat: 40.7128, lng: -74.006 }, // Default to NYC if no position
    type: "hub",
    details: {
      phone: hub.phone,
      services: hub.services,
      hours: hub.hours,
      distance: hub.distance,
    },
  }));

  // Simulate fetching hubs based on location
  useEffect(() => {
    if (selectedLocation) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        // Calculate distances for each hub based on selected location
        const hubsWithDistance = mockHubs.map((hub) => {
          if (hub.position && selectedLocation) {
            const distanceKm = calculateDistance(
              selectedLocation.lat,
              selectedLocation.lng,
              hub.position.lat,
              hub.position.lng,
            );
            return {
              ...hub,
              distance: formatDistance(distanceKm),
            };
          }
          return hub;
        });

        // Sort by distance
        hubsWithDistance.sort((a, b) => {
          const distA = a.distance ? parseFloat(a.distance.split(" ")[0]) : 999;
          const distB = b.distance ? parseFloat(b.distance.split(" ")[0]) : 999;
          return distA - distB;
        });

        setHubs(hubsWithDistance);
        setIsLoading(false);
      }, 1000);
    }
  }, [selectedLocation]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a search based on the query
    setIsLoading(true);
    setTimeout(() => {
      const filteredHubs = mockHubs.filter(
        (hub) =>
          hub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hub.services.some((service) =>
            service.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
      setHubs(filteredHubs);
      setIsLoading(false);
    }, 800);
  };

  const handleAddressSelect = (address: string, lat: number, lng: number) => {
    setSelectedLocation({ address, lat, lng });
  };

  const handleHubSelect = (hub: CommunityHub) => {
    setSelectedHub(hub);
    onSelectHub(hub);
  };

  const handleMapLocationSelect = (location: MapLocation) => {
    const hub = hubs.find((h) => h.id === location.id);
    if (hub) {
      setSelectedHub(hub);
      onSelectHub(hub);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold mb-2">Find a Community Hub</h2>
        <p className="text-muted-foreground">
          Locate senior assistance hubs in your area for in-person support
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Search by keyword
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Service, hub name, etc."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Your location</label>
                  <AddressAutocomplete
                    onAddressSelect={handleAddressSelect}
                    placeholder="Enter your address"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Search Hubs
                </Button>
              </form>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Available Services</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Transportation</Badge>
                  <Badge variant="outline">Meals</Badge>
                  <Badge variant="outline">Social Activities</Badge>
                  <Badge variant="outline">Health Screenings</Badge>
                  <Badge variant="outline">Technology Help</Badge>
                  <Badge variant="outline">Home Maintenance</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Call our support line to get assistance finding a hub near you.
              </p>
              <Button variant="outline" className="w-full">
                <Phone className="h-4 w-4 mr-2" /> (800) SENIOR-HELP
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="list" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {hubs.length} {hubs.length === 1 ? "Hub" : "Hubs"} Found
              </h3>
              <TabsList>
                <TabsTrigger value="list" onClick={() => setViewMode("list")}>
                  <Users className="h-4 w-4 mr-2" /> List View
                </TabsTrigger>
                <TabsTrigger value="map" onClick={() => setViewMode("map")}>
                  <Map className="h-4 w-4 mr-2" /> Map View
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="list" className="mt-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : hubs.length === 0 ? (
                <Card className="h-64">
                  <CardContent className="flex flex-col items-center justify-center h-full">
                    <MapPin className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium">No hubs found</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      Try adjusting your search criteria or location to find
                      community hubs in your area.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {hubs.map((hub) => (
                    <Card
                      key={hub.id}
                      className={`overflow-hidden ${selectedHub?.id === hub.id ? "ring-2 ring-primary" : ""}`}
                    >
                      <div className="flex flex-col md:flex-row">
                        {hub.image && (
                          <div className="md:w-1/3 h-48 md:h-auto">
                            <img
                              src={hub.image}
                              alt={hub.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold">{hub.name}</h3>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>
                                  {hub.address}{" "}
                                  {hub.distance && `(${hub.distance})`}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="ml-1 font-medium">
                                {hub.rating}
                              </span>
                              <span className="text-xs text-muted-foreground ml-1">
                                ({hub.reviews})
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-1">
                            {hub.services.map((service, index) => (
                              <Badge key={index} variant="secondary">
                                {service}
                              </Badge>
                            ))}
                          </div>

                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-primary mr-2" />
                              <span>{hub.hours}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-primary mr-2" />
                              <span>{hub.phone}</span>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end">
                            <Button
                              variant="outline"
                              className="mr-2"
                              onClick={() => window.open(`tel:${hub.phone}`)}
                            >
                              <Phone className="h-4 w-4 mr-2" /> Call
                            </Button>
                            <Button onClick={() => handleHubSelect(hub)}>
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="map" className="mt-0">
              <Card>
                <CardContent className="p-0 overflow-hidden">
                  <GoogleMapWrapper
                    height="500px"
                    center={
                      selectedLocation
                        ? {
                            lat: selectedLocation.lat,
                            lng: selectedLocation.lng,
                          }
                        : undefined
                    }
                    zoom={12}
                    locations={mapLocations}
                    showUserLocation={true}
                    onLocationSelect={handleMapLocationSelect}
                    className="rounded-md overflow-hidden"
                  />
                </CardContent>
              </Card>

              {selectedHub && (
                <Card className="mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle>{selectedHub.name}</CardTitle>
                    <CardDescription>{selectedHub.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Services</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedHub.services.map((service, index) => (
                            <Badge key={index} variant="secondary">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Contact</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-primary mr-2" />
                            <span>{selectedHub.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-primary mr-2" />
                            <span>{selectedHub.hours}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => window.open(`tel:${selectedHub.phone}`)}
                    >
                      <Phone className="h-4 w-4 mr-2" /> Call
                    </Button>
                    <Button>Get Directions</Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default HubFinder;
