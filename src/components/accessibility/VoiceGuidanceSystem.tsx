import React, { useEffect } from "react";
import { updateVoiceSettings, initVoiceGuidance, speak } from "@/lib/voice-guidance";

export interface VoiceSettings {
  enabled: boolean;
  volume: number;
  rate: number;
  pitch: number;
  voice: SpeechSynthesisVoice | null;
  autoReadPageContent: boolean;
}

interface VoiceGuidanceSystemProps {
  children: React.ReactNode;
  enabled: boolean;
  volume?: number;
  rate?: number;
  pitch?: number;
  autoReadPageContent?: boolean;
  onSettingsChange?: (settings: VoiceSettings) => void;
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
    updateVoiceSettings({ 
      enabled, 
      volume, 
      rate, 
      pitch, 
      autoReadPageContent 
    });
    
    if (onSettingsChange) {
      onSettingsChange({ 
        enabled, 
        volume, 
        rate, 
        pitch, 
        voice: null, 
        autoReadPageContent 
      });
    }
    
    // Announce when voice guidance is enabled
    if (enabled) {
      speak("Voice guidance is now active", true);
    }
  }, [enabled, volume, rate, pitch, autoReadPageContent, onSettingsChange]);

  return <>{children}</>;
};

export default VoiceGuidanceSystem;
export type { VoiceSettings };