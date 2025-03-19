import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Calendar,
  User,
  Settings,
  LogOut,
  Bell,
  MessageSquare,
  HelpCircle,
  DollarSign,
  Wrench,
} from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      {
        path: "/dashboard",
        label: "Dashboard",
        icon: <Home className="h-5 w-5" />,
      },
      {
        path: "/profile",
        label: "Profile",
        icon: <User className="h-5 w-5" />,
      },
    ];

    if (user?.role === "admin") {
      return [
        ...commonItems,
        {
          path: "/admin",
          label: "Admin Panel",
          icon: <Settings className="h-5 w-5" />,
        },
      ];
    }

    if (user?.role === "helper") {
      return [
        ...commonItems,
        {
          path: "/assignments",
          label: "My Assignments",
          icon: <Calendar className="h-5 w-5" />,
        },
        {
          path: "/certifications",
          label: "My Certifications",
          icon: <FileCheck className="h-5 w-5" />,
        },
      ];
    }

    // Elderly user
    return [
      ...commonItems,
      {
        path: "/services",
        label: "Request Services",
        icon: <Calendar className="h-5 w-5" />,
      },
      {
        path: "/financial",
        label: "Financial",
        icon: <DollarSign className="h-5 w-5" />,
      },
      {
        path: "/maintenance",
        label: "Home Maintenance",
        icon: <Wrench className="h-5 w-5" />,
      },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 p-2 rounded-md">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Senior Assist</h1>
              <p className="text-xs text-muted-foreground">
                {user?.role === "admin"
                  ? "Hub Administration"
                  : user?.role === "helper"
                    ? "Helper Portal"
                    : "Senior Portal"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`w-full justify-start ${isActive(item.path) ? "" : ""}`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                  alt={user?.full_name || "User"}
                />
                <AvatarFallback>
                  {user?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {user?.full_name || "User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.role === "admin"
                    ? "Administrator"
                    : user?.role === "helper"
                      ? "Helper"
                      : "Senior User"}
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white border-b px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">
                {location.pathname === "/dashboard"
                  ? "Dashboard"
                  : location.pathname === "/services"
                    ? "Request Services"
                    : location.pathname === "/profile"
                      ? "My Profile"
                      : location.pathname === "/financial"
                        ? "Financial Management"
                        : location.pathname === "/maintenance"
                          ? "Home Maintenance"
                          : "Senior Assistance Platform"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <MessageSquare className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  2
                </Badge>
              </Button>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;

// Heart icon component
function Heart({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

// FileCheck icon component
function FileCheck({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 15l2 2 4-4" />
    </svg>
  );
}
