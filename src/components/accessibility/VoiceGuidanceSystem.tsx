import React, { useEffect } from "react";
import { updateVoiceSettings, initVoiceGuidance } from "@/lib/voice-guidance";
import { useVoiceGuidance as importedUseVoiceGuidance } from "@/hooks/useVoiceGuidance";

// Re-export the useVoiceGuidance hook
export const useVoiceGuidance = importedUseVoiceGuidance;

interface VoiceGuidanceSystemProps {
  children: React.ReactNode;
  enabled: boolean;
  volume?: number;
  rate?: number;
  pitch?: number;
  autoReadPageContent?: boolean;
  onSettingsChange?: (settings: any) => void;
}

const VoiceGuidanceSystem: React.FC<VoiceGuidanceSystemProps> = ({
  children,
  enabled,
  volume = 1,
  rate = 1,
  pitch = 1,
  autoReadPageContent = false,
  onSettingsChange,
}) => {
  // Initialize voice guidance system on mount
  useEffect(() => {
    initVoiceGuidance();
  }, []);

  // Update voice settings when props change
  useEffect(() => {
    if (enabled) {
      updateVoiceSettings({ rate, pitch });
      if (onSettingsChange) {
        onSettingsChange({ enabled, volume, rate, pitch, autoReadPageContent });
      }
    }
  }, [enabled, volume, rate, pitch, autoReadPageContent, onSettingsChange]);

  // Auto-read page content if enabled
  useEffect(() => {
    if (enabled && autoReadPageContent) {
      // This would need a more sophisticated implementation to extract
      // meaningful content from the page to read aloud
      // For now, we'll leave this as a placeholder
    }
  }, [enabled, autoReadPageContent]);

  return <>{children}</>;
};

export default VoiceGuidanceSystem;
