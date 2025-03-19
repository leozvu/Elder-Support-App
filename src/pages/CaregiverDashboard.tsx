import React from "react";
import Layout from "@/components/layout/Layout";
import CaregiverPortal from "@/components/caregiver/CaregiverPortal";
import QuickAccessPanel from "@/components/dashboard/QuickAccessPanel";

const CaregiverDashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Caregiver Dashboard</h1>

        {/* Quick Access Panel */}
        <QuickAccessPanel role="caregiver" />

        {/* Main Caregiver Portal */}
        <CaregiverPortal />
      </div>
    </Layout>
  );
};

export default CaregiverDashboard;
