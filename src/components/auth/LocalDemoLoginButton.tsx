import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LocalDemoLoginButtonProps {
  userType?: "customer" | "helper" | "admin";
  className?: string;
}

const LocalDemoLoginButton = ({
  userType = "customer",
  className = "",
}: LocalDemoLoginButtonProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      let userData;

      // Create user data based on type
      switch (userType) {
        case "helper":
          userData = {
            id: "00000000-0000-0000-0000-000000000002",
            email: "helper@example.com",
            full_name: "Henry Helper",
            role: "helper",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Henry",
          };
          break;
        case "admin":
          userData = {
            id: "00000000-0000-0000-0000-000000000003",
            email: "admin@example.com",
            full_name: "Admin User",
            role: "admin",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
          };
          break;
        default: // customer/elderly
          userData = {
            id: "00000000-0000-0000-0000-000000000001",
            email: "martha@example.com",
            full_name: "Martha Johnson",
            role: "customer",
            avatar_url:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha",
          };
          break;
      }

      console.log(`Using local demo login as ${userType}`, userData);

      // Store user data in localStorage to simulate a login
      localStorage.setItem("senior_assist_user", JSON.stringify(userData));
      localStorage.setItem("senior_assist_auth_method", "local");

      // Set a fake session token
      localStorage.setItem(
        "senior_assist_session",
        JSON.stringify({
          access_token: "local_demo_token_" + userData.id,
          expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
          user: userData,
        }),
      );

      // Navigate to dashboard after successful login
      navigate("/");

      // Add a longer delay before reloading to ensure navigation completes
      setTimeout(() => {
        console.log("Reloading page to refresh auth state");
        window.location.reload(); // Force reload to ensure auth state is updated
      }, 1000);
    } catch (error: any) {
      console.error("Exception during local demo login:", error);
      alert(
        `Demo login failed: ${error.message}\n\nPlease check the console for more details.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleDemoLogin}
      className={`${className}`}
      disabled={isLoading}
    >
      {isLoading ? (
        "Logging in..."
      ) : (
        <>
          Local Login as{" "}
          {userType === "customer"
            ? "Senior"
            : userType === "helper"
              ? "Helper"
              : "Admin"}
        </>
      )}
    </Button>
  );
};

export default LocalDemoLoginButton;
