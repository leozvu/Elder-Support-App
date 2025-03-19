import React, { useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  Circle,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GOOGLE_MAPS_API_KEY,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  MAP_STYLES,
} from "@/lib/maps-config";

// Define the libraries we want to load
const libraries: (
  | "places"
  | "drawing"
  | "geometry"
  | "localContext"
  | "visualization"
)[] = ["places", "geometry"];

// Map container style
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export interface MapLocation {
  id: string;
  name: string;
  address: string;
  position: google.maps.LatLngLiteral;
  type: "hub" | "home" | "service" | "helper" | "poi";
  details?: {
    phone?: string;
    services?: string[];
    hours?: string;
    distance?: string;
    eta?: string;
  };
}

interface GoogleMapWrapperProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  locations?: MapLocation[];
  showUserLocation?: boolean;
  showDirections?: boolean;
  origin?: google.maps.LatLngLiteral;
  destination?: google.maps.LatLngLiteral;
  onLocationSelect?: (location: MapLocation) => void;
  onMapLoad?: (map: google.maps.Map) => void;
  height?: string;
  className?: string;
  children?: React.ReactNode;
}

const GoogleMapWrapper: React.FC<GoogleMapWrapperProps> = ({
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_MAP_ZOOM,
  locations = [],
  showUserLocation = true,
  showDirections = false,
  origin,
  destination,
  onLocationSelect,
  onMapLoad,
  height = "400px",
  className = "",
  children,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(
    null,
  );
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(
    null,
  );

  // Initialize the map
  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);
      if (onMapLoad) onMapLoad(map);

      // Get user's current location if requested
      if (showUserLocation && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(userPos);
            map.setCenter(userPos);
          },
          () => {
            console.log("Error getting user location");
          },
        );
      }

      // Initialize directions service
      if (showDirections) {
        directionsServiceRef.current = new google.maps.DirectionsService();
      }
    },
    [onMapLoad, showUserLocation, showDirections],
  );

  // Clean up on unmount
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Handle marker click
  const handleMarkerClick = (location: MapLocation) => {
    setSelectedLocation(location);
    if (onLocationSelect) onLocationSelect(location);
  };

  // Calculate and display directions
  const calculateDirections = useCallback(() => {
    if (!directionsServiceRef.current || !origin || !destination) return;

    directionsServiceRef.current.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Directions request failed: ${status}`);
        }
      },
    );
  }, [origin, destination]);

  // Calculate directions when origin or destination changes
  React.useEffect(() => {
    if (showDirections && origin && destination && isLoaded) {
      calculateDirections();
    }
  }, [showDirections, origin, destination, isLoaded, calculateDirections]);

  // Get marker icon based on location type
  const getMarkerIcon = (locationType: MapLocation["type"]) => {
    // SVG icons encoded as data URLs
    const iconSize = new google.maps.Size(32, 32);
    const iconAnchor = new google.maps.Point(16, 32);

    switch (locationType) {
      case "hub":
        return {
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: iconSize,
          anchor: iconAnchor,
        };
      case "home":
        return {
          url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
          scaledSize: iconSize,
          anchor: iconAnchor,
        };
      case "service":
        return {
          url: "https://maps.google.com/mapfiles/ms/icons/purple-dot.png",
          scaledSize: iconSize,
          anchor: iconAnchor,
        };
      case "helper":
        return {
          url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
          scaledSize: iconSize,
          anchor: iconAnchor,
        };
      case "poi":
        return {
          url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: iconSize,
          anchor: iconAnchor,
        };
      default:
        return {
          url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: iconSize,
          anchor: iconAnchor,
        };
    }
  };

  // Handle map load error
  if (loadError) {
    return (
      <Card className={className}>
        <CardContent
          className="flex items-center justify-center"
          style={{ height }}
        >
          <div className="text-center p-4">
            <p className="text-red-500 mb-2">Error loading Google Maps</p>
            <p className="text-sm text-gray-500">
              Please check your internet connection and API key configuration.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show loading state
  if (!isLoaded) {
    return (
      <Card className={className}>
        <CardContent className="p-4" style={{ height }}>
          <div className="space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-[calc(100%-2rem)] w-full mt-4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className} style={{ height }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: MAP_STYLES,
          fullscreenControl: false,
          mapTypeControl: true,
          streetViewControl: false,
          zoomControl: true,
        }}
      >
        {/* User location marker with accuracy circle */}
        {userLocation && showUserLocation && (
          <>
            <Marker
              position={userLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeColor: "white",
                strokeWeight: 2,
              }}
            />
            <Circle
              center={userLocation}
              radius={100} // Accuracy radius in meters
              options={{
                fillColor: "#4285F4",
                fillOpacity: 0.15,
                strokeColor: "#4285F4",
                strokeOpacity: 0.5,
                strokeWeight: 1,
              }}
            />
          </>
        )}

        {/* Location markers */}
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={location.position}
            icon={getMarkerIcon(location.type)}
            onClick={() => handleMarkerClick(location)}
          />
        ))}

        {/* Selected location info window */}
        {selectedLocation && (
          <InfoWindow
            position={selectedLocation.position}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-bold text-sm">{selectedLocation.name}</h3>
              <p className="text-xs text-gray-600">
                {selectedLocation.address}
              </p>
              {selectedLocation.details?.distance && (
                <p className="text-xs text-blue-600 mt-1">
                  {selectedLocation.details.distance} away
                  {selectedLocation.details.eta &&
                    ` • ${selectedLocation.details.eta}`}
                </p>
              )}
              {selectedLocation.details?.services && (
                <div className="mt-1">
                  <p className="text-xs font-medium">Services:</p>
                  <p className="text-xs text-gray-600">
                    {selectedLocation.details.services.join(", ")}
                  </p>
                </div>
              )}
              {selectedLocation.details?.phone && (
                <p className="text-xs mt-1">
                  <span className="font-medium">Phone:</span>{" "}
                  {selectedLocation.details.phone}
                </p>
              )}
              <div className="mt-2 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs py-1 h-7"
                >
                  Get Directions
                </Button>
              </div>
            </div>
          </InfoWindow>
        )}

        {/* Directions renderer */}
        {directions && <DirectionsRenderer directions={directions} />}

        {/* Additional children */}
        {children}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapWrapper;
