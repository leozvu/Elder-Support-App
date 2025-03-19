import React, { useRef, useEffect, useState } from "react";
import { speak } from "@/lib/voice-guidance";
import { getVoiceGuidanceStatus } from "@/lib/voice-guidance";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";

interface VoiceGuidedElementProps {
  description: string;
  children: React.ReactNode;
  priority?: boolean;
  onFocus?: boolean;
  onHover?: boolean;
  onClick?: boolean;
  className?: string;
  showSpeakButton?: boolean;
  detailedDescription?: string;
  role?: string;
  enhancedA11y?: boolean;
}

const VoiceGuidedElement = ({
  description,
  children,
  priority = false,
  onFocus = true,
  onHover = true,
  onClick = false,
  className = "",
  showSpeakButton = false,
  detailedDescription,
  role,
  enhancedA11y = false,
}: VoiceGuidedElementProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { enabled } = getVoiceGuidanceStatus();
  const [hasFocus, setHasFocus] = useState(false);
  const [hasHover, setHasHover] = useState(false);

  // Generate a unique ID for this element
  const uniqueId = useRef(
    `voice-guided-${Math.random().toString(36).substring(2, 11)}`,
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleFocus = () => {
      setHasFocus(true);
      if (enabled && onFocus) speak(description, priority);
    };

    const handleBlur = () => {
      setHasFocus(false);
    };

    const handleMouseEnter = () => {
      setHasHover(true);
      if (enabled && onHover) speak(description, priority);
    };

    const handleMouseLeave = () => {
      setHasHover(false);
    };

    const handleClick = () => {
      if (enabled && onClick) speak(description, priority);
    };

    // Add event listeners
    if (onFocus) {
      element.addEventListener("focus", handleFocus, true);
      element.addEventListener("blur", handleBlur, true);
    }

    if (onHover) {
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
    }

    if (onClick) {
      element.addEventListener("click", handleClick);
    }

    return () => {
      // Remove event listeners
      if (onFocus) {
        element.removeEventListener("focus", handleFocus, true);
        element.removeEventListener("blur", handleBlur, true);
      }

      if (onHover) {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      }

      if (onClick) {
        element.removeEventListener("click", handleClick);
      }
    };
  }, [description, priority, onFocus, onHover, onClick, enabled]);

  const handleSpeakButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events
    speak(detailedDescription || description, true);
  };

  return (
    <div
      ref={elementRef}
      className={`${className} ${enhancedA11y && hasFocus ? "ring-2 ring-primary ring-offset-2" : ""} ${enhancedA11y && hasHover ? "outline outline-1 outline-primary/50" : ""}`}
      aria-label={description}
      role={role}
      id={uniqueId.current}
      tabIndex={enhancedA11y ? 0 : undefined}
      aria-describedby={
        detailedDescription ? `${uniqueId.current}-desc` : undefined
      }
    >
      {children}

      {/* Hidden detailed description for screen readers */}
      {detailedDescription && (
        <span id={`${uniqueId.current}-desc`} className="sr-only">
          {detailedDescription}
        </span>
      )}

      {/* Optional speak button */}
      {showSpeakButton && enabled && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 absolute top-1 right-1 opacity-70 hover:opacity-100"
          onClick={handleSpeakButtonClick}
          aria-label="Read description aloud"
        >
          <Volume2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default VoiceGuidedElement;
