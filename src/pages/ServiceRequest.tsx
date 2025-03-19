import React from "react";
import Layout from "@/components/layout/Layout";
import ServiceRequestFlow from "@/components/service/ServiceRequestFlow";
import { useNavigate } from "react-router-dom";

const ServiceRequest = () => {
  const navigate = useNavigate();

  const handleRequestComplete = (data: any) => {
    // In a real app, we would save the request data to a database
    console.log("Service request completed:", data);

    // Navigate to the dashboard with active request
    navigate("/");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Request Assistance</h1>
        <ServiceRequestFlow onComplete={handleRequestComplete} />
      </div>
    </Layout>
  );
};

export default ServiceRequest;
