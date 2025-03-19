import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { updateVoiceSettings } from "@/lib/voice-guidance";

interface VoiceGuidanceSettings {
  enabled: boolean;
  volume: number;
  rate: number;
  pitch: number;
  voice: any;
  autoReadPageContent: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  largePointer: boolean;
  simplifiedNavigation: boolean;
  voiceGuidance: VoiceGuidanceSettings;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: AccessibilitySettings) => void;
}

export const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  largePointer: false,
  simplifiedNavigation: false,
  voiceGuidance: {
    enabled: false,
    volume: 1,
    rate: 1,
    pitch: 1,
    voice: null,
    autoReadPageContent: false,
  },
};

// Create the context with a default value
const AccessibilityContext = createContext<AccessibilityContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
});

// Custom hook to use the accessibility context
export const useAccessibility = () => useContext(AccessibilityContext);

// Provider component - using function declaration for Fast Refresh compatibility
function AccessibilityProvider({ children }: { children: ReactNode }) {
  // Try to load settings from localStorage first
  const loadInitialSettings = (): AccessibilitySettings => {
    try {
      const savedSettings = localStorage.getItem("accessibilitySettings");
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        console.log("Loaded settings from localStorage:", parsedSettings);

        // Update voice settings if voice guidance is enabled
        if (
          parsedSettings.voiceGuidance &&
          parsedSettings.voiceGuidance.enabled
        ) {
          updateVoiceSettings({
            rate: parsedSettings.voiceGuidance.rate,
            pitch: parsedSettings.voiceGuidance.pitch,
          });
        }

        return parsedSettings;
      }
    } catch (error) {
      console.error("Failed to load accessibility settings:", error);
    }
    return defaultSettings;
  };

  const [settings, setSettings] = useState<AccessibilitySettings>(
    loadInitialSettings(),
  );

  const updateSettings = (newSettings: AccessibilitySettings) => {
    setSettings(newSettings);
    // Save to localStorage
    try {
      localStorage.setItem(
        "accessibilitySettings",
        JSON.stringify(newSettings),
      );

      // Update voice settings if voice guidance is enabled
      if (newSettings.voiceGuidance && newSettings.voiceGuidance.enabled) {
        updateVoiceSettings({
          rate: newSettings.voiceGuidance.rate,
          pitch: newSettings.voiceGuidance.pitch,
        });
      }
    } catch (error) {
      console.error("Failed to save accessibility settings:", error);
    }
    console.log("Settings updated:", newSettings);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// Export the provider and context consistently
export { AccessibilityProvider };
export default AccessibilityContext;
