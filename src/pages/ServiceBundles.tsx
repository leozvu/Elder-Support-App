import React from "react";
import Layout from "@/components/layout/Layout";
import ServiceBundleSelector from "@/components/service/ServiceBundleSelector";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ServiceBundles = () => {
  const navigate = useNavigate();

  const handleBundleSelect = (bundleId: string) => {
    // In a real app, we would store the selected bundle and navigate to a confirmation page
    console.log(`Selected bundle: ${bundleId}`);
    navigate("/request", { state: { selectedBundle: bundleId } });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Service Bundles</h1>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <ServiceBundleSelector onSelect={handleBundleSelect} />
        </div>
      </div>
    </Layout>
  );
};

export default ServiceBundles;
