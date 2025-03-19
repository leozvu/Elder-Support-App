import React from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import {
  toggleVoiceGuidance,
  getVoiceGuidanceStatus,
  speak,
} from "@/lib/voice-guidance";

interface VoiceGuidanceButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

const VoiceGuidanceButton = ({
  className = "",
  size = "default",
  variant = "outline",
}: VoiceGuidanceButtonProps) => {
  const [enabled, setEnabled] = React.useState(
    () => getVoiceGuidanceStatus().enabled,
  );

  const handleToggle = () => {
    const newState = toggleVoiceGuidance();
    setEnabled(newState);
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleToggle}
      aria-label={enabled ? "Disable voice guidance" : "Enable voice guidance"}
      onMouseOver={() =>
        speak(enabled ? "Disable voice guidance" : "Enable voice guidance")
      }
    >
      {size === "icon" ? (
        enabled ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4" />
        )
      ) : (
        <>
          {enabled ? (
            <Volume2 className="h-4 w-4 mr-2" />
          ) : (
            <VolumeX className="h-4 w-4 mr-2" />
          )}
          {enabled ? "Voice On" : "Voice Off"}
        </>
      )}
    </Button>
  );
};

export default VoiceGuidanceButton;
