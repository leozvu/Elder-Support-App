import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff } from "lucide-react";
import { speak, getVoiceGuidanceStatus } from "@/lib/voice-guidance";

interface VoiceCommandListenerProps {
  commands: { [key: string]: () => void };
  onListening?: (isListening: boolean) => void;
  autoStart?: boolean;
  listeningTimeout?: number; // in milliseconds
  className?: string;
  showFeedback?: boolean;
}

const VoiceCommandListener: React.FC<VoiceCommandListenerProps> = ({
  commands,
  onListening,
  autoStart = false,
  listeningTimeout = 10000, // 10 seconds default
  className = "",
  showFeedback = true,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const { enabled: voiceGuidanceEnabled } = getVoiceGuidanceStatus();

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
          processCommand(transcriptValue);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (onListening) onListening(false);
        setFeedback("Voice recognition error. Please try again.");
        if (voiceGuidanceEnabled) {
          speak("Voice recognition error. Please try again.", true);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (onListening) onListening(false);
      };

      // Auto-start if enabled
      if (autoStart) {
        startListening();
      }
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
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [autoStart, onListening, voiceGuidanceEnabled]);

  const processCommand = (text: string) => {
    const normalizedText = text.toLowerCase().trim();
    let commandFound = false;

    // Check for exact matches first
    Object.keys(commands).forEach((command) => {
      if (normalizedText === command.toLowerCase()) {
        executeCommand(command);
        commandFound = true;
      }
    });

    // If no exact match, check for partial matches
    if (!commandFound) {
      Object.keys(commands).forEach((command) => {
        if (normalizedText.includes(command.toLowerCase())) {
          executeCommand(command);
          commandFound = true;
        }
      });
    }

    if (!commandFound) {
      setFeedback(`Command not recognized: "${text}". Please try again.`);
      if (voiceGuidanceEnabled) {
        speak("Command not recognized. Please try again.", true);
      }
    }
  };

  const executeCommand = (command: string) => {
    setFeedback(`Executing command: "${command}"`);
    if (voiceGuidanceEnabled) {
      speak(`Executing command: ${command}`, true);
    }
    commands[command]();
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      setFeedback("Voice recognition is not supported in your browser.");
      if (voiceGuidanceEnabled) {
        speak("Voice recognition is not supported in your browser.", true);
      }
      return;
    }

    try {
      // Clear previous transcript and feedback
      setTranscript("");
      setFeedback("Listening for commands...");

      // Start listening
      recognitionRef.current.start();
      setIsListening(true);
      if (onListening) onListening(true);

      // Announce available commands
      if (voiceGuidanceEnabled) {
        const availableCommands = Object.keys(commands).join(", ");
        speak(
          `Listening for commands. You can say: ${availableCommands}`,
          true,
        );
      }

      // Set timeout to stop listening after specified time
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        if (isListening && recognitionRef.current) {
          recognitionRef.current.stop();
          setFeedback("Listening timeout. Click to start again.");
          if (voiceGuidanceEnabled) {
            speak(
              "Listening timeout. Click the microphone button to start again.",
              true,
            );
          }
        }
      }, listeningTimeout);
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      setFeedback("Failed to start voice recognition. Please try again.");
      setIsListening(false);
      if (onListening) onListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (onListening) onListening(false);
      setFeedback("Voice command listening stopped.");
      if (voiceGuidanceEnabled) {
        speak("Voice command listening stopped.", true);
      }
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!showFeedback) {
    return (
      <Button
        type="button"
        variant={isListening ? "destructive" : "outline"}
        size="icon"
        className={`h-10 w-10 rounded-full ${isListening ? "bg-red-500 hover:bg-red-600" : ""} ${className}`}
        onClick={toggleListening}
        title={isListening ? "Stop voice commands" : "Start voice commands"}
        aria-label={
          isListening ? "Stop voice commands" : "Start voice commands"
        }
      >
        {isListening ? (
          <MicOff className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-3">
          <Button
            type="button"
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            className={`h-12 w-12 rounded-full ${isListening ? "bg-red-500 hover:bg-red-600" : ""}`}
            onClick={toggleListening}
            title={isListening ? "Stop voice commands" : "Start voice commands"}
            aria-label={
              isListening ? "Stop voice commands" : "Start voice commands"
            }
          >
            {isListening ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>

          <div className="text-center">
            {isListening ? (
              <p className="text-sm font-medium text-blue-600 animate-pulse">
                Listening... {transcript ? `"${transcript}"` : ""}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {feedback || "Click to start voice commands"}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceCommandListener;
