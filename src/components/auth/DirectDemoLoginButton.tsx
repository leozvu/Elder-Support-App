import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { directSignIn, createDemoUsersDirect } from "@/lib/direct-auth";

interface DirectDemoLoginButtonProps {
  userType?: "customer" | "helper" | "admin";
  className?: string;
}

const DirectDemoLoginButton = ({
  userType = "customer",
  className = "",
}: DirectDemoLoginButtonProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      let email, password;

      // These credentials must match exactly with users in your Supabase database
      switch (userType) {
        case "helper":
          email = "helper@example.com";
          password = "password123";
          break;
        case "admin":
          email = "admin@example.com";
          password = "password123";
          break;
        default: // customer/elderly
          email = "martha@example.com";
          password = "password123";
          break;
      }

      console.log(
        `Using demo credentials - Email: ${email}, Password: ${password.replace(/./g, "*")}`,
      );

      // Try to create demo users first (will be skipped if they already exist)
      console.log("Ensuring demo users exist before login...");
      await createDemoUsersDirect();

      console.log(
        `Attempting direct API login as ${userType} with email: ${email}`,
      );

      // Clear local storage to ensure clean state
      localStorage.removeItem("supabase.auth.token");
      localStorage.removeItem("senior_assist_auth");

      // Wait a moment to ensure storage is cleared
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Attempt login using direct API
      const authResult = await directSignIn(email, password);

      if (!authResult.success) {
        console.error("Direct API demo login error:", authResult.error);
        console.error("Error details:", authResult.data);

        alert(
          `Demo login failed: ${authResult.error}\n\nPlease try again or use the debug tools to diagnose the issue.`,
        );
        setIsLoading(false);
        return;
      }

      console.log("Direct API demo login successful!");
      console.log(
        "Access token received:",
        authResult.data.access_token.substring(0, 10) + "...",
      );

      // Navigate to dashboard after successful login
      navigate("/");

      // Add a longer delay before reloading to ensure navigation completes
      setTimeout(() => {
        console.log("Reloading page to refresh auth state");
        window.location.reload(); // Force reload to ensure auth state is updated
      }, 1000);
    } catch (error: any) {
      console.error("Exception during direct API demo login:", error);
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
          API Login as{" "}
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

export default DirectDemoLoginButton;
