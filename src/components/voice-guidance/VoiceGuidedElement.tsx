import React from 'react';
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
  // Function to handle focus
  const handleFocus = () => {
    speak(description, priority);
  };

  // Clone the child element and add onFocus handler
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onFocus: (e: React.FocusEvent) => {
          handleFocus();
          // Call the original onFocus if it exists
          if (child.props.onFocus) {
            child.props.onFocus(e);
          }
        }
      });
    }
    return child;
  });

  return (
    <div data-voice-description={description}>
      {childrenWithProps}
    </div>
  );
};

export default VoiceGuidedElement;