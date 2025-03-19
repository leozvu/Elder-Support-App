import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAccessibility } from "./AccessibilityContext";
import { useVoiceGuidance } from "@/hooks/useVoiceGuidance";
import {
  Eye,
  Type,
  MousePointer,
  Volume2,
  Layout,
  RefreshCw,
} from "lucide-react";

interface AccessibilitySettingsPanelProps {
  className?: string;
}

const AccessibilitySettingsPanel = ({
  className = "",
}: AccessibilitySettingsPanelProps) => {
  const { settings, updateSettings } = useAccessibility();
  const { speak } = useVoiceGuidance();

  const handleToggleHighContrast = () => {
    const newSettings = {
      ...settings,
      highContrast: !settings.highContrast,
    };
    updateSettings(newSettings);
    speak(
      `High contrast mode ${newSettings.highContrast ? "enabled" : "disabled"}`,
    );
  };

  const handleToggleLargeText = () => {
    const newSettings = {
      ...settings,
      largeText: !settings.largeText,
    };
    updateSettings(newSettings);
    speak(`Large text mode ${newSettings.largeText ? "enabled" : "disabled"}`);
  };

  const handleToggleSimplifiedNavigation = () => {
    const newSettings = {
      ...settings,
      simplifiedNavigation: !settings.simplifiedNavigation,
    };
    updateSettings(newSettings);
    speak(
      `Simplified navigation ${newSettings.simplifiedNavigation ? "enabled" : "disabled"}`,
    );
  };

  const handleToggleVoiceGuidance = () => {
    const newSettings = {
      ...settings,
      voiceGuidance: {
        ...settings.voiceGuidance,
        enabled: !settings.voiceGuidance.enabled,
      },
    };
    updateSettings(newSettings);
    speak(
      `Voice guidance ${newSettings.voiceGuidance.enabled ? "enabled" : "disabled"}`,
    );
  };

  const handleVoiceRateChange = (value: number[]) => {
    const newSettings = {
      ...settings,
      voiceGuidance: {
        ...settings.voiceGuidance,
        rate: value[0],
      },
    };
    updateSettings(newSettings);
    speak("This is how the voice will sound at this speed");
  };

  const handleVoicePitchChange = (value: number[]) => {
    const newSettings = {
      ...settings,
      voiceGuidance: {
        ...settings.voiceGuidance,
        pitch: value[0],
      },
    };
    updateSettings(newSettings);
    speak("This is how the voice will sound at this pitch");
  };

  const handleToggleAutoReadPageContent = () => {
    const newSettings = {
      ...settings,
      voiceGuidance: {
        ...settings.voiceGuidance,
        autoReadPageContent: !settings.voiceGuidance.autoReadPageContent,
      },
    };
    updateSettings(newSettings);
    speak(
      `Auto read page content ${newSettings.voiceGuidance.autoReadPageContent ? "enabled" : "disabled"}`,
    );
  };

  const resetToDefaults = () => {
    const defaultSettings = {
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
    };
    updateSettings(defaultSettings);
    speak("Accessibility settings reset to defaults");
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-2xl">Accessibility Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visual">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="visual" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Visual</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span>Text</span>
            </TabsTrigger>
            <TabsTrigger value="navigation" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              <span>Navigation</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <span>Voice</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="high-contrast" className="text-lg font-medium">
                  High Contrast Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Increases contrast for better visibility
                </p>
              </div>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={handleToggleHighContrast}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="large-pointer" className="text-lg font-medium">
                  Large Mouse Pointer
                </Label>
                <p className="text-sm text-muted-foreground">
                  Makes the cursor larger and easier to see
                </p>
              </div>
              <Switch
                id="large-pointer"
                checked={settings.largePointer}
                onCheckedChange={() => {
                  const newSettings = {
                    ...settings,
                    largePointer: !settings.largePointer,
                  };
                  updateSettings(newSettings);
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="text" className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="large-text" className="text-lg font-medium">
                  Large Text Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Increases text size throughout the application
                </p>
              </div>
              <Switch
                id="large-text"
                checked={settings.largeText}
                onCheckedChange={handleToggleLargeText}
              />
            </div>
          </TabsContent>

          <TabsContent value="navigation" className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label
                  htmlFor="simplified-navigation"
                  className="text-lg font-medium"
                >
                  Simplified Navigation
                </Label>
                <p className="text-sm text-muted-foreground">
                  Reduces complexity and shows only essential options
                </p>
              </div>
              <Switch
                id="simplified-navigation"
                checked={settings.simplifiedNavigation}
                onCheckedChange={handleToggleSimplifiedNavigation}
              />
            </div>
          </TabsContent>

          <TabsContent value="voice" className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="voice-guidance" className="text-lg font-medium">
                  Voice Guidance
                </Label>
                <p className="text-sm text-muted-foreground">
                  Provides spoken feedback and instructions
                </p>
              </div>
              <Switch
                id="voice-guidance"
                checked={settings.voiceGuidance.enabled}
                onCheckedChange={handleToggleVoiceGuidance}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="voice-rate" className="text-base">
                Voice Speed
              </Label>
              <div className="flex items-center gap-4">
                <span className="text-sm">Slow</span>
                <Slider
                  id="voice-rate"
                  disabled={!settings.voiceGuidance.enabled}
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  value={[settings.voiceGuidance.rate]}
                  onValueChange={handleVoiceRateChange}
                  className="flex-1"
                />
                <span className="text-sm">Fast</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="voice-pitch" className="text-base">
                Voice Pitch
              </Label>
              <div className="flex items-center gap-4">
                <span className="text-sm">Low</span>
                <Slider
                  id="voice-pitch"
                  disabled={!settings.voiceGuidance.enabled}
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  value={[settings.voiceGuidance.pitch]}
                  onValueChange={handleVoicePitchChange}
                  className="flex-1"
                />
                <span className="text-sm">High</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label
                  htmlFor="auto-read-content"
                  className="text-lg font-medium"
                >
                  Auto-Read Page Content
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically read page content when it loads
                </p>
              </div>
              <Switch
                id="auto-read-content"
                disabled={!settings.voiceGuidance.enabled}
                checked={settings.voiceGuidance.autoReadPageContent}
                onCheckedChange={handleToggleAutoReadPageContent}
              />
            </div>

            <Button
              variant="secondary"
              className="w-full mt-4"
              onClick={() => {
                speak(
                  "This is a test of the voice guidance system. You can adjust the settings to make it more comfortable for you.",
                );
              }}
              disabled={!settings.voiceGuidance.enabled}
            >
              Test Voice
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button
            variant="outline"
            onClick={resetToDefaults}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilitySettingsPanel;
