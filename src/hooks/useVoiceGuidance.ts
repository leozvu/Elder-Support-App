import { useContext } from "react";
import VoiceGuidanceContext from "@/components/voice-guidance/VoiceGuidanceContext";
import {
  speak,
  readFormField,
  announceAction,
  announceNotification,
  announcePageChange,
  stopSpeaking,
} from "@/lib/voice-guidance";

// Custom hook for voice guidance functionality
export const useVoiceGuidance = () => {
  const context = useContext(VoiceGuidanceContext);

  if (context === undefined) {
    throw new Error(
      "useVoiceGuidance must be used within a VoiceGuidanceProvider",
    );
  }

  return {
    ...context,
    speak: (text: string, priority?: boolean) => speak(text, priority),
    readFormField: (label: string, value?: string) =>
      readFormField(label, value),
    announceAction: (action: string) => announceAction(action),
    announceNotification: (title: string, description?: string) =>
      announceNotification(title, description),
    announcePageChange: (pageName: string) => announcePageChange(pageName),
    stopSpeaking: () => stopSpeaking(),
  };
};

export default useVoiceGuidance;
