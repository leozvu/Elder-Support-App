import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VoiceGuidanceButton from "@/components/voice-guidance/VoiceGuidanceButton";
import VoiceGuidanceSettings from "@/components/voice-guidance/VoiceGuidanceSettings";
import { VoiceGuidanceProvider } from "@/components/voice-guidance/VoiceGuidanceProvider";
import { speak } from "@/lib/voice-guidance";

const VoiceGuidanceDemo = () => {
  return (
    <VoiceGuidanceProvider>
      <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Voice Guidance System
        </h1>

        <div className="flex justify-center space-x-4 mb-8">
          <VoiceGuidanceButton size="default" variant="default" />
          <VoiceGuidanceSettings />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Assistance</CardTitle>
              <CardDescription>
                Voice-guided navigation through the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                The system announces page changes and important navigation
                elements.
              </p>
              <Button
                onClick={() =>
                  speak(
                    "This button simulates navigating to the Dashboard page",
                  )
                }
                className="w-full mb-2"
              >
                Dashboard
              </Button>
              <Button
                onClick={() =>
                  speak("This button simulates navigating to the Services page")
                }
                className="w-full mb-2"
                variant="outline"
              >
                Services
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Elements</CardTitle>
              <CardDescription>
                Voice announcements for interactive elements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Hover over or focus on elements to hear descriptions.
              </p>
              <div className="space-y-4">
                <Button
                  onMouseOver={() => speak("Emergency assistance button")}
                  onFocus={() => speak("Emergency assistance button")}
                  variant="destructive"
                  className="w-full"
                >
                  Emergency Assistance
                </Button>
                <Button
                  onMouseOver={() => speak("Schedule a service request")}
                  onFocus={() => speak("Schedule a service request")}
                  variant="secondary"
                  className="w-full"
                >
                  Schedule Service
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Voice Guidance Instructions</CardTitle>
            <CardDescription>
              How to use the voice guidance system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Toggle voice guidance on/off using the Voice On/Off button
              </li>
              <li>Adjust voice speed and pitch in Voice Settings</li>
              <li>Navigate through the app to hear automatic announcements</li>
              <li>
                Hover over or focus on interactive elements for descriptions
              </li>
              <li>The system will automatically announce page changes</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </VoiceGuidanceProvider>
  );
};

export default VoiceGuidanceDemo;
