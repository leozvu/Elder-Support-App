import React, { ReactNode, useState, useEffect } from "react";
import Header from "./Header";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  Map,
  Settings,
  User,
  Menu,
  Pill,
  Heart,
  HeartPulse,
  Phone,
} from "lucide-react";
import AccessibilityControls from "@/components/accessibility/AccessibilityControls";
import SOSButton from "@/components/emergency/SOSButton";
import { useAuth } from "@/lib/auth";

interface LayoutProps {
  children: ReactNode;
  userName?: string;
  userAvatar?: string;
  showFloatingMenu?: boolean;
}

const Layout = ({
  children,
  userName,
  userAvatar,
  showFloatingMenu = true,
}: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, userDetails } = useAuth();

  // Use provided values or fall back to user details from auth
  const displayName = userName || userDetails?.full_name || "Guest";
  const avatarUrl =
    userAvatar ||
    userDetails?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;
  const userRole = userDetails?.role || "customer";

  // Apply accessibility settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('accessibilitySettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        
        // Apply settings to document
        document.documentElement.classList.toggle('high-contrast', parsedSettings.highContrast || false);
        document.documentElement.classList.toggle('large-text', parsedSettings.largeText || false);
        document.documentElement.classList.toggle('simplified-nav', parsedSettings.simplifiedNavigation || false);
      }
    } catch (error) {
      console.error('Failed to apply accessibility settings:', error);
    }
  }, []);

  const navigationItems = [
    { name: "Dashboard", icon: <Home className="h-5 w-5" />, path: "/" },
    {
      name: "Request Service",
      icon: <Calendar className="h-5 w-5" />,
      path: "/request",
      roles: ["customer"],
    },
    { name: "Nearby Hubs", icon: <Map className="h-5 w-5" />, path: "/hub-finder" },
    {
      name: "Medications",
      icon: <Pill className="h-5 w-5" />,
      path: "/medications",
      roles: ["customer"],
    },
    {
      name: "Wellness",
      icon: <HeartPulse className="h-5 w-5" />,
      path: "/wellness",
      roles: ["customer"],
    },
    {
      name: "Community Events",
      icon: <Calendar className="h-5 w-5" />,
      path: "/community-events",
    },
    {
      name: "Family Portal",
      icon: <Heart className="h-5 w-5" />,
      path: "/family-portal",
      roles: ["customer", "admin"],
    },
    { name: "Profile", icon: <User className="h-5 w-5" />, path: "/profile" },
    {
      name: "Emergency Contacts",
      icon: <Phone className="h-5 w-5" />,
      path: "/emergency-contacts",
      roles: ["customer"],
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/settings",
    },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div
        className="sr-only"
        aria-live="polite"
        id="screen-reader-announcements"
      ></div>
      <Header
        userName={displayName}
        userAvatar={avatarUrl}
        onMenuToggle={handleMenuToggle}
      />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 p-4">
          <nav className="space-y-2 mt-6" aria-label="Main Navigation">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-primary transition-colors ${
                  location.pathname === item.path ? "bg-primary/10 text-primary font-medium" : ""
                }`}
                aria-current={
                  location.pathname === item.path ? "page" : undefined
                }
              >
                {item.icon}
                <span className="text-lg">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Accessibility Controls */}
          <div className="mt-8 border-t pt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3 px-3">
              Accessibility
            </h3>
            <div className="px-3">
              <AccessibilityControls />
            </div>
          </div>

          {/* Emergency SOS Button */}
          {userRole === "customer" && (
            <div className="mt-8 border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3 px-3">
                Emergency
              </h3>
              <div className="flex justify-center">
                <SOSButton userRole={userRole} />
              </div>
            </div>
          )}
        </aside>

        {/* Mobile Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold text-primary">Senior Assist</h2>
            </div>
            <nav className="p-4 space-y-2" aria-label="Mobile Navigation">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-primary transition-colors ${
                    location.pathname === item.path ? "bg-primary/10 text-primary font-medium" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={
                    location.pathname === item.path ? "page" : undefined
                  }
                >
                  {item.icon}
                  <span className="text-lg">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile Accessibility Controls */}
            <div className="p-4 border-t">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Accessibility
              </h3>
              <AccessibilityControls />
            </div>

            {/* Mobile Emergency Button */}
            {userRole === "customer" && (
              <div className="p-4 border-t">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Emergency
                </h3>
                <div className="flex justify-center">
                  <SOSButton userRole={userRole} />
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1" role="main" tabIndex={-1}>
          {/* Floating SOS button on mobile */}
          {userRole === "customer" && (
            <div className="md:hidden fixed bottom-4 right-4 z-50">
              <SOSButton userRole={userRole} />
            </div>
          )}

          {/* Main content */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;