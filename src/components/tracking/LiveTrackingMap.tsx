import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Phone,
  MessageSquare,
  Navigation,
  Clock,
  MapPin,
  AlertTriangle,
  Lock,
  MapPinOff,
  Info,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import GoogleMapWrapper, {
  MapLocation,
} from "@/components/maps/GoogleMapWrapper";
import { calculateDistance } from "@/lib/maps-config";

interface LiveTrackingMapProps {
  serviceId: string;
  customerLocation?: { lat: number; lng: number };
  helperLocation?: { lat: number; lng: number };
  helperName?: string;
  helperAvatar?: string;
  helperPhone?: string;
  estimatedArrival?: string;
  status?: "en_route" | "arrived" | "in_progress" | "completed";
  onCallHelper?: () => void;
  onMessageHelper?: () => void;
  className?: string;
  trackingEnabled?: boolean;
  onToggleTracking?: (enabled: boolean) => void;
  customerConsentGiven?: boolean;
  helperConsentGiven?: boolean;
  onGiveConsent?: () => void;
}

const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  serviceId,
  customerLocation = { lat: 40.7128, lng: -74.006 },
  helperLocation = { lat: 40.7138, lng: -74.008 },
  helperName = "Sarah Johnson",
  helperAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  helperPhone = "(555) 123-4567",
  estimatedArrival = "10 minutes",
  status = "en_route",
  onCallHelper,
  onMessageHelper,
  className,
  trackingEnabled = false,
  onToggleTracking = () => {},
  customerConsentGiven = false,
  helperConsentGiven = false,
  onGiveConsent = () => {},
}) => {
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [distance, setDistance] = useState<string>("Calculating...");
  const [eta, setEta] = useState<string>(estimatedArrival);
  const [mapCenter, setMapCenter] = useState(customerLocation);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [consentChecked, setConsentChecked] = useState(customerConsentGiven);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const { toast } = useToast();

  // Simulate helper movement for demo purposes
  const [simulatedHelperLocation, setSimulatedHelperLocation] =
    useState(helperLocation);

  // Handle location tracking toggle
  const handleTrackingToggle = (enabled: boolean) => {
    if (enabled && !customerConsentGiven) {
      setShowConsentDialog(true);
      return;
    }

    onToggleTracking(enabled);

    if (enabled) {
      toast({
        title: "Location tracking enabled",
        description: "Real-time location tracking is now active.",
      });

      // In a real implementation, this would start the geolocation tracking
      startLocationTracking();
    } else {
      toast({
        title: "Location tracking disabled",
        description: "Real-time location tracking has been turned off.",
      });

      // In a real implementation, this would stop the geolocation tracking
      stopLocationTracking();
    }
  };

  // Handle consent confirmation
  const handleConsentConfirm = () => {
    setShowConsentDialog(false);
    setConsentChecked(true);
    onGiveConsent();
    onToggleTracking(true);

    toast({
      title: "Consent given",
      description:
        "You have given consent for location tracking during this service.",
    });

    // In a real implementation, this would start the geolocation tracking
    startLocationTracking();
  };

  // Start location tracking
  const startLocationTracking = () => {
    setIsUpdatingLocation(true);

    // In a real implementation, this would use the browser's geolocation API
    // navigator.geolocation.watchPosition((position) => {
    //   const { latitude, longitude } = position.coords;
    //   // Update location in database
    // });
  };

  // Stop location tracking
  const stopLocationTracking = () => {
    setIsUpdatingLocation(false);

    // In a real implementation, this would clear the geolocation watch
    // navigator.geolocation.clearWatch(watchId);
  };

  useEffect(() => {
    // Create locations for the map
    const mapLocations: MapLocation[] = [
      {
        id: "customer",
        name: "Your Location",
        address: "Home",
        position: customerLocation,
        type: "home",
      },
      {
        id: "helper",
        name: helperName,
        address: "En route to you",
        position: simulatedHelperLocation,
        type: "helper",
        details: {
          eta: eta,
        },
      },
    ];

    setLocations(mapLocations);

    // Calculate distance between customer and helper
    const distanceInKm = calculateDistance(
      customerLocation.lat,
      customerLocation.lng,
      simulatedHelperLocation.lat,
      simulatedHelperLocation.lng,
    );

    setDistance(`${distanceInKm.toFixed(1)} km`);

    // Only update ETA if helper is en route
    if (status === "en_route") {
      // Calculate estimated travel time (simple calculation for demo)
      const speedKmPerHour = 30; // Average urban driving speed
      const timeHours = distanceInKm / speedKmPerHour;
      const timeMinutes = Math.round(timeHours * 60);
      setEta(`${timeMinutes} min driving`);
    }

    // Set map center to include both points
    const centerLat = (customerLocation.lat + simulatedHelperLocation.lat) / 2;
    const centerLng = (customerLocation.lng + simulatedHelperLocation.lng) / 2;
    setMapCenter({ lat: centerLat, lng: centerLng });

    // Simulate helper movement (only if en route)
    if (status === "en_route") {
      const movementInterval = setInterval(() => {
        setSimulatedHelperLocation((prev) => {
          // Move helper closer to customer
          const newLat = prev.lat + (customerLocation.lat - prev.lat) * 0.05;
          const newLng = prev.lng + (customerLocation.lng - prev.lng) * 0.05;

          // If helper is very close to customer, consider them arrived
          const newDistance = calculateDistance(
            customerLocation.lat,
            customerLocation.lng,
            newLat,
            newLng,
          );

          if (newDistance < 0.05) {
            clearInterval(movementInterval);
            // In a real app, you would update the service status to "arrived"
          }

          return { lat: newLat, lng: newLng };
        });
      }, 3000); // Update every 3 seconds

      return () => clearInterval(movementInterval);
    }
  }, [customerLocation, simulatedHelperLocation, helperName, status, eta]);

  const getStatusBadge = () => {
    switch (status) {
      case "en_route":
        return <Badge className="bg-blue-100 text-blue-800">En Route</Badge>;
      case "arrived":
        return <Badge className="bg-green-100 text-green-800">Arrived</Badge>;
      case "in_progress":
        return (
          <Badge className="bg-purple-100 text-purple-800">In Progress</Badge>
        );
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Live Service Tracking</CardTitle>
          <div className="flex items-center gap-2">
            {isUpdatingLocation && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                Live
              </Badge>
            )}
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <GoogleMapWrapper
            center={mapCenter}
            zoom={14}
            locations={locations}
            height="300px"
            className="w-full"
          />

          {/* Location tracking consent dialog */}
          <AlertDialog
            open={showConsentDialog}
            onOpenChange={setShowConsentDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Location Tracking Consent</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="space-y-4">
                    <p>
                      To enable real-time location tracking during this service,
                      we need your explicit consent. This helps ensure safety
                      and transparency for both you and the helper.
                    </p>

                    <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                      <h4 className="font-medium text-blue-800 flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        How location tracking works:
                      </h4>
                      <ul className="list-disc pl-5 mt-2 text-blue-700 text-sm space-y-1">
                        <li>
                          Your location will only be shared during this specific
                          service
                        </li>
                        <li>
                          Location data is encrypted and only visible to you and
                          your helper
                        </li>
                        <li>
                          Tracking automatically stops when the service is
                          completed
                        </li>
                        <li>You can disable tracking at any time</li>
                      </ul>
                    </div>

                    <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                      <h4 className="font-medium text-amber-800 flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        Privacy protection:
                      </h4>
                      <p className="text-amber-700 text-sm mt-1">
                        Your location data is never stored permanently or shared
                        with third parties. It is only used for the duration of
                        this service and then deleted.
                      </p>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConsentConfirm}>
                  I Give Consent
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Helper info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {/* Location tracking toggle */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <Label
                    htmlFor="location-tracking"
                    className="flex items-center cursor-pointer"
                  >
                    {trackingEnabled ? (
                      <MapPin className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <MapPinOff className="h-4 w-4 text-gray-400 mr-1" />
                    )}
                    <span
                      className={
                        trackingEnabled
                          ? "text-green-600 font-medium"
                          : "text-gray-500"
                      }
                    >
                      Location Tracking
                    </span>
                  </Label>

                  {!helperConsentGiven && status !== "completed" && (
                    <Badge
                      variant="outline"
                      className="ml-2 bg-amber-50 text-amber-700 border-amber-200"
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Waiting for helper consent
                    </Badge>
                  )}
                </div>

                <Switch
                  id="location-tracking"
                  checked={trackingEnabled}
                  onCheckedChange={handleTrackingToggle}
                  disabled={
                    status === "completed" ||
                    (!customerConsentGiven && !consentChecked)
                  }
                />
              </div>

              {/* Helper info */}
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary">
                  <img
                    src={helperAvatar}
                    alt={helperName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{helperName}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{distance} away</span>
                    {status === "en_route" && (
                      <>
                        <Clock className="h-3 w-3 ml-2 mr-1" />
                        <span>ETA: {eta}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={onCallHelper}
                    title="Call Helper"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={onMessageHelper}
                    title="Message Helper"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={() =>
                      window.open(
                        `https://maps.google.com/?q=${simulatedHelperLocation.lat},${simulatedHelperLocation.lng}`,
                        "_blank",
                      )
                    }
                    title="Open in Maps"
                  >
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveTrackingMap;
