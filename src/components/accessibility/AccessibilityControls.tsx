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
import { Slider } from "@/components/ui/slider";
import { Volume2, Sun, Moon, Type, Maximize2, Settings } from "lucide-react";
import { useAccessibility } from "./AccessibilityContext";
import { speak } from "@/lib/voice-guidance";
import VoiceGuidanceSettings from "@/components/voice-guidance/VoiceGuidanceSettings";

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  simplifiedNavigation: boolean;
  voiceGuidance: VoiceSettings;
}

export interface VoiceSettings {
  enabled: boolean;
  volume: number;
  rate: number;
  pitch: number;
  voice: SpeechSynthesisVoice | null;
  autoReadPageContent: boolean;
}

interface AccessibilityControlsProps {
  className?: string;
}

const AccessibilityControls = ({
  className = "",
}: AccessibilityControlsProps) => {
  const { settings, updateSettings, toggleHighContrast, toggleLargeText } = useAccessibility();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleVoiceSettingsChange = (newVoiceSettings: VoiceSettings) => {
    updateSettings({
      voiceGuidance: newVoiceSettings,
    });
  };

  const toggleSimplifiedNavigation = () => {
    const newValue = !settings.simplifiedNavigation;
    updateSettings({ simplifiedNavigation: newValue });
    
    if (settings.voiceGuidance.enabled) {
      speak(`Simplified navigation ${newValue ? 'enabled' : 'disabled'}`);
    }
  };

  return (
    <div className={`bg-white rounded-lg p-2 ${className}`}>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={settings.highContrast ? "default" : "outline"}
                size="icon"
                onClick={toggleHighContrast}
                aria-label="Toggle high contrast mode"
              >
                {settings.highContrast ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {settings.highContrast
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
                variant={settings.largeText ? "default" : "outline"}
                size="icon"
                onClick={toggleLargeText}
                aria-label="Toggle large text"
              >
                <Type className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{settings.largeText ? "Disable large text" : "Enable large text"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={settings.simplifiedNavigation ? "default" : "outline"}
                size="icon"
                onClick={toggleSimplifiedNavigation}
                aria-label="Toggle simplified navigation"
              >
                <Maximize2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {settings.simplifiedNavigation
                  ? "Disable simplified navigation"
                  : "Enable simplified navigation"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <VoiceGuidanceSettings />

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
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => {
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
                  checked={settings.largeText}
                  onCheckedChange={(checked) => {
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
                  checked={settings.simplifiedNavigation}
                  onCheckedChange={(checked) => {
                    updateSettings({ simplifiedNavigation: checked });
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="voice-guidance" className="flex-1">
                  Voice Guidance
                </Label>
                <Switch
                  id="voice-guidance"
                  checked={settings.voiceGuidance.enabled}
                  onCheckedChange={(checked) => {
                    updateSettings({ 
                      voiceGuidance: {
                        ...settings.voiceGuidance,
                        enabled: checked
                      }
                    });
                    
                    if (checked) {
                      speak("Voice guidance enabled");
                    }
                  }}
                />
              </div>

              {settings.voiceGuidance.enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="voice-volume">Voice Volume</Label>
                    <Slider
                      id="voice-volume"
                      min={0}
                      max={1}
                      step={0.1}
                      value={[settings.voiceGuidance.volume]}
                      onValueChange={(value) => {
                        updateSettings({
                          voiceGuidance: {
                            ...settings.voiceGuidance,
                            volume: value[0]
                          }
                        });
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="voice-rate">Voice Speed</Label>
                    <Slider
                      id="voice-rate"
                      min={0.5}
                      max={2}
                      step={0.1}
                      value={[settings.voiceGuidance.rate]}
                      onValueChange={(value) => {
                        updateSettings({
                          voiceGuidance: {
                            ...settings.voiceGuidance,
                            rate: value[0]
                          }
                        });
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-read" className="flex-1">
                      Auto-read Page Content
                    </Label>
                    <Switch
                      id="auto-read"
                      checked={settings.voiceGuidance.autoReadPageContent}
                      onCheckedChange={(checked) => {
                        updateSettings({
                          voiceGuidance: {
                            ...settings.voiceGuidance,
                            autoReadPageContent: checked
                          }
                        });
                      }}
                    />
                  </div>
                </>
              )}

              <div className="pt-2">
                <Button
                  onClick={() => {
                    // Reset to defaults
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