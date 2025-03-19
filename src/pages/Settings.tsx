import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const { userDetails } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    privacy: {
      shareLocation: true,
      shareProfile: false,
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      screenReader: false,
    },
  });
  
  const handleToggle = (category: keyof typeof settings, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };
  
  const handleSave = () => {
    // In a real app, this would save the settings to the database
    alert("Settings saved successfully!");
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="notifications">
              <TabsList className="mb-4">
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
              </TabsList>
              
              <TabsContent value="notifications" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => handleToggle('notifications', 'email', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications via text message</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.sms}
                    onCheckedChange={(checked) => handleToggle('notifications', 'sms', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications in the app</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => handleToggle('notifications', 'push', checked)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="privacy" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Share Location</h3>
                    <p className="text-sm text-gray-500">Allow the app to access your location</p>
                  </div>
                  <Switch 
                    checked={settings.privacy.shareLocation}
                    onCheckedChange={(checked) => handleToggle('privacy', 'shareLocation', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Share Profile</h3>
                    <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                  </div>
                  <Switch 
                    checked={settings.privacy.shareProfile}
                    onCheckedChange={(checked) => handleToggle('privacy', 'shareProfile', checked)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="accessibility" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">High Contrast</h3>
                    <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
                  </div>
                  <Switch 
                    checked={settings.accessibility.highContrast}
                    onCheckedChange={(checked) => handleToggle('accessibility', 'highContrast', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Large Text</h3>
                    <p className="text-sm text-gray-500">Increase text size for better readability</p>
                  </div>
                  <Switch 
                    checked={settings.accessibility.largeText}
                    onCheckedChange={(checked) => handleToggle('accessibility', 'largeText', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Screen Reader Support</h3>
                    <p className="text-sm text-gray-500">Optimize for screen readers</p>
                  </div>
                  <Switch 
                    checked={settings.accessibility.screenReader}
                    onCheckedChange={(checked) => handleToggle('accessibility', 'screenReader', checked)}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6">
              <Button onClick={handleSave}>Save Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;