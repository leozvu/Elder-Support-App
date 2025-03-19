/**
 * Local database service that works with Supabase but uses local authentication
 * This allows database operations without requiring Supabase auth to work
 */

import { supabase } from "./supabase";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

// Get the current user from local storage
const getLocalUser = () => {
  const userStr = localStorage.getItem("senior_assist_user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error("Error parsing local user:", e);
    return null;
  }
};

// Check if using local auth
const isUsingLocalAuth = () => {
  return localStorage.getItem("senior_assist_auth_method") === "local";
};

/**
 * Database service that works with both local auth and Supabase auth
 */
export const db = {
  /**
   * Select data from a table
   */
  from: (table: string) => {
    // Start with the regular Supabase query builder
    const query = supabase.from(table);

    // Return an enhanced version of the query builder
    return {
      ...query,
      select: (columns: string) => {
        const selectQuery = query.select(columns);

        // Enhance the query with local auth handling
        return enhanceQuery(selectQuery, table);
      },
    };
  },

  /**
   * Insert data into a table
   */
  insert: async (table: string, data: any | any[]) => {
    console.log(`Inserting into ${table}:`, data);

    // If using local auth, we need to handle RLS manually
    if (isUsingLocalAuth()) {
      const localUser = getLocalUser();

      // For service_requests table, ensure customer_id is set to current user if it's a customer
      if (
        table === "service_requests" &&
        localUser?.role === "customer" &&
        !Array.isArray(data)
      ) {
        data.customer_id = data.customer_id || localUser.id;
      }

      // For helper_profiles, ensure id matches the current user if it's a helper
      if (
        table === "helper_profiles" &&
        localUser?.role === "helper" &&
        !Array.isArray(data)
      ) {
        data.id = data.id || localUser.id;
      }
    }

    return supabase.from(table).insert(data);
  },

  /**
   * Update data in a table
   */
  update: (table: string, data: any) => {
    console.log(`Updating ${table}:`, data);
    return supabase.from(table).update(data);
  },

  /**
   * Delete data from a table
   */
  delete: (table: string) => {
    console.log(`Deleting from ${table}`);
    return supabase.from(table).delete();
  },

  /**
   * Get the current user
   */
  getCurrentUser: () => {
    if (isUsingLocalAuth()) {
      return getLocalUser();
    }

    // Otherwise use Supabase auth
    return supabase.auth.getUser().then(({ data }) => data?.user || null);
  },

  /**
   * Get user details including profile data
   */
  getUserDetails: async () => {
    if (isUsingLocalAuth()) {
      const localUser = getLocalUser();
      if (!localUser) return null;

      // If it's a helper, also get helper profile
      if (localUser.role === "helper") {
        const { data: helperProfile } = await supabase
          .from("helper_profiles")
          .select("*")
          .eq("id", localUser.id)
          .single();

        return { ...localUser, helperProfile };
      }

      return localUser;
    }

    // Otherwise use Supabase auth
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: userDetails } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!userDetails) return null;

    // If it's a helper, also get helper profile
    if (userDetails.role === "helper") {
      const { data: helperProfile } = await supabase
        .from("helper_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      return { ...userDetails, helperProfile };
    }

    return userDetails;
  },
};

/**
 * Enhance a Supabase query with local auth handling
 */
function enhanceQuery<T>(
  query: PostgrestFilterBuilder<any, any, T[]>,
  table: string,
) {
  // Create a wrapper around the original query
  const enhancedQuery = {
    ...query,
    // Override the eq method to handle local auth
    eq: (column: string, value: any) => {
      const eqQuery = query.eq(column, value);
      return enhanceQuery(eqQuery, table);
    },
    // Override the in method to handle local auth
    in: (column: string, values: any[]) => {
      const inQuery = query.in(column, values);
      return enhanceQuery(inQuery, table);
    },
    // Override the single method to handle local auth
    single: () => {
      return query.single();
    },
    // Add additional methods as needed
    order: (column: string, options?: { ascending?: boolean }) => {
      const orderQuery = query.order(column, options);
      return enhanceQuery(orderQuery, table);
    },
    limit: (count: number) => {
      const limitQuery = query.limit(count);
      return enhanceQuery(limitQuery, table);
    },
  };

  return enhancedQuery;
}
