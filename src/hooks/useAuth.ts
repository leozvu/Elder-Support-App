import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  role: "admin" | "helper" | "elderly";
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    email: string,
    password: string,
    role: string,
    fullName: string,
  ) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

// Provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // In a real app, this would be a call to your auth service
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be a call to your auth service
      // Mock login for demonstration
      const mockUser: User = {
        id: "user-123",
        email,
        role: email.includes("admin")
          ? "admin"
          : email.includes("helper")
            ? "helper"
            : "elderly",
        full_name: "John Doe",
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const register = async (
    email: string,
    password: string,
    role: string,
    fullName: string,
  ) => {
    setIsLoading(true);
    try {
      // In a real app, this would be a call to your auth service
      // Mock registration for demonstration
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email,
        role: role as "admin" | "helper" | "elderly",
        full_name: fullName,
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    login,
    logout,
    register,
  };
};

// Create the provider component separately
export const AuthProviderComponent = ({ children }: AuthProviderProps) => {
  const auth = AuthProvider({ children });

  // In TypeScript files, we need to use React.createElement for JSX
  return React.createElement(AuthContext.Provider, { value: auth }, children);
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
