import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase, ensureDemoUsersExist } from "@/lib/supabase";

interface DemoLoginButtonProps {
  userType?: "customer" | "helper" | "admin";
  className?: string;
}

const DemoLoginButton = ({
  userType = "customer",
  className = "",
}: DemoLoginButtonProps) => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
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
      await ensureDemoUsersExist();

      // First sign out to clear any existing session
      await supabase.auth.signOut();

      // Clear local storage to ensure clean state
      localStorage.removeItem("senior_assist_auth");

      // Wait a moment to ensure signOut completes
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log(`Attempting demo login as ${userType} with email: ${email}`);

      // Attempt login
      const { data, error } = await signIn(email, password);

      if (error) {
        console.error("Demo login error:", error);
        alert(
          `Demo login failed: ${error.message}\n\nPlease try recreating the demo users.`,
        );
        setIsLoading(false);
        return;
      }

      console.log("Demo login successful:", data);

      // Navigate to dashboard after successful login
      navigate("/");
    } catch (error: any) {
      console.error("Exception during demo login:", error);
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
          Demo Login as{" "}
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

export default DemoLoginButton;
