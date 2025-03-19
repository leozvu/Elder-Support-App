import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import ElderlyDashboard from "./pages/ElderlyDashboard";
import routes from "tempo-routes";
import { useAuth } from "./lib/auth";
import AdminRoutes from "./routes/AdminRoutes";
import { AccessibilityProvider } from "./components/accessibility/AccessibilityContext";

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
    console.log("getDashboardComponent - user:", user?.id);
    console.log("getDashboardComponent - userDetails:", userDetails);

    if (!user) {
      console.log("No user, redirecting to login");
      return <Navigate to="/login" />;
    }

    if (userDetails) {
      console.log("User role:", userDetails.role);
      switch (userDetails.role) {
        case "customer":
          return <ElderlyDashboard />;
        case "helper":
          return <HelperDashboard />;
        case "admin":
          return <HubDashboard />;
        default:
          console.log("Unknown role, defaulting to elderly dashboard");
          return <ElderlyDashboard />;
      }
    }

    // Default to elderly dashboard if role not determined yet
    console.log("No user details yet, defaulting to elderly dashboard");
    return <ElderlyDashboard />;
  };

  // Protected route component
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
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

    if (!user) return <Navigate to="/login" />;
    return children;
  };

  // Public route component - redirects to dashboard if already logged in
  const PublicRoute = ({ children }: { children: JSX.Element }) => {
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

    if (user) return <Navigate to="/" />;
    return children;
  };

  return (
    <AccessibilityProvider>
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
    </AccessibilityProvider>
  );
}

export default App;