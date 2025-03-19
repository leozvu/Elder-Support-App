import React, { createContext, useContext, useState, useEffect } from "react";
import {
  speak,
  stopSpeaking,
  toggleVoiceGuidance,
  updateVoiceSettings,
  getVoiceGuidanceStatus,
  announcePageChange,
  announceAction,
  announceNotification,
  readFormField,
} from "@/lib/voice-guidance";

interface VoiceGuidanceContextType {
  enabled: boolean;
  rate: number;
  pitch: number;
  toggleGuidance: () => boolean;
  updateSettings: (settings: { rate?: number; pitch?: number }) => void;
  speak: (text: string, priority?: boolean) => void;
  stopSpeaking: () => void;
  announcePageChange: (pageName: string) => void;
  announceAction: (action: string) => void;
  announceNotification: (title: string, description?: string) => void;
  readFormField: (label: string, value?: string) => void;
}

const VoiceGuidanceContext = createContext<
  VoiceGuidanceContextType | undefined
>(undefined);

export const useVoiceGuidance = () => {
  const context = useContext(VoiceGuidanceContext);
  if (context === undefined) {
    throw new Error(
      "useVoiceGuidance must be used within a VoiceGuidanceProvider",
    );
  }
  return context;
};

interface VoiceGuidanceProviderProps {
  children: React.ReactNode;
  initialSettings?: {
    enabled?: boolean;
    rate?: number;
    pitch?: number;
  };
}

export const VoiceGuidanceProvider = ({
  children,
  initialSettings,
}: VoiceGuidanceProviderProps) => {
  const [status, setStatus] = useState(() => {
    const currentStatus = getVoiceGuidanceStatus();

    // Apply initial settings if provided
    if (initialSettings) {
      if (
        initialSettings.rate !== undefined ||
        initialSettings.pitch !== undefined
      ) {
        updateVoiceSettings({
          rate: initialSettings.rate,
          pitch: initialSettings.pitch,
        });
      }

      // If enabled status is explicitly provided, set it
      if (
        initialSettings.enabled !== undefined &&
        initialSettings.enabled !== currentStatus.enabled
      ) {
        toggleVoiceGuidance();
      }
    }

    return getVoiceGuidanceStatus();
  });

  // Update local state when voice guidance settings change
  const refreshStatus = () => {
    setStatus(getVoiceGuidanceStatus());
  };

  const handleToggleGuidance = () => {
    const newState = toggleVoiceGuidance();
    refreshStatus();
    return newState;
  };

  const handleUpdateSettings = (settings: {
    rate?: number;
    pitch?: number;
  }) => {
    updateVoiceSettings(settings);
    refreshStatus();
  };

  const value = {
    enabled: status.enabled,
    rate: status.rate,
    pitch: status.pitch,
    toggleGuidance: handleToggleGuidance,
    updateSettings: handleUpdateSettings,
    speak,
    stopSpeaking,
    announcePageChange,
    announceAction,
    announceNotification,
    readFormField,
  };

  return (
    <VoiceGuidanceContext.Provider value={value}>
      {children}
    </VoiceGuidanceContext.Provider>
  );
};

export default VoiceGuidanceContext;
