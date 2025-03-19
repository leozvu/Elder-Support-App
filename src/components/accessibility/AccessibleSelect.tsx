import React, { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface SelectOption {
  value: string;
  label: string;
}

interface AccessibleSelectProps {
  id: string;
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  helpText?: string;
  errorMessage?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  enableVoiceInput?: boolean;
  voiceInputPrompt?: string;
}

const AccessibleSelect = ({
  id,
  label,
  options,
  value,
  onChange,
  helpText,
  errorMessage,
  required = false,
  placeholder = "Select an option",
  disabled = false,
  enableVoiceInput = true,
  voiceInputPrompt,
}: AccessibleSelectProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { enabled: voiceGuidanceEnabled } = getVoiceGuidanceStatus();
  const [isOpen, setIsOpen] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
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

        if (result.isFinal) {
          // Try to match the transcript to an option
          const normalizedTranscript = transcriptValue.toLowerCase().trim();

          // First try exact match on label
          let matchedOption = options.find(
            (opt) => opt.label.toLowerCase() === normalizedTranscript,
          );

          // If no exact match, try to find a partial match
          if (!matchedOption) {
            matchedOption = options.find(
              (opt) =>
                opt.label.toLowerCase().includes(normalizedTranscript) ||
                normalizedTranscript.includes(opt.label.toLowerCase()),
            );
          }

          if (matchedOption) {
            onChange(matchedOption.value);
            if (voiceGuidanceEnabled) {
              speak(`Selected: ${matchedOption.label}`, true);
            }
            setIsOpen(false);
          } else {
            if (voiceGuidanceEnabled) {
              speak(
                "Sorry, I couldn't find that option. Please try again or select manually.",
                true,
              );
            }
          }

          // Stop listening after processing
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
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
  }, [options, onChange, voiceGuidanceEnabled, isListening]);

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

      // Open the select dropdown to show options
      setIsOpen(true);

      // Read available options
      if (voiceGuidanceEnabled) {
        const optionsText = options.map((opt) => opt.label).join(", ");
        const promptText =
          voiceInputPrompt ||
          `Please say one of the following options for ${label}: ${optionsText}`;
        speak(promptText, true);
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
        voiceGuidanceEnabled ? 2000 : 0,
      );

      // Auto-stop after timeout
      setTimeout(() => {
        if (isListening && recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, 8000); // Give more time to speak an option
    }
  };

  const handleFocus = () => {
    setIsFocused(true);

    // Read label and help text aloud when focused
    if (voiceGuidanceEnabled && !sessionStorage.getItem(`read-${id}`)) {
      const textToRead = `${label} dropdown. ${helpText || ""} Please select an option. ${enableVoiceInput ? "You can use voice input to select an option." : ""}`;
      speak(textToRead);

      // Only read once per session
      sessionStorage.setItem(`read-${id}`, "true");
    }
  };

  const handleValueChange = (newValue: string) => {
    onChange(newValue);

    // Read selected value aloud
    if (voiceGuidanceEnabled) {
      const selectedOption = options.find((opt) => opt.value === newValue);
      if (selectedOption) {
        speak(`Selected: ${selectedOption.label}`, true);
      }
    }
  };

  const readCurrentValue = () => {
    if (voiceGuidanceEnabled) {
      const selectedOption = options.find((opt) => opt.value === value);
      if (selectedOption) {
        speak(`Current selection is: ${selectedOption.label}`);
      } else {
        speak("No option selected yet.");
      }
    }
  };

  const readAvailableOptions = () => {
    if (voiceGuidanceEnabled) {
      const optionsText = options.map((opt) => opt.label).join(", ");
      speak(`Available options are: ${optionsText}`);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label
          htmlFor={id}
          className={`text-base ${required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ""} ${errorMessage ? "text-destructive" : ""}`}
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
              title="Read current selection"
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
          <Select
            value={value}
            onValueChange={handleValueChange}
            disabled={disabled || isListening}
            open={isOpen}
            onOpenChange={setIsOpen}
          >
            <SelectTrigger
              id={id}
              className={`text-lg ${isFocused ? "border-primary" : ""} ${errorMessage ? "border-destructive" : ""} ${isListening ? "border-blue-400 bg-blue-50" : ""}`}
              aria-describedby={helpText ? `${id}-help` : undefined}
              aria-invalid={!!errorMessage}
              aria-required={required}
              onFocus={handleFocus}
              onBlur={() => setIsFocused(false)}
              onClick={() => {
                if (voiceGuidanceEnabled) {
                  readAvailableOptions();
                }
              }}
            >
              <SelectValue placeholder={placeholder} />
              {isListening && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 animate-pulse">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-lg"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            disabled={disabled}
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

export default AccessibleSelect;
