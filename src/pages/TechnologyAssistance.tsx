import React from "react";
import Layout from "@/components/layout/Layout";
import TechnologyAssistanceRequestForm from "@/components/service/TechnologyAssistanceRequestForm";

const TechnologyAssistance = () => {
  const handleSubmit = (data: any) => {
    console.log("Technology assistance request submitted:", data);
    // In a real app, this would send the data to your backend
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Technology Assistance</h1>
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
          <TechnologyAssistanceRequestForm onSubmit={handleSubmit} />
        </div>
      </div>
    </Layout>
  );
};

export default TechnologyAssistance;
