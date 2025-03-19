import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Volume2, VolumeX } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAccessibility } from '@/components/accessibility/AccessibilityContext';
import { speak } from '@/lib/voice-guidance';

interface VoiceGuidanceSettingsProps {
  className?: string;
}

const VoiceGuidanceSettings: React.FC<VoiceGuidanceSettingsProps> = ({ className = '' }) => {
  const { settings, updateSettings } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  
  const { voiceGuidance } = settings;
  
  const handleToggleVoiceGuidance = () => {
    const newEnabled = !voiceGuidance.enabled;
    updateSettings({
      voiceGuidance: {
        ...voiceGuidance,
        enabled: newEnabled
      }
    });
    
    if (newEnabled) {
      speak('Voice guidance enabled', true);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    updateSettings({
      voiceGuidance: {
        ...voiceGuidance,
        volume: value[0]
      }
    });
    
    if (voiceGuidance.enabled) {
      speak('Volume adjusted', true);
    }
  };
  
  const handleRateChange = (value: number[]) => {
    updateSettings({
      voiceGuidance: {
        ...voiceGuidance,
        rate: value[0]
      }
    });
    
    if (voiceGuidance.enabled) {
      speak('Speech rate adjusted', true);
    }
  };
  
  const handlePitchChange = (value: number[]) => {
    updateSettings({
      voiceGuidance: {
        ...voiceGuidance,
        pitch: value[0]
      }
    });
    
    if (voiceGuidance.enabled) {
      speak('Speech pitch adjusted', true);
    }
  };
  
  const handleAutoReadChange = (checked: boolean) => {
    updateSettings({
      voiceGuidance: {
        ...voiceGuidance,
        autoReadPageContent: checked
      }
    });
    
    if (voiceGuidance.enabled) {
      speak(checked ? 'Auto-read enabled' : 'Auto-read disabled', true);
    }
  };

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={voiceGuidance.enabled ? "default" : "outline"}
            size="icon"
            aria-label="Voice guidance settings"
            title="Voice guidance settings"
          >
            {voiceGuidance.enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Voice Guidance Settings</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="voice-enabled">Enable Voice Guidance</Label>
              <Switch
                id="voice-enabled"
                checked={voiceGuidance.enabled}
                onCheckedChange={handleToggleVoiceGuidance}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="voice-volume">Volume</Label>
                <span>{Math.round(voiceGuidance.volume * 100)}%</span>
              </div>
              <Slider
                id="voice-volume"
                min={0}
                max={1}
                step={0.1}
                value={[voiceGuidance.volume]}
                onValueChange={handleVolumeChange}
                disabled={!voiceGuidance.enabled}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="voice-rate">Speech Rate</Label>
                <span>{voiceGuidance.rate}x</span>
              </div>
              <Slider
                id="voice-rate"
                min={0.5}
                max={2}
                step={0.1}
                value={[voiceGuidance.rate]}
                onValueChange={handleRateChange}
                disabled={!voiceGuidance.enabled}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="voice-pitch">Pitch</Label>
                <span>{voiceGuidance.pitch}x</span>
              </div>
              <Slider
                id="voice-pitch"
                min={0.5}
                max={2}
                step={0.1}
                value={[voiceGuidance.pitch]}
                onValueChange={handlePitchChange}
                disabled={!voiceGuidance.enabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-read">Auto-read Page Content</Label>
              <Switch
                id="auto-read"
                checked={voiceGuidance.autoReadPageContent}
                onCheckedChange={handleAutoReadChange}
                disabled={!voiceGuidance.enabled}
              />
            </div>
            
            <Button 
              className="w-full"
              onClick={() => {
                if (voiceGuidance.enabled) {
                  speak('This is a test of the voice guidance system. You can adjust the volume, rate, and pitch to your preference.', true);
                }
              }}
              disabled={!voiceGuidance.enabled}
            >
              Test Voice
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default VoiceGuidanceSettings;