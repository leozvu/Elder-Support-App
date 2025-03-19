import { Suspense, lazy, useState, useEffect } from "react";
import { useRoutes, Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./components/home";
import ElderlyDashboard from "./pages/ElderlyDashboard";
import routes from "tempo-routes";
import { useAuth } from "./lib/auth";
import AdminRoutes from "./routes/AdminRoutes";
import LoadingScreen from "./components/ui/loading-screen";

// Lazy load pages for better performance
const ServiceRequest = lazy(() => import("./pages/ServiceRequest"));
const HelperProfile = lazy(() => import("./pages/HelperProfile"));
const ServiceTracking = lazy(() => import("./pages/ServiceTracking"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const HelperDashboard = lazy(() => import("./pages/HelperDashboard"));
const HelperSchedule = lazy(() => import("./pages/HelperSchedule"));
const HubDashboard = lazy(() => import("./pages/HubDashboard"));
const ServiceReview = lazy(() => import("./pages/ServiceReview"));
const ServiceHistory = lazy(() => import("./pages/ServiceHistory"));
const MedicationReminders = lazy(() => import("./pages/MedicationReminders"));
const WellnessChecks = lazy(() => import("./pages/WellnessChecks"));
const CaregiverDashboard = lazy(() => import("./pages/CaregiverDashboard"));
const CommunityEvents = lazy(() => import("./pages/CommunityEvents"));
const EmergencyServices = lazy(() => import("./pages/EmergencyServices"));
const EmergencyContacts = lazy(() => import("./pages/EmergencyContacts"));
const HubFinder = lazy(() => import("./pages/HubFinder"));
const DirectCommunication = lazy(() => import("./pages/DirectCommunication"));
const ServiceBundles = lazy(() => import("./pages/ServiceBundles"));
const FamilyPortal = lazy(() => import("./pages/FamilyPortal"));
const AddSeniorProfile = lazy(() => import("./pages/AddSeniorProfile"));
const LocalBusinessDirectory = lazy(
  () => import("./pages/LocalBusinessDirectory"),
);
const SocialConnections = lazy(() => import("./pages/SocialConnections"));
const HelperSkillsDirectory = lazy(
  () => import("./pages/HelperSkillsDirectory"),
);

function App() {
  const { user, userDetails, isLoading } = useAuth();

  // Function to determine which dashboard to show based on user role
  const getDashboardComponent = () => {
    // Use more concise logging with structured data
    console.log("getDashboardComponent", {
      userId: user?.id,
      userRole: userDetails?.role,
    });

    if (!user) {
      console.log("No user, redirecting to login");
      return <Navigate to="/login" replace />;
    }

    if (userDetails) {
      // Validate user role to prevent security issues
      const validRoles = ["customer", "helper", "admin"];
      const role = validRoles.includes(userDetails.role)
        ? userDetails.role
        : "customer";

      console.log(
        `User role: ${role}${role !== userDetails.role ? " (invalid role defaulted)" : ""}`,
      );

      switch (role) {
        case "customer":
          return <ElderlyDashboard />;
        case "helper":
          return <HelperDashboard />;
        case "admin":
          return <HubDashboard />;
        default:
          // This should never execute due to the validation above
          console.warn("Unknown role, defaulting to elderly dashboard");
          return <ElderlyDashboard />;
      }
    }

    // Default to elderly dashboard if role not determined yet
    console.log("No user details yet, defaulting to elderly dashboard");
    return <ElderlyDashboard />;
  };

  // Protected route component
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const [authTimeout, setAuthTimeout] = useState<"none" | "soft" | "hard">(
      "none",
    );
    const [timerIds, setTimerIds] = useState<NodeJS.Timeout[]>([]);

    useEffect(() => {
      // Clear any existing timers when component mounts or dependencies change
      return () => {
        timerIds.forEach((id) => clearTimeout(id));
      };
    }, [timerIds]);

    useEffect(() => {
      if (!isLoading) return;

      // Set a backup timeout in case the auth loading state gets stuck
      const softTimer = setTimeout(() => {
        if (isLoading) {
          console.warn("Soft timeout triggered for protected route");
          setAuthTimeout("soft");
        }
      }, 5000);

      // Hard timeout - will force redirect regardless of state
      const hardTimer = setTimeout(() => {
        if (isLoading) {
          console.warn("Hard timeout triggered for protected route");
          setAuthTimeout("hard");
        }
      }, 10000);

      // Store timer IDs for cleanup
      setTimerIds([softTimer, hardTimer]);

      return () => {
        clearTimeout(softTimer);
        clearTimeout(hardTimer);
      };
    }, [isLoading]);

    // Handle manual retry - use navigate instead of direct page reload
    const handleRetry = () => {
      console.log("Manual retry initiated");
      // Reset timeout state
      setAuthTimeout("none");
      // Clear existing timers
      timerIds.forEach((id) => clearTimeout(id));
      setTimerIds([]);
      // Reload the page in a more controlled way
      window.location.reload();
    };

    // Hard timeout - force redirect to login
    if (authTimeout === "hard") {
      console.warn("Hard timeout reached, redirecting to login");
      return <Navigate to="/login" state={{ from: "timeout" }} replace />;
    }

    if (isLoading && authTimeout === "none") {
      return (
        <LoadingScreen
          text="Checking authentication..."
          timeout={8000}
          showRetryButton={false} // Don't show retry until soft timeout
          onRetry={handleRetry}
          onTimeout={() => setAuthTimeout("soft")} // Use the state instead of direct navigation
        />
      );
    }

    // If we hit the soft timeout but auth is still loading, show retry option
    if (authTimeout === "soft" && isLoading) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
          <div className="text-center max-w-md w-full bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Authentication Taking Too Long
            </h2>
            <p className="mb-6 text-gray-600">
              We're having trouble verifying your authentication status.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
              >
                Retry Authentication
              </button>
              <Link
                to="/login"
                className="px-4 py-2 border border-gray-300 rounded text-center hover:bg-gray-50 transition-colors"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      );
    }

    if (!user)
      return <Navigate to="/login" state={{ from: "protected" }} replace />;
    return children;
  };

  // Public route component - redirects to dashboard if already logged in
  const PublicRoute = ({ children }: { children: JSX.Element }) => {
    const [authTimeout, setAuthTimeout] = useState(false);
    const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
      // Clear any existing timer when component unmounts
      return () => {
        if (timerId) clearTimeout(timerId);
      };
    }, [timerId]);

    useEffect(() => {
      if (!isLoading) return;

      // Set a backup timeout in case the auth loading state gets stuck
      const timer = setTimeout(() => {
        if (isLoading) {
          console.warn("Backup timeout triggered for public route");
          setAuthTimeout(true);
        }
      }, 5000);

      setTimerId(timer);

      return () => clearTimeout(timer);
    }, [isLoading]);

    // Handle manual retry with more controlled approach
    const handleRetry = () => {
      console.log("Manual retry initiated");
      // Reset timeout state
      setAuthTimeout(false);
      // Clear existing timer
      if (timerId) clearTimeout(timerId);
      setTimerId(null);
      // Reload the page
      window.location.reload();
    };

    if (isLoading && !authTimeout) {
      return (
        <LoadingScreen
          text="Checking authentication..."
          timeout={5000}
          showRetryButton={false} // Only show retry after timeout
          onRetry={handleRetry}
          onTimeout={() => {
            console.warn("Authentication check timed out");
            // Allow proceeding to login page after timeout
            setAuthTimeout(true);
          }}
        />
      );
    }

    // If we hit the timeout but auth is still loading, show the children anyway
    // For public routes, we'll just proceed to the login page
    if (authTimeout && isLoading) {
      console.log(
        "Timeout reached for public route, proceeding to render children",
      );
      return children;
    }

    if (user) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <Suspense
      fallback={
        <LoadingScreen
          text="Loading application..."
          timeout={10000}
          showRetryButton={true}
          onRetry={() => {
            // Clear any error state that might be stored in session storage
            try {
              sessionStorage.removeItem("app_load_error");
            } catch (e) {
              console.error("Failed to clear session storage:", e);
            }
            window.location.reload();
          }}
          onTimeout={() => {
            console.warn("Application loading timed out");
            // Store error state to prevent infinite reload loops
            try {
              const errorCount = parseInt(
                sessionStorage.getItem("app_load_error") || "0",
              );
              if (errorCount < 3) {
                sessionStorage.setItem(
                  "app_load_error",
                  (errorCount + 1).toString(),
                );
                window.location.reload();
              } else {
                console.error(
                  "Multiple reload attempts failed, showing error UI",
                );
                // The LoadingScreen will remain visible with retry button
              }
            } catch (e) {
              console.error("Failed to access session storage:", e);
              window.location.reload();
            }
          }}
        />
      }
    >
      <>
        <Routes>
          <Route path="/" element={getDashboardComponent()} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/request"
            element={
              <ProtectedRoute>
                <ServiceRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/helper/:id"
            element={
              <ProtectedRoute>
                <HelperProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/helper-dashboard"
            element={
              <ProtectedRoute>
                <HelperDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/helper-schedule"
            element={
              <ProtectedRoute>
                <HelperSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hub-dashboard"
            element={
              <ProtectedRoute>
                <HubDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracking/:id"
            element={
              <ProtectedRoute>
                <ServiceTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/review/:id"
            element={
              <ProtectedRoute>
                <ServiceReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/service-history"
            element={
              <ProtectedRoute>
                <ServiceHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medications"
            element={
              <ProtectedRoute>
                <MedicationReminders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wellness"
            element={
              <ProtectedRoute>
                <WellnessChecks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/caregiver"
            element={
              <ProtectedRoute>
                <CaregiverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community-events"
            element={
              <ProtectedRoute>
                <CommunityEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emergency-services"
            element={
              <ProtectedRoute>
                <EmergencyServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emergency-contacts"
            element={
              <ProtectedRoute>
                <EmergencyContacts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hub-finder"
            element={
              <ProtectedRoute>
                <HubFinder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/direct-communication"
            element={
              <ProtectedRoute>
                <DirectCommunication />
              </ProtectedRoute>
            }
          />
          <Route
            path="/service-bundles"
            element={
              <ProtectedRoute>
                <ServiceBundles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/family-portal"
            element={
              <ProtectedRoute>
                <FamilyPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/family-portal/:seniorId"
            element={
              <ProtectedRoute>
                <FamilyPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/family-portal/add-senior"
            element={
              <ProtectedRoute>
                <AddSeniorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/local-businesses"
            element={
              <ProtectedRoute>
                <LocalBusinessDirectory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/social-connections"
            element={
              <ProtectedRoute>
                <SocialConnections />
              </ProtectedRoute>
            }
          />
          <Route
            path="/helper-skills"
            element={
              <ProtectedRoute>
                <HelperSkillsDirectory />
              </ProtectedRoute>
            }
          />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
