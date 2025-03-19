import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Volume2, HelpCircle } from "lucide-react";
import { speak, getVoiceGuidanceStatus } from "@/lib/voice-guidance";
import { readFormField } from "@/lib/voice-guidance";

interface VoiceGuidedFormProps {
  children: React.ReactNode;
  formTitle: string;
  formDescription?: string;
  onSubmitMessage?: string;
  className?: string;
  tutorialFeature?: string;
}

const VoiceGuidedForm = ({
  children,
  formTitle,
  formDescription,
  onSubmitMessage = "Form submitted successfully",
  className = "",
  tutorialFeature,
}: VoiceGuidedFormProps) => {
  const formRef = React.useRef<HTMLFormElement>(null);
  const { enabled } = getVoiceGuidanceStatus();
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const form = formRef.current;
    if (!form || !enabled) return;

    // Announce form when it receives focus
    const handleFormFocus = (e: FocusEvent) => {
      // Only announce if the form itself (not a child) receives focus
      if (e.target === form) {
        const announcement = formDescription
          ? `${formTitle}. ${formDescription}`
          : formTitle;
        speak(announcement, true);
      }
    };

    // Handle form submission
    const handleSubmit = (e: Event) => {
      if (onSubmitMessage) {
        speak(onSubmitMessage, true);
      }
    };

    form.addEventListener("focus", handleFormFocus, true);
    form.addEventListener("submit", handleSubmit);

    return () => {
      form.removeEventListener("focus", handleFormFocus, true);
      form.removeEventListener("submit", handleSubmit);
    };
  }, [formTitle, formDescription, onSubmitMessage, enabled]);

  const startTutorial = () => {
    setShowTutorial(true);
    if (tutorialFeature && enabled) {
      speak(`Starting tutorial for ${tutorialFeature}`, true);
    }
  };

  return (
    <div className={className}>
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">{formTitle}</CardTitle>
            {enabled && tutorialFeature && (
              <Button
                variant="outline"
                size="sm"
                onClick={startTutorial}
                className="flex items-center"
              >
                <HelpCircle className="h-4 w-4 mr-1" /> Voice Guide
              </Button>
            )}
          </div>
          {formDescription && (
            <p className="text-muted-foreground">{formDescription}</p>
          )}
        </CardHeader>
        <CardContent>
          <form
            ref={formRef}
            className={className}
            aria-label={formTitle}
            aria-describedby={
              formDescription
                ? `${formTitle.replace(/\s+/g, "-").toLowerCase()}-desc`
                : undefined
            }
          >
            {formDescription && (
              <div
                id={`${formTitle.replace(/\s+/g, "-").toLowerCase()}-desc`}
                className="sr-only"
              >
                {formDescription}
              </div>
            )}
            {children}
          </form>
        </CardContent>
      </Card>

      {showTutorial && tutorialFeature && (
        <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center mb-2">
            <Volume2 className="h-5 w-5 mr-2 text-primary" />
            <h3 className="font-medium">Voice Guidance Tutorial</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Step-by-step voice guidance is now active. Listen to the
            instructions and follow along. You can use the voice input buttons
            next to form fields to speak instead of typing.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => setShowTutorial(false)}
          >
            Close Tutorial
          </Button>
        </div>
      )}
    </div>
  );
};

export default VoiceGuidedForm;
