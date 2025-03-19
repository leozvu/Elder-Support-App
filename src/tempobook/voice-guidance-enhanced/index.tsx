import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Volume2,
  Mic,
  VolumeX,
  Settings,
  Info,
  HelpCircle,
} from "lucide-react";
import { useVoiceGuidance } from "@/hooks/useVoiceGuidance";
import VoiceGuidedElement from "@/components/voice-guidance/VoiceGuidedElement";
import VoiceGuidedButton from "@/components/voice-guidance/VoiceGuidedButton";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const EnhancedVoiceGuidanceDemo = () => {
  const {
    enabled,
    toggleGuidance,
    rate,
    pitch,
    updateSettings,
    speak,
    stopSpeaking,
  } = useVoiceGuidance();
  const [demoText, setDemoText] = useState(
    "Welcome to the Enhanced Voice Guidance System. This system helps users with visual impairments or reading difficulties navigate the application.",
  );
  const [activeTab, setActiveTab] = useState("settings");
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [transcript, setTranscript] = useState("");

  // Initialize speech recognition if supported
  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleSpeak = () => {
    speak(demoText, true);
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
  };

  const handleToggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognition.start();
      setIsListening(true);
    }
  };

  const handleRateChange = (value: number[]) => {
    updateSettings({ rate: value[0] });
  };

  const handlePitchChange = (value: number[]) => {
    updateSettings({ pitch: value[0] });
  };

  const handleVolumeChange = (value: number[]) => {
    setVoiceVolume(value[0]);
    // In a real implementation, this would update the actual volume
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    speak(`${value} tab selected`, false);
  };

  const exampleCommands = [
    "Go to home page",
    "Request assistance",
    "Show my medications",
    "Call emergency contact",
    "Increase text size",
    "Enable high contrast",
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
      <CardHeader className="bg-primary/5 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            Enhanced Voice Guidance System
          </CardTitle>
          <Badge
            variant={enabled ? "default" : "outline"}
            className={
              enabled
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }
          >
            {enabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <Volume2
              className={`h-6 w-6 ${enabled ? "text-primary" : "text-gray-400"}`}
            />
            <div>
              <h3 className="text-lg font-medium">Voice Guidance</h3>
              <p className="text-sm text-gray-500">
                Enable spoken feedback throughout the app
              </p>
            </div>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={toggleGuidance}
            aria-label="Toggle voice guidance"
          />
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings" className="text-base">
              Settings
            </TabsTrigger>
            <TabsTrigger value="test" className="text-base">
              Test Voice
            </TabsTrigger>
            <TabsTrigger value="commands" className="text-base">
              Voice Commands
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="mt-6 space-y-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="voice-volume"
                  className="text-base font-medium flex items-center gap-2"
                >
                  <Volume2 className="h-4 w-4" /> Volume
                </Label>
                <div className="flex items-center gap-4">
                  <VolumeX className="h-4 w-4 text-gray-500" />
                  <Slider
                    id="voice-volume"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[voiceVolume]}
                    onValueChange={handleVolumeChange}
                    disabled={!enabled}
                    className="flex-1"
                  />
                  <Volume2 className="h-4 w-4 text-gray-500" />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="voice-rate" className="text-base font-medium">
                  Speech Rate: {rate.toFixed(1)}x
                </Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm">Slow</span>
                  <Slider
                    id="voice-rate"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={[rate]}
                    onValueChange={handleRateChange}
                    disabled={!enabled}
                    className="flex-1"
                  />
                  <span className="text-sm">Fast</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="voice-pitch" className="text-base font-medium">
                  Voice Pitch: {pitch.toFixed(1)}
                </Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm">Low</span>
                  <Slider
                    id="voice-pitch"
                    min={0.5}
                    max={1.5}
                    step={0.1}
                    value={[pitch]}
                    onValueChange={handlePitchChange}
                    disabled={!enabled}
                    className="flex-1"
                  />
                  <span className="text-sm">High</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex flex-col space-y-2">
                  <Label className="text-base font-medium">
                    Additional Settings
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-gray-500" />
                        <span>Auto-read page content</span>
                      </div>
                      <Switch disabled={!enabled} />
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-gray-500" />
                        <span>Read hover elements</span>
                      </div>
                      <Switch disabled={!enabled} defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="test" className="mt-6 space-y-6">
            <div className="space-y-4">
              <Label htmlFor="demo-text" className="text-base font-medium">
                Test Text
              </Label>
              <textarea
                id="demo-text"
                value={demoText}
                onChange={(e) => setDemoText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md h-32"
                placeholder="Enter text to be spoken"
                aria-label="Text to be spoken by voice guidance"
              />

              <div className="flex gap-3">
                <VoiceGuidedButton
                  description="Speak the text in the text area"
                  onClick={() => handleSpeak()}
                  disabled={!enabled}
                  className="flex-1"
                >
                  <Volume2 className="mr-2 h-4 w-4" />
                  Speak Text
                </VoiceGuidedButton>

                <VoiceGuidedButton
                  description="Stop speaking"
                  onClick={() => handleStopSpeaking()}
                  disabled={!enabled}
                  variant="outline"
                  className="flex-1"
                >
                  <VolumeX className="mr-2 h-4 w-4" />
                  Stop
                </VoiceGuidedButton>
              </div>

              {recognition && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">
                      Voice Recognition Test
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Test speech recognition by speaking into your
                            microphone
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex gap-3 items-start">
                    <Button
                      onClick={handleToggleListening}
                      variant={isListening ? "destructive" : "default"}
                      className="flex-shrink-0"
                    >
                      <Mic className="mr-2 h-4 w-4" />
                      {isListening ? "Stop Listening" : "Start Listening"}
                    </Button>

                    <div className="flex-1 p-3 border rounded-md bg-gray-50 min-h-[100px]">
                      {transcript ? (
                        transcript
                      ) : (
                        <span className="text-gray-400">
                          {isListening
                            ? "Listening... speak now"
                            : "Click 'Start Listening' and speak"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="commands" className="mt-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Example Voice Commands</h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Experimental
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exampleCommands.map((command, index) => (
                  <VoiceGuidedElement
                    key={index}
                    description={`Example command: ${command}`}
                    className="p-3 bg-gray-50 rounded-lg border hover:border-primary cursor-pointer transition-colors"
                    onClick={true}
                  >
                    <div className="flex items-center gap-2">
                      <Mic className="h-4 w-4 text-gray-500" />
                      <span>"{command}"</span>
                    </div>
                  </VoiceGuidedElement>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-md mt-4">
                <h4 className="text-base font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Voice Command Tips
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-blue-700 text-sm">
                  <li>Speak clearly and at a moderate pace</li>
                  <li>Use the exact phrases shown in the examples</li>
                  <li>Wait for the beep before speaking</li>
                  <li>Commands work best in a quiet environment</li>
                  <li>You can say "Help" at any time for assistance</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-gray-50 p-4 rounded-md mt-6 border">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Voice Guidance Tips
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Enable voice guidance for audio feedback throughout the app</li>
            <li>Adjust volume and speech rate to your preference</li>
            <li>Hover over elements to hear descriptions</li>
            <li>
              All important actions and navigation elements have voice
              descriptions
            </li>
            <li>Press ESC key to stop any ongoing speech</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedVoiceGuidanceDemo;
