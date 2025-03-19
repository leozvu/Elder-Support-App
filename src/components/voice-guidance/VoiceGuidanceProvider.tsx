import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  speak,
  stopSpeaking,
  getVoiceGuidanceStatus,
  updateVoiceSettings,
  getAvailableVoices
} from '@/lib/voice-guidance';

// Define the context type
interface VoiceGuidanceContextType {
  enabled: boolean;
  volume: number;
  rate: number;
  pitch: number;
  toggleEnabled: () => void;
  setVolume: (volume: number) => void;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  speak: (text: string, priority?: boolean) => boolean;
  stop: () => void;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setVoice: (voice: SpeechSynthesisVoice | null) => void;
}

// Create the context with default values
const VoiceGuidanceContext = createContext<VoiceGuidanceContextType>({
  enabled: false,
  volume: 1,
  rate: 1,
  pitch: 1,
  toggleEnabled: () => {},
  setVolume: () => {},
  setRate: () => {},
  setPitch: () => {},
  speak: () => false,
  stop: () => {},
  availableVoices: [],
  selectedVoice: null,
  setVoice: () => {},
});

// Provider component
export const VoiceGuidanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get initial state from the voice guidance system
  const initialStatus = getVoiceGuidanceStatus();
  
  const [enabled, setEnabled] = useState(initialStatus.enabled);
  const [volume, setVolume] = useState(initialStatus.volume);
  const [rate, setRate] = useState(initialStatus.rate);
  const [pitch, setPitch] = useState(initialStatus.pitch);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(initialStatus.voice);

  // Load available voices
  useEffect(() => {
    setAvailableVoices(getAvailableVoices());
    
    // Set up a listener for voice changes
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const handleVoicesChanged = () => {
        setAvailableVoices(getAvailableVoices());
      };
      
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  // Update settings when any parameter changes
  useEffect(() => {
    updateVoiceSettings({
      enabled,
      volume,
      rate,
      pitch,
      voice: selectedVoice
    });
  }, [enabled, volume, rate, pitch, selectedVoice]);

  // Toggle enabled state
  const toggleEnabled = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    
    if (newEnabled) {
      speak('Voice guidance enabled', true);
    }
  };

  // Set volume
  const handleSetVolume = (newVolume: number) => {
    setVolume(newVolume);
  };

  // Set rate
  const handleSetRate = (newRate: number) => {
    setRate(newRate);
  };

  // Set pitch
  const handleSetPitch = (newPitch: number) => {
    setPitch(newPitch);
  };

  // Set voice
  const handleSetVoice = (voice: SpeechSynthesisVoice | null) => {
    setSelectedVoice(voice);
  };

  // Speak text
  const handleSpeak = (text: string, priority = false) => {
    return speak(text, priority);
  };

  // Stop speaking
  const handleStop = () => {
    stopSpeaking();
  };

  // Context value
  const value = {
    enabled,
    volume,
    rate,
    pitch,
    toggleEnabled,
    setVolume: handleSetVolume,
    setRate: handleSetRate,
    setPitch: handleSetPitch,
    speak: handleSpeak,
    stop: handleStop,
    availableVoices,
    selectedVoice,
    setVoice: handleSetVoice,
  };

  return (
    <VoiceGuidanceContext.Provider value={value}>
      {children}
    </VoiceGuidanceContext.Provider>
  );
};

// Hook to use the voice guidance context
export const useVoiceGuidance = () => {
  const context = useContext(VoiceGuidanceContext);
  if (!context) {
    throw new Error('useVoiceGuidance must be used within a VoiceGuidanceProvider');
  }
  return context;
};