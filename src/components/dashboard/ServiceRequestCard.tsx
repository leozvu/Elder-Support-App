import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ShoppingCart, Calendar, Users, ChevronRight } from "lucide-react";

interface ServiceType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface ServiceRequestCardProps {
  services?: ServiceType[];
  onServiceSelect?: (serviceId: string) => void;
  simplified?: boolean;
}

const ServiceRequestCard = ({
  services = [
    {
      id: "shopping",
      name: "Shopping Assistance",
      description: "Get help with grocery shopping and errands",
      icon: <ShoppingCart className="h-10 w-10 text-primary" />,
    },
    {
      id: "medical",
      name: "Medical Appointments",
      description: "Transportation and companionship for medical visits",
      icon: <Calendar className="h-10 w-10 text-primary" />,
    },
    {
      id: "companionship",
      name: "Companionship",
      description: "Someone to talk to or help around the house",
      icon: <Users className="h-10 w-10 text-primary" />,
    },
  ],
  onServiceSelect = (id) => console.log(`Service selected: ${id}`),
  simplified = false,
}: ServiceRequestCardProps) => {
  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center sm:text-left">
          Request Assistance
        </CardTitle>
        <CardDescription className="text-lg text-center sm:text-left">
          Select the type of service you need
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <Button
              key={service.id}
              variant="outline"
              className="h-auto p-6 flex flex-col items-center md:items-start text-left border-2 hover:border-primary hover:bg-primary/5 transition-all"
              onClick={() => onServiceSelect(service.id)}
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full">
                <div className="flex-shrink-0 mb-2 md:mb-0">{service.icon}</div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  {!simplified && (
                    <p className="text-gray-600 text-base">
                      {service.description}
                    </p>
                  )}
                </div>
                <ChevronRight className="hidden md:block ml-auto self-center h-6 w-6 text-gray-400" />
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceRequestCard;
