import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, LogIn, Menu } from "lucide-react";
import NotificationsDropdown from "@/components/notifications/NotificationsDropdown";
import LanguageSelector from "@/components/language/LanguageSelector";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();

  // Force re-render when language changes
  useEffect(() => {
    // This is just to ensure the component re-renders when language changes
    // The dependency array includes i18n.language to trigger re-render
  }, [i18n.language]);

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
          aria-label={t("common.toggleMenu")}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          {t("app.name")}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <div className="bg-red-600 rounded-full h-12 w-12 flex items-center justify-center shadow-lg">
            <Button
              variant="ghost"
              className="h-full w-full text-white font-bold text-lg hover:bg-red-700 rounded-full"
              aria-label={t("emergency.sos")}
            >
              {t("emergency.sos")}
            </Button>
          </div>
        </div>

        <LanguageSelector />
        <NotificationsDropdown />

        {/* Login/Logout Button */}
        {user ? (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t("auth.logout")}</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleLogin}
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">{t("auth.login")}</span>
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
            <p className="text-xs text-gray-500">{t("navigation.profile")}</p>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("auth.logoutConfirmTitle", "Confirm Logout")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "auth.logoutConfirmMessage",
                "Are you sure you want to log out of your account?",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              {t("auth.logout")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Header;
