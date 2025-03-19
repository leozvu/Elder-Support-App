import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Type, Maximize2, Settings, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { speak } from "@/lib/voice-guidance";

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  simplifiedNavigation: boolean;
  voiceGuidance: {
    enabled: boolean;
    volume: number;
    rate: number;
    pitch: number;
    voice: null;
    autoReadPageContent: boolean;
  };
}

interface AccessibilityControlsProps {
  settings?: Partial<AccessibilitySettings>;
  onSettingsChange?: (settings: AccessibilitySettings) => void;
}

const AccessibilityControls = ({
  settings = {},
  onSettingsChange = () => {},
}: AccessibilityControlsProps) => {
  const [highContrast, setHighContrast] = useState(
    settings.highContrast || false,
  );
  const [largeText, setLargeText] = useState(settings.largeText || false);
  const [simplifiedNavigation, setSimplifiedNavigation] = useState(
    settings.simplifiedNavigation || false,
  );
  const [voiceEnabled, setVoiceEnabled] = useState(
    settings.voiceGuidance?.enabled || false,
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setHighContrast(parsedSettings.highContrast || false);
        setLargeText(parsedSettings.largeText || false);
        setSimplifiedNavigation(parsedSettings.simplifiedNavigation || false);
        setVoiceEnabled(parsedSettings.voiceGuidance?.enabled || false);
      } catch (error) {
        console.error('Failed to parse accessibility settings:', error);
      }
    }
  }, []);

  const updateSettings = () => {
    const updatedSettings: AccessibilitySettings = {
      highContrast,
      largeText,
      simplifiedNavigation,
      voiceGuidance: {
        enabled: voiceEnabled,
        volume: 1,
        rate: 1,
        pitch: 1,
        voice: null,
        autoReadPageContent: false,
      },
    };

    // Save to localStorage
    localStorage.setItem('accessibilitySettings', JSON.stringify(updatedSettings));

    // Apply settings to document
    document.documentElement.classList.toggle('high-contrast', updatedSettings.highContrast);
    document.documentElement.classList.toggle('large-text', updatedSettings.largeText);
    document.documentElement.classList.toggle('simplified-nav', updatedSettings.simplifiedNavigation);

    // Call the callback
    onSettingsChange(updatedSettings);

    // Announce changes if voice guidance is enabled
    if (voiceEnabled) {
      speak("Accessibility settings updated");
    }

    // Show toast notification
    toast({
      title: "Accessibility Settings Updated",
      description: "Your accessibility preferences have been saved.",
    });
  };

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    setTimeout(() => {
      updateSettings();
      if (voiceEnabled) {
        speak(`High contrast mode ${newValue ? 'enabled' : 'disabled'}`);
      }
    }, 0);
  };

  const toggleLargeText = () => {
    const newValue = !largeText;
    setLargeText(newValue);
    setTimeout(() => {
      updateSettings();
      if (voiceEnabled) {
        speak(`Large text mode ${newValue ? 'enabled' : 'disabled'}`);
      }
    }, 0);
  };

  const toggleSimplifiedNavigation = () => {
    const newValue = !simplifiedNavigation;
    setSimplifiedNavigation(newValue);
    setTimeout(() => {
      updateSettings();
      if (voiceEnabled) {
        speak(`Simplified navigation ${newValue ? 'enabled' : 'disabled'}`);
      }
    }, 0);
  };

  const toggleVoiceGuidance = () => {
    const newValue = !voiceEnabled;
    setVoiceEnabled(newValue);
    setTimeout(() => {
      updateSettings();
      if (newValue) {
        speak("Voice guidance enabled");
      }
    }, 0);
  };

  return (
    <div className="bg-white rounded-lg p-2">
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={highContrast ? "default" : "outline"}
                size="icon"
                onClick={toggleHighContrast}
                aria-label="Toggle high contrast mode"
              >
                {highContrast ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {highContrast
                  ? "Disable high contrast"
                  : "Enable high contrast"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={largeText ? "default" : "outline"}
                size="icon"
                onClick={toggleLargeText}
                aria-label="Toggle large text"
              >
                <Type className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{largeText ? "Disable large text" : "Enable large text"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={simplifiedNavigation ? "default" : "outline"}
                size="icon"
                onClick={toggleSimplifiedNavigation}
                aria-label="Toggle simplified navigation"
              >
                <Maximize2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {simplifiedNavigation
                  ? "Disable simplified navigation"
                  : "Enable simplified navigation"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={voiceEnabled ? "default" : "outline"}
                size="icon"
                onClick={toggleVoiceGuidance}
                aria-label="Toggle voice guidance"
              >
                {voiceEnabled ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {voiceEnabled
                  ? "Disable voice guidance"
                  : "Enable voice guidance"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Accessibility settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Accessibility Settings</DialogTitle>
              <DialogDescription>
                Customize your accessibility preferences to make the app easier
                to use.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast" className="flex-1">
                  High Contrast Mode
                </Label>
                <Switch
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={(checked) => {
                    setHighContrast(checked);
                    setTimeout(() => updateSettings(), 0);
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="large-text" className="flex-1">
                  Large Text
                </Label>
                <Switch
                  id="large-text"
                  checked={largeText}
                  onCheckedChange={(checked) => {
                    setLargeText(checked);
                    setTimeout(() => updateSettings(), 0);
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="simplified-nav" className="flex-1">
                  Simplified Navigation
                </Label>
                <Switch
                  id="simplified-nav"
                  checked={simplifiedNavigation}
                  onCheckedChange={(checked) => {
                    setSimplifiedNavigation(checked);
                    setTimeout(() => updateSettings(), 0);
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="voice-guidance" className="flex-1">
                  Voice Guidance
                </Label>
                <Switch
                  id="voice-guidance"
                  checked={voiceEnabled}
                  onCheckedChange={(checked) => {
                    setVoiceEnabled(checked);
                    setTimeout(() => updateSettings(), 0);
                  }}
                />
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => {
                    // Reset to defaults
                    setHighContrast(false);
                    setLargeText(false);
                    setSimplifiedNavigation(false);
                    setVoiceEnabled(false);
                    setTimeout(() => updateSettings(), 0);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AccessibilityControls;