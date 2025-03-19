import React from "react";
import Layout from "@/components/layout/Layout";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  Shield,
  Award,
  Mail,
} from "lucide-react";

const HelperProfile = () => {
  // This would typically come from an API or context
  const helper = {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    rating: 4.8,
    specialties: ["Shopping", "Medical Appointments", "Companionship"],
    experience: "5 years",
    distance: "0.8 miles",
    availability: "Available now",
    bio: "Certified caregiver with experience in elderly assistance. I'm patient, compassionate, and reliable.",
    phone: "(555) 123-4567",
    email: "sarah.johnson@example.com",
    certifications: [
      "Certified Nursing Assistant",
      "First Aid & CPR",
      "Elder Care Specialist",
    ],
    languages: ["English", "Spanish"],
    reviews: [
      {
        id: "r1",
        userName: "Robert Smith",
        rating: 5,
        date: "2023-05-15",
        comment:
          "Sarah was wonderful! She helped me with my grocery shopping and was very patient.",
      },
      {
        id: "r2",
        userName: "Mary Johnson",
        rating: 4,
        date: "2023-04-22",
        comment:
          "Very professional and caring. Would recommend for medical appointments.",
      },
    ],
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-8">
          <CardHeader className="pb-0">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-32 w-32 border-2 border-primary">
                <img
                  src={helper.avatar}
                  alt={helper.name}
                  className="object-cover"
                />
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{helper.name}</h1>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
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

                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-medium">{helper.rating}</span>
                  </div>

                  <Badge variant="secondary" className="text-base">
                    <Clock className="h-4 w-4 mr-1" />
                    {helper.experience}
                  </Badge>

                  <Badge variant="secondary" className="text-base">
                    <MapPin className="h-4 w-4 mr-1" />
                    {helper.distance}
                  </Badge>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <Button className="gap-2">
                    <Phone className="h-5 w-5" />
                    Call
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Message
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-5 w-5" />
                    Schedule
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">About</h2>
                <p className="text-lg text-gray-700 mb-6">{helper.bio}</p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium mb-2">
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-gray-500" />
                        <span className="text-lg">{helper.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-gray-500" />
                        <span className="text-lg">{helper.email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {helper.languages.map((language, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-base py-1 px-3"
                        >
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Certifications & Verification
                </h2>
                <div className="mb-6 space-y-3">
                  {helper.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span className="text-lg">{cert}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-6 w-6 text-green-600" />
                    <h3 className="text-xl font-medium text-green-800">
                      Verified Helper
                    </h3>
                  </div>
                  <p className="text-green-700">
                    Sarah has completed our background check and verification
                    process.
                  </p>
                </div>

                <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-lg font-medium">
                  {helper.availability}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">Reviews & Ratings</h2>
              <div className="space-y-4">
                {helper.reviews.map((review) => (
                  <div key={review.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-medium">
                          {review.userName}
                        </h3>
                        <p className="text-gray-500">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default HelperProfile;
