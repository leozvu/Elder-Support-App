import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import ElderlyDashboard from "./pages/ElderlyDashboard";
import { useAuth } from "./lib/auth";
import Diagnostics from "./pages/Diagnostics";

// Lazy load pages for better performance
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-lg">Loading...</p>
    </div>
  </div>
);

function App() {
  const { user, userDetails, isLoading } = useAuth();

  // Check for Supabase configuration issues
  const hasSupabaseConfigIssue = localStorage.getItem('supabaseConfigIssue') === 'true';
  
  // If there are configuration issues, show a warning
  if (hasSupabaseConfigIssue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
          <h1 className="text-xl font-bold text-yellow-800 mb-4">Configuration Issue Detected</h1>
          <p className="text-yellow-700 mb-4">
            The application is missing required configuration for Supabase. Please check your environment variables.
          </p>
          <div className="flex justify-between">
            <a 
              href="/diagnostics" 
              className="text-blue-600 hover:underline"
            >
              View Diagnostics
            </a>
            <button 
              onClick={() => {
                localStorage.removeItem('supabaseConfigIssue');
                window.location.reload();
              }}
              className="text-blue-600 hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Function to determine which dashboard to show based on user role
  const getDashboardComponent = () => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    if (userDetails) {
      switch (userDetails.role) {
        case "customer":
          return <ElderlyDashboard />;
        case "helper":
          return <div>Helper Dashboard</div>;
        case "admin":
          return <div>Admin Dashboard</div>;
        default:
          return <ElderlyDashboard />;
      }
    }

    // Default to elderly dashboard if role not determined yet
    return <ElderlyDashboard />;
  };

  // Loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={getDashboardComponent()} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
        <Route path="/diagnostics" element={<Diagnostics />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default App;