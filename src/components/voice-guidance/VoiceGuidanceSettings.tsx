import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Volume2, Settings } from "lucide-react";
import {
  getVoiceGuidanceStatus,
  updateVoiceSettings,
  toggleVoiceGuidance,
  speak,
} from "@/lib/voice-guidance";

interface VoiceGuidanceSettingsProps {
  className?: string;
}

const VoiceGuidanceSettings = ({
  className = "",
}: VoiceGuidanceSettingsProps) => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(() => getVoiceGuidanceStatus());

  const handleToggle = () => {
    const newState = toggleVoiceGuidance();
    setSettings((prev) => ({ ...prev, enabled: newState }));
  };

  const handleRateChange = (value: number[]) => {
    const newRate = value[0];
    setSettings((prev) => ({ ...prev, rate: newRate }));
    updateVoiceSettings({ rate: newRate });
    speak("This is how the voice will sound at this speed");
  };

  const handlePitchChange = (value: number[]) => {
    const newPitch = value[0];
    setSettings((prev) => ({ ...prev, pitch: newPitch }));
    updateVoiceSettings({ pitch: newPitch });
    speak("This is how the voice will sound at this pitch");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${className}`}
          onClick={() => speak("Voice guidance settings")}
        >
          <Volume2 className="h-4 w-4" />
          <span>Voice Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Voice Guidance Settings</DialogTitle>
          <DialogDescription>
            Customize how voice guidance works for you.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="voice-enabled" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Enable Voice Guidance
            </Label>
            <Switch
              id="voice-enabled"
              checked={settings.enabled}
              onCheckedChange={handleToggle}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice-rate">Voice Speed</Label>
            <div className="flex items-center gap-4">
              <span className="text-sm">Slow</span>
              <Slider
                id="voice-rate"
                disabled={!settings.enabled}
                min={0.5}
                max={1.5}
                step={0.1}
                value={[settings.rate]}
                onValueChange={handleRateChange}
                className="flex-1"
              />
              <span className="text-sm">Fast</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice-pitch">Voice Pitch</Label>
            <div className="flex items-center gap-4">
              <span className="text-sm">Low</span>
              <Slider
                id="voice-pitch"
                disabled={!settings.enabled}
                min={0.5}
                max={1.5}
                step={0.1}
                value={[settings.pitch]}
                onValueChange={handlePitchChange}
                className="flex-1"
              />
              <span className="text-sm">High</span>
            </div>
          </div>

          <div className="pt-4">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                speak(
                  "This is a test of the voice guidance system. You can adjust the settings to make it more comfortable for you.",
                );
              }}
              disabled={!settings.enabled}
            >
              Test Voice
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceGuidanceSettings;
