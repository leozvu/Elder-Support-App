import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import {
  toggleVoiceGuidance,
  getVoiceGuidanceStatus,
  speak
} from '@/lib/voice-guidance';

interface VoiceGuidanceButtonProps {
  className?: string;
}

const VoiceGuidanceButton: React.FC<VoiceGuidanceButtonProps> = ({ className = '' }) => {
  const [enabled, setEnabled] = useState(false);
  
  // Initialize state from voice guidance system
  useEffect(() => {
    const status = getVoiceGuidanceStatus();
    setEnabled(status.enabled);
  }, []);
  
  const handleToggle = () => {
    const newState = toggleVoiceGuidance();
    setEnabled(newState);
    
    if (newState) {
      // No need to speak here as toggleVoiceGuidance already does this
    }
  };
  
  return (
    <Button
      variant={enabled ? "default" : "outline"}
      size="icon"
      onClick={handleToggle}
      aria-label={enabled ? "Disable voice guidance" : "Enable voice guidance"}
      title={enabled ? "Disable voice guidance" : "Enable voice guidance"}
      className={className}
    >
      {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </Button>
  );
};

export default VoiceGuidanceButton;