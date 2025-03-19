import React, { useRef, useEffect } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { speak } from "@/lib/voice-guidance";
import { getVoiceGuidanceStatus } from "@/lib/voice-guidance";

interface VoiceGuidedButtonProps extends ButtonProps {
  description: string;
  priority?: boolean;
  onFocus?: boolean;
  onHover?: boolean;
  onClick?: boolean;
}

const VoiceGuidedButton = ({
  description,
  priority = false,
  onFocus = true,
  onHover = true,
  onClick = false,
  children,
  ...props
}: VoiceGuidedButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { enabled } = getVoiceGuidanceStatus();

  useEffect(() => {
    const element = buttonRef.current;
    if (!element || !enabled) return;

    const handleFocus = () => {
      if (onFocus) speak(description, priority);
    };

    const handleMouseEnter = () => {
      if (onHover) speak(description, priority);
    };

    const handleClick = () => {
      if (onClick) speak(`${description} activated`, priority);
    };

    if (onFocus) element.addEventListener("focus", handleFocus);
    if (onHover) element.addEventListener("mouseenter", handleMouseEnter);
    if (onClick) element.addEventListener("click", handleClick);

    return () => {
      if (onFocus) element.removeEventListener("focus", handleFocus);
      if (onHover) element.removeEventListener("mouseenter", handleMouseEnter);
      if (onClick) element.removeEventListener("click", handleClick);
    };
  }, [description, priority, onFocus, onHover, onClick, enabled]);

  return (
    <Button ref={buttonRef} aria-label={description} {...props}>
      {children}
    </Button>
  );
};

export default VoiceGuidedButton;
