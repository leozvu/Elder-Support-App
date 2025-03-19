import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { RefreshCw } from "lucide-react";

interface LoadingScreenProps {
  fullScreen?: boolean;
  text?: string;
  spinnerSize?: "sm" | "md" | "lg";
  className?: string;
  bgClassName?: string;
  timeout?: number; // Auto-hide timeout in milliseconds
  onTimeout?: () => void; // Callback when timeout occurs
  showRetryButton?: boolean; // Whether to show a retry button
  onRetry?: () => void; // Callback when retry button is clicked
}

const LoadingScreen = ({
  fullScreen = true,
  text = "Loading...",
  spinnerSize = "lg",
  className = "",
  bgClassName = "bg-gray-100",
  timeout = 0, // 0 means no timeout
  onTimeout,
  showRetryButton = false,
  onRetry,
}: LoadingScreenProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  const containerClasses = cn(
    "flex items-center justify-center",
    fullScreen ? "fixed inset-0 z-50" : "w-full h-full",
    bgClassName,
    className,
  );

  // Safety timeout to prevent infinite loading states
  useEffect(() => {
    if (timeout > 0) {
      console.log(`LoadingScreen: Setting timeout for ${timeout}ms`);
      const timer = setTimeout(() => {
        console.log(
          "LoadingScreen: Timeout reached, calling onTimeout callback",
        );
        if (onTimeout) {
          onTimeout();
        }
      }, timeout);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [timeout, onTimeout]);

  // Track elapsed time for user feedback
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1;
        // Show help message after 8 seconds
        if (newTime === 8) {
          setShowHelp(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle retry button click
  const handleRetry = () => {
    console.log("Retry button clicked");
    if (onRetry) {
      onRetry();
    } else {
      // Default behavior: reload the page
      window.location.reload();
    }
  };

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className="text-center bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">{text}</p>

        {elapsedTime > 3 && (
          <p className="text-sm text-gray-500 mt-4">
            Time elapsed: {elapsedTime} seconds
          </p>
        )}

        {showHelp && (
          <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
            <p>
              This is taking longer than expected. There might be an issue with
              the authentication service.
            </p>
          </div>
        )}

        {(showRetryButton || elapsedTime > 10) && (
          <div className="mt-4">
            <Button
              onClick={handleRetry}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Retry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
