import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  ShoppingCart,
  Pill,
  Heart,
  AlertTriangle,
  Menu,
  X,
  Phone,
  MapPin,
  User,
  Settings,
} from "lucide-react";

interface FloatingMenuProps {
  className?: string;
}

const FloatingMenu = ({ className = "" }: FloatingMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: <Home className="h-5 w-5" />, label: "Home", path: "/" },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "Services",
      path: "/request",
    },
    {
      icon: <Pill className="h-5 w-5" />,
      label: "Medication",
      path: "/medications",
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: "Wellness",
      path: "/wellness",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Events",
      path: "/community-events",
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      label: "Emergency",
      path: "/emergency-services",
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: "Contacts",
      path: "/emergency-contacts",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "Find Hub",
      path: "/hub-finder",
    },
    {
      icon: <User className="h-5 w-5" />,
      label: "Profile",
      path: "/profile",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      path: "/settings",
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end ${className}`}
    >
      {isOpen && (
        <div className="mb-4 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-3 gap-1 p-2">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="flex flex-col items-center justify-center h-20 w-20 rounded-lg hover:bg-gray-100"
                onClick={() => handleNavigate(item.path)}
              >
                <div className="text-primary">{item.icon}</div>
                <span className="mt-1 text-xs">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <Button
          size="lg"
          className="rounded-full h-14 w-14 bg-green-600 hover:bg-green-700 shadow-lg"
          onClick={() => window.open("tel:911")}
        >
          <Phone className="h-6 w-6" />
        </Button>

        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg"
          onClick={toggleMenu}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  );
};

export default FloatingMenu;
