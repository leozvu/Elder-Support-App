import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Calendar,
  Clock,
  MapPin,
  Check,
  Camera,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ServiceReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ rating?: string; review?: string }>(
    {},
  );

  // Detailed ratings
  const [punctualityRating, setPunctualityRating] = useState(0);
  const [communicationRating, setCommunicationRating] = useState(0);
  const [serviceQualityRating, setServiceQualityRating] = useState(0);
  const [improvementSuggestions, setImprovementSuggestions] = useState("");

  // In a real app, this would fetch the service details from an API
  const serviceDetails = {
    id: id || "REQ-12345",
    type: "Shopping Assistance",
    date: "May 20, 2023",
    time: "2:00 PM - 3:30 PM",
    location: "123 Main Street, Apt 4B",
    helper: {
      id: "helper-123",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
  };

  const validateForm = () => {
    const newErrors: { rating?: string; review?: string } = {};
    let isValid = true;

    if (rating === 0) {
      newErrors.rating = "Please select an overall rating";
      isValid = false;
    }

    if (review.trim().length < 10) {
      newErrors.review = "Please provide a review with at least 10 characters";
      isValid = false;
    }

    // We don't require the detailed ratings to be filled, but we'll use them if they are

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, this would submit the review to an API
      console.log({
        serviceId: id,
        overallRating: rating,
        review,
        photoUrl,
        punctualityRating,
        communicationRating,
        serviceQualityRating,
        improvementSuggestions,
      });

      // Example of how we would submit to Supabase
      // const { data, error } = await supabase
      //   .from('service_feedback')
      //   .insert({
      //     service_id: id,
      //     user_id: currentUser.id,
      //     helper_id: serviceDetails.helper.id,
      //     overall_rating: rating,
      //     punctuality_rating: punctualityRating || rating,
      //     communication_rating: communicationRating || rating,
      //     service_quality_rating: serviceQualityRating || rating,
      //     feedback_text: review,
      //     improvement_suggestions: improvementSuggestions
      //   });

      setIsSubmitting(false);
      setShowConfirmation(true);
    }, 1000);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    // Navigate back to the dashboard
    navigate("/");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      // For demo purposes, we'll just create a local URL
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Rate Your Experience</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {serviceDetails.type}
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span>{serviceDetails.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span>{serviceDetails.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span>{serviceDetails.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-lg font-medium mb-2">Your Helper</h3>
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={serviceDetails.helper.avatar}
                      alt={serviceDetails.helper.name}
                    />
                    <AvatarFallback>
                      {serviceDetails.helper.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-medium">
                      {serviceDetails.helper.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">
                  Rate your overall experience
                </h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="focus:outline-none"
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        className={`h-10 w-10 ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                      />
                    </button>
                  ))}
                </div>
                {errors.rating && (
                  <div className="flex items-center gap-2 text-red-500 mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{errors.rating}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4 bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-medium">Detailed Feedback</h3>
                <p className="text-sm text-muted-foreground">
                  Your detailed feedback helps us improve our service and match
                  you with better helpers in the future.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Punctuality</h4>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setPunctualityRating(star)}
                          className="focus:outline-none"
                          aria-label={`Rate punctuality ${star} stars`}
                        >
                          <Star
                            className={`h-6 w-6 ${star <= punctualityRating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Communication</h4>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setCommunicationRating(star)}
                          className="focus:outline-none"
                          aria-label={`Rate communication ${star} stars`}
                        >
                          <Star
                            className={`h-6 w-6 ${star <= communicationRating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Service Quality
                    </h4>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setServiceQualityRating(star)}
                          className="focus:outline-none"
                          aria-label={`Rate service quality ${star} stars`}
                        >
                          <Star
                            className={`h-6 w-6 ${star <= serviceQualityRating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Suggestions for Improvement
                    </h4>
                    <Textarea
                      placeholder="How could we improve our service? Any suggestions for the helper?"
                      className="min-h-[80px]"
                      value={improvementSuggestions}
                      onChange={(e) =>
                        setImprovementSuggestions(e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">
                  Share your experience
                </h3>
                <Textarea
                  placeholder="Tell us about your experience with this service..."
                  className="min-h-[150px]"
                  value={review}
                  onChange={handleReviewChange}
                />
                {errors.review && (
                  <div className="flex items-center gap-2 text-red-500 mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{errors.review}</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">
                  Add a photo (optional)
                </h3>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() =>
                      document.getElementById("photo-upload")?.click()
                    }
                  >
                    <Camera className="h-5 w-5" />
                    <span>Upload Photo</span>
                  </Button>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  {photoUrl && (
                    <div className="relative">
                      <img
                        src={photoUrl}
                        alt="Uploaded"
                        className="h-20 w-20 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={() => setPhotoUrl(null)}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full md:w-auto text-lg py-6 px-8 h-auto"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
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
                    </span>
                  ) : (
                    <>
                      <Check className="mr-2 h-5 w-5" /> Submit Review
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Thank you for your feedback!</AlertDialogTitle>
            <AlertDialogDescription>
              Your review has been submitted successfully. Your feedback helps
              us improve our services.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleConfirmationClose}>
              Return to Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default ServiceReview;
