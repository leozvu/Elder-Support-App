import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HelpCircle, Mic, MicOff, Volume2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { speak } from "@/lib/voice-guidance";
import { getVoiceGuidanceStatus } from "@/lib/voice-guidance";

interface AccessibleInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  helpText?: string;
  errorMessage?: string;
  onVoiceInput?: (text: string) => void;
  enableVoiceInput?: boolean;
  voiceInputPrompt?: string;
  voiceInputTimeout?: number; // in milliseconds
}

const AccessibleInput = ({
  id,
  label,
  helpText,
  errorMessage,
  className,
  onVoiceInput,
  enableVoiceInput = true,
  voiceInputPrompt,
  voiceInputTimeout = 5000,
  ...props
}: AccessibleInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { enabled: voiceGuidanceEnabled } = getVoiceGuidanceStatus();

  // Initialize speech recognition
  useEffect(() => {
    if (
      (typeof window !== "undefined" && "SpeechRecognition" in window) ||
      "webkitSpeechRecognition" in window
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = navigator.language || "en-US";

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcriptValue = result[0].transcript;
        setTranscript(transcriptValue);

        if (result.isFinal && onVoiceInput) {
          onVoiceInput(transcriptValue);
        }

        // Update input value directly
        if (inputRef.current) {
          inputRef.current.value = transcriptValue;
          // Trigger change event to update form state
          const event = new Event("input", { bubbles: true });
          inputRef.current.dispatchEvent(event);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (voiceGuidanceEnabled) {
          speak("Voice input error. Please try again.", true);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        if (isListening) {
          recognitionRef.current.abort();
        }
      }
    };
  }, [onVoiceInput, voiceGuidanceEnabled, isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      if (voiceGuidanceEnabled) {
        speak("Voice input is not supported in your browser.", true);
      }
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (voiceGuidanceEnabled) {
        speak("Voice input stopped.", true);
      }
    } else {
      // Clear previous transcript when starting new recording
      setTranscript("");

      // Announce what to say if prompt is provided
      if (voiceInputPrompt && voiceGuidanceEnabled) {
        speak(voiceInputPrompt, true);
      } else if (voiceGuidanceEnabled) {
        speak(`Please speak to enter ${label}`, true);
      }

      // Start listening after announcement
      setTimeout(
        () => {
          try {
            recognitionRef.current?.start();
            setIsListening(true);
          } catch (error) {
            console.error("Failed to start speech recognition:", error);
          }
        },
        voiceGuidanceEnabled ? 1000 : 0,
      );

      // Auto-stop after timeout if specified
      if (voiceInputTimeout > 0) {
        setTimeout(() => {
          if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }, voiceInputTimeout);
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);

    // Read label and help text aloud when focused
    if (voiceGuidanceEnabled && !sessionStorage.getItem(`read-${id}`)) {
      const textToRead = `${label}. ${helpText || ""}. ${enableVoiceInput ? "You can use voice input for this field." : ""}`;
      speak(textToRead);

      // Only read once per session
      sessionStorage.setItem(`read-${id}`, "true");
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (props.onBlur) props.onBlur(e);
  };

  const readCurrentValue = () => {
    if (inputRef.current && voiceGuidanceEnabled) {
      const value = inputRef.current.value;
      if (value) {
        speak(`Current value is: ${value}`);
      } else {
        speak("No value entered yet.");
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label
          htmlFor={id}
          className={`text-base ${props.required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ""} ${errorMessage ? "text-destructive" : ""}`}
        >
          {label}
        </Label>

        <div className="flex items-center space-x-1">
          {voiceGuidanceEnabled && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={readCurrentValue}
              title="Read current value"
            >
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}

          {helpText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{helpText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            id={id}
            ref={inputRef}
            className={`text-lg ${isFocused ? "border-primary" : ""} ${errorMessage ? "border-destructive" : ""} ${className || ""} ${isListening ? "pr-10 border-blue-400 bg-blue-50" : ""}`}
            aria-describedby={helpText ? `${id}-help` : undefined}
            aria-invalid={!!errorMessage}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {isListening && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-pulse">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          )}
        </div>

        {enableVoiceInput && (
          <Button
            type="button"
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            className={`h-10 w-10 rounded-full ${isListening ? "bg-red-500 hover:bg-red-600" : ""}`}
            onClick={toggleListening}
            title={isListening ? "Stop voice input" : "Start voice input"}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
          >
            {isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>

      {helpText && (
        <p id={`${id}-help`} className="text-sm text-muted-foreground">
          {helpText}
        </p>
      )}

      {errorMessage && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      {isListening && (
        <p className="text-sm text-blue-600 animate-pulse">
          Listening... {transcript ? `"${transcript}"` : ""}
        </p>
      )}
    </div>
  );
};

export default AccessibleInput;
