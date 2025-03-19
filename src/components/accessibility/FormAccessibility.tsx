import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Mic, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FormAccessibilityProps {
  formId: string;
  helpText?: string;
  voiceEnabled?: boolean;
}

const FormAccessibility = ({
  formId,
  helpText = "Fill out this form with your information. Required fields are marked with an asterisk (*).",
  voiceEnabled = true,
}: FormAccessibilityProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const speakText = (text: string) => {
    if (!voiceEnabled) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower rate for better comprehension
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    speechSynthesis.speak(utterance);
  };

  const readFormAloud = () => {
    const form = document.getElementById(formId);
    if (!form) return;

    // Get form title or legend if available
    const formTitle =
      form.querySelector("legend")?.textContent ||
      form.querySelector("h1")?.textContent ||
      form.querySelector("h2")?.textContent ||
      "Form";

    // Start with form title and help text
    let textToRead = `${formTitle}. ${helpText} `;

    // Read all labels and their associated inputs
    const labels = form.querySelectorAll("label");
    labels.forEach((label) => {
      const labelText = label.textContent;
      const forAttribute = label.getAttribute("for");
      if (forAttribute) {
        const input = document.getElementById(forAttribute);
        if (input) {
          const inputType =
            input.getAttribute("type") || input.tagName.toLowerCase();
          const isRequired = input.hasAttribute("required");
          const requiredText = isRequired ? ", required" : ", optional";

          textToRead += `${labelText} field${requiredText}. `;

          // Add specific instructions based on input type
          if (inputType === "radio" || inputType === "checkbox") {
            textToRead += "Select an option. ";
          } else if (inputType === "select") {
            textToRead += "Choose from dropdown. ";
          }
        }
      }
    });

    // Add information about buttons
    const buttons = form.querySelectorAll("button");
    if (buttons.length > 0) {
      textToRead += "Form contains the following buttons: ";
      buttons.forEach((button, index) => {
        if (button.textContent) {
          textToRead += `${button.textContent}${index < buttons.length - 1 ? ", " : "."}`;
        }
      });
    }

    speakText(textToRead);
  };

  const startVoiceInput = () => {
    if (!voiceEnabled) return;

    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        speakText("Voice input activated. Speak now.");
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");

        setRecognizedText(transcript);

        // Focus on active element and insert text if it's an input
        const activeElement = document.activeElement as HTMLInputElement;
        if (
          activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA")
        ) {
          activeElement.value = transcript;
          // Trigger input event to update React state if needed
          const inputEvent = new Event("input", { bubbles: true });
          activeElement.dispatchEvent(inputEvent);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.start();
    } else {
      speakText("Voice recognition is not supported in your browser.");
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      speakText("Voice input deactivated.");
    }
  };

  return (
    <div className="flex items-center justify-end gap-2 mb-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={readFormAloud}
              aria-label="Read form aloud"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Read form aloud</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              aria-label={
                isListening ? "Stop voice input" : "Start voice input"
              }
              className={isListening ? "bg-red-100" : ""}
            >
              <Mic className={`h-4 w-4 ${isListening ? "text-red-500" : ""}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isListening ? "Stop voice input" : "Start voice input"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => speakText(helpText)}
              aria-label="Help"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Get help</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isListening && (
        <div className="text-sm text-muted-foreground animate-pulse">
          Listening...
        </div>
      )}
    </div>
  );
};

export default FormAccessibility;
