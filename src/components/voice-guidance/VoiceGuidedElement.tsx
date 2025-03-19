import React, { useRef, useEffect } from 'react';
import { speak } from '@/lib/voice-guidance';

interface VoiceGuidedElementProps {
  children: React.ReactNode;
  description: string;
  priority?: boolean;
}

const VoiceGuidedElement: React.FC<VoiceGuidedElementProps> = ({
  children,
  description,
  priority = false
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Check if voice guidance is enabled
  const isVoiceEnabled = () => {
    try {
      const settings = localStorage.getItem('accessibilitySettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        return parsed.voiceGuidance?.enabled || false;
      }
    } catch (e) {
      console.error('Error checking voice guidance settings:', e);
    }
    return false;
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleFocus = () => {
      if (isVoiceEnabled()) {
        speak(description, priority);
      }
    };

    // Find all focusable elements within this component
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    // Add event listeners to each focusable element
    focusableElements.forEach(el => {
      el.addEventListener('focus', handleFocus);
    });

    return () => {
      // Clean up event listeners
      focusableElements.forEach(el => {
        el.removeEventListener('focus', handleFocus);
      });
    };
  }, [description, priority]);

  return (
    <div ref={elementRef} data-voice-description={description}>
      {children}
    </div>
  );
};

export default VoiceGuidedElement;