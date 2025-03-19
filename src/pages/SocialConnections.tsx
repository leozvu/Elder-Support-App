import React from "react";
import Layout from "@/components/layout/Layout";
import SocialConnectionHub from "@/components/social/SocialConnectionHub";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Users, Plus } from "lucide-react";

const SocialConnections = () => {
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
          <h1 className="text-3xl font-bold">Social Connections</h1>
        </div>

        <p className="text-gray-600 mb-6">
          Connect with other seniors in your community, join social events, and
          build meaningful relationships.
        </p>

        <div className="flex flex-wrap gap-4 mb-6">
          <Button className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" /> Create Event
          </Button>
          <Button variant="outline" className="flex items-center">
            <Users className="h-4 w-4 mr-2" /> My Connections
          </Button>
          <Button variant="outline" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" /> My Events
          </Button>
        </div>

        <SocialConnectionHub />
      </div>
    </Layout>
  );
};

export default SocialConnections;
