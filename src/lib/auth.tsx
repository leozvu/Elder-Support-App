import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";

// Define types
interface UserDetails {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: any;
  userDetails: UserDetails | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any; data?: any }>;
  signOut: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  userDetails: null,
  isLoading: true,
  signIn: async () => ({ error: new Error("AuthProvider not initialized") }),
  signOut: async () => {},
});

// Auth Provider Component
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    setIsLoading(true);

    // Check for local demo login
    const localAuthMethod = localStorage.getItem("senior_assist_auth_method");
    if (localAuthMethod === "local") {
      const localUserStr = localStorage.getItem("senior_assist_user");
      if (localUserStr) {
        try {
          const localUser = JSON.parse(localUserStr);
          setUser(localUser);
          setUserDetails(localUser);
          setIsLoading(false);
          return;
        } catch (e) {
          console.error("Error parsing local user:", e);
        }
      }
    }

    // Check Supabase auth
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setIsLoading(false);
          return;
        }
        
        if (data.session?.user) {
          setUser(data.session.user);
          
          // Get user details
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.session.user.id)
            .single();
            
          if (!userError && userData) {
            setUserDetails(userData);
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Sign in method
  const signIn = async (email: string, password: string) => {
    try {
      // For demo purposes, allow login with demo accounts
      if (email === "martha@example.com" && password === "password123") {
        const demoUser = {
          id: "demo-martha",
          email: "martha@example.com",
          full_name: "Martha Johnson",
          role: "customer",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha",
        };
        
        localStorage.setItem("senior_assist_auth_method", "local");
        localStorage.setItem("senior_assist_user", JSON.stringify(demoUser));
        
        setUser(demoUser);
        setUserDetails(demoUser);
        
        return { error: null, data: { user: demoUser } };
      }
      
      if (email === "helper@example.com" && password === "password123") {
        const demoUser = {
          id: "demo-helper",
          email: "helper@example.com",
          full_name: "Henry Helper",
          role: "helper",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Henry",
        };
        
        localStorage.setItem("senior_assist_auth_method", "local");
        localStorage.setItem("senior_assist_user", JSON.stringify(demoUser));
        
        setUser(demoUser);
        setUserDetails(demoUser);
        
        return { error: null, data: { user: demoUser } };
      }
      
      if (email === "admin@example.com" && password === "password123") {
        const demoUser = {
          id: "demo-admin",
          email: "admin@example.com",
          full_name: "Admin User",
          role: "admin",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
        };
        
        localStorage.setItem("senior_assist_auth_method", "local");
        localStorage.setItem("senior_assist_user", JSON.stringify(demoUser));
        
        setUser(demoUser);
        setUserDetails(demoUser);
        
        return { error: null, data: { user: demoUser } };
      }

      // Sign in with Supabase for non-demo accounts
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      setUser(data.user);
      
      // Get user details
      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();
          
        if (!userError && userData) {
          setUserDetails(userData);
        }
      }

      return { error: null, data };
    } catch (error: any) {
      return {
        error: {
          message: error.message || "An unexpected error occurred. Please try again.",
        },
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
      } else {
        await supabase.auth.signOut();
      }
      
      setUser(null);
      setUserDetails(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Create the context value
  const value = {
    user,
    userDetails,
    isLoading,
    signIn,
    signOut,
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