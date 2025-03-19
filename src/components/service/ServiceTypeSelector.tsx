import React from "react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  Stethoscope,
  Heart,
  Coffee,
  Car,
  Home,
  Utensils,
  Book,
  Wrench,
} from "lucide-react";

interface ServiceType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface ServiceTypeSelectorProps {
  selectedService?: string;
  onSelectService?: (serviceId: string) => void;
}

const ServiceTypeSelector = ({
  selectedService = "",
  onSelectService = () => {},
}: ServiceTypeSelectorProps) => {
  const serviceTypes: ServiceType[] = [
    {
      id: "shopping",
      name: "Shopping",
      description: "Grocery and essential items",
      icon: <ShoppingCart className="h-12 w-12" />,
    },
    {
      id: "medical",
      name: "Medical",
      description: "Appointments and medication",
      icon: <Stethoscope className="h-12 w-12" />,
    },
    {
      id: "companionship",
      name: "Companionship",
      description: "Social visits and activities",
      icon: <Heart className="h-12 w-12" />,
    },
    {
      id: "social",
      name: "Social Outings",
      description: "Cafes, parks and events",
      icon: <Coffee className="h-12 w-12" />,
    },
    {
      id: "transport",
      name: "Transportation",
      description: "Rides to appointments",
      icon: <Car className="h-12 w-12" />,
    },
    {
      id: "housekeeping",
      name: "Housekeeping",
      description: "Light cleaning and organization",
      icon: <Home className="h-12 w-12" />,
    },
    {
      id: "maintenance",
      name: "Home Maintenance",
      description: "Repairs and home fixes",
      icon: <Wrench className="h-12 w-12" />,
    },
    {
      id: "meals",
      name: "Meal Preparation",
      description: "Cooking and meal planning",
      icon: <Utensils className="h-12 w-12" />,
    },
    {
      id: "education",
      name: "Technology Help",
      description: "Device and app assistance",
      icon: <Book className="h-12 w-12" />,
    },
  ];

  return (
    <div className="w-full bg-white p-6 rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Select Service Type
      </h2>
      <p className="text-xl text-center text-gray-600 mb-8">
        What kind of assistance do you need today?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {serviceTypes.map((service) => (
          <Card
            key={service.id}
            className={cn(
              "p-6 cursor-pointer transition-all duration-200 hover:shadow-lg border-2",
              selectedService === service.id
                ? "border-primary bg-primary/10"
                : "border-gray-200 hover:border-primary/50",
            )}
            onClick={() => onSelectService(service.id)}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className={cn(
                  "p-4 rounded-full mb-4",
                  selectedService === service.id
                    ? "bg-primary/20 text-primary"
                    : "bg-gray-100 text-gray-600",
                )}
              >
                {service.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-2">{service.name}</h3>
              <p className="text-lg text-gray-600">{service.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-lg text-gray-500">
          Need a different type of assistance? Contact your local hub at{" "}
          <span className="font-bold">1-800-SENIOR-HELP</span>
        </p>
      </div>
    </div>
  );
};

export default ServiceTypeSelector;
