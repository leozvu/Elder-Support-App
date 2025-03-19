import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
      <h1 className="text-9xl font-bold text-gray-300">404</h1>
      <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
      <p className="text-gray-600 mt-2 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-4 mt-8">
        <Button asChild variant="outline">
          <Link to="-1" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Link>
        </Button>
        <Button asChild>
          <Link to="/dashboard" className="flex items-center">
            <Home className="mr-2 h-4 w-4" /> Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
