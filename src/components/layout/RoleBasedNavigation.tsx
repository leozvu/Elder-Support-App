import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  Calendar,
  Clock,
  Pill,
  Activity,
  Users,
  Settings,
  Heart,
  MapPin,
  Bell,
  UserCheck,
  Building,
  AlertTriangle,
  Wallet,
  Star,
  MessageSquare,
} from "lucide-react";
import VoiceGuidedButton from "@/components/voice-guidance/VoiceGuidedButton";
import { useVoiceGuidance } from "@/hooks/useVoiceGuidance";

type UserRole = "customer" | "helper" | "admin" | "caregiver";

interface RoleBasedNavigationProps {
  userRole: UserRole;
  simplified?: boolean;
  vertical?: boolean;
  className?: string;
}

const RoleBasedNavigation = ({
  userRole,
  simplified = false,
  vertical = false,
  className = "",
}: RoleBasedNavigationProps) => {
  const navigate = useNavigate();
  const { enabled } = useVoiceGuidance();

  // Define navigation items based on user role
  const getNavigationItems = () => {
    switch (userRole) {
      case "customer": // Elderly user
        return [
          {
            label: "Home",
            icon: <Home className="h-5 w-5" />,
            path: "/",
            description: "Go to home dashboard",
          },
          {
            label: "Services",
            icon: <Heart className="h-5 w-5" />,
            path: "/service-request",
            description: "Request assistance services",
          },
          {
            label: "History",
            icon: <Clock className="h-5 w-5" />,
            path: "/service-history",
            description: "View your service history",
          },
          {
            label: "Medications",
            icon: <Pill className="h-5 w-5" />,
            path: "/medications",
            description: "Manage your medications",
          },
          {
            label: "Wellness",
            icon: <Activity className="h-5 w-5" />,
            path: "/wellness",
            description: "Track your wellness",
          },
          {
            label: "Contacts",
            icon: <Users className="h-5 w-5" />,
            path: "/emergency-contacts",
            description: "Manage emergency contacts",
          },
          {
            label: "Community",
            icon: <Building className="h-5 w-5" />,
            path: "/community-events",
            description: "View community events",
          },
          {
            label: "Settings",
            icon: <Settings className="h-5 w-5" />,
            path: "/settings",
            description: "Adjust your settings",
          },
        ];

      case "helper":
        return [
          {
            label: "Dashboard",
            icon: <Home className="h-5 w-5" />,
            path: "/helper-dashboard",
            description: "Go to helper dashboard",
          },
          {
            label: "Requests",
            icon: <Bell className="h-5 w-5" />,
            path: "/helper-requests",
            description: "View service requests",
          },
          {
            label: "Schedule",
            icon: <Calendar className="h-5 w-5" />,
            path: "/helper-schedule",
            description: "Manage your schedule",
          },
          {
            label: "Earnings",
            icon: <Wallet className="h-5 w-5" />,
            path: "/helper-earnings",
            description: "View your earnings",
          },
          {
            label: "Reviews",
            icon: <Star className="h-5 w-5" />,
            path: "/helper-reviews",
            description: "View your reviews",
          },
          {
            label: "Profile",
            icon: <UserCheck className="h-5 w-5" />,
            path: "/profile",
            description: "Manage your profile",
          },
          {
            label: "Settings",
            icon: <Settings className="h-5 w-5" />,
            path: "/settings",
            description: "Adjust your settings",
          },
        ];

      case "admin": // Hub administrator
        return [
          {
            label: "Dashboard",
            icon: <Home className="h-5 w-5" />,
            path: "/hub-dashboard",
            description: "Go to hub dashboard",
          },
          {
            label: "Verification",
            icon: <UserCheck className="h-5 w-5" />,
            path: "/user-verification",
            description: "Verify users and helpers",
          },
          {
            label: "Emergency",
            icon: <AlertTriangle className="h-5 w-5" />,
            path: "/emergency-response",
            description: "Emergency response system",
          },
          {
            label: "Community",
            icon: <Building className="h-5 w-5" />,
            path: "/community-management",
            description: "Manage community events",
          },
          {
            label: "Analytics",
            icon: <Activity className="h-5 w-5" />,
            path: "/hub-analytics",
            description: "View service analytics",
          },
          {
            label: "Settings",
            icon: <Settings className="h-5 w-5" />,
            path: "/hub-settings",
            description: "Adjust hub settings",
          },
        ];

      case "caregiver": // Family member/caregiver
        return [
          {
            label: "Dashboard",
            icon: <Home className="h-5 w-5" />,
            path: "/caregiver",
            description: "Go to caregiver dashboard",
          },
          {
            label: "Family",
            icon: <Users className="h-5 w-5" />,
            path: "/family-members",
            description: "Manage family members",
          },
          {
            label: "Medications",
            icon: <Pill className="h-5 w-5" />,
            path: "/family-medications",
            description: "Monitor medications",
          },
          {
            label: "Wellness",
            icon: <Activity className="h-5 w-5" />,
            path: "/family-wellness",
            description: "Monitor wellness",
          },
          {
            label: "Services",
            icon: <Heart className="h-5 w-5" />,
            path: "/family-services",
            description: "View service history",
          },
          {
            label: "Messages",
            icon: <MessageSquare className="h-5 w-5" />,
            path: "/family-messages",
            description: "Message helpers and family",
          },
          {
            label: "Settings",
            icon: <Settings className="h-5 w-5" />,
            path: "/caregiver-settings",
            description: "Adjust caregiver settings",
          },
        ];

      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  // Simplified navigation shows fewer items for elderly users
  const displayItems = simplified
    ? navigationItems.slice(0, 4) // Only show first 4 items in simplified mode
    : navigationItems;

  if (vertical) {
    return (
      <div className={`flex flex-col space-y-2 ${className}`}>
        {displayItems.map((item) =>
          enabled ? (
            <VoiceGuidedButton
              key={item.path}
              description={item.description}
              variant="ghost"
              className="justify-start w-full"
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </VoiceGuidedButton>
          ) : (
            <Button
              key={item.path}
              variant="ghost"
              className="justify-start w-full"
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Button>
          ),
        )}
      </div>
    );
  }

  return (
    <div className={`flex space-x-2 ${className}`}>
      {displayItems.map((item) =>
        enabled ? (
          <VoiceGuidedButton
            key={item.path}
            description={item.description}
            variant="ghost"
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span className="ml-2 hidden md:inline">{item.label}</span>
          </VoiceGuidedButton>
        ) : (
          <Button
            key={item.path}
            variant="ghost"
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span className="ml-2 hidden md:inline">{item.label}</span>
          </Button>
        ),
      )}
    </div>
  );
};

export default RoleBasedNavigation;
