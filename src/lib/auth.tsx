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
  authError: Error | null;
  signIn: (email: string, password: string) => Promise<{ error: any; data?: any }>;
  signOut: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  userDetails: null,
  isLoading: true,
  authError: null,
  signIn: async () => ({ error: new Error("AuthProvider not initialized") }),
  signOut: async () => {},
});

// Auth Provider Component
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    
    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (isMounted && isLoading) {
        console.warn('Auth initialization timed out after 10 seconds');
        setIsLoading(false);
        setAuthError(new Error('Authentication initialization timed out'));
        setAuthInitialized(true);
      }
    }, 10000);

    // Check for local demo login
    const localAuthMethod = localStorage.getItem("senior_assist_auth_method");
    if (localAuthMethod === "local") {
      const localUserStr = localStorage.getItem("senior_assist_user");
      if (localUserStr) {
        try {
          const localUser = JSON.parse(localUserStr);
          if (isMounted) {
            setUser(localUser);
            setUserDetails(localUser);
            setIsLoading(false);
            setAuthInitialized(true);
            clearTimeout(loadingTimeout);
          }
          return;
        } catch (e) {
          console.error("Error parsing local user:", e);
          if (isMounted) {
            setAuthError(e instanceof Error ? e : new Error(String(e)));
          }
        }
      }
    }

    // Check Supabase auth
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          if (isMounted) {
            setAuthError(error);
            setIsLoading(false);
            setAuthInitialized(true);
          }
          return;
        }
        
        if (data.session?.user) {
          if (isMounted) {
            setUser(data.session.user);
          }
          
          // Get user details
          try {
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("*")
              .eq("id", data.session.user.id)
              .single();
              
            if (userError) {
              console.error("Error fetching user details:", userError);
              if (isMounted) {
                setAuthError(userError);
              }
            } else if (userData && isMounted) {
              setUserDetails(userData);
            }
          } catch (detailsError) {
            console.error("Exception fetching user details:", detailsError);
            if (isMounted) {
              setAuthError(detailsError instanceof Error ? detailsError : new Error(String(detailsError)));
            }
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
        if (isMounted) {
          setAuthError(error instanceof Error ? error : new Error(String(error)));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setAuthInitialized(true);
          clearTimeout(loadingTimeout);
        }
      }
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (isMounted) {
          setUser(session?.user || null);
          
          if (session?.user) {
            try {
              const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", session.user.id)
                .single();
                
              if (error) {
                console.error("Error fetching user details on auth change:", error);
              } else if (data && isMounted) {
                setUserDetails(data);
              }
            } catch (error) {
              console.error("Exception fetching user details on auth change:", error);
            }
          } else {
            setUserDetails(null);
          }
        }
      }
    );
    
    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  // Sign in method
  const signIn = async (email: string, password: string) => {
    try {
      setAuthError(null);
      
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
        setAuthError(error);
        return { error };
      }

      setUser(data.user);
      
      // Get user details
      if (data.user) {
        try {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.user.id)
            .single();
            
          if (userError) {
            console.error("Error fetching user details after sign in:", userError);
            setAuthError(userError);
          } else if (userData) {
            setUserDetails(userData);
          }
        } catch (error) {
          console.error("Exception fetching user details after sign in:", error);
          setAuthError(error instanceof Error ? error : new Error(String(error)));
        }
      }

      return { error: null, data };
    } catch (error: any) {
      console.error("Exception during sign in:", error);
      setAuthError(error);
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
      setAuthError(null);
      
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
      setAuthError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // Create the context value
  const value = {
    user,
    userDetails,
    isLoading,
    authError,
    signIn,
    signOut,
  };

  // Don't render children until auth is initialized to prevent flashing
  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Initializing authentication...</p>
        </div>
      </div>
    );
  }

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