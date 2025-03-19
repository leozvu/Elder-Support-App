// Google Maps API configuration

// The API key should be stored in environment variables for security
// For development, we'll use the VITE_GOOGLE_MAPS_API_KEY environment variable
export const GOOGLE_MAPS_API_KEY = "AIzaSyCD99y0MXmj07v1SOfm-Ul5F9gR_L2PxA8";

// Default map settings
export const DEFAULT_MAP_CENTER = {
  lat: 40.7128, // New York City coordinates as default
  lng: -74.006,
};

export const DEFAULT_MAP_ZOOM = 14;

// Map styling options (optional - for customizing the map appearance)
export const MAP_STYLES = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

// Helper function to calculate distance between two coordinates (in kilometers)
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Convert distance to human-readable format
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} meters`;
  }
  return `${distance.toFixed(1)} km`;
};

// Estimate travel time based on distance (very rough estimate)
export const estimateTravelTime = (
  distanceKm: number,
  mode: string,
): string => {
  let speedKmPerHour = 5; // Default walking speed

  switch (mode) {
    case "walking":
      speedKmPerHour = 5;
      break;
    case "bicycling":
      speedKmPerHour = 15;
      break;
    case "driving":
      speedKmPerHour = 30; // Assuming city driving
      break;
    default:
      speedKmPerHour = 5;
  }

  const timeHours = distanceKm / speedKmPerHour;
  const timeMinutes = Math.round(timeHours * 60);

  if (timeMinutes < 1) {
    return "Less than a minute";
  } else if (timeMinutes === 1) {
    return "1 minute";
  } else if (timeMinutes < 60) {
    return `${timeMinutes} minutes`;
  } else {
    const hours = Math.floor(timeHours);
    const minutes = Math.round((timeHours - hours) * 60);
    return `${hours} hour${hours > 1 ? "s" : ""} ${minutes > 0 ? `${minutes} minutes` : ""}`;
  }
};

// Alias for estimateTravelTime to match any imports using getEstimatedTravelTime
export const getEstimatedTravelTime = estimateTravelTime;

/**
 * Gets a static map image URL for a given location
 * @param lat Latitude
 * @param lng Longitude
 * @param zoom Zoom level (1-20)
 * @param width Image width in pixels
 * @param height Image height in pixels
 * @returns URL for a static map image
 */
export function getStaticMapUrl(
  lat: number,
  lng: number,
  zoom: number = 14,
  width: number = 600,
  height: number = 300,
): string {
  // In a real app, you would use a service like Google Maps, Mapbox, etc.
  // This is a placeholder that returns a generic map image
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&key=${GOOGLE_MAPS_API_KEY}`;
}
