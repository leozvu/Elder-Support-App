import React from "react";
import { useTranslation } from "react-i18next";
import SimplifiedServiceHistory from "@/components/service/SimplifiedServiceHistory";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServiceHistory = () => {
  const { t } = useTranslation();
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
          <h1 className="text-3xl font-bold">{t("Service History")}</h1>
        </div>
        <SimplifiedServiceHistory />
      </div>
    </Layout>
  );
};

export default ServiceHistory;
