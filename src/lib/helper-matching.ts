import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";

type Helper = Tables<"helper_profiles"> & {
  user: Tables<"users">;
  distance?: number;
  matchScore?: number;
};

interface ServiceRequest {
  id: string;
  customer_id: string;
  service_type: string;
  status: string;
  location: string;
  scheduled_time: string;
  duration_minutes: number;
  required_skills?: string[];
  preferred_language?: string;
}

interface MatchingOptions {
  maxDistance?: number;
  minRating?: number;
  prioritizeRating?: boolean;
  requiredServices?: string[];
  useAvailability?: boolean;
  requestDate?: Date;
}

// Calculate distance between two points using Haversine formula
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Calculate match score for a helper
const calculateMatchScore = (
  helper: Helper,
  request: ServiceRequest,
  options: MatchingOptions
): number => {
  let score = 0;
  const maxScore = 100;
  
  // Distance score (25 points max)
  if (helper.distance !== undefined) {
    const maxDistance = options.maxDistance || 20;
    const distanceScore = Math.max(0, 25 - (helper.distance / maxDistance) * 25);
    score += distanceScore;
  } else {
    // If no distance info, give average score
    score += 12.5;
  }
  
  // Rating score (20 points max)
  if (helper.average_rating) {
    const ratingScore = (helper.average_rating / 5) * 20;
    score += ratingScore;
  } else {
    // Default rating score if none available
    score += 10;
  }
  
  // Service match score (20 points max)
  if (helper.services_offered) {
    if (helper.services_offered.includes(request.service_type)) {
      score += 20;
    } else {
      // Partial points for having other services
      score += Math.min(10, helper.services_offered.length * 2);
    }
  }
  
  // Experience score (10 points max)
  if (helper.total_reviews) {
    score += Math.min(10, helper.total_reviews / 5);
  }
  
  // Skills match score (10 points max)
  if (helper.skills && request.required_skills) {
    const matchingSkills = helper.skills.filter(skill => 
      request.required_skills?.includes(skill)
    );
    if (matchingSkills.length > 0) {
      score += Math.min(10, (matchingSkills.length / request.required_skills.length) * 10);
    }
  }
  
  // Language match (5 points)
  if (helper.languages && request.preferred_language) {
    if (helper.languages.includes(request.preferred_language)) {
      score += 5;
    }
  }
  
  // Availability score (10 points)
  if (options.useAvailability && helper.availability_hours) {
    // Simple check - in a real app, this would be more sophisticated
    score += 10;
  }
  
  return Math.min(maxScore, Math.round(score * 10) / 10);
};

// Mock data for helpers when Supabase is not available
const getMockHelpers = (): Helper[] => {
  return [
    {
      id: "helper-1",
      user: {
        id: "user-1",
        full_name: "Sarah Johnson",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        email: "sarah@example.com",
        created_at: new Date().toISOString(),
      },
      user_id: "user-1",
      bio: "Experienced caregiver with 5+ years working with seniors",
      services_offered: ["shopping", "transport", "companionship"],
      skills: ["grocery shopping", "heavy lifting", "first aid"],
      languages: ["en", "es"],
      average_rating: 4.8,
      total_reviews: 24,
      availability_hours: {
        monday: ["9-17"],
        tuesday: ["9-17"],
        wednesday: ["9-17"],
        thursday: ["9-17"],
        friday: ["9-17"],
      },
      location_lat: 37.7749,
      location_lng: -122.4194,
      training_completed: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "helper-2",
      user: {
        id: "user-2",
        full_name: "Michael Chen",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        email: "michael@example.com",
        created_at: new Date().toISOString(),
      },
      user_id: "user-2",
      bio: "Retired nurse with a passion for helping seniors",
      services_offered: ["medical", "transport", "shopping"],
      skills: ["medication management", "vital signs", "first aid"],
      languages: ["en", "zh"],
      average_rating: 4.9,
      total_reviews: 36,
      availability_hours: {
        monday: ["8-12"],
        wednesday: ["8-12"],
        friday: ["8-12"],
      },
      location_lat: 37.7833,
      location_lng: -122.4167,
      training_completed: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "helper-3",
      user: {
        id: "user-3",
        full_name: "David Wilson",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        email: "david@example.com",
        created_at: new Date().toISOString(),
      },
      user_id: "user-3",
      bio: "Former physical therapist specializing in senior mobility",
      services_offered: ["exercise", "transport", "housekeeping"],
      skills: ["mobility assistance", "exercise planning", "home safety"],
      languages: ["en"],
      average_rating: 4.6,
      total_reviews: 18,
      availability_hours: {
        tuesday: ["13-18"],
        thursday: ["13-18"],
        saturday: ["10-15"],
      },
      location_lat: 37.7935,
      location_lng: -122.4217,
      training_completed: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "helper-4",
      user: {
        id: "user-4",
        full_name: "Emily Rodriguez",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        email: "emily@example.com",
        created_at: new Date().toISOString(),
      },
      user_id: "user-4",
      bio: "Compassionate caregiver with experience in dementia care",
      services_offered: ["companionship", "shopping", "meal preparation"],
      skills: ["dementia care", "meal planning", "grocery shopping"],
      languages: ["en", "es"],
      average_rating: 4.7,
      total_reviews: 29,
      availability_hours: {
        monday: ["9-17"],
        tuesday: ["9-17"],
        wednesday: ["9-17"],
        thursday: ["9-17"],
        friday: ["9-17"],
      },
      location_lat: 37.7699,
      location_lng: -122.4269,
      training_completed: true,
      created_at: new Date().toISOString(),
    },
  ];
};

