import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AccessibilityControls from "@/components/accessibility/AccessibilityControls";

const AccessibilityDemo = () => {
  const [settings, setSettings] = useState({
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

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    console.log("Settings changed:", newSettings);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Accessibility Features Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This demo showcases the accessibility features available in the
            Senior Assistance Platform. Use the controls below to toggle
            different accessibility modes.
          </p>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Accessibility Controls</h3>
            <AccessibilityControls
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />
          </div>

          <div className="mt-8 p-6 border rounded-md">
            <h3 className="text-xl font-bold mb-4">Preview Area</h3>
            <p className="mb-4">
              This text will change based on your accessibility settings. Try
              enabling large text mode or high contrast mode to see the
              difference.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-gray-100 rounded-md">
                <h4 className="font-medium mb-2">Service Request</h4>
                <p>
                  Request assistance with grocery shopping, medical
                  appointments, or companionship.
                </p>
              </div>
              <div className="p-4 bg-gray-100 rounded-md">
                <h4 className="font-medium mb-2">Emergency Help</h4>
                <p>
                  Access emergency services or contact your designated emergency
                  contacts.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 text-sm text-gray-500">
        <p>
          Note: The settings you choose here will be saved to your browser's
          local storage and applied across the entire application.
        </p>
      </div>
    </div>
  );
};

export default AccessibilityDemo;
