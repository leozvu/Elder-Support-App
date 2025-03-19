import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Pill,
  Activity,
  Users,
  Calendar,
  MapPin,
  Bell,
  HelpCircle,
  Wallet,
  Star,
  FileText,
  BarChart4,
  Settings,
  MessageSquare,
} from "lucide-react";
import { useVoiceGuidance } from "@/hooks/useVoiceGuidance";
import { useAccessibility } from "@/components/accessibility/AccessibilityContext";

type UserRole = "elderly" | "helper" | "caregiver" | "admin";

interface QuickAccessPanelProps {
  role?: UserRole;
  className?: string;
}

const QuickAccessPanel = ({
  role = "elderly",
  className = "",
}: QuickAccessPanelProps) => {
  const navigate = useNavigate();
  const { speak } = useVoiceGuidance();
  const accessibilityContext = useAccessibility();
  const isSimplifiedUI =
    accessibilityContext?.settings?.simplifiedNavigation || false;

  // Define quick access items based on user role
  const getQuickAccessItems = () => {
    switch (role) {
      case "elderly":
        return [
          {
            icon: <Bell className="h-8 w-8 text-primary" />,
            label: "Request Help",
            path: "/service-request",
            description: "Request assistance services",
            priority: true,
          },
          {
            icon: <Clock className="h-8 w-8 text-primary" />,
            label: "Service History",
            path: "/service-history",
            description: "View your past service requests",
            priority: true,
          },
          {
            icon: <Pill className="h-8 w-8 text-primary" />,
            label: "Medications",
            path: "/medications",
            description: "Manage your medication schedule",
            priority: true,
          },
          {
            icon: <Activity className="h-8 w-8 text-primary" />,
            label: "Wellness",
            path: "/wellness-checks",
            description: "Track your health and wellness",
            priority: true,
          },
          {
            icon: <Users className="h-8 w-8 text-primary" />,
            label: "Emergency Contacts",
            path: "/emergency-contacts",
            description: "Manage your emergency contacts",
            priority: true,
          },
          {
            icon: <MessageSquare className="h-8 w-8 text-primary" />,
            label: "Messages",
            path: "/direct-communication",
            description: "Communicate with helpers and hubs",
            priority: true,
          },
          {
            icon: <MapPin className="h-8 w-8 text-primary" />,
            label: "Find Hubs",
            path: "/hub-finder",
            description: "Locate support hubs near you",
          },
          {
            icon: <Calendar className="h-8 w-8 text-primary" />,
            label: "Community Events",
            path: "/community-events",
            description: "Browse community events",
          },
          {
            icon: <HelpCircle className="h-8 w-8 text-primary" />,
            label: "Help",
            path: "/help",
            description: "Get help using the app",
          },
        ];
      case "helper":
        return [
          {
            icon: <Bell className="h-8 w-8 text-primary" />,
            label: "Available Requests",
            path: "/helper-dashboard?tab=available",
            description: "View available service requests",
            priority: true,
          },
          {
            icon: <Clock className="h-8 w-8 text-primary" />,
            label: "My Schedule",
            path: "/helper-schedule",
            description: "View and manage your schedule",
            priority: true,
          },
          {
            icon: <FileText className="h-8 w-8 text-primary" />,
            label: "Completed Services",
            path: "/helper-dashboard?tab=completed",
            description: "View your completed services",
            priority: true,
          },
          {
            icon: <Wallet className="h-8 w-8 text-primary" />,
            label: "Earnings",
            path: "/payment-management",
            description: "View your earnings and payment history",
            priority: true,
          },
          {
            icon: <MessageSquare className="h-8 w-8 text-primary" />,
            label: "Messages",
            path: "/direct-communication",
            description: "Communicate with clients and hubs",
            priority: true,
          },
          {
            icon: <Star className="h-8 w-8 text-primary" />,
            label: "Ratings & Reviews",
            path: "/helper-profile?tab=reviews",
            description: "View your ratings and reviews",
          },
          {
            icon: <MapPin className="h-8 w-8 text-primary" />,
            label: "Service Areas",
            path: "/helper-profile?tab=areas",
            description: "Manage your service areas",
          },
          {
            icon: <Settings className="h-8 w-8 text-primary" />,
            label: "Profile Settings",
            path: "/helper-profile",
            description: "Manage your helper profile",
          },
          {
            icon: <Calendar className="h-8 w-8 text-primary" />,
            label: "Availability",
            path: "/helper-schedule?tab=availability",
            description: "Set your availability schedule",
          },
        ];
      case "caregiver":
        return [
          {
            icon: <Users className="h-8 w-8 text-primary" />,
            label: "My Seniors",
            path: "/caregiver-dashboard",
            description: "View seniors under your care",
            priority: true,
          },
          {
            icon: <Pill className="h-8 w-8 text-primary" />,
            label: "Medications",
            path: "/medication-management",
            description: "Manage medications for seniors",
            priority: true,
          },
          {
            icon: <Activity className="h-8 w-8 text-primary" />,
            label: "Wellness",
            path: "/wellness-checks",
            description: "Monitor wellness for seniors",
            priority: true,
          },
          {
            icon: <Clock className="h-8 w-8 text-primary" />,
            label: "Service History",
            path: "/service-history",
            description: "View service history for seniors",
            priority: true,
          },
          {
            icon: <Bell className="h-8 w-8 text-primary" />,
            label: "Notifications",
            path: "/caregiver-dashboard?tab=notifications",
            description: "View important notifications",
          },
          {
            icon: <Calendar className="h-8 w-8 text-primary" />,
            label: "Schedule",
            path: "/caregiver-dashboard?tab=schedule",
            description: "View and manage senior schedules",
          },
        ];
      case "admin":
        return [
          {
            icon: <Users className="h-8 w-8 text-primary" />,
            label: "User Management",
            path: "/hub-dashboard?tab=users",
            description: "Manage users in your hub",
            priority: true,
          },
          {
            icon: <Bell className="h-8 w-8 text-primary" />,
            label: "Service Requests",
            path: "/hub-dashboard?tab=requests",
            description: "Manage service requests",
            priority: true,
          },
          {
            icon: <MapPin className="h-8 w-8 text-primary" />,
            label: "Hub Management",
            path: "/hub-dashboard?tab=hub",
            description: "Manage hub settings and services",
            priority: true,
          },
          {
            icon: <BarChart4 className="h-8 w-8 text-primary" />,
            label: "Analytics",
            path: "/hub-dashboard?tab=analytics",
            description: "View hub analytics and reports",
            priority: true,
          },
          {
            icon: <Calendar className="h-8 w-8 text-primary" />,
            label: "Community Events",
            path: "/community-events",
            description: "Manage community events",
          },
          {
            icon: <FileText className="h-8 w-8 text-primary" />,
            label: "Reports",
            path: "/hub-dashboard?tab=reports",
            description: "Generate and view reports",
          },
        ];
      default:
        return [];
    }
  };

  const quickAccessItems = getQuickAccessItems();

  // For simplified UI, show only high priority items or the first few
  const displayItems = isSimplifiedUI
    ? quickAccessItems.filter((item) => item.priority).slice(0, 4) ||
      quickAccessItems.slice(0, 4)
    : quickAccessItems;

  const handleNavigation = (path: string, label: string) => {
    speak(`Navigating to ${label}`, true);
    navigate(path);
  };

  return (
    <Card className={`w-full bg-white ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Quick Access</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`grid grid-cols-2 ${isSimplifiedUI ? "sm:grid-cols-2" : "sm:grid-cols-4"} gap-4`}
        >
          {displayItems.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-2 border-2 hover:border-primary hover:bg-primary/5 transition-colors"
              onClick={() => handleNavigation(item.path, item.label)}
              aria-label={`${item.label}: ${item.description}`}
            >
              {item.icon}
              <span className="text-lg font-medium text-center">
                {item.label}
              </span>
              {!isSimplifiedUI && (
                <span className="text-xs text-gray-500 text-center hidden md:block">
                  {item.description}
                </span>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickAccessPanel;
