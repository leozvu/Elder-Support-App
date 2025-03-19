import React, { useState } from "react";
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
import { Slider } from "@/components/ui/slider";
import { Volume2, Sun, Moon, Type, Maximize2, Settings } from "lucide-react";
import VoiceGuidanceSystem, { VoiceSettings } from "./VoiceGuidanceSystem";

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  simplifiedNavigation: boolean;
  voiceGuidance: VoiceSettings;
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
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: false,
    volume: 1,
    rate: 1,
    pitch: 1,
    voice: null,
    autoReadPageContent: false,
    ...(settings.voiceGuidance || {}),
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleVoiceSettingsChange = (newVoiceSettings: VoiceSettings) => {
    setVoiceSettings(newVoiceSettings);
    updateSettings({
      voiceGuidance: newVoiceSettings,
    });
  };

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    const updatedSettings: AccessibilitySettings = {
      highContrast,
      largeText,
      simplifiedNavigation,
      voiceGuidance: voiceSettings,
      ...newSettings,
    };

    onSettingsChange(updatedSettings);

    // Apply settings to document
    document.documentElement.classList.toggle(
      "high-contrast",
      updatedSettings.highContrast,
    );
    document.documentElement.classList.toggle(
      "large-text",
      updatedSettings.largeText,
    );
    document.documentElement.classList.toggle(
      "simplified-nav",
      updatedSettings.simplifiedNavigation,
    );
  };

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    updateSettings({ highContrast: newValue });
  };

  const toggleLargeText = () => {
    const newValue = !largeText;
    setLargeText(newValue);
    updateSettings({ largeText: newValue });
  };

  const toggleSimplifiedNavigation = () => {
    const newValue = !simplifiedNavigation;
    setSimplifiedNavigation(newValue);
    updateSettings({ simplifiedNavigation: newValue });
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

        <VoiceGuidanceSystem
          enabled={voiceSettings.enabled}
          volume={voiceSettings.volume}
          rate={voiceSettings.rate}
          pitch={voiceSettings.pitch}
          autoReadPageContent={voiceSettings.autoReadPageContent}
          onSettingsChange={handleVoiceSettingsChange}
        />

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
                    updateSettings({ highContrast: checked });
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
                    updateSettings({ largeText: checked });
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
                    updateSettings({ simplifiedNavigation: checked });
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
                    setVoiceSettings({
                      enabled: false,
                      volume: 1,
                      rate: 1,
                      pitch: 1,
                      voice: null,
                      autoReadPageContent: false,
                    });
                    updateSettings({
                      highContrast: false,
                      largeText: false,
                      simplifiedNavigation: false,
                      voiceGuidance: {
                        enabled: false,
                        volume: 1,
                        rate: 1,
                        pitch: 1,
                        voice: null,
                        autoReadPageContent: false,
                      },
                    });
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
