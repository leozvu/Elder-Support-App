import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  GraduationCap,
  Heart,
  Award,
  Star,
  ThumbsUp,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  Check,
  Plus,
} from "lucide-react";

interface HelperSkillsProfileProps {
  helperId: string;
  className?: string;
}

interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
  verified: boolean;
  endorsements: number;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  verified: boolean;
  documentUrl?: string;
}

interface Experience {
  id: string;
  title: string;
  organization: string;
  startDate: string;
  endDate?: string;
  description: string;
}

interface Review {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  date: string;
  comment: string;
}

const HelperSkillsProfile = ({
  helperId,
  className = "",
}: HelperSkillsProfileProps) => {
  const [activeTab, setActiveTab] = useState("skills");

  // Mock data for demonstration
  const helperData = {
    id: helperId,
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    title: "Certified Elder Care Specialist",
    location: "Anytown, CA",
    phone: "(555) 123-4567",
    email: "sarah.johnson@example.com",
    bio: "Dedicated caregiver with over 5 years of experience working with seniors. Specialized in companionship, medication management, and mobility assistance.",
    overallRating: 4.8,
    reviewCount: 47,
    completedServices: 156,
    yearsExperience: 5,
  };

  const skills: Skill[] = [
    {
      id: "skill-1",
      name: "Medication Management",
      level: 5,
      verified: true,
      endorsements: 32,
    },
    {
      id: "skill-2",
      name: "Mobility Assistance",
      level: 4,
      verified: true,
      endorsements: 28,
    },
    {
      id: "skill-3",
      name: "Meal Preparation",
      level: 5,
      verified: true,
      endorsements: 41,
    },
    {
      id: "skill-4",
      name: "Companionship",
      level: 5,
      verified: true,
      endorsements: 45,
    },
    {
      id: "skill-5",
      name: "Transportation",
      level: 4,
      verified: true,
      endorsements: 22,
    },
    {
      id: "skill-6",
      name: "Light Housekeeping",
      level: 3,
      verified: false,
      endorsements: 15,
    },
    {
      id: "skill-7",
      name: "Dementia Care",
      level: 4,
      verified: true,
      endorsements: 19,
    },
  ];

  const certifications: Certification[] = [
    {
      id: "cert-1",
      name: "CPR & First Aid",
      issuer: "American Red Cross",
      date: "2022-05-15",
      expiryDate: "2024-05-15",
      verified: true,
      documentUrl: "#",
    },
    {
      id: "cert-2",
      name: "Certified Nursing Assistant (CNA)",
      issuer: "State Board of Nursing",
      date: "2019-03-10",
      expiryDate: "2025-03-10",
      verified: true,
      documentUrl: "#",
    },
    {
      id: "cert-3",
      name: "Elder Care Specialist",
      issuer: "Senior Care Institute",
      date: "2020-11-22",
      verified: true,
      documentUrl: "#",
    },
    {
      id: "cert-4",
      name: "Medication Management Training",
      issuer: "Healthcare Education Services",
      date: "2021-07-05",
      verified: true,
      documentUrl: "#",
    },
  ];

  const experience: Experience[] = [
    {
      id: "exp-1",
      title: "Home Health Aide",
      organization: "Sunshine Senior Services",
      startDate: "2020-06-01",
      description:
        "Provided in-home care for elderly clients including medication reminders, meal preparation, light housekeeping, and companionship.",
    },
    {
      id: "exp-2",
      title: "Caregiver",
      organization: "Golden Years Assisted Living",
      startDate: "2018-03-15",
      endDate: "2020-05-30",
      description:
        "Assisted residents with activities of daily living, medication management, and mobility. Organized social activities and provided emotional support.",
    },
    {
      id: "exp-3",
      title: "Nursing Assistant",
      organization: "City General Hospital",
      startDate: "2017-01-10",
      endDate: "2018-02-28",
      description:
        "Worked in the geriatric ward assisting nurses with patient care, monitoring vital signs, and helping with mobility and personal hygiene.",
    },
  ];

  const reviews: Review[] = [
    {
      id: "review-1",
      customerName: "Martha Wilson",
      customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha",
      rating: 5,
      date: "2023-06-15",
      comment:
        "Sarah is exceptional! She took wonderful care of my mother, always patient and attentive to her needs. Her medication management skills are excellent.",
    },
    {
      id: "review-2",
      customerName: "Robert Thompson",
      customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      rating: 5,
      date: "2023-05-22",
      comment:
        "We hired Sarah for companionship services for my father, and she has been a blessing. She engages him in meaningful conversations and activities that brighten his day.",
    },
    {
      id: "review-3",
      customerName: "Eleanor Davis",
      customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eleanor",
      rating: 4,
      date: "2023-04-10",
      comment:
        "Sarah is reliable and professional. She helped me with transportation to medical appointments and was always punctual. Would recommend her services.",
    },
  ];

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
        />
      ));
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Helper Skills & Certifications</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Helper Profile Summary */}
        <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={helperData.avatar} alt={helperData.name} />
            <AvatarFallback>{helperData.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-2xl font-bold">{helperData.name}</h2>
            <p className="text-gray-600">{helperData.title}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-2">
              <div className="flex items-center text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{helperData.location}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Phone className="h-4 w-4 mr-1" />
                <span>{helperData.phone}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Mail className="h-4 w-4 mr-1" />
                <span>{helperData.email}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Briefcase className="h-4 w-4 mr-1" />
                <span>{helperData.yearsExperience} years experience</span>
              </div>
            </div>

            <div className="flex items-center mt-3">
              <div className="flex mr-2">
                {renderStars(helperData.overallRating)}
              </div>
              <span className="font-bold">{helperData.overallRating}</span>
              <span className="text-gray-500 ml-1">
                ({helperData.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 mt-4 md:mt-0">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {helperData.completedServices}
              </div>
              <div className="text-sm text-gray-500">Services Completed</div>
            </div>
            <Button className="w-full md:w-auto">Request Service</Button>
          </div>
        </div>

        <div className="border-t pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="skills">
                <Award className="h-4 w-4 mr-2" /> Skills
              </TabsTrigger>
              <TabsTrigger value="certifications">
                <GraduationCap className="h-4 w-4 mr-2" /> Certifications
              </TabsTrigger>
              <TabsTrigger value="experience">
                <Briefcase className="h-4 w-4 mr-2" /> Experience
              </TabsTrigger>
              <TabsTrigger value="reviews">
                <Star className="h-4 w-4 mr-2" /> Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="skills" className="mt-6">
              <div className="space-y-6">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="border rounded-lg p-4 bg-white"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <h3 className="font-medium">{skill.name}</h3>
                        {skill.verified && (
                          <Badge className="ml-2 bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" /> Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1 text-blue-500" />
                        <span className="text-sm">
                          {skill.endorsements} endorsements
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={skill.level * 20} className="h-2" />
                      <span className="text-sm font-medium">
                        {skill.level}/5
                      </span>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" /> View All Skills
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="certifications" className="mt-6">
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{cert.name}</h3>
                        <p className="text-sm text-gray-600">{cert.issuer}</p>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Issued: {formatDate(cert.date)}</span>
                          {cert.expiryDate && (
                            <>
                              <span className="mx-1">•</span>
                              <span>
                                Expires: {formatDate(cert.expiryDate)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {cert.verified && (
                          <Badge className="bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" /> Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    {cert.documentUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => window.open(cert.documentUrl, "_blank")}
                      >
                        <FileText className="h-4 w-4 mr-1" /> View Certificate
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="experience" className="mt-6">
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="border rounded-lg p-4 bg-white">
                    <h3 className="font-medium">{exp.title}</h3>
                    <p className="text-sm text-gray-600">{exp.organization}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {formatDate(exp.startDate)} -{" "}
                        {exp.endDate ? formatDate(exp.endDate) : "Present"}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border rounded-lg p-4 bg-white"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={review.customerAvatar}
                          alt={review.customerName}
                        />
                        <AvatarFallback>
                          {review.customerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{review.customerName}</h3>
                          <div className="text-sm text-gray-500">
                            {review.date}
                          </div>
                        </div>
                        <div className="flex mt-1">
                          {renderStars(review.rating)}
                        </div>
                        <p className="mt-2 text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  <Star className="h-4 w-4 mr-2" /> View All Reviews
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default HelperSkillsProfile;
