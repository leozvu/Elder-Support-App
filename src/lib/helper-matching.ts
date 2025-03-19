import { supabase } from "./supabase";
import * as mockData from "./mock-data";
import { Tables } from "@/types/supabase";

type Helper = Tables<"helper_profiles"> & {
  user: Tables<"users">;
  distance?: number;
  matchScore?: number;
};

type ServiceRequest = Tables<"service_requests">;

interface MatchingOptions {
  maxDistance?: number; // in kilometers
  minRating?: number; // minimum average rating (1-5)
  prioritizeRating?: boolean; // whether to prioritize rating over distance
  requiredServices?: string[]; // specific services that must be offered
  preferredGender?: string; // preferred helper gender if any
  useAvailability?: boolean; // whether to check helper availability
  requestDate?: Date; // the date of the service request
  specificNeeds?: string[]; // specific needs for this request
  medicalConditions?: string[]; // medical conditions to consider
  mobilityRestrictions?: boolean; // whether mobility assistance is needed
  dietaryRequirements?: boolean; // whether dietary knowledge is needed
  communicationPreferences?: string[]; // preferred communication methods
}

// Default matching options
const defaultOptions: MatchingOptions = {
  maxDistance: 20, // 20km radius
  minRating: 3.5, // minimum 3.5 star rating
  prioritizeRating: false, // distance is default priority
  useAvailability: true,
  requiredServices: [], // no specific services required by default
  preferredGender: undefined, // no gender preference by default
  requestDate: new Date(), // current date/time by default
  specificNeeds: [], // no specific needs by default
  medicalConditions: [], // no medical conditions by default
  mobilityRestrictions: false, // no mobility restrictions by default
  dietaryRequirements: false, // no dietary requirements by default
  communicationPreferences: [], // no communication preferences by default
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Check if a helper is available at the requested time
 * @param helperId Helper ID to check
 * @param requestDate Date and time of the service request
 * @param durationMinutes Duration of the service in minutes
 * @returns Boolean indicating if helper is available
 */
async function isHelperAvailable(
  helperId: string,
  requestDate: Date,
  durationMinutes: number = 60,
): Promise<boolean> {
  try {
    // Calculate the end time of the service
    const requestEndTime = new Date(
      requestDate.getTime() + durationMinutes * 60000,
    );

    // Check for overlapping service requests
    const { data, error } = await supabase
      .from("service_requests")
      .select("*")
      .eq("helper_id", helperId)
      .in("status", ["assigned", "in_progress"]);

    if (error) {
      console.error("Error checking helper availability:", error);
      return true; // Assume available if there's an error to not block matching
    }

    // If no data, the helper is available
    if (!data || data.length === 0) return true;

    // Check for time conflicts
    for (const request of data) {
      const startTime = new Date(request.scheduled_time);
      const endTime = new Date(
        startTime.getTime() + (request.duration_minutes || 60) * 60000,
      );

      // Check if there's an overlap
      if (
        (requestDate >= startTime && requestDate < endTime) ||
        (requestEndTime > startTime && requestEndTime <= endTime) ||
        (requestDate <= startTime && requestEndTime >= endTime)
      ) {
        return false; // Helper is not available
      }
    }

    return true; // No conflicts found
  } catch (error) {
    console.error("Exception checking helper availability:", error);
    return true; // Assume available if there's an exception
  }
}

/**
 * Calculate match score for a helper based on various factors
 * @param helper Helper profile
 * @param request Service request
 * @param options Matching options
 * @returns Match score between 0-100
 */
function calculateMatchScore(
  helper: Helper,
  request: ServiceRequest,
  options: MatchingOptions,
): number {
  let score = 0;
  const maxScore = 100;

  // Distance score (0-20 points) - closer is better
  if (helper.distance !== undefined) {
    const maxDistance = options.maxDistance || 20;
    const distanceScore = Math.max(
      0,
      20 - (helper.distance / maxDistance) * 20,
    );
    score += distanceScore;
  } else {
    // If distance is unknown, give average score
    score += 10;
  }

  // Rating score (0-15 points)
  if (helper.average_rating) {
    const ratingScore = (helper.average_rating / 5) * 15;
    score += ratingScore;
  } else {
    // If no ratings yet, give benefit of doubt with average score
    score += 7.5;
  }

  // Service match score (0-15 points)
  if (request.service_type && helper.services_offered) {
    // Check if the helper offers the specific service type
    const serviceTypeMatch = helper.services_offered.includes(
      request.service_type,
    );
    if (serviceTypeMatch) {
      score += 15; // Full points for exact service match
    } else {
      // Partial points based on number of services offered (assuming versatility)
      const serviceMatchScore = Math.min(
        7.5,
        helper.services_offered.length * 1.5,
      );
      score += serviceMatchScore;
    }
  }

  // Experience score based on total reviews (0-10 points)
  if (helper.total_reviews) {
    const experienceScore = Math.min(10, helper.total_reviews / 5);
    score += experienceScore;
  }

  // Availability score (0-5 points)
  // This is already handled by filtering out unavailable helpers,
  // but we can give extra points for helpers who are immediately available
  if (helper.user && helper.user.last_sign_in_at) {
    const lastActive = new Date(helper.user.last_sign_in_at);
    const now = new Date();
    const hoursSinceActive =
      (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);

    if (hoursSinceActive < 1) {
      score += 5; // Recently active (within the last hour)
    } else if (hoursSinceActive < 24) {
      score += 2.5; // Active within the last day
    }
  }

  // Skill match score (0-10 points)
  if (request.required_skills && helper.skills) {
    const requiredSkills = Array.isArray(request.required_skills)
      ? request.required_skills
      : typeof request.required_skills === "string"
        ? [request.required_skills]
        : [];

    if (requiredSkills.length > 0 && helper.skills.length > 0) {
      const matchedSkills = requiredSkills.filter((skill) =>
        helper.skills?.includes(skill),
      );

      const skillMatchScore =
        (matchedSkills.length / requiredSkills.length) * 10;
      score += skillMatchScore;
    }
  }

  // Language match score (0-5 points)
  if (request.preferred_language && helper.languages) {
    if (helper.languages.includes(request.preferred_language)) {
      score += 5; // Full points for language match
    }
  }

  // NEW: Specific needs match score (0-10 points)
  if (
    options.specificNeeds &&
    options.specificNeeds.length > 0 &&
    helper.specialized_skills
  ) {
    const matchedNeeds = options.specificNeeds.filter((need) =>
      helper.specialized_skills?.some((skill) =>
        skill.toLowerCase().includes(need.toLowerCase()),
      ),
    );

    const specificNeedsScore =
      (matchedNeeds.length / options.specificNeeds.length) * 10;
    score += specificNeedsScore;
  }

  // NEW: Medical conditions experience score (0-5 points)
  if (
    options.medicalConditions &&
    options.medicalConditions.length > 0 &&
    helper.experience_with_conditions
  ) {
    const matchedConditions = options.medicalConditions.filter((condition) =>
      helper.experience_with_conditions?.some((exp) =>
        exp.toLowerCase().includes(condition.toLowerCase()),
      ),
    );

    const medicalConditionsScore =
      (matchedConditions.length / options.medicalConditions.length) * 5;
    score += medicalConditionsScore;
  }

  // NEW: Mobility assistance score (0-5 points)
  if (options.mobilityRestrictions && helper.specialized_skills) {
    const hasMobilitySkills = helper.specialized_skills.some((skill) =>
      ["mobility", "transfer", "wheelchair", "walker", "assistance"].some(
        (keyword) => skill.toLowerCase().includes(keyword),
      ),
    );

    if (hasMobilitySkills) {
      score += 5;
    }
  }

  // NEW: Dietary knowledge score (0-5 points)
  if (options.dietaryRequirements && helper.specialized_skills) {
    const hasDietarySkills = helper.specialized_skills.some((skill) =>
      ["diet", "nutrition", "food", "meal", "cooking"].some((keyword) =>
        skill.toLowerCase().includes(keyword),
      ),
    );

    if (hasDietarySkills) {
      score += 5;
    }
  }

  return Math.min(maxScore, score);
}

/**
 * Find suitable helpers for a service request
 * @param request Service request object or ID
 * @param options Matching options
 * @returns Array of matched helpers sorted by match score
 */
export async function findMatchingHelpers(
  request: ServiceRequest | string,
  options: MatchingOptions = defaultOptions,
): Promise<Helper[]> {
  try {
    // Merge options with defaults
    const matchOptions = { ...defaultOptions, ...options };

    // If request is a string (ID), fetch the full request
    let serviceRequest: ServiceRequest;
    if (typeof request === "string") {
      const { data, error } = await supabase
        .from("service_requests")
        .select("*")
        .eq("id", request)
        .single();

      if (error || !data) {
        console.error("Error fetching service request:", error);
        return [];
      }

      serviceRequest = data;
    } else {
      serviceRequest = request;
    }

    // Get customer location from address
    let customerLocation = {
      latitude: 40.7128, // Default coordinates
      longitude: -74.006,
    };

    // Try to get customer location from the database if customer_id exists
    if (serviceRequest.customer_id) {
      const { data: customerData, error: customerError } = await supabase
        .from("users")
        .select("latitude, longitude")
        .eq("id", serviceRequest.customer_id)
        .single();

      if (
        !customerError &&
        customerData &&
        customerData.latitude &&
        customerData.longitude
      ) {
        customerLocation = {
          latitude: customerData.latitude,
          longitude: customerData.longitude,
        };
      }
    }

    // If location is provided in the service request, try to geocode it
    // This would be implemented with a real geocoding service in production
    if (serviceRequest.location) {
      // For now, we'll just use the default coordinates
      // In a real implementation, you would use a geocoding service here
      console.log(`Would geocode location: ${serviceRequest.location}`);
    }

    // Fetch all verified helpers
    const { data: helpers, error } = await supabase
      .from("helper_profiles")
      .select("*, user:users(*)")
      .eq("verification_status", "approved");

    if (error || !helpers) {
      console.error("Error fetching helpers:", error);

      // Fallback to mock data
      console.log("Using mock helper data");
      return mockData.mockHelperProfiles as unknown as Helper[];
    }

    // Process and filter helpers
    let matchedHelpers: Helper[] = [];

    for (const helper of helpers) {
      // Skip helpers without location data
      if (!helper.user || !helper.user.latitude || !helper.user.longitude) {
        continue;
      }

      // Calculate distance
      const distance = calculateDistance(
        customerLocation.latitude,
        customerLocation.longitude,
        helper.user.latitude,
        helper.user.longitude,
      );

      // Add distance to helper object
      helper.distance = distance;

      // Filter by distance
      if (matchOptions.maxDistance && distance > matchOptions.maxDistance) {
        continue;
      }

      // Filter by minimum rating
      if (
        matchOptions.minRating &&
        helper.average_rating &&
        helper.average_rating < matchOptions.minRating
      ) {
        continue;
      }

      // Filter by required services
      if (
        matchOptions.requiredServices &&
        matchOptions.requiredServices.length > 0 &&
        helper.services_offered
      ) {
        const hasAllRequiredServices = matchOptions.requiredServices.every(
          (service) => helper.services_offered?.includes(service),
        );

        if (!hasAllRequiredServices) {
          continue;
        }
      }

      // If service type is specified in the request, prioritize helpers who offer that service
      if (serviceRequest.service_type && helper.services_offered) {
        if (!helper.services_offered.includes(serviceRequest.service_type)) {
          // If the helper doesn't offer the requested service, lower their priority
          // but don't exclude them completely
          helper.distance = (helper.distance || 0) * 1.5; // Artificially increase distance to lower priority
        }
      }

      // NEW: Check for specific needs match
      if (
        serviceRequest.specific_needs &&
        serviceRequest.specific_needs.length > 0
      ) {
        options.specificNeeds = serviceRequest.specific_needs;
      }

      // NEW: Extract medical conditions from the request or user profile
      if (serviceRequest.customer_id) {
        try {
          // In a real implementation, we would fetch the user's medical conditions
          // For now, we'll just use a placeholder
          // const { data: userData } = await supabase
          //   .from('users')
          //   .select('medical_conditions')
          //   .eq('id', serviceRequest.customer_id)
          //   .single();
          //
          // if (userData?.medical_conditions) {
          //   options.medicalConditions = userData.medical_conditions.split(',').map(c => c.trim());
          // }
        } catch (error) {
          console.error("Error fetching user medical conditions:", error);
        }
      }

      // Filter by gender preference if specified
      if (
        matchOptions.preferredGender &&
        helper.user.gender &&
        helper.user.gender !== matchOptions.preferredGender
      ) {
        continue;
      }

      // Check availability if needed
      if (matchOptions.useAvailability && matchOptions.requestDate) {
        const available = await isHelperAvailable(
          helper.id,
          matchOptions.requestDate,
          serviceRequest.duration_minutes,
        );

        if (!available) {
          continue;
        }
      }

      // Calculate match score
      helper.matchScore = calculateMatchScore(
        helper,
        serviceRequest,
        matchOptions,
      );

      // Add to matched helpers
      matchedHelpers.push(helper);
    }

    // Sort helpers by match score (descending)
    matchedHelpers.sort((a, b) => {
      const scoreA = a.matchScore || 0;
      const scoreB = b.matchScore || 0;
      return scoreB - scoreA;
    });

    return matchedHelpers;
  } catch (error) {
    console.error("Error in helper matching algorithm:", error);
    return [];
  }
}

/**
 * Get the best match for a service request
 * @param request Service request object or ID
 * @param options Matching options
 * @returns The best matching helper or null if no matches
 */
export async function getBestMatchingHelper(
  request: ServiceRequest | string,
  options: MatchingOptions = defaultOptions,
): Promise<Helper | null> {
  const matches = await findMatchingHelpers(request, options);
  return matches.length > 0 ? matches[0] : null;
}

/**
 * Automatically assign the best matching helper to a service request
 * @param requestId Service request ID
 * @param options Matching options
 * @returns Boolean indicating success or failure
 */
export async function autoAssignHelper(
  requestId: string,
  options: MatchingOptions = defaultOptions,
): Promise<boolean> {
  try {
    const bestMatch = await getBestMatchingHelper(requestId, options);

    if (!bestMatch) {
      console.log("No matching helpers found for request", requestId);
      return false;
    }

    // Update the service request with the assigned helper
    const { error } = await supabase
      .from("service_requests")
      .update({
        helper_id: bestMatch.id,
        status: "assigned",
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (error) {
      console.error("Error assigning helper to request:", error);
      return false;
    }

    console.log(
      `Successfully assigned helper ${bestMatch.id} to request ${requestId} with match score ${bestMatch.matchScore}`,
    );
    return true;
  } catch (error) {
    console.error("Error in auto-assigning helper:", error);
    return false;
  }
}
