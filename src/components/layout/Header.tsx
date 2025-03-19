import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, LogIn, Menu } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  onProfileClick?: () => void;
  onMenuToggle?: () => void;
}

const Header = ({
  userName,
  userAvatar,
  onProfileClick,
  onMenuToggle = () => console.log("Menu toggled"),
}: HeaderProps) => {
  const { user, userDetails, signOut } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  // Use provided values or fall back to user details from auth
  const displayName = userName || userDetails?.full_name || "Guest";
  const avatarUrl =
    userAvatar ||
    userDetails?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      navigate("/profile");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    setShowLogoutConfirm(false);
  };

  return (
    <header className="w-full h-20 px-4 md:px-6 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </Button>

        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          Senior Assist
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Login/Logout Button */}
        {user ? (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleLogin}
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Login</span>
          </Button>
        )}

        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={handleProfileClick}
        >
          <Avatar className="h-10 w-10 border border-gray-200">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="text-lg">
              {displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-base font-medium">{displayName}</p>
            <p className="text-xs text-gray-500">Profile</p>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm Logout
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out of your account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Header;