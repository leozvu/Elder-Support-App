import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import ElderlyDashboard from "./pages/ElderlyDashboard";
import { useAuth } from "./lib/auth";

// Lazy load pages for better performance
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));

// Simplify the App component to minimize potential issues
function App() {
  const { user, userDetails, isLoading } = useAuth();

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={getDashboardComponent()} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default App;