import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  Calendar,
  Settings,
  User,
  Bell,
  Pill,
  Activity,
  Users,
  MapPin,
  Clock,
  HelpCircle,
  FileText,
  Wallet,
  Star,
  BarChart4,
  Shield,
  Package,
  Search,
  Heart,
  ShoppingCart,
  GraduationCap,
  UserPlus,
} from "lucide-react";
import { useVoiceGuidance } from "@/components/accessibility/VoiceGuidanceSystem";

type UserRole = "elderly" | "helper" | "caregiver" | "admin";

interface RoleBasedNavigationProps {
  role: UserRole;
  simplified?: boolean;
  className?: string;
}

const RoleBasedNavigation = ({
  role = "elderly",
  simplified = false,
  className = "",
}: RoleBasedNavigationProps) => {
  const navigate = useNavigate();
  const { speak } = useVoiceGuidance();

  const handleNavigation = (path: string, label: string) => {
    try {
      if (speak) {
        speak(`Navigating to ${label}`, true);
      }
      navigate(path);
    } catch (error) {
      console.error("Navigation error:", error);
      navigate(path);
    }
  };

  // Common navigation items for all roles
  const commonNavItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Home",
      path:
        role === "elderly"
          ? "/elderly-dashboard"
          : role === "helper"
            ? "/helper-dashboard"
            : role === "caregiver"
              ? "/caregiver-dashboard"
              : "/hub-dashboard",
      priority: true,
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      path: "/settings",
      priority: false,
    },
    {
      icon: <User className="h-5 w-5" />,
      label: "Profile",
      path: "/profile",
      priority: false,
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: "Help",
      path: "/help",
      priority: false,
    },
  ];

  // Role-specific navigation items
  const roleSpecificNavItems = {
    elderly: [
      {
        icon: <Bell className="h-5 w-5" />,
        label: "Request Help",
        path: "/service-request",
        priority: true,
      },
      {
        icon: <Package className="h-5 w-5" />,
        label: "Service Bundles",
        path: "/service-bundles",
        priority: true,
      },
      {
        icon: <Clock className="h-5 w-5" />,
        label: "Service History",
        path: "/service-history",
        priority: true,
      },
      {
        icon: <Pill className="h-5 w-5" />,
        label: "Medications",
        path: "/medications",
        priority: true,
      },
      {
        icon: <Activity className="h-5 w-5" />,
        label: "Wellness",
        path: "/wellness-checks",
        priority: true,
      },
      {
        icon: <Users className="h-5 w-5" />,
        label: "Emergency Contacts",
        path: "/emergency-contacts",
        priority: true,
      },
      {
        icon: <UserPlus className="h-5 w-5" />,
        label: "Family Portal",
        path: "/family-portal",
        priority: true,
      },
      {
        icon: <ShoppingCart className="h-5 w-5" />,
        label: "Local Businesses",
        path: "/local-businesses",
        priority: false,
      },
      {
        icon: <Heart className="h-5 w-5" />,
        label: "Social Connections",
        path: "/social-connections",
        priority: false,
      },
      {
        icon: <MapPin className="h-5 w-5" />,
        label: "Find Hubs",
        path: "/hub-finder",
        priority: false,
      },
      {
        icon: <Calendar className="h-5 w-5" />,
        label: "Community Events",
        path: "/community-events",
        priority: false,
      },
    ],
    helper: [
      {
        icon: <Bell className="h-5 w-5" />,
        label: "Available Requests",
        path: "/helper-dashboard?tab=available",
        priority: true,
      },
      {
        icon: <Clock className="h-5 w-5" />,
        label: "My Schedule",
        path: "/helper-dashboard?tab=upcoming",
        priority: true,
      },
      {
        icon: <FileText className="h-5 w-5" />,
        label: "Completed Services",
        path: "/helper-dashboard?tab=completed",
        priority: true,
      },
      {
        icon: <Wallet className="h-5 w-5" />,
        label: "Earnings",
        path: "/payment-management",
        priority: true,
      },
      {
        icon: <GraduationCap className="h-5 w-5" />,
        label: "Skills & Certifications",
        path: "/helper-skills",
        priority: true,
      },
      {
        icon: <Star className="h-5 w-5" />,
        label: "Ratings & Reviews",
        path: "/helper-profile?tab=reviews",
        priority: false,
      },
      {
        icon: <MapPin className="h-5 w-5" />,
        label: "Service Areas",
        path: "/helper-profile?tab=areas",
        priority: false,
      },
    ],
    caregiver: [
      {
        icon: <Users className="h-5 w-5" />,
        label: "My Seniors",
        path: "/caregiver-dashboard",
        priority: true,
      },
      {
        icon: <Pill className="h-5 w-5" />,
        label: "Medication Management",
        path: "/medication-management",
        priority: true,
      },
      {
        icon: <Activity className="h-5 w-5" />,
        label: "Wellness Monitoring",
        path: "/wellness-checks",
        priority: true,
      },
      {
        icon: <Bell className="h-5 w-5" />,
        label: "Notifications",
        path: "/caregiver-dashboard?tab=notifications",
        priority: true,
      },
      {
        icon: <Clock className="h-5 w-5" />,
        label: "Service History",
        path: "/service-history",
        priority: false,
      },
      {
        icon: <Calendar className="h-5 w-5" />,
        label: "Schedule",
        path: "/caregiver-dashboard?tab=schedule",
        priority: false,
      },
    ],
    admin: [
      {
        icon: <Users className="h-5 w-5" />,
        label: "User Management",
        path: "/hub-dashboard?tab=users",
        priority: true,
      },
      {
        icon: <Bell className="h-5 w-5" />,
        label: "Service Requests",
        path: "/hub-dashboard?tab=requests",
        priority: true,
      },
      {
        icon: <MapPin className="h-5 w-5" />,
        label: "Hub Management",
        path: "/hub-dashboard?tab=hub",
        priority: true,
      },
      {
        icon: <BarChart4 className="h-5 w-5" />,
        label: "Analytics",
        path: "/hub-dashboard?tab=analytics",
        priority: true,
      },
      {
        icon: <Calendar className="h-5 w-5" />,
        label: "Community Events",
        path: "/community-events",
        priority: false,
      },
      {
        icon: <Shield className="h-5 w-5" />,
        label: "Verification",
        path: "/hub-dashboard?tab=verification",
        priority: false,
      },
      {
        icon: <FileText className="h-5 w-5" />,
        label: "Reports",
        path: "/hub-dashboard?tab=reports",
        priority: false,
      },
    ],
  };

  // Combine common and role-specific items
  const navItems = [...commonNavItems, ...(roleSpecificNavItems[role] || [])];

  // For simplified view, show only priority items or limit to most important items
  const displayItems = simplified
    ? navItems.filter((item) => item.priority).slice(0, 6) ||
      navItems.slice(0, 6)
    : navItems;

  return (
    <nav className={`p-2 ${className}`}>
      <div
        className={`grid ${simplified ? "grid-cols-3" : "grid-cols-4"} gap-2`}
      >
        {displayItems.map((item, index) => (
          <Button
            key={index}
            variant="outline"
            className="flex flex-col items-center justify-center h-20 p-2 text-center"
            onClick={() => handleNavigation(item.path, item.label)}
            aria-label={item.label}
          >
            {item.icon}
            <span className="mt-1 text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default RoleBasedNavigation;
