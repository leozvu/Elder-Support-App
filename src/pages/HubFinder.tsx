import React from "react";
import Layout from "@/components/layout/Layout";
import HubFinder from "@/components/hub/HubFinder";

const HubFinderPage = () => {
  const handleSelectHub = (hub: any) => {
    console.log("Selected hub:", hub);
    // In a real app, this would navigate to the hub details page
    // or open a modal with more information
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <HubFinder onSelectHub={handleSelectHub} />
      </div>
    </Layout>
  );
};

export default HubFinderPage;
