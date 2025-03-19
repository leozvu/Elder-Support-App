import React, { useRef, useEffect } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { getVoiceGuidanceStatus } from "@/lib/voice-guidance";
import { speak } from '@/lib/voice-guidance';

interface VoiceGuidedButtonProps extends ButtonProps {
  description: string;
  priority?: boolean;
}

const VoiceGuidedButton: React.FC<VoiceGuidedButtonProps> = ({
  description,
  priority = false,
  onClick,
  children,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Handle focus event
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    
    const handleFocus = () => {
      const status = getVoiceGuidanceStatus();
      if (status.enabled) {
        speak(description, priority);
      }
    };
    
    button.addEventListener('focus', handleFocus);
    
    return () => {
      button.removeEventListener('focus', handleFocus);
    };
  }, [description, priority]);
  
  // Handle click event
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const status = getVoiceGuidanceStatus();
    if (status.enabled) {
      speak(description, priority);
    }
    
    if (onClick) {
      onClick(e);
    }
  };
  
  return (
    <Button
      ref={buttonRef}
      onClick={handleClick}
      data-voice-description={description}
      {...props}
    >
      {children}
    </Button>
  );
};

export default VoiceGuidedButton;