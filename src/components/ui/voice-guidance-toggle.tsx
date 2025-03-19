import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import {
  toggleVoiceGuidance,
  getVoiceGuidanceStatus,
  speak,
  initVoiceGuidance,
} from "@/lib/voice-guidance";

interface VoiceGuidanceToggleProps {
  className?: string;
}

const VoiceGuidanceToggle = ({ className = "" }: VoiceGuidanceToggleProps) => {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Initialize voice guidance when component mounts
    initVoiceGuidance();

    // Set initial state
    setEnabled(getVoiceGuidanceStatus().enabled);

    // Announce the feature when first loaded
    setTimeout(() => {
      speak(
        "Voice guidance is available. Click the speaker button to toggle voice guidance.",
      );
    }, 1000);
  }, []);

  const handleToggle = () => {
    const newState = toggleVoiceGuidance();
    setEnabled(newState);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full h-10 w-10 ${className}`}
      onClick={handleToggle}
      aria-label={enabled ? "Disable voice guidance" : "Enable voice guidance"}
      title={enabled ? "Disable voice guidance" : "Enable voice guidance"}
    >
      {enabled ? (
        <Volume2 className="h-5 w-5" />
      ) : (
        <VolumeX className="h-5 w-5" />
      )}
    </Button>
  );
};

export default VoiceGuidanceToggle;
