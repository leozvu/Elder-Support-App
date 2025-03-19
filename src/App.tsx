import React, { Suspense, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./lib/auth";

// Import components directly instead of using lazy loading for critical components
import Home from "./components/home";
import Login from "./pages/Login";

// Use lazy loading for non-critical components
const ElderlyDashboard = React.lazy(() => import("./pages/ElderlyDashboard"));
const HelperDashboard = React.lazy(() => import("./pages/HelperDashboard"));
const AdminDashboard = React.lazy(() => import("./pages/HubDashboard"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Register = React.lazy(() => import("./pages/Register"));

// Loading component with timeout detection
const LoadingScreen = ({ timeout = 10000 }) => {
  const [isTimedOut, setIsTimedOut] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimedOut(true);
    }, timeout);
    
    return () => clearTimeout(timer);
  }, [timeout]);
  
  if (isTimedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Loading Timeout</h2>
          <p className="text-gray-700 mb-4">
            The application is taking longer than expected to load. This might be due to a slow connection or a temporary issue.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg">Loading...</p>
      </div>
    </div>
  );
};

// Error fallback component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
      <p className="text-gray-700 mb-4">
        The application encountered an error. Please try refreshing the page.
      </p>
      <div className="bg-red-50 p-3 rounded-md mb-4 overflow-auto max-h-40">
        <p className="text-red-700 font-mono text-sm">
          {error.message}
        </p>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

function App() {
  const { user, userDetails, isLoading, authError } = useAuth();
  const [hasError, setHasError] = useState<Error | null>(null);

  // Handle auth errors
  useEffect(() => {
    if (authError) {
      setHasError(authError);
    }
  }, [authError]);

  // Error boundary
  if (hasError) {
    return <ErrorFallback error={hasError} />;
  }

  // Loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Function to determine which dashboard to show based on user role
  const getDashboardComponent = () => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    try {
      if (userDetails) {
        switch (userDetails.role) {
          case "customer":
            return <ElderlyDashboard />;
          case "helper":
            return <HelperDashboard />;
          case "admin":
            return <AdminDashboard />;
          default:
            return <ElderlyDashboard />;
        }
      }
      
      // Default to elderly dashboard if role not determined yet
      return <ElderlyDashboard />;
    } catch (error) {
      console.error("Error rendering dashboard:", error);
      setHasError(error instanceof Error ? error : new Error(String(error)));
      return <ErrorFallback error={error instanceof Error ? error : new Error(String(error))} />;
    }
  };

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={getDashboardComponent()} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route 
          path="/register" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              {user ? <Navigate to="/" /> : <Register />}
            </Suspense>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              {user ? <Profile /> : <Navigate to="/login" />}
            </Suspense>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              {user ? <Settings /> : <Navigate to="/login" />}
            </Suspense>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

// Wrap App with error boundary
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error!} />;
    }

    return this.props.children;
  }
}

// Export the wrapped component
export default function AppWithErrorBoundary() {
  return (
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  );
}