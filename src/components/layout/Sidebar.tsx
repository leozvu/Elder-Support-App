import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  Calendar,
  Map,
  Pill,
  Heart,
  Users,
  Settings,
  User,
  HelpCircle,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, userDetails } = useAuth();

  const userRole = userDetails?.role || "customer";

  const navItems = [
    {
      name: t("navigation.dashboard"),
      href: "/",
      icon: <Home className="h-5 w-5" />,
      roles: ["customer", "helper", "admin"],
    },
    {
      name: t("navigation.requestService"),
      href: "/service-request",
      icon: <Calendar className="h-5 w-5" />,
      roles: ["customer"],
    },
    {
      name: t("navigation.nearbyHubs"),
      href: "/nearby-hubs",
      icon: <Map className="h-5 w-5" />,
      roles: ["customer", "helper"],
    },
    {
      name: t("navigation.medications"),
      href: "/medications",
      icon: <Pill className="h-5 w-5" />,
      roles: ["customer"],
    },
    {
      name: t("navigation.wellness"),
      href: "/wellness",
      icon: <Heart className="h-5 w-5" />,
      roles: ["customer"],
    },
    {
      name: t("navigation.caregiver"),
      href: "/caregiver",
      icon: <Users className="h-5 w-5" />,
      roles: ["helper", "admin"],
    },
    {
      name: t("navigation.profile"),
      href: "/profile",
      icon: <User className="h-5 w-5" />,
      roles: ["customer", "helper", "admin"],
    },
    {
      name: t("navigation.settings"),
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      roles: ["customer", "helper", "admin"],
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b md:hidden">
        <h2 className="text-xl font-bold text-primary">{t("app.name")}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="md:hidden"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="py-4">
          <nav className="px-2 space-y-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  location.pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100",
                )}
                onClick={() => {
                  if (open) onClose();
                }}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="px-4 mt-8">
            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                <HelpCircle className="mr-3 h-5 w-5" />
                {t("common.help")}
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
