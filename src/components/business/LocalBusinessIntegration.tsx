import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Pill,
  Utensils,
  Home,
  Search,
  MapPin,
  Star,
  Clock,
  Phone,
  ExternalLink,
  Tag,
  Percent,
} from "lucide-react";

interface LocalBusinessIntegrationProps {
  className?: string;
}

interface Business {
  id: string;
  name: string;
  type: "grocery" | "pharmacy" | "restaurant" | "homecare" | "other";
  image: string;
  address: string;
  distance: string;
  rating: number;
  hours: string;
  phone: string;
  website: string;
  partnerStatus: "premium" | "standard" | "none";
  discounts?: {
    description: string;
    code: string;
    expiryDate: string;
  }[];
}

const LocalBusinessIntegration = ({
  className = "",
}: LocalBusinessIntegrationProps) => {
  const [activeTab, setActiveTab] = useState("grocery");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for demonstration
  const businesses: Business[] = [
    {
      id: "business-1",
      name: "Fresh Market Grocery",
      type: "grocery",
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
      address: "123 Main Street, Anytown",
      distance: "0.8 miles",
      rating: 4.7,
      hours: "8:00 AM - 9:00 PM",
      phone: "(555) 123-4567",
      website: "https://example.com/freshmarket",
      partnerStatus: "premium",
      discounts: [
        {
          description: "10% off for seniors on Tuesdays",
          code: "SENIOR10",
          expiryDate: "Ongoing",
        },
        {
          description: "Free delivery on orders over $50",
          code: "FREEDEL50",
          expiryDate: "12/31/2023",
        },
      ],
    },
    {
      id: "business-2",
      name: "Wellness Pharmacy",
      type: "pharmacy",
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
      address: "456 Oak Avenue, Anytown",
      distance: "1.2 miles",
      rating: 4.5,
      hours: "9:00 AM - 8:00 PM",
      phone: "(555) 987-6543",
      website: "https://example.com/wellnesspharmacy",
      partnerStatus: "standard",
      discounts: [
        {
          description: "15% off on over-the-counter medications",
          code: "OTC15",
          expiryDate: "Ongoing",
        },
      ],
    },
    {
      id: "business-3",
      name: "Comfort Meals Restaurant",
      type: "restaurant",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      address: "789 Pine Road, Anytown",
      distance: "0.5 miles",
      rating: 4.8,
      hours: "11:00 AM - 10:00 PM",
      phone: "(555) 456-7890",
      website: "https://example.com/comfortmeals",
      partnerStatus: "premium",
      discounts: [
        {
          description: "Early bird special: 20% off between 3-5 PM",
          code: "EARLYBIRD",
          expiryDate: "Ongoing",
        },
      ],
    },
    {
      id: "business-4",
      name: "Home Helpers",
      type: "homecare",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
      address: "321 Maple Drive, Anytown",
      distance: "1.5 miles",
      rating: 4.6,
      hours: "8:00 AM - 6:00 PM",
      phone: "(555) 789-0123",
      website: "https://example.com/homehelpers",
      partnerStatus: "standard",
    },
    {
      id: "business-5",
      name: "Value Grocery",
      type: "grocery",
      image:
        "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&q=80",
      address: "555 Cedar Lane, Anytown",
      distance: "1.0 miles",
      rating: 4.2,
      hours: "7:00 AM - 10:00 PM",
      phone: "(555) 234-5678",
      website: "https://example.com/valuegrocery",
      partnerStatus: "none",
    },
  ];

  const getBusinessIcon = (type: Business["type"]) => {
    switch (type) {
      case "grocery":
        return <ShoppingCart className="h-5 w-5 text-green-500" />;
      case "pharmacy":
        return <Pill className="h-5 w-5 text-blue-500" />;
      case "restaurant":
        return <Utensils className="h-5 w-5 text-orange-500" />;
      case "homecare":
        return <Home className="h-5 w-5 text-purple-500" />;
      default:
        return <ShoppingCart className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPartnerBadge = (status: Business["partnerStatus"]) => {
    switch (status) {
      case "premium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Premium Partner
          </Badge>
        );
      case "standard":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Partner
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredBusinesses = businesses.filter(
    (business) =>
      (activeTab === "all" || business.type === activeTab) &&
      (searchQuery === "" ||
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.address.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Local Business Partners</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search businesses..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all" className="flex items-center">
              All
            </TabsTrigger>
            <TabsTrigger value="grocery" className="flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" /> Grocery
            </TabsTrigger>
            <TabsTrigger value="pharmacy" className="flex items-center">
              <Pill className="h-4 w-4 mr-2" /> Pharmacy
            </TabsTrigger>
            <TabsTrigger value="restaurant" className="flex items-center">
              <Utensils className="h-4 w-4 mr-2" /> Restaurant
            </TabsTrigger>
            <TabsTrigger value="homecare" className="flex items-center">
              <Home className="h-4 w-4 mr-2" /> Home Care
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBusinesses.length > 0 ? (
                filteredBusinesses.map((business) => (
                  <div
                    key={business.id}
                    className="border rounded-lg overflow-hidden flex flex-col bg-white"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={business.image}
                        alt={business.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2">
                        {getPartnerBadge(business.partnerStatus)}
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold flex items-center">
                            {getBusinessIcon(business.type)}
                            <span className="ml-2">{business.name}</span>
                          </h3>
                          <div className="flex items-center mt-1 text-gray-500">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>
                              {business.address} ({business.distance})
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{business.rating}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{business.hours}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{business.phone}</span>
                        </div>
                      </div>

                      {business.discounts && business.discounts.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium flex items-center">
                            <Percent className="h-4 w-4 mr-1 text-green-500" />
                            Special Discounts
                          </h4>
                          <div className="mt-2 space-y-2">
                            {business.discounts.map((discount, index) => (
                              <div
                                key={index}
                                className="p-2 bg-green-50 border border-green-100 rounded-md text-sm"
                              >
                                <div className="flex justify-between items-center">
                                  <span>{discount.description}</span>
                                  <Badge variant="outline" className="bg-white">
                                    {discount.code}
                                  </Badge>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Expires: {discount.expiryDate}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-auto pt-4 flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                          onClick={() =>
                            window.open(business.website, "_blank")
                          }
                        >
                          <ExternalLink className="h-4 w-4 mr-1" /> Visit
                          Website
                        </Button>
                        <Button size="sm" className="flex items-center">
                          <ShoppingCart className="h-4 w-4 mr-1" /> Order Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-gray-500 bg-white rounded-lg">
                  No businesses found matching your criteria
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LocalBusinessIntegration;
