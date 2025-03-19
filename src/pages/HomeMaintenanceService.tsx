import React from "react";
import Layout from "@/components/layout/Layout";
import HomeMaintenanceRequestForm from "@/components/service/HomeMaintenanceRequestForm";

const HomeMaintenanceService = () => {
  const handleSubmit = (data: any) => {
    console.log("Home maintenance request submitted:", data);
    // In a real app, this would send the data to your backend
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Home Maintenance Service</h1>
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
          <HomeMaintenanceRequestForm onSubmit={handleSubmit} />
        </div>
      </div>
    </Layout>
  );
};

export default HomeMaintenanceService;
