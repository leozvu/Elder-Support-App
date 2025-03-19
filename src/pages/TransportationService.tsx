import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import TransportationRequestForm, {
  TransportationRequestData,
} from "@/components/service/TransportationRequestForm";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const TransportationService = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: TransportationRequestData) => {
    try {
      setIsSubmitting(true);
      console.log("Transportation request submitted:", data);

      // Get current user
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) throw userError;

      if (!userData.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to submit a request",
          variant: "destructive",
        });
        return;
      }

      // Create service request in database
      const { data: requestData, error: requestError } = await supabase
        .from("service_requests")
        .insert({
          customer_id: userData.user.id,
          service_type: "transportation",
          status: "pending",
          location: data.pickupAddress,
          destination: data.destinationAddress,
          scheduled_time: new Date(
            `${data.pickupDate.toISOString().split("T")[0]}T${data.pickupTime}`,
          ).toISOString(),
          return_ride_needed: data.returnRide,
          return_time:
            data.returnRide && data.returnTime
              ? new Date(
                  `${data.pickupDate.toISOString().split("T")[0]}T${data.returnTime}`,
                ).toISOString()
              : null,
          special_needs: data.specialNeeds,
          transportation_type: data.transportationType,
          additional_notes: data.additionalNotes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (requestError) throw requestError;

      toast({
        title: "Request Submitted Successfully",
        description:
          "Your transportation request has been submitted. We're looking for available helpers.",
      });

      // Navigate to tracking page
      navigate(`/service-tracking/${requestData.id}`);
    } catch (error: any) {
      console.error("Error submitting transportation request:", error);
      toast({
        title: "Error Submitting Request",
        description:
          error.message ||
          "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Transportation Service</h1>
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
          <TransportationRequestForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </Layout>
  );
};

export default TransportationService;
