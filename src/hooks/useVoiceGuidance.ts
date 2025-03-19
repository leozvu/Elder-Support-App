import { useState, useEffect, useCallback } from 'react';
import { 
  speak, 
  stopSpeaking, 
  updateVoiceSettings, 
  getAvailableVoices,
  isVoiceGuidanceEnabled
} from '@/lib/voice-guidance';

export function useVoiceGuidance() {
  const [enabled, setEnabled] = useState(isVoiceGuidanceEnabled());
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Load available voices
  useEffect(() => {
    setVoices(getAvailableVoices());
    
    // Set up a listener for voice changes
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const handleVoicesChanged = () => {
        setVoices(getAvailableVoices());
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

  // Speak text
  const speakText = useCallback((text: string, priority = false) => {
    if (!enabled) return false;
    return speak(text, priority);
  }, [enabled]);

  // Stop speaking
  const stop = useCallback(() => {
    stopSpeaking();
  }, []);

  // Toggle enabled state
  const toggle = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);

  return {
    enabled,
    setEnabled,
    volume,
    setVolume,
    rate,
    setRate,
    pitch,
    setPitch,
    voices,
    selectedVoice,
    setSelectedVoice,
    speak: speakText,
    stop,
    toggle
  };
}