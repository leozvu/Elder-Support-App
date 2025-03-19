import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Home,
  Clock,
  Heart,
  Calendar,
  Briefcase,
  Package,
} from "lucide-react";

interface ServiceBundle {
  id: string;
  title: string;
  description: string;
  services: string[];
  price: number;
  discount: number;
  icon: React.ReactNode;
  popular?: boolean;
}

interface ServiceBundleSelectorProps {
  onSelect: (bundleId: string) => void;
}

const ServiceBundleSelector = ({ onSelect }: ServiceBundleSelectorProps) => {
  const serviceBundles: ServiceBundle[] = [
    {
      id: "essential-care",
      title: "Essential Care",
      description: "Basic assistance for everyday needs",
      services: [
        "Weekly grocery shopping",
        "Light housekeeping",
        "Medication reminders",
      ],
      price: 120,
      discount: 10,
      icon: <ShoppingCart className="h-8 w-8 text-blue-500" />,
      popular: true,
    },
    {
      id: "home-maintenance",
      title: "Home Maintenance",
      description: "Keep your home in good condition",
      services: ["Weekly cleaning", "Minor repairs", "Yard maintenance"],
      price: 150,
      discount: 15,
      icon: <Home className="h-8 w-8 text-green-500" />,
    },
    {
      id: "companionship",
      title: "Companionship",
      description: "Regular social interaction and support",
      services: [
        "Bi-weekly visits",
        "Social activities",
        "Conversation and company",
      ],
      price: 100,
      discount: 5,
      icon: <Heart className="h-8 w-8 text-red-500" />,
    },
    {
      id: "transportation",
      title: "Transportation Plus",
      description: "Regular transportation to appointments and activities",
      services: [
        "Weekly medical appointments",
        "Shopping trips",
        "Social outings",
      ],
      price: 130,
      discount: 12,
      icon: <Calendar className="h-8 w-8 text-purple-500" />,
    },
    {
      id: "premium-care",
      title: "Premium Care",
      description: "Comprehensive assistance package",
      services: [
        "Daily check-ins",
        "Meal preparation",
        "Personal care",
        "Medication management",
        "Transportation",
      ],
      price: 250,
      discount: 20,
      icon: <Package className="h-8 w-8 text-amber-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Service Bundles</h2>
        <p className="text-muted-foreground">
          Choose from our pre-defined service packages at discounted rates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceBundles.map((bundle) => (
          <Card
            key={bundle.id}
            className={`cursor-pointer hover:border-primary transition-colors ${bundle.popular ? "border-primary" : ""}`}
            onClick={() => onSelect(bundle.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                {bundle.icon}
                {bundle.popular && (
                  <Badge className="bg-primary text-primary-foreground">
                    Popular
                  </Badge>
                )}
              </div>
              <CardTitle className="mt-2">{bundle.title}</CardTitle>
              <CardDescription>{bundle.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {bundle.services.map((service, index) => (
                  <li key={index} className="flex items-center">
                    <div className="mr-2 h-4 w-4 text-primary">✓</div>
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col items-start pt-0">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  ${(bundle.price * (1 - bundle.discount / 100)).toFixed(0)}
                </span>
                <span className="text-sm line-through text-muted-foreground">
                  ${bundle.price}
                </span>
                <span className="text-sm text-green-600 font-medium">
                  {bundle.discount}% off
                </span>
              </div>
              <Button className="w-full mt-4">Select Bundle</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceBundleSelector;
