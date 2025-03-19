import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAccessibility } from './AccessibilityContext';
import { speak } from '@/lib/voice-guidance';

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  helpText?: string;
  errorText?: string;
}

const AccessibleInput: React.FC<AccessibleInputProps> = ({
  id,
  label,
  helpText,
  errorText,
  ...props
}) => {
  const { settings } = useAccessibility();
  const [isFocused, setIsFocused] = useState(false);
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    
    // Announce the field when focused with voice guidance
    if (settings.voiceGuidance.enabled) {
      const announcement = `${label} field. ${helpText || ''} ${errorText ? 'Error: ' + errorText : ''}`;
      speak(announcement);
    }
    
    if (props.onFocus) {
      props.onFocus(e);
    }
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id}
        className={settings.largeText ? 'text-lg' : ''}
      >
        {label}
      </Label>
      
      <Input
        id={id}
        aria-describedby={`${id}-help ${id}-error`}
        aria-invalid={!!errorText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`
          ${settings.largeText ? 'text-lg p-3' : ''}
          ${errorText ? 'border-red-500' : ''}
          ${isFocused ? 'ring-2 ring-primary' : ''}
        `}
        {...props}
      />
      
      {helpText && (
        <p 
          id={`${id}-help`} 
          className={`text-muted-foreground ${settings.largeText ? 'text-base' : 'text-sm'}`}
        >
          {helpText}
        </p>
      )}
      
      {errorText && (
        <p 
          id={`${id}-error`} 
          className={`text-red-500 ${settings.largeText ? 'text-base' : 'text-sm'}`}
        >
          {errorText}
        </p>
      )}
    </div>
  );
};

export default AccessibleInput;