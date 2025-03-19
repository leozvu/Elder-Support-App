import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Log environment variables status
console.log(
  "VITE_SUPABASE_URL:",
  import.meta.env.VITE_SUPABASE_URL ? "defined" : "missing",
);
console.log(
  "VITE_SUPABASE_ANON_KEY:",
  import.meta.env.VITE_SUPABASE_ANON_KEY ? "defined" : "missing",
);

// Create the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: "senior_assist_auth",
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Test the connection and log the result
supabase.auth.onAuthStateChange((event, session) => {
  console.log(
    "Supabase auth state changed:",
    event,
    session ? `Session exists for user ${session.user.id}` : "No session",
  );
});

// Attempt to verify the connection
supabase
  .from("users")
  .select("count", { count: "exact", head: true })
  .then(({ count, error }) => {
    if (error) {
      console.warn("Supabase connection test failed:", error.message);
      console.log("Using mock data for development");
    } else {
      console.log("Supabase connection successful! Users count:", count);
    }
  })
  .catch((err) => {
    console.warn("Supabase connection test exception:", err.message);
    console.log("Using mock data for development");
  });

// Function to ensure demo users exist
export const ensureDemoUsersExist = async () => {
  try {
    // Call the recreate-demo-users edge function
    const { data, error } = await supabase.functions.invoke(
      "recreate-demo-users",
      {
        method: "POST",
      },
    );

    if (error) {
      console.error("Error creating demo users:", error);
      return false;
    }

    console.log("Demo users created successfully:", data);
    return true;
  } catch (error) {
    console.error("Exception creating demo users:", error);
    return false;
  }
};

// Function to reset auth state
export const resetAuthState = async () => {
  try {
    console.log("Resetting auth state...");
    await supabase.auth.signOut();
    localStorage.removeItem("senior_assist_auth");
    console.log("Auth state reset complete");
    return true;
  } catch (error) {
    console.error("Error resetting auth state:", error);
    return false;
  }
};
