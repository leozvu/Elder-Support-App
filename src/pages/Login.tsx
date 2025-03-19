import React, { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import DemoCredentials from "@/components/auth/DemoCredentials";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [showCredentials, setShowCredentials] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Senior Assist
          </h1>
          <p className="text-xl text-gray-600">
            Welcome back! Sign in to continue.
          </p>
          <Button
            variant="link"
            className="text-sm text-primary mt-2"
            onClick={() => setShowCredentials(!showCredentials)}
          >
            {showCredentials
              ? "Hide Demo Credentials"
              : "Show Demo Credentials"}
          </Button>
        </div>

        {showCredentials && <DemoCredentials />}
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
