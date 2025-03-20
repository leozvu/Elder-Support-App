import React, { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { 
  Home, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Calendar, 
  Bell, 
  HelpCircle,
  FileText,
  Users,
  BarChart,
  Shield
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, userDetails, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  // Define navigation items based on user role
  const getNavItems = () => {
    const role = userDetails?.role || "customer";
    
    const commonItems = [
      { label: "Home", icon: <Home className="h-5 w-5" />, path: "/" },
      { label: "Profile", icon: <User className="h-5 w-5" />, path: "/profile" },
      { label: "Settings", icon: <Settings className="h-5 w-5" />, path: "/settings" },
    ];
    
    if (role === "customer") {
      return [
        ...commonItems,
        { label: "Services", icon: <Calendar className="h-5 w-5" />, path: "/service-request" },
        { label: "Notifications", icon: <Bell className="h-5 w-5" />, path: "/notifications" },
        { label: "Help", icon: <HelpCircle className="h-5 w-5" />, path: "/help" },
      ];
    } else if (role === "helper") {
      return [
        ...commonItems,
        { label: "Assignments", icon: <FileText className="h-5 w-5" />, path: "/helper-schedule" },
        { label: "Customers", icon: <Users className="h-5 w-5" />, path: "/customers" },
        { label: "Earnings", icon: <BarChart className="h-5 w-5" />, path: "/earnings" },
      ];
    } else if (role === "admin") {
      return [
        ...commonItems,
        { label: "Users", icon: <Users className="h-5 w-5" />, path: "/admin/users" },
        { label: "Services", icon: <FileText className="h-5 w-5" />, path: "/admin/services" },
        { label: "Verifications", icon: <Shield className="h-5 w-5" />, path: "/admin/verifications" },
        { label: "Analytics", icon: <BarChart className="h-5 w-5" />, path: "/admin/analytics" },
      ];
    }
    
    return commonItems;
  };
  
  const navItems = getNavItems();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden mr-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 
              className="text-xl font-bold text-primary cursor-pointer" 
              onClick={() => navigate("/")}
            >
              Elder Support App
            </h1>
          </div>
          
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium hidden md:inline-block">
                {userDetails?.full_name || "User"}
              </span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/profile")}
              >
                <User className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </header>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <nav className="container mx-auto px-4 py-2">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Button>
                </li>
              ))}
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-2">Logout</span>
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      )}
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2023 Elder Support App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;