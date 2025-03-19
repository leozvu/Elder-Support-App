import React from "react";
import Layout from "@/components/layout/Layout";
import LocalBusinessIntegration from "@/components/business/LocalBusinessIntegration";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const LocalBusinessDirectory = () => {
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-bold">Local Business Directory</h1>
        </div>

        <p className="text-gray-600 mb-6">
          Browse our partner businesses that offer special discounts and
          services for seniors. You can request services directly through our
          platform or contact them directly.
        </p>

        <LocalBusinessIntegration />
      </div>
    </Layout>
  );
};

export default LocalBusinessDirectory;
