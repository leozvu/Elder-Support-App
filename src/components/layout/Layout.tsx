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
  ZoomIn,
  Eye,
  AlertTriangle,
  MessageSquare,
  Phone,
} from "lucide-react";
import AccessibilityControls from "@/components/accessibility/AccessibilityControls";
import SOSButton from "@/components/emergency/SOSButton";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ChatInterface from "@/components/communication/ChatInterface";
import VoiceGuidedElement from "@/components/voice-guidance/VoiceGuidedElement";
import { speak, announcePageChange } from "@/lib/voice-guidance";
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
  const [showEmergencyChat, setShowEmergencyChat] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const { user, userDetails } = useAuth();

  // Use provided values or fall back to user details from auth
  const displayName = userName || userDetails?.full_name || "Guest";
  const avatarUrl =
    userAvatar ||
    userDetails?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;
  const userRole = userDetails?.role || "customer";

  // Check if voice guidance is enabled
  const isVoiceEnabled = () => {
    try {
      const settings = localStorage.getItem('accessibilitySettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        return parsed.voiceGuidance?.enabled || false;
      }
    } catch (e) {
      console.error('Error checking voice guidance settings:', e);
    }
    return false;
  };

  // Announce page changes for voice guidance
  useEffect(() => {
    if (isVoiceEnabled()) {
      const pageName = getPageNameFromPath(location.pathname);
      announcePageChange(pageName);
    }
  }, [location.pathname]);

  // Helper function to get a friendly page name from the path
  const getPageNameFromPath = (path: string): string => {
    // Remove leading slash and split by remaining slashes
    const segments = path.replace(/^\//, "").split("/");
    if (segments[0] === "") return "Home";

    // Convert kebab-case to spaces and capitalize first letter of each word
    return segments[0]
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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

  // Check if high contrast mode is enabled
  const isHighContrast = () => {
    try {
      const settings = localStorage.getItem('accessibilitySettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        return parsed.highContrast || false;
      }
    } catch (e) {
      console.error('Error checking high contrast settings:', e);
    }
    return false;
  };

  // Check if large text mode is enabled
  const isLargeText = () => {
    try {
      const settings = localStorage.getItem('accessibilitySettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        return parsed.largeText || false;
      }
    } catch (e) {
      console.error('Error checking large text settings:', e);
    }
    return false;
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

      {/* Accessibility Quick Controls - Fixed position */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
        <VoiceGuidedElement
          description="Toggle high contrast mode"
          priority={true}
        >
          <Button
            variant={isHighContrast() ? "default" : "outline"}
            size="icon"
            onClick={() => {
              try {
                const settings = localStorage.getItem('accessibilitySettings');
                if (settings) {
                  const parsed = JSON.parse(settings);
                  const newValue = !parsed.highContrast;
                  parsed.highContrast = newValue;
                  localStorage.setItem('accessibilitySettings', JSON.stringify(parsed));
                  
                  // Apply setting to document
                  document.documentElement.classList.toggle('high-contrast', newValue);
                  
                  // Announce change
                  if (isVoiceEnabled()) {
                    speak(`High contrast mode ${newValue ? 'enabled' : 'disabled'}`);
                  }
                  
                  // Force re-render
                  window.dispatchEvent(new Event('storage'));
                }
              } catch (e) {
                console.error('Error toggling high contrast:', e);
              }
            }}
            aria-label="Toggle high contrast mode"
            title="Toggle high contrast mode"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </VoiceGuidedElement>

        <VoiceGuidedElement
          description="Toggle large text mode"
          priority={true}
        >
          <Button
            variant={isLargeText() ? "default" : "outline"}
            size="icon"
            onClick={() => {
              try {
                const settings = localStorage.getItem('accessibilitySettings');
                if (settings) {
                  const parsed = JSON.parse(settings);
                  const newValue = !parsed.largeText;
                  parsed.largeText = newValue;
                  localStorage.setItem('accessibilitySettings', JSON.stringify(parsed));
                  
                  // Apply setting to document
                  document.documentElement.classList.toggle('large-text', newValue);
                  
                  // Announce change
                  if (isVoiceEnabled()) {
                    speak(`Large text mode ${newValue ? 'enabled' : 'disabled'}`);
                  }
                  
                  // Force re-render
                  window.dispatchEvent(new Event('storage'));
                }
              } catch (e) {
                console.error('Error toggling large text:', e);
              }
            }}
            aria-label="Toggle large text mode"
            title="Toggle large text mode"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </VoiceGuidedElement>

        {/* Emergency Chat Button */}
        {userRole === "customer" && (
          <VoiceGuidedElement
            description="Emergency chat with hub"
            priority={true}
          >
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setShowEmergencyChat(true)}
              aria-label="Emergency chat with hub"
              title="Emergency chat with hub"
            >
              <AlertTriangle className="h-4 w-4" />
            </Button>
          </VoiceGuidedElement>
        )}
      </div>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 p-4">
          <nav className="space-y-2 mt-6" aria-label="Main Navigation">
            {filteredNavItems.map((item) => (
              <VoiceGuidedElement
                key={item.name}
                description={`${item.name} menu item`}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-primary transition-colors ${
                    location.pathname === item.path ? "bg-primary/10 text-primary font-medium" : ""
                  }`}
                  aria-current={
                    location.pathname === item.path ? "page" : undefined
                  }
                >
                  {item.icon}
                  <span className={`${isLargeText() ? "text-xl" : "text-lg"}`}>{item.name}</span>
                </Link>
              </VoiceGuidedElement>
            ))}
          </nav>

          {/* Accessibility Controls */}
          <div className="mt-8 border-t pt-4">
            <h3 className={`text-sm font-medium text-gray-500 mb-3 px-3 ${isLargeText() ? "text-base" : ""}`}>
              Accessibility
            </h3>
            <div className="px-3">
              <AccessibilityControls />
            </div>
          </div>

          {/* Emergency SOS Button */}
          {userRole === "customer" && (
            <div className="mt-8 border-t pt-4">
              <h3 className={`text-sm font-medium text-gray-500 mb-3 px-3 ${isLargeText() ? "text-base" : ""}`}>
                Emergency
              </h3>
              <div className="flex justify-center">
                <VoiceGuidedElement
                  description="Emergency SOS button"
                  priority={true}
                >
                  <SOSButton userRole={userRole} />
                </VoiceGuidedElement>
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
                <VoiceGuidedElement
                  key={item.name}
                  description={`${item.name} menu item`}
                >
                  <Link
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
                    <span className={`${isLargeText() ? "text-xl" : "text-lg"}`}>{item.name}</span>
                  </Link>
                </VoiceGuidedElement>
              ))}
            </nav>

            {/* Mobile Accessibility Controls */}
            <div className="p-4 border-t">
              <h3 className={`text-sm font-medium text-gray-500 mb-3 ${isLargeText() ? "text-base" : ""}`}>
                Accessibility
              </h3>
              <AccessibilityControls />
            </div>

            {/* Mobile Emergency Button */}
            {userRole === "customer" && (
              <div className="p-4 border-t">
                <h3 className={`text-sm font-medium text-gray-500 mb-3 ${isLargeText() ? "text-base" : ""}`}>
                  Emergency
                </h3>
                <div className="flex justify-center">
                  <VoiceGuidedElement
                    description="Emergency SOS button"
                    priority={true}
                  >
                    <SOSButton userRole={userRole} />
                  </VoiceGuidedElement>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1" role="main" tabIndex={-1}>
          {/* Floating SOS button on mobile */}
          {userRole === "customer" && (
            <div className="md:hidden fixed bottom-4 right-4 z-50 flex flex-col gap-2">
              <VoiceGuidedElement
                description="Emergency SOS button"
                priority={true}
              >
                <SOSButton userRole={userRole} />
              </VoiceGuidedElement>

              <VoiceGuidedElement
                description="Emergency chat with hub"
                priority={true}
              >
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setShowEmergencyChat(true)}
                  aria-label="Emergency chat with hub"
                  className="rounded-full h-12 w-12 flex items-center justify-center"
                >
                  <MessageSquare className="h-6 w-6" />
                </Button>
              </VoiceGuidedElement>
            </div>
          )}

          {/* Main content */}
          {children}

          {/* Emergency Chat Dialog */}
          <Dialog open={showEmergencyChat} onOpenChange={setShowEmergencyChat}>
            <DialogContent className="sm:max-w-[500px] p-0">
              <ChatInterface
                recipientId="hub-1"
                recipientName="Emergency Support Hub"
                recipientAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Hub"
                recipientType="hub"
                initialMessages={[
                  {
                    id: `emergency-${Date.now()}`,
                    senderId: "hub-1",
                    receiverId: "current-user-id",
                    content:
                      "This is an emergency chat line. How can we help you? If this is a life-threatening emergency, please call 911 immediately.",
                    timestamp: new Date(),
                    read: true,
                    type: "system",
                  },
                ]}
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Layout;