// Main function to find matching helpers
export const findMatchingHelpers = async (
  request: ServiceRequest,
  options: MatchingOptions = {}
): Promise<Helper[]> => {
  try {
    // Try to get helpers from Supabase
    const { data: helpers, error } = await supabase
      .from("helper_profiles")
      .select(`
        *,
        user:users(*)
      `)
      .eq("is_active", true)
      .order("average_rating", { ascending: false });

    if (error) {
      console.error("Error fetching helpers:", error);
      throw error;
    }

    if (!helpers || helpers.length === 0) {
      console.warn("No helpers found in database, using mock data");
      const mockHelpers = getMockHelpers();
      return processHelpers(mockHelpers, request, options);
    }

    return processHelpers(helpers as Helper[], request, options);
  } catch (error) {
    console.error("Error in findMatchingHelpers:", error);
    // Fallback to mock data if Supabase fails
    const mockHelpers = getMockHelpers();
    return processHelpers(mockHelpers, request, options);
  }
};

// Process helpers to calculate distances and match scores
const processHelpers = (
  helpers: Helper[],
  request: ServiceRequest,
  options: MatchingOptions
): Helper[] => {
  // Mock request location (would come from geocoding in a real app)
  const requestLat = 37.7749;
  const requestLng = -122.4194;

  // Calculate distance for each helper
  const helpersWithDistance = helpers.map(helper => {
    let distance: number | undefined = undefined;
    
    if (helper.location_lat && helper.location_lng) {
      distance = calculateDistance(
        requestLat,
        requestLng,
        helper.location_lat,
        helper.location_lng
      );
    }
    
    return {
      ...helper,
      distance
    };
  });

  // Filter by distance if maxDistance is specified
  let filteredHelpers = helpersWithDistance;
  if (options.maxDistance) {
    filteredHelpers = filteredHelpers.filter(
      helper => !helper.distance || helper.distance <= options.maxDistance!
    );
  }

  // Filter by minimum rating if specified
  if (options.minRating) {
    filteredHelpers = filteredHelpers.filter(
      helper => !helper.average_rating || helper.average_rating >= options.minRating!
    );
  }

  // Filter by required services if specified
  if (options.requiredServices && options.requiredServices.length > 0) {
    filteredHelpers = filteredHelpers.filter(helper => 
      helper.services_offered && 
      options.requiredServices!.some(service => 
        helper.services_offered!.includes(service)
      )
    );
  }

  // Calculate match score for each helper
  const helpersWithScore = filteredHelpers.map(helper => ({
    ...helper,
    matchScore: calculateMatchScore(helper, request, options)
  }));

  // Sort by match score (descending)
  return helpersWithScore.sort((a, b) => 
    (b.matchScore || 0) - (a.matchScore || 0)
  );
};

export default findMatchingHelpers;