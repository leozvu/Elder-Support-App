import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, Phone } from "lucide-react";

interface HelperProfile {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  specialties: string[];
  experience: string;
  distance: string;
  availability: string;
  bio: string;
  phone: string;
}

interface HelperMatchDisplayProps {
  helpers?: HelperProfile[];
  onViewProfile?: (helper: HelperProfile) => void;
  onAcceptMatch?: (helper: HelperProfile) => void;
  isLoading?: boolean;
}

export default function HelperMatchDisplay({
  helpers = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      rating: 4.8,
      specialties: [
        "Shopping Assistance",
        "Medical Appointments",
        "Companionship",
      ],
      experience: "5 years",
      distance: "0.8 miles",
      availability: "Available now",
      bio: "Certified caregiver with experience in elderly assistance. I'm patient, compassionate, and reliable.",
      phone: "(555) 123-4567",
    },
    {
      id: "2",
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      rating: 4.9,
      specialties: ["Medical Appointments", "Transportation", "Home Care"],
      experience: "3 years",
      distance: "1.2 miles",
      availability: "Available in 30 min",
      bio: "Former nurse with specialized training in elderly care. I provide professional and friendly assistance.",
      phone: "(555) 987-6543",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      rating: 4.7,
      specialties: ["Companionship", "Light Housekeeping", "Meal Preparation"],
      experience: "4 years",
      distance: "1.5 miles",
      availability: "Available tomorrow",
      bio: "I specialize in providing companionship and creating a positive environment for seniors.",
      phone: "(555) 456-7890",
    },
  ],
  onViewProfile = () => {},
  onAcceptMatch = () => {},
  isLoading = false,
}: HelperMatchDisplayProps) {
  // Render loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 bg-white rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-2xl font-medium text-gray-700">
            Finding the perfect helper for you...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        Available Helpers
      </h2>

      {helpers.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-2xl text-gray-600">
            No helpers available at the moment.
          </p>
          <p className="text-xl text-gray-500 mt-2">
            Please try again later or adjust your request.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {helpers.map((helper) => (
            <Card
              key={helper.id}
              className="overflow-hidden border-2 hover:border-primary transition-all duration-200"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20 border-2 border-primary">
                    <img
                      src={helper.avatar}
                      alt={helper.name}
                      className="object-cover"
                    />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-bold">{helper.name}</h3>
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg font-medium">
                          {helper.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {helper.specialties.map((specialty, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-base py-1 px-3"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-lg">
                      {helper.experience} experience
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="text-lg">{helper.distance} away</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="text-lg">{helper.phone}</span>
                  </div>
                </div>

                <p className="text-lg text-gray-700 mt-2">{helper.bio}</p>

                <div className="mt-4 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-lg font-medium">
                  {helper.availability}
                </div>
              </CardContent>

              <CardFooter className="flex gap-4 pt-2">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 text-lg"
                  onClick={() => onViewProfile(helper)}
                >
                  View Full Profile
                </Button>
                <Button
                  size="lg"
                  className="flex-1 text-lg"
                  onClick={() => onAcceptMatch(helper)}
                >
                  Accept Helper
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
