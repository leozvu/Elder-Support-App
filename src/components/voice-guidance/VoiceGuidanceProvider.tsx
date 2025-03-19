import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  initVoiceGuidance,
  announcePageChange,
  getVoiceGuidanceStatus,
  speak,
} from "@/lib/voice-guidance";

interface VoiceGuidanceContextType {
  enabled: boolean;
  toggleGuidance: () => void;
  announceElement: (text: string) => void;
}

export const VoiceGuidanceContext = createContext<VoiceGuidanceContextType>({
  enabled: true,
  toggleGuidance: () => {},
  announceElement: () => {},
});

export const useVoiceGuidance = () => useContext(VoiceGuidanceContext);

interface VoiceGuidanceProviderProps {
  children: React.ReactNode;
}

export const VoiceGuidanceProvider = ({
  children,
}: VoiceGuidanceProviderProps) => {
  const [enabled, setEnabled] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Initialize voice guidance
    initVoiceGuidance();
    setEnabled(getVoiceGuidanceStatus().enabled);
  }, []);

  // Announce page changes
  useEffect(() => {
    const pageName = getPageNameFromPath(location.pathname);
    if (pageName) {
      announcePageChange(pageName);
    }
  }, [location.pathname]);

  const toggleGuidance = () => {
    const newState = !enabled;
    setEnabled(newState);
    return newState;
  };

  const announceElement = (text: string) => {
    if (enabled) {
      speak(text);
    }
  };

  // Helper function to get a friendly page name from the path
  const getPageNameFromPath = (path: string): string => {
    // Remove leading slash and split by remaining slashes
    const segments = path.replace(/^\//, "").split("/");
    if (segments[0] === "") return "Home";

    // Convert kebab-case to spaces and capitalize first letter of each word
    return segments[0]
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <VoiceGuidanceContext.Provider
      value={{ enabled, toggleGuidance, announceElement }}
    >
      {children}
    </VoiceGuidanceContext.Provider>
  );
};

export default VoiceGuidanceProvider;
