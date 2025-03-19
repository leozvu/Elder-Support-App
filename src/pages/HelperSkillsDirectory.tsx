import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import HelperSkillsProfile from "@/components/helper/HelperSkillsProfile";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Search,
  Filter,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  Check,
} from "lucide-react";

interface Helper {
  id: string;
  name: string;
  avatar: string;
  title: string;
  location: string;
  distance: string;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  skills: string[];
  certifications: string[];
  isVerified: boolean;
}

const HelperSkillsDirectory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHelper, setSelectedHelper] = useState<string | null>(null);

  // Mock data for demonstration
  const helpers: Helper[] = [
    {
      id: "helper-1",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      title: "Certified Elder Care Specialist",
      location: "Anytown, CA",
      distance: "0.8 miles",
      rating: 4.8,
      reviewCount: 47,
      yearsExperience: 5,
      skills: [
        "Medication Management",
        "Mobility Assistance",
        "Meal Preparation",
        "Companionship",
      ],
      certifications: ["CPR & First Aid", "CNA", "Elder Care Specialist"],
      isVerified: true,
    },
    {
      id: "helper-2",
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      title: "Home Health Aide",
      location: "Anytown, CA",
      distance: "1.2 miles",
      rating: 4.6,
      reviewCount: 32,
      yearsExperience: 3,
      skills: [
        "Transportation",
        "Companionship",
        "Light Housekeeping",
        "Technology Assistance",
      ],
      certifications: ["First Aid", "Driver Safety"],
      isVerified: true,
    },
    {
      id: "helper-3",
      name: "David Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      title: "Nursing Assistant",
      location: "Anytown, CA",
      distance: "1.5 miles",
      rating: 4.9,
      reviewCount: 56,
      yearsExperience: 7,
      skills: [
        "Personal Care",
        "Medication Management",
        "Meal Preparation",
        "Home Maintenance",
      ],
      certifications: ["CNA", "CPR & First Aid", "Dementia Care"],
      isVerified: true,
    },
    {
      id: "helper-4",
      name: "Emily Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      title: "Companion Caregiver",
      location: "Anytown, CA",
      distance: "0.5 miles",
      rating: 4.7,
      reviewCount: 28,
      yearsExperience: 2,
      skills: [
        "Companionship",
        "Light Housekeeping",
        "Meal Preparation",
        "Errands",
      ],
      certifications: ["Companion Caregiver", "First Aid"],
      isVerified: true,
    },
  ];

  const filteredHelpers = helpers.filter(
    (helper) =>
      searchQuery === "" ||
      helper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      helper.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      helper.certifications.some((cert) =>
        cert.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

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
          <h1 className="text-3xl font-bold">Helper Skills Directory</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar with search and filters */}
          <div className="md:w-1/3 lg:w-1/4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      Search Helpers
                    </h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by name, skill, or certification..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      Filter by Skills
                    </h2>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="skill-medication"
                          className="mr-2"
                        />
                        <label htmlFor="skill-medication">
                          Medication Management
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="skill-mobility"
                          className="mr-2"
                        />
                        <label htmlFor="skill-mobility">
                          Mobility Assistance
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="skill-meal"
                          className="mr-2"
                        />
                        <label htmlFor="skill-meal">Meal Preparation</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="skill-companionship"
                          className="mr-2"
                        />
                        <label htmlFor="skill-companionship">
                          Companionship
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="skill-transportation"
                          className="mr-2"
                        />
                        <label htmlFor="skill-transportation">
                          Transportation
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="skill-housekeeping"
                          className="mr-2"
                        />
                        <label htmlFor="skill-housekeeping">Housekeeping</label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      Filter by Certifications
                    </h2>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="cert-cpr" className="mr-2" />
                        <label htmlFor="cert-cpr">CPR & First Aid</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="cert-cna" className="mr-2" />
                        <label htmlFor="cert-cna">CNA</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="cert-elder"
                          className="mr-2"
                        />
                        <label htmlFor="cert-elder">
                          Elder Care Specialist
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="cert-dementia"
                          className="mr-2"
                        />
                        <label htmlFor="cert-dementia">Dementia Care</label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      Experience Level
                    </h2>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="experience"
                          id="exp-any"
                          className="mr-2"
                        />
                        <label htmlFor="exp-any">Any Experience</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="experience"
                          id="exp-1plus"
                          className="mr-2"
                        />
                        <label htmlFor="exp-1plus">1+ Years</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="experience"
                          id="exp-3plus"
                          className="mr-2"
                        />
                        <label htmlFor="exp-3plus">3+ Years</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="experience"
                          id="exp-5plus"
                          className="mr-2"
                        />
                        <label htmlFor="exp-5plus">5+ Years</label>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Filter className="h-4 w-4 mr-2" /> Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="md:w-2/3 lg:w-3/4">
            {selectedHelper ? (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedHelper(null)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Results
                </Button>
                <HelperSkillsProfile helperId={selectedHelper} />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {filteredHelpers.length} Helpers Available
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <select className="border rounded p-1 text-sm">
                      <option>Highest Rated</option>
                      <option>Closest Distance</option>
                      <option>Most Experience</option>
                    </select>
                  </div>
                </div>

                {filteredHelpers.map((helper) => (
                  <Card
                    key={helper.id}
                    className="cursor-pointer hover:border-primary transition-colors bg-white"
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={helper.avatar} alt={helper.name} />
                          <AvatarFallback>
                            {helper.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">
                              {helper.name}
                            </h3>
                            {helper.isVerified && (
                              <Badge className="bg-green-100 text-green-800">
                                <Check className="h-3 w-3 mr-1" /> Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600">{helper.title}</p>

                          <div className="flex items-center mt-1">
                            <div className="flex mr-2">
                              {renderStars(helper.rating)}
                            </div>
                            <span className="font-medium">{helper.rating}</span>
                            <span className="text-gray-500 ml-1">
                              ({helper.reviewCount} reviews)
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-2">
                            <div className="flex items-center text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>
                                {helper.location} ({helper.distance})
                              </span>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <Briefcase className="h-4 w-4 mr-1" />
                              <span>
                                {helper.yearsExperience} years experience
                              </span>
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="flex flex-wrap gap-2">
                              {helper.skills.slice(0, 4).map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="bg-blue-50"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {helper.skills.length > 4 && (
                                <Badge variant="outline">
                                  +{helper.skills.length - 4} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="mt-2">
                            <div className="flex flex-wrap gap-2">
                              {helper.certifications.map((cert, index) => (
                                <div
                                  key={index}
                                  className="flex items-center text-sm text-gray-600"
                                >
                                  <GraduationCap className="h-3 w-3 mr-1" />
                                  <span>{cert}</span>
                                  {index < helper.certifications.length - 1 && (
                                    <span className="mx-1">•</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-4 md:mt-0">
                          <Button onClick={() => setSelectedHelper(helper.id)}>
                            View Profile
                          </Button>
                          <Button variant="outline">Request Service</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredHelpers.length === 0 && (
                  <Card className="bg-white">
                    <CardContent className="py-12 text-center">
                      <p className="text-gray-500">
                        No helpers found matching your criteria
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelperSkillsDirectory;
