import React, { useRef, useEffect } from "react";
import { Link, LinkProps } from "react-router-dom";
import { speak } from "@/lib/voice-guidance";
import { getVoiceGuidanceStatus } from "@/lib/voice-guidance";

interface VoiceGuidedLinkProps extends LinkProps {
  description: string;
  priority?: boolean;
  onFocus?: boolean;
  onHover?: boolean;
  onClick?: boolean;
}

const VoiceGuidedLink = ({
  description,
  priority = false,
  onFocus = true,
  onHover = true,
  onClick = false,
  children,
  ...props
}: VoiceGuidedLinkProps) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const { enabled } = getVoiceGuidanceStatus();

  useEffect(() => {
    const element = linkRef.current;
    if (!element || !enabled) return;

    const handleFocus = () => {
      if (onFocus) speak(description, priority);
    };

    const handleMouseEnter = () => {
      if (onHover) speak(description, priority);
    };

    const handleClick = () => {
      if (onClick) speak(description, priority);
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
    <Link ref={linkRef} aria-label={description} {...props}>
      {children}
    </Link>
  );
};

export default VoiceGuidedLink;
