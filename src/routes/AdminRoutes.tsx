import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "@/components/admin/AdminDashboard";
import HelperCertificationTracker from "@/components/admin/HelperCertificationTracker";
import AutomatedReportingSystem from "@/components/admin/AutomatedReportingSystem";
import HubCommunicationTools from "@/components/admin/HubCommunicationTools";
import ServiceDemandHeatmap from "@/components/admin/ServiceDemandHeatmap";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/certifications" element={<HelperCertificationTracker />} />
      <Route path="/reporting" element={<AutomatedReportingSystem />} />
      <Route path="/communication" element={<HubCommunicationTools />} />
      <Route path="/heatmap" element={<ServiceDemandHeatmap />} />
    </Routes>
  );
};

export default AdminRoutes;
