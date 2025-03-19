import React, { useRef, useEffect } from 'react';
import { useAccessibility } from '@/components/accessibility/AccessibilityContext';
import { speak } from '@/lib/voice-guidance';

interface VoiceGuidedElementProps {
  children: React.ReactNode;
  description: string;
  priority?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

const VoiceGuidedElement: React.FC<VoiceGuidedElementProps> = ({
  children,
  description,
  priority = false,
  onFocus,
  onBlur
}) => {
  const { settings } = useAccessibility();
  const elementRef = useRef<HTMLDivElement>(null);
  const isVoiceEnabled = settings.voiceGuidance.enabled;

  // Handle focus events
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleFocus = () => {
      if (isVoiceEnabled) {
        speak(description, priority);
      }
      if (onFocus) onFocus();
    };

    const handleBlur = () => {
      if (onBlur) onBlur();
    };

    // Find all focusable elements within this component
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    // Add event listeners to each focusable element
    focusableElements.forEach(el => {
      el.addEventListener('focus', handleFocus);
      el.addEventListener('blur', handleBlur);
    });

    return () => {
      // Clean up event listeners
      focusableElements.forEach(el => {
        el.removeEventListener('focus', handleFocus);
        el.removeEventListener('blur', handleBlur);
      });
    };
  }, [description, isVoiceEnabled, priority, onFocus, onBlur]);

  return (
    <div ref={elementRef} data-voice-description={description}>
      {children}
    </div>
  );
};

export default VoiceGuidedElement;