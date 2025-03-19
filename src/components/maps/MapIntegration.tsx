import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Navigation,
  Search,
  Locate,
  Home,
  Building,
  Phone,
  Info,
  ChevronDown,
  ChevronUp,
  Layers,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GoogleMapWrapper, { MapLocation } from "./GoogleMapWrapper";
import { DEFAULT_MAP_CENTER } from "@/lib/maps-config";

interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  type: "hub" | "home" | "service" | "helper" | "poi";
  details?: {
    phone?: string;
    services?: string[];
    hours?: string;
    distance?: string;
    eta?: string;
  };
}

interface MapIntegrationProps {
  locations?: Location[];
  userLocation?: [number, number];
  initialZoom?: number;
  onLocationSelect?: (location: Location) => void;
  height?: string;
  showSearch?: boolean;
  showControls?: boolean;
  interactive?: boolean;
  mapType?: "standard" | "satellite" | "terrain";
}

const MapIntegration = ({
  locations = [
    {
      id: "home",
      name: "Your Home",
      address: "123 Main Street, Anytown",
      coordinates: [40.7128, -74.006],
      type: "home",
      details: {
        distance: "0 miles",
      },
    },
    {
      id: "hub1",
      name: "Sunshine Community Hub",
      address: "456 Elder Street, Anytown",
      coordinates: [40.715, -74.009],
      type: "hub",
      details: {
        phone: "(555) 123-4567",
        services: [
          "Shopping Assistance",
          "Medical Appointments",
          "Companionship",
        ],
        hours: "9:00 AM - 5:00 PM",
        distance: "0.8 miles",
        eta: "15 min walk",
      },
    },
    {
      id: "hub2",
      name: "Golden Years Center",
      address: "789 Senior Avenue, Anytown",
      coordinates: [40.718, -74.003],
      type: "hub",
      details: {
        phone: "(555) 987-6543",
        services: ["Home Maintenance", "Transportation", "Meal Delivery"],
        hours: "8:00 AM - 6:00 PM",
        distance: "1.2 miles",
        eta: "5 min drive",
      },
    },
    {
      id: "helper1",
      name: "Sarah (Helper)",
      address: "Currently mobile",
      coordinates: [40.714, -74.007],
      type: "helper",
      details: {
        distance: "0.3 miles away",
        eta: "Arriving in 5 minutes",
      },
    },
  ],
  userLocation = [40.7128, -74.006],
  initialZoom = 15,
  onLocationSelect = () => {},
  height = "400px",
  showSearch = true,
  showControls = true,
  interactive = true,
  mapType = "standard",
}: MapIntegrationProps) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [mapZoom, setMapZoom] = useState(initialZoom);
  const [currentMapType, setCurrentMapType] = useState(mapType);
  const [showLocationList, setShowLocationList] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Convert locations to Google Maps format
  const mapLocations: MapLocation[] = locations.map((location) => ({
    id: location.id,
    name: location.name,
    address: location.address,
    position: { lat: location.coordinates[0], lng: location.coordinates[1] },
    type: location.type,
    details: location.details,
  }));

  // Filter locations based on search query
  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Convert filtered locations to Google Maps format
  const filteredMapLocations = filteredLocations.map((location) => ({
    id: location.id,
    name: location.name,
    address: location.address,
    position: { lat: location.coordinates[0], lng: location.coordinates[1] },
    type: location.type,
    details: location.details,
  }));

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  const handleMapLocationSelect = (mapLocation: MapLocation) => {
    const originalLocation = locations.find((loc) => loc.id === mapLocation.id);
    if (originalLocation) {
      setSelectedLocation(originalLocation);
      onLocationSelect(originalLocation);
    }
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.setZoom((mapRef.current.getZoom() || mapZoom) + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.setZoom((mapRef.current.getZoom() || mapZoom) - 1);
    }
  };

  const handleCenterMap = () => {
    if (mapRef.current) {
      mapRef.current.setCenter({
        lat: userLocation[0],
        lng: userLocation[1],
      });
    }
  };

  const handleMapTypeChange = (type: "standard" | "satellite" | "terrain") => {
    setCurrentMapType(type);
    if (mapRef.current) {
      switch (type) {
        case "satellite":
          mapRef.current.setMapTypeId(google.maps.MapTypeId.SATELLITE);
          break;
        case "terrain":
          mapRef.current.setMapTypeId(google.maps.MapTypeId.TERRAIN);
          break;
        default:
          mapRef.current.setMapTypeId(google.maps.MapTypeId.ROADMAP);
      }
    }
  };

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    // Set initial map type
    switch (currentMapType) {
      case "satellite":
        map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
        break;
      case "terrain":
        map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
        break;
      default:
        map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    }
  };

  const getMarkerColor = (locationType: Location["type"]) => {
    switch (locationType) {
      case "hub":
        return "bg-primary text-white";
      case "home":
        return "bg-blue-500 text-white";
      case "service":
        return "bg-purple-500 text-white";
      case "helper":
        return "bg-green-500 text-white";
      case "poi":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getMarkerIcon = (locationType: Location["type"]) => {
    switch (locationType) {
      case "hub":
        return <Building className="h-4 w-4" />;
      case "home":
        return <Home className="h-4 w-4" />;
      case "service":
        return <Info className="h-4 w-4" />;
      case "helper":
        return <Navigation className="h-4 w-4" />;
      case "poi":
        return <MapPin className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full bg-white shadow-md">
      {showSearch && (
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      <div className="relative" style={{ height }}>
        {/* Google Map */}
        <GoogleMapWrapper
          center={{ lat: userLocation[0], lng: userLocation[1] }}
          zoom={mapZoom}
          locations={filteredMapLocations}
          onLocationSelect={handleMapLocationSelect}
          onMapLoad={handleMapLoad}
          height="100%"
          className="w-full"
        />

        {/* Map controls */}
        {showControls && (
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleZoomIn}
                    className="bg-white shadow-md"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Zoom in</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleZoomOut}
                    className="bg-white shadow-md"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Zoom out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleCenterMap}
                    className="bg-white shadow-md"
                  >
                    <Locate className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Center on your location</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="bg-white shadow-md"
                      >
                        <Layers className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Map type</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleMapTypeChange("standard")}
                >
                  Standard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleMapTypeChange("satellite")}
                >
                  Satellite
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleMapTypeChange("terrain")}
                >
                  Terrain
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Location list toggle */}
        <div className="absolute bottom-3 left-3 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowLocationList(!showLocationList)}
            className="bg-white shadow-md flex items-center gap-1"
          >
            {showLocationList ? (
              <>
                <ChevronDown className="h-4 w-4" /> Hide Locations
              </>
            ) : (
              <>
                <ChevronUp className="h-4 w-4" /> Show Locations
              </>
            )}
          </Button>
        </div>

        {/* Selected location info */}
        {selectedLocation && (
          <div className="absolute bottom-0 left-0 right-0 bg-white p-3 border-t border-gray-200 shadow-md z-10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{selectedLocation.name}</h3>
                <p className="text-sm text-gray-600">
                  {selectedLocation.address}
                </p>
                {selectedLocation.details?.distance && (
                  <p className="text-sm text-primary font-medium">
                    {selectedLocation.details.distance} away
                    {selectedLocation.details.eta &&
                      ` • ${selectedLocation.details.eta}`}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLocation(null)}
              >
                Close
              </Button>
            </div>

            {selectedLocation.details?.services && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {selectedLocation.details.services.map((service, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedLocation.details?.phone && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <Phone className="h-3 w-3" />
                <span>{selectedLocation.details.phone}</span>
              </div>
            )}

            <div className="mt-3 flex justify-end">
              <Button size="sm" className="flex items-center gap-1">
                <Navigation className="h-4 w-4" /> Get Directions
              </Button>
            </div>
          </div>
        )}

        {/* Location list panel */}
        {showLocationList && (
          <div className="absolute top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto shadow-md z-10">
            <div className="p-3 border-b">
              <h3 className="font-bold">Nearby Locations</h3>
            </div>
            <div className="divide-y">
              {filteredLocations.map((location) => (
                <div
                  key={location.id}
                  className={`p-3 cursor-pointer hover:bg-gray-50 ${selectedLocation?.id === location.id ? "bg-gray-100" : ""}`}
                  onClick={() => handleLocationClick(location)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-6 w-6 rounded-full ${getMarkerColor(location.type)} flex items-center justify-center`}
                    >
                      {getMarkerIcon(location.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{location.name}</h4>
                      <p className="text-xs text-gray-500">
                        {location.details?.distance}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// Helper components for the map controls
const Plus = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Minus = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default MapIntegration;
