import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Volume2, Type, MousePointer2, Eye } from "lucide-react";
import VoiceGuidanceSettings from "@/components/voice-guidance/VoiceGuidanceSettings";
import {
  speak,
  getVoiceGuidanceStatus,
  updateVoiceSettings,
} from "@/lib/voice-guidance";

const AccessibilitySettings = () => {
  const [fontSize, setFontSize] = React.useState(100);
  const [highContrast, setHighContrast] = React.useState(false);
  const [largePointer, setLargePointer] = React.useState(false);
  const voiceSettings = getVoiceGuidanceStatus();

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
    speak(`Font size set to ${newSize} percent`);
  };

  const handleHighContrastChange = (checked: boolean) => {
    setHighContrast(checked);
    if (checked) {
      document.documentElement.classList.add("high-contrast");
      speak("High contrast mode enabled");
    } else {
      document.documentElement.classList.remove("high-contrast");
      speak("High contrast mode disabled");
    }
  };

  const handleLargePointerChange = (checked: boolean) => {
    setLargePointer(checked);
    if (checked) {
      document.documentElement.classList.add("large-pointer");
      speak("Large pointer enabled");
    } else {
      document.documentElement.classList.remove("large-pointer");
      speak("Large pointer disabled");
    }
  };

  const resetSettings = () => {
    setFontSize(100);
    setHighContrast(false);
    setLargePointer(false);
    document.documentElement.style.fontSize = "100%";
    document.documentElement.classList.remove("high-contrast", "large-pointer");
    updateVoiceSettings({ rate: 0.9, pitch: 1.0 });
    speak("Accessibility settings have been reset to default");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Accessibility Settings</CardTitle>
        <CardDescription>
          Customize your experience to make the app more accessible.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="voice-guidance" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Voice Guidance
            </Label>
            <VoiceGuidanceSettings />
          </div>

          <div className="space-y-2">
            <Label htmlFor="font-size" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Font Size
            </Label>
            <div className="flex items-center gap-4">
              <span className="text-sm">A</span>
              <Slider
                id="font-size"
                min={75}
                max={150}
                step={5}
                value={[fontSize]}
                onValueChange={handleFontSizeChange}
                className="flex-1"
              />
              <span className="text-lg font-bold">A</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              High Contrast Mode
            </Label>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={handleHighContrastChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="large-pointer" className="flex items-center gap-2">
              <MousePointer2 className="h-4 w-4" />
              Large Pointer
            </Label>
            <Switch
              id="large-pointer"
              checked={largePointer}
              onCheckedChange={handleLargePointerChange}
            />
          </div>
        </div>

        <div className="pt-4">
          <Button variant="outline" className="w-full" onClick={resetSettings}>
            Reset to Default Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilitySettings;
