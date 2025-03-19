import React from "react";
import { useLocation } from "react-router-dom";
import { announcePageChange } from "@/lib/voice-guidance";
import { getVoiceGuidanceStatus } from "@/lib/voice-guidance";

interface VoiceGuidedNavigationProps {
  children: React.ReactNode;
  pageNames?: Record<string, string>;
}

const VoiceGuidedNavigation = ({
  children,
  pageNames = {},
}: VoiceGuidedNavigationProps) => {
  const location = useLocation();
  const { enabled } = getVoiceGuidanceStatus();

  // Announce page changes when location changes
  React.useEffect(() => {
    if (!enabled) return;

    const pageName = getPageNameFromPath(location.pathname, pageNames);
    if (pageName) {
      announcePageChange(pageName);
    }
  }, [location.pathname, pageNames, enabled]);

  // Helper function to get a friendly page name from the path
  const getPageNameFromPath = (
    path: string,
    customNames: Record<string, string>,
  ): string => {
    // Check if we have a custom name for this path
    if (customNames[path]) {
      return customNames[path];
    }

    // Remove leading slash and split by remaining slashes
    const segments = path.replace(/^\//, "").split("/");
    if (segments[0] === "") return "Home";

    // Convert kebab-case to spaces and capitalize first letter of each word
    return segments[0]
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return <>{children}</>;
};

export default VoiceGuidedNavigation;
