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
import { Volume2, Sun, Moon, Type, Maximize2, Settings, VolumeX } from "lucide-react";
import VoiceGuidanceSystem, { VoiceSettings } from "./VoiceGuidanceSystem";
import { speak, toggleVoiceGuidance, updateVoiceSettings } from "@/lib/voice-guidance";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

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
    
    // Save settings to localStorage
    localStorage.setItem('accessibilitySettings', JSON.stringify(updatedSettings));
    
    // Announce changes if voice guidance is enabled
    if (updatedSettings.voiceGuidance.enabled) {
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
    updateSettings({ highContrast: newValue });
    
    if (voiceSettings.enabled) {
      speak(`High contrast mode ${newValue ? 'enabled' : 'disabled'}`);
    }
  };

  const toggleLargeText = () => {
    const newValue = !largeText;
    setLargeText(newValue);
    updateSettings({ largeText: newValue });
    
    if (voiceSettings.enabled) {
      speak(`Large text mode ${newValue ? 'enabled' : 'disabled'}`);
    }
  };

  const toggleSimplifiedNavigation = () => {
    const newValue = !simplifiedNavigation;
    setSimplifiedNavigation(newValue);
    updateSettings({ simplifiedNavigation: newValue });
    
    if (voiceSettings.enabled) {
      speak(`Simplified navigation ${newValue ? 'enabled' : 'disabled'}`);
    }
  };
  
  const handleToggleVoiceGuidance = () => {
    const newEnabled = !voiceSettings.enabled;
    setVoiceSettings({
      ...voiceSettings,
      enabled: newEnabled
    });
    updateSettings({
      voiceGuidance: {
        ...voiceSettings,
        enabled: newEnabled
      }
    });
    
    // This will automatically announce if enabled
    toggleVoiceGuidance();
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
                variant={voiceSettings.enabled ? "default" : "outline"}
                size="icon"
                onClick={handleToggleVoiceGuidance}
                aria-label="Toggle voice guidance"
              >
                {voiceSettings.enabled ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {voiceSettings.enabled
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
              
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-guidance" className="flex-1">
                  Voice Guidance
                </Label>
                <Switch
                  id="voice-guidance"
                  checked={voiceSettings.enabled}
                  onCheckedChange={(checked) => {
                    setVoiceSettings({
                      ...voiceSettings,
                      enabled: checked
                    });
                    updateSettings({
                      voiceGuidance: {
                        ...voiceSettings,
                        enabled: checked
                      }
                    });
                    
                    // This will automatically announce if enabled
                    toggleVoiceGuidance();
                  }}
                />
              </div>
              
              {voiceSettings.enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="voice-rate">Speech Rate</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Slow</span>
                      <Slider
                        id="voice-rate"
                        min={0.5}
                        max={2}
                        step={0.1}
                        value={[voiceSettings.rate]}
                        onValueChange={(value) => {
                          setVoiceSettings({
                            ...voiceSettings,
                            rate: value[0]
                          });
                          updateSettings({
                            voiceGuidance: {
                              ...voiceSettings,
                              rate: value[0]
                            }
                          });
                        }}
                        className="w-[60%]"
                      />
                      <span className="text-sm">Fast</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="voice-volume">Volume</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Quiet</span>
                      <Slider
                        id="voice-volume"
                        min={0}
                        max={1}
                        step={0.1}
                        value={[voiceSettings.volume]}
                        onValueChange={(value) => {
                          setVoiceSettings({
                            ...voiceSettings,
                            volume: value[0]
                          });
                          updateSettings({
                            voiceGuidance: {
                              ...voiceSettings,
                              volume: value[0]
                            }
                          });
                        }}
                        className="w-[60%]"
                      />
                      <span className="text-sm">Loud</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => {
                      if (voiceSettings.enabled) {
                        speak("This is a test of the voice guidance system");
                      }
                    }}
                  >
                    Test Voice
                  </Button>
                </>
              )}

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