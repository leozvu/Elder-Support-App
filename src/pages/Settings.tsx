import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Globe, Shield, User, Volume2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "en");

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    i18n.changeLanguage(value);
    localStorage.setItem("i18nextLng", value);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6">{t("settings.title")}</h1>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.account")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t("settings.notifications")}
              </span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.privacy")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="accessibility"
              className="flex items-center gap-2"
            >
              <Volume2 className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t("settings.accessibility")}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your personal details here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Martha Johnson" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="martha.j@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      defaultValue="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Home Address</Label>
                    <Input
                      id="address"
                      defaultValue="123 Maple Street, Anytown"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control how you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Service Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your service requests
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Helper Arrival Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when your helper is on the way
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Community Hub Updates</p>
                      <p className="text-sm text-muted-foreground">
                        News and events from your local hubs
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        Emergency Contact Notifications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Alert your emergency contacts in case of SOS
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Manage your privacy preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Location Sharing</p>
                      <p className="text-sm text-muted-foreground">
                        Share your location with helpers during service
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Profile Visibility</p>
                      <p className="text-sm text-muted-foreground">
                        Allow helpers to see your profile information
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Collection</p>
                      <p className="text-sm text-muted-foreground">
                        Allow anonymous data collection to improve services
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    Download My Data
                  </Button>
                </div>
                <div className="flex justify-end">
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accessibility">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.accessibilityOptions")}</CardTitle>
                <CardDescription>
                  {t("settings.customizeExperience")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t("settings.largerText")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("settings.largerText")}
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {t("settings.highContrastMode")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("settings.highContrastMode")}
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {t("settings.screenReaderSupport")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("settings.screenReaderSupport")}
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {t("settings.voiceCommands")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("settings.voiceCommands")}
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t("settings.language")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("settings.selectLanguage")}
                      </p>
                    </div>
                    <Select
                      value={language}
                      onValueChange={handleLanguageChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue
                          placeholder={t("settings.selectLanguage")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">{t("languages.en")}</SelectItem>
                        <SelectItem value="es">{t("languages.es")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>{t("settings.savePreferences")}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
