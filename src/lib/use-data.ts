import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import * as mockData from "./mock-data";

// Generic hook to fetch data from Supabase with fallback to mock data
export function useData<T>(
  tableName: string,
  mockDataKey: keyof typeof mockData,
  query?: {
    select?: string;
    eq?: [string, any];
    order?: [string, "asc" | "desc"];
    limit?: number;
  },
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Start with a query builder
        let queryBuilder = supabase
          .from(tableName)
          .select(query?.select || "*");

        // Add filters if provided
        if (query?.eq) {
          queryBuilder = queryBuilder.eq(query.eq[0], query.eq[1]);
        }

        // Add ordering if provided
        if (query?.order) {
          queryBuilder = queryBuilder.order(query.order[0], {
            ascending: query.order[1] === "asc",
          });
        }

        // Add limit if provided
        if (query?.limit) {
          queryBuilder = queryBuilder.limit(query.limit);
        }

        const { data: supabaseData, error } = await queryBuilder;

        if (error) {
          console.warn(`Error fetching from ${tableName}:`, error.message);
          console.log(`Using mock data for ${tableName}`);
          // Fallback to mock data
          setData(mockData[mockDataKey] as T[]);
        } else {
          setData(supabaseData as T[]);
        }
      } catch (err) {
        console.error(`Exception fetching from ${tableName}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        // Fallback to mock data
        setData(mockData[mockDataKey] as T[]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, mockDataKey, JSON.stringify(query)]);

  return { data, loading, error };
}

// Specific hooks for different data types
export function useUsers(query?: any) {
  return useData("users", "mockUsers", query);
}

export function useHelperProfiles(query?: any) {
  return useData("helper_profiles", "mockHelperProfiles", query);
}

export function useServiceRequests(query?: any) {
  return useData("service_requests", "mockServiceRequests", query);
}

export function useHubs(query?: any) {
  return useData("hubs", "mockHubs", query);
}

export function useEmergencyContacts(query?: any) {
  return useData("emergency_contacts", "mockEmergencyContacts", query);
}
