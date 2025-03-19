import React from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AuthStatus = () => {
  const { user, userDetails, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate("/login")}>
          Sign In
        </Button>
        <Button onClick={() => navigate("/register")}>Register</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm">
        <span className="text-gray-500">Signed in as </span>
        <span className="font-medium">
          {userDetails?.full_name || user.email}
        </span>
      </div>
      <Button variant="outline" size="sm" onClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  );
};

export default AuthStatus;
