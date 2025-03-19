import React, { Suspense, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./lib/auth";
import ErrorBoundary from "./components/error/ErrorBoundary";
import AccessibilityWrapper from "./components/accessibility/AccessibilityWrapper";

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
const Diagnostics = React.lazy(() => import("./pages/Diagnostics"));
const SupabaseDiagnostic = React.lazy(() => import("./pages/SupabaseDiagnostic"));
const SystemDiagnostics = React.lazy(() => import("./pages/SystemDiagnostics"));

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

function App() {
  const { user, userDetails, isLoading, authError } = useAuth();
  const [hasError, setHasError] = useState<Error | null>(null);

  // Handle auth errors
  useEffect(() => {
    if (authError) {
      console.error("Auth error in App:", authError);
      setHasError(authError);
    }
  }, [authError]);

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
      return null;
    }
  };

  return (
    <AccessibilityWrapper>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={
            <ErrorBoundary context="Dashboard">
              {getDashboardComponent()}
            </ErrorBoundary>
          } />
          <Route path="/home" element={
            <ErrorBoundary context="Home">
              <Home />
            </ErrorBoundary>
          } />
          <Route path="/login" element={
            <ErrorBoundary context="Login">
              {user ? <Navigate to="/" /> : <Login />}
            </ErrorBoundary>
          } />
          <Route 
            path="/register" 
            element={
              <ErrorBoundary context="Register">
                <Suspense fallback={<LoadingScreen />}>
                  {user ? <Navigate to="/" /> : <Register />}
                </Suspense>
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ErrorBoundary context="Profile">
                <Suspense fallback={<LoadingScreen />}>
                  {user ? <Profile /> : <Navigate to="/login" />}
                </Suspense>
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ErrorBoundary context="Settings">
                <Suspense fallback={<LoadingScreen />}>
                  {user ? <Settings /> : <Navigate to="/login" />}
                </Suspense>
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/diagnostics" 
            element={
              <ErrorBoundary context="Diagnostics">
                <Suspense fallback={<LoadingScreen />}>
                  <Diagnostics />
                </Suspense>
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/supabase-diagnostic" 
            element={
              <ErrorBoundary context="SupabaseDiagnostic">
                <Suspense fallback={<LoadingScreen />}>
                  <SupabaseDiagnostic />
                </Suspense>
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/system-diagnostics" 
            element={
              <ErrorBoundary context="SystemDiagnostics">
                <Suspense fallback={<LoadingScreen />}>
                  <SystemDiagnostics />
                </Suspense>
              </ErrorBoundary>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </AccessibilityWrapper>
  );
}

export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary context="App">
      <App />
    </ErrorBoundary>
  );
}