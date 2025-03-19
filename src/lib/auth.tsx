import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";
import { Session, User } from "@supabase/supabase-js";
import { Tables } from "../types/supabase";

// Define types
type UserDetails = Tables<"users">;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: any; data?: any }>;
  signUp: (
    email: string,
    password: string,
    userData: any,
  ) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  refreshUserDetails: () => Promise<void>;
}

// Create context with default values
const defaultContextValue: AuthContextType = {
  session: null,
  user: null,
  userDetails: null,
  isLoading: true,
  signIn: async () => ({ error: new Error("AuthProvider not initialized") }),
  signUp: async () => ({
    error: new Error("AuthProvider not initialized"),
    data: null,
  }),
  signOut: async () => {},
  refreshUserDetails: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Helper functions
const fetchUserDetailsFromDB = async (userId: string) => {
  if (!userId) {
    console.log("fetchUserDetails: No user ID provided");
    return null;
  }

  try {
    console.log("Fetching user details for ID:", userId);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user details:", error);
      return null;
    }

    if (data) {
      console.log("User details fetched successfully");
      return data;
    } else {
      console.warn("No user details found for ID:", userId);
      return null;
    }
  } catch (error) {
    console.error("Exception fetching user details:", error);
    return null;
  }
};

// Auth Provider Component
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    console.log("AuthProvider: Initializing auth state");
    setIsLoading(true);

    // Get current session
    const initializeAuth = async () => {
      try {
        // Check for local demo login first
        const localAuthMethod = localStorage.getItem(
          "senior_assist_auth_method",
        );
        if (localAuthMethod === "local") {
          const localUserStr = localStorage.getItem("senior_assist_user");
          if (localUserStr) {
            try {
              const localUser = JSON.parse(localUserStr);
              console.log("Found local demo user:", localUser.email);
              setUserDetails(localUser);
              setUser(localUser as any);
              setSession(
                JSON.parse(
                  localStorage.getItem("senior_assist_session") || "null",
                ) as any,
              );
              setIsLoading(false);
              return;
            } catch (e) {
              console.error("Error parsing local user:", e);
              // Continue with normal auth if local auth fails
            }
          }
        }

        console.log("AuthProvider: Getting session");
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          setIsLoading(false);
          return;
        }

        console.log("Initial session:", data.session ? "Found" : "Not found");
        setSession(data.session);
        setUser(data.session?.user ?? null);

        if (data.session?.user) {
          const details = await fetchUserDetailsFromDB(data.session.user.id);
          setUserDetails(details);
        }
      } catch (error) {
        console.error("Exception during auth initialization:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        "Auth state changed:",
        event,
        session ? "Session exists" : "No session",
      );

      // Skip if using local auth
      if (localStorage.getItem("senior_assist_auth_method") === "local") {
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const details = await fetchUserDetailsFromDB(session.user.id);
        setUserDetails(details);
      } else {
        setUserDetails(null);
      }

      setIsLoading(false);
    });

    return () => {
      console.log("AuthProvider: Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user details method
  const fetchUserDetails = async (userId: string) => {
    if (!userId) return;
    const details = await fetchUserDetailsFromDB(userId);
    setUserDetails(details);
  };

  // Public method to refresh user details
  const refreshUserDetails = async () => {
    if (user) {
      await fetchUserDetails(user.id);
    }
  };

  // Sign in method
  const signIn = async (email: string, password: string) => {
    console.log("Attempting to sign in with email:", email);
    try {
      // For demo purposes, allow login with demo accounts without Supabase
      if (email === "martha@example.com" && password === "password123") {
        const demoUser = {
          id: "demo-martha",
          email: "martha@example.com",
          full_name: "Martha Johnson",
          role: "customer",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha",
          phone: "(555) 123-4567",
          address: "123 Main St, Anytown, USA",
        };
        
        localStorage.setItem("senior_assist_auth_method", "local");
        localStorage.setItem("senior_assist_user", JSON.stringify(demoUser));
        localStorage.setItem("senior_assist_session", JSON.stringify({ user: demoUser }));
        
        setUser(demoUser as any);
        setUserDetails(demoUser);
        setSession({ user: demoUser } as any);
        
        return { error: null, data: { user: demoUser } };
      }
      
      if (email === "helper@example.com" && password === "password123") {
        const demoUser = {
          id: "demo-helper",
          email: "helper@example.com",
          full_name: "Henry Helper",
          role: "helper",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Henry",
          phone: "(555) 987-6543",
          address: "456 Oak St, Anytown, USA",
        };
        
        localStorage.setItem("senior_assist_auth_method", "local");
        localStorage.setItem("senior_assist_user", JSON.stringify(demoUser));
        localStorage.setItem("senior_assist_session", JSON.stringify({ user: demoUser }));
        
        setUser(demoUser as any);
        setUserDetails(demoUser);
        setSession({ user: demoUser } as any);
        
        return { error: null, data: { user: demoUser } };
      }
      
      if (email === "admin@example.com" && password === "password123") {
        const demoUser = {
          id: "demo-admin",
          email: "admin@example.com",
          full_name: "Admin User",
          role: "admin",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
          phone: "(555) 555-5555",
          address: "789 Pine St, Anytown, USA",
        };
        
        localStorage.setItem("senior_assist_auth_method", "local");
        localStorage.setItem("senior_assist_user", JSON.stringify(demoUser));
        localStorage.setItem("senior_assist_session", JSON.stringify({ user: demoUser }));
        
        setUser(demoUser as any);
        setUserDetails(demoUser);
        setSession({ user: demoUser } as any);
        
        return { error: null, data: { user: demoUser } };
      }

      // Sign in with Supabase for non-demo accounts
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error.message);
        return { error };
      }

      console.log("Sign in successful", data);
      setSession(data.session);
      setUser(data.user);

      if (data.user) {
        const details = await fetchUserDetailsFromDB(data.user.id);
        setUserDetails(details);
      }

      return { error: null, data };
    } catch (error: any) {
      console.error("Exception during sign in:", error);
      return {
        error: {
          message:
            error.message || "An unexpected error occurred. Please try again.",
        },
      };
    }
  };

  // Sign up method
  const signUp = async (email: string, password: string, userData: any) => {
    console.log("Attempting to sign up with email:", email);
    try {
      // First create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName,
            role: userData.userType,
          },
        },
      });

      if (error || !data.user) {
        console.error("Sign up error:", error);
        return { error, data: null };
      }

      console.log("Auth user created successfully");

      // Then create the user profile
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email: email,
          full_name: userData.fullName,
          phone: userData.phone,
          address: userData.address,
          role: userData.userType,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.fullName.split(" ")[0]}`,
        },
      ]);

      if (profileError) {
        console.error("Error creating user profile:", profileError);
      } else {
        console.log("User profile created successfully");
      }

      // If user is a helper, create helper profile
      if (userData.userType === "helper" && !profileError) {
        const { error: helperError } = await supabase
          .from("helper_profiles")
          .insert([
            {
              id: data.user.id,
              bio: "",
              verification_status: "pending",
              services_offered: [],
            },
          ]);

        if (helperError) {
          console.error("Error creating helper profile:", helperError);
        } else {
          console.log("Helper profile created successfully");
        }
      }

      return { error: profileError, data: data };
    } catch (error: any) {
      console.error("Exception during sign up:", error);
      return {
        error: {
          message:
            error.message || "An unexpected error occurred during signup.",
        },
        data: null,
      };
    }
  };

  // Sign out method
  const signOut = async () => {
    try {
      // Check if using local auth
      if (localStorage.getItem("senior_assist_auth_method") === "local") {
        localStorage.removeItem("senior_assist_user");
        localStorage.removeItem("senior_assist_auth_method");
        localStorage.removeItem("senior_assist_session");
        setUser(null);
        setUserDetails(null);
        setSession(null);
      } else {
        await supabase.auth.signOut();
      }
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Create the context value
  const value = {
    session,
    user,
    userDetails,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshUserDetails,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use the auth context
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth, AuthContext };