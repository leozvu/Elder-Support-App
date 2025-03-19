import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import ServiceTypeSelector from "./ServiceTypeSelector";
import ServiceDetailsForm from "./ServiceDetailsForm";
import HelperMatchDisplay from "./HelperMatchDisplay";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import TransportationRequestForm, {
  TransportationRequestData,
} from "./TransportationRequestForm";
import HomeMaintenanceRequestForm from "./HomeMaintenanceRequestForm";
import TechnologyAssistanceRequestForm from "./TechnologyAssistanceRequestForm";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface ServiceRequestFlowProps {
  onComplete?: (data: ServiceRequestData) => void;
  initialStep?: string;
  initialData?: Partial<ServiceRequestData>;
  enableRecurring?: boolean;
  enablePreferredHelper?: boolean;
}

interface ServiceRequestData {
  serviceType: string;
  serviceDetails: {
    serviceTitle: string;
    serviceDate: Date;
    serviceTime: string;
    serviceLocation: string;
    serviceDetails: string;
  };
  selectedHelper?: {
    id: string;
    name: string;
  };
  agreement?: {
    customerAgreed: boolean;
    helperAgreed: boolean;
    agreedAt?: Date;
    termsAccepted: boolean;
  };
}

const ServiceRequestFlow = ({
  onComplete = () => {},
  initialStep = "service-type",
  initialData = {
    serviceType: "",
    serviceDetails: {
      serviceTitle: "",
      serviceDate: new Date(),
      serviceTime: "10:00",
      serviceLocation: "",
      serviceDetails: "",
    },
  },
  enableRecurring = true,
  enablePreferredHelper = true,
}: ServiceRequestFlowProps) => {
  const [currentStep, setCurrentStep] = useState<string>(initialStep);
  const [requestData, setRequestData] = useState<ServiceRequestData>(
    initialData as ServiceRequestData,
  );
  const [isSearchingHelpers, setIsSearchingHelpers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const steps = [
    { id: "service-type", label: "Service Type" },
    { id: "service-details", label: "Service Details" },
    { id: "helper-match", label: "Select Helper" },
    { id: "agreement", label: "Service Agreement" },
    { id: "confirmation", label: "Confirmation" },
  ];

  const handleServiceTypeSelect = (serviceType: string) => {
    setRequestData((prev) => ({ ...prev, serviceType }));
    setCurrentStep("service-details");
  };

  const handleServiceDetailsSubmit = (details: any) => {
    setRequestData((prev) => ({ ...prev, serviceDetails: details }));
    setCurrentStep("helper-match");
    // Simulate searching for helpers
    setIsSearchingHelpers(true);
    setTimeout(() => setIsSearchingHelpers(false), 2000);
  };

  const handleHelperSelect = (helper: any) => {
    setRequestData((prev) => ({
      ...prev,
      selectedHelper: { id: helper.id, name: helper.name },
    }));
    setCurrentStep("agreement");
  };

  const handleAgreementComplete = () => {
    setRequestData((prev) => ({
      ...prev,
      agreement: {
        customerAgreed: true,
        helperAgreed: false, // Helper will agree separately
        agreedAt: new Date(),
        termsAccepted: termsAccepted,
      },
    }));
    setCurrentStep("confirmation");
  };

  const handleConfirmation = async () => {
    try {
      setIsSubmitting(true);

      // In a real implementation, you would save the service request to the database
      // and send a notification to the helper to confirm the service

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the service request with the agreement details
      const finalRequestData = {
        ...requestData,
        agreement: {
          ...requestData.agreement,
          customerAgreed: true,
          agreedAt: new Date(),
        },
      };

      // Send notification to helper
      toast({
        title: "Service request submitted",
        description: "The helper will be notified to confirm the service.",
      });

      onComplete(finalRequestData);

      // Navigate to tracking page
      navigate(`/tracking/new-request-id`, {
        state: { serviceRequest: finalRequestData },
      });
    } catch (error) {
      console.error("Error submitting service request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit service request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToNextStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleTransportationSubmit = async (
    data: TransportationRequestData,
  ) => {
    try {
      setIsSubmitting(true);

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

      // Format the date properly to avoid timezone issues
      const formattedPickupDate = data.pickupDate.toISOString().split("T")[0];
      const scheduledTime = new Date(
        `${formattedPickupDate}T${data.pickupTime}:00`,
      );

      let returnTime = null;
      if (data.returnRide && data.returnTime) {
        returnTime = new Date(`${formattedPickupDate}T${data.returnTime}:00`);
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
          scheduled_time: scheduledTime.toISOString(),
          return_ride_needed: data.returnRide,
          return_time: returnTime ? returnTime.toISOString() : null,
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
      navigate(`/tracking/${requestData.id}`);
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

  const renderServiceDetailsForm = () => {
    switch (requestData.serviceType) {
      case "transport":
        return (
          <TransportationRequestForm
            onSubmit={handleTransportationSubmit}
            onBack={goToPreviousStep}
            isSubmitting={isSubmitting}
          />
        );
      case "housekeeping":
        return (
          <HomeMaintenanceRequestForm
            onSubmit={handleServiceDetailsSubmit}
            onBack={goToPreviousStep}
          />
        );
      case "education":
        return (
          <TechnologyAssistanceRequestForm
            onSubmit={handleServiceDetailsSubmit}
            onBack={goToPreviousStep}
          />
        );
      default:
        return (
          <ServiceDetailsForm
            serviceType={requestData.serviceType}
            onSubmit={handleServiceDetailsSubmit}
            onBack={goToPreviousStep}
          />
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-gray-50 rounded-xl shadow-md p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <Tabs value={currentStep} className="w-full">
          <TabsList className="w-full h-auto p-1 bg-gray-100">
            {steps.map((step, index) => (
              <TabsTrigger
                key={step.id}
                value={step.id}
                className={`flex-1 py-4 text-lg font-medium ${currentStep === step.id ? "bg-white shadow-sm" : ""}`}
                disabled
              >
                <div className="flex items-center justify-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${index < steps.findIndex((s) => s.id === currentStep) ? "bg-green-500 text-white" : "bg-gray-200"}`}
                  >
                    {index < steps.findIndex((s) => s.id === currentStep) ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className="hidden md:inline">{step.label}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="service-type" className="mt-6">
            <ServiceTypeSelector
              selectedService={requestData.serviceType}
              onSelectService={handleServiceTypeSelect}
            />
          </TabsContent>

          <TabsContent value="service-details" className="mt-6">
            {renderServiceDetailsForm()}
          </TabsContent>

          <TabsContent value="helper-match" className="mt-6">
            <HelperMatchDisplay
              isLoading={isSearchingHelpers}
              onAcceptMatch={handleHelperSelect}
              onBack={goToPreviousStep}
              helper={
                isSearchingHelpers
                  ? undefined
                  : {
                      id: "helper-123",
                      name: "Sarah Johnson",
                      photo:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
                      rating: 4.8,
                      reviews: 42,
                      distance: "1.2 miles",
                      estimatedArrival: "15 minutes",
                      services: [
                        "Shopping",
                        "Medical Appointments",
                        "Companionship",
                      ],
                      bio: "I've been helping seniors in our community for over 5 years. I'm patient, reliable, and enjoy making a difference in people's lives.",
                    }
              }
            />
          </TabsContent>

          <TabsContent value="agreement" className="mt-6">
            <Card className="p-8 bg-white">
              <h2 className="text-3xl font-bold text-center text-primary mb-8">
                Service Agreement
              </h2>

              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">
                    Service Details
                  </h3>
                  <p className="text-blue-700">
                    Please review the service details below and confirm your
                    agreement. Both you and the helper must agree to these terms
                    before the service can begin.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-700">
                        Service Type
                      </h4>
                      <p className="text-lg">{requestData.serviceType}</p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-700">
                        Service Title
                      </h4>
                      <p className="text-lg">
                        {requestData.serviceDetails.serviceTitle}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-700">Date & Time</h4>
                      <p className="text-lg">
                        {requestData.serviceDetails.serviceDate.toLocaleDateString()}{" "}
                        at {requestData.serviceDetails.serviceTime}
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-700">Location</h4>
                      <p className="text-lg">
                        {requestData.serviceDetails.serviceLocation}
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-700">
                      Selected Helper
                    </h4>
                    <p className="text-lg">
                      {requestData.selectedHelper?.name || "No helper selected"}
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-700">
                      Additional Details
                    </h4>
                    <p className="text-lg">
                      {requestData.serviceDetails.serviceDetails}
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="text-xl font-semibold text-amber-800 mb-2">
                    Service Agreement Terms
                  </h3>
                  <div className="space-y-2 text-amber-700">
                    <p>
                      By confirming this service request, you agree to the
                      following terms:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        The helper will arrive at the specified location at the
                        agreed time.
                      </li>
                      <li>
                        You will be present at the specified location at the
                        agreed time.
                      </li>
                      <li>
                        The helper will perform only the services described in
                        the service details.
                      </li>
                      <li>
                        Any changes to the service must be agreed upon by both
                        parties.
                      </li>
                      <li>
                        Payment will be processed according to the platform's
                        payment terms.
                      </li>
                      <li>
                        Cancellation policy: Cancellations made less than 24
                        hours before the service may incur a fee.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) =>
                      setTermsAccepted(checked === true)
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the service terms and conditions
                    </label>
                    <p className="text-sm text-muted-foreground">
                      You must agree to the terms to proceed with the service
                      request.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-4 mt-10">
                <Button
                  variant="outline"
                  onClick={goToPreviousStep}
                  size="lg"
                  className="text-lg px-8"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>

                <Button
                  onClick={handleAgreementComplete}
                  size="lg"
                  className="text-lg px-8 bg-blue-600 hover:bg-blue-700"
                  disabled={!termsAccepted}
                >
                  I Agree to These Terms <Check className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="confirmation" className="mt-6">
            <Card className="p-8 bg-white">
              <h2 className="text-3xl font-bold text-center text-primary mb-8">
                Request Confirmation
              </h2>

              <div className="space-y-6 text-lg">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                  <div className="flex items-center">
                    <Check className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="text-xl font-semibold text-green-800">
                      Service Agreement Completed
                    </h3>
                  </div>
                  <p className="text-green-700 mt-2">
                    You have agreed to the service terms. The helper will be
                    notified and must also confirm the agreement before the
                    service begins.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Service Type</h3>
                    <p className="bg-gray-100 p-4 rounded-lg">
                      {requestData.serviceType}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Service Title
                    </h3>
                    <p className="bg-gray-100 p-4 rounded-lg">
                      {requestData.serviceDetails.serviceTitle}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Date & Time</h3>
                    <p className="bg-gray-100 p-4 rounded-lg">
                      {requestData.serviceDetails.serviceDate.toLocaleDateString()}{" "}
                      at {requestData.serviceDetails.serviceTime}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">Location</h3>
                    <p className="bg-gray-100 p-4 rounded-lg">
                      {requestData.serviceDetails.serviceLocation}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Additional Details
                  </h3>
                  <p className="bg-gray-100 p-4 rounded-lg">
                    {requestData.serviceDetails.serviceDetails}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Selected Helper
                  </h3>
                  <p className="bg-gray-100 p-4 rounded-lg">
                    {requestData.selectedHelper?.name || "No helper selected"}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">
                    Next Steps
                  </h3>
                  <p className="text-blue-700">
                    After submitting this request, you will be able to track the
                    service status. The helper will be notified and must confirm
                    the service details. You will receive a notification once
                    the helper confirms.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-4 mt-10">
                <Button
                  variant="outline"
                  onClick={goToPreviousStep}
                  size="lg"
                  className="text-lg px-8"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>

                <Button
                  onClick={handleConfirmation}
                  size="lg"
                  className="text-lg px-8 bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Request <Check className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ServiceRequestFlow;
