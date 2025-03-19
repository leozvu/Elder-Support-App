import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "@/hooks/useAuth.tsx";
import DashboardMain from "@/components/dashboard/DashboardMain";
import ServiceRequestFlow from "@/components/service/ServiceRequestFlow";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminRoutes from "@/routes/AdminRoutes";
import UserProfile from "@/components/profile/UserProfile";
import LoginPage from "@/components/auth/LoginPage";
import RegisterPage from "@/components/auth/RegisterPage";
import NotFoundPage from "@/components/common/NotFoundPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const AppNavigation = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          {/* User routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardMain />} />
          <Route path="/services" element={<ServiceRequestFlow />} />
          <Route path="/profile" element={<UserProfile />} />

          {/* Admin routes */}
          <Route
            path="/admin/*"
            element={
              <AdminLayout>
                <AdminRoutes />
              </AdminLayout>
            }
          />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppNavigation;
