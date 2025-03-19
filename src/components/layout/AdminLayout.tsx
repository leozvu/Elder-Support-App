import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Users,
  FileText,
  Settings,
  LogOut,
  Bell,
  MessageSquare,
  HelpCircle,
  Award,
  Megaphone,
  MapPin,
  BarChart,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    {
      path: "/admin/certifications",
      label: "Certifications",
      icon: <Award className="h-5 w-5" />,
    },
    {
      path: "/admin/reporting",
      label: "Reporting",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      path: "/admin/communication",
      label: "Communication",
      icon: <Megaphone className="h-5 w-5" />,
    },
    {
      path: "/admin/heatmap",
      label: "Demand Analysis",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      path: "/admin/users",
      label: "User Management",
      icon: <Users className="h-5 w-5" />,
    },
    {
      path: "/admin/analytics",
      label: "Analytics",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 p-2 rounded-md">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Senior Hub</h1>
              <p className="text-xs text-muted-foreground">Administration</p>
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
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                  alt="Admin"
                />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">Hub Manager</p>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start">
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
              <h1 className="text-xl font-semibold">Hub Administration</h1>
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
                  5
                </Badge>
              </Button>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-100">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;

// Shield icon component
function Shield({ className }: { className?: string }) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
