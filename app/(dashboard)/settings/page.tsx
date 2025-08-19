"use client";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc/init";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Card } from "@/components/ui/Card";
import { Settings, Moon, Sun, Monitor, Bell, Mail, Shield, Globe, Languages, RotateCcw, Clock } from "lucide-react";
import { useTheme } from "next-themes";
import { TimezoneService } from "@/lib/timezone";
import NotificationTest from "@/components/NotificationTest";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const utils = trpc.useUtils();
  
  const { data: settings, isLoading: loadingSettings } = trpc.settings.get.useQuery();
  const updateSettings = trpc.settings.update.useMutation({
    onSuccess: () => {
      utils.settings.get.invalidate();
      setIsLoading(false);
    },
    onError: () => setIsLoading(false),
  });
  const resetSettings = trpc.settings.reset.useMutation({
    onSuccess: () => {
      utils.settings.get.invalidate();
      setIsLoading(false);
    },
    onError: () => setIsLoading(false),
  });

  // Sync theme with settings
  useEffect(() => {
    if (settings?.theme && settings.theme !== theme) {
      setTheme(settings.theme);
    }
  }, [settings?.theme, theme, setTheme]);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setIsLoading(true);
    updateSettings.mutate({ [key]: value });
    
    // Apply theme immediately
    if (key === "theme") {
      setTheme(value);
    }
  };

  const handleReset = () => {
    setIsLoading(true);
    resetSettings.mutate();
  };

  if (loadingSettings || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}>
          Settings
        </h1>
      </div>

      <div className="grid gap-6">
        {/* Appearance */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Monitor className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Appearance
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <div className="flex gap-3">
                {[
                  { value: "light", icon: Sun, label: "Light" },
                  { value: "dark", icon: Moon, label: "Dark" },
                  { value: "system", icon: Monitor, label: "System" },
                ].map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => handleSettingChange("theme", value)}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                      theme === value
                        ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Notifications
            </h2>
          </div>
                     <div className="space-y-4">
             <div className="flex items-center justify-between">
               <div>
                 <label className="block text-sm font-medium">Enable Notifications</label>
                 <p className="text-sm text-gray-600">Receive notifications for habit reminders, friend requests, and cheers</p>
               </div>
              <button
                onClick={() => handleSettingChange("notificationsEnabled", !settings?.notificationsEnabled)}
                disabled={isLoading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings?.notificationsEnabled ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings?.notificationsEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-600" />
                <div>
                  <label className="block text-sm font-medium">Email Notifications</label>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
              </div>
              <button
                onClick={() => handleSettingChange("emailNotifications", !settings?.emailNotifications)}
                disabled={isLoading || !settings?.notificationsEnabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings?.emailNotifications && settings?.notificationsEnabled ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings?.emailNotifications && settings?.notificationsEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Privacy */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Privacy
            </h2>
          </div>
          <div className="space-y-4">
                         <div>
               <label className="block text-sm font-medium mb-2">Privacy Level</label>
               <select
                 value={settings?.privacyLevel || "friends"}
                 onChange={(e) => handleSettingChange("privacyLevel", e.target.value)}
                 disabled={isLoading}
                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               >
                 <option value="public">Public - Anyone can see your habits</option>
                 <option value="friends">Friends - Only friends can see your habits</option>
                 <option value="private">Only you can see your habits</option>
               </select>
               <p className="text-sm text-gray-600 mt-2">
                 This affects how your habits appear in the community and to other users.
               </p>
             </div>
          </div>
        </Card>

        {/* Regional */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-semibold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Regional
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
               <label className="block text-sm font-medium mb-2">Timezone</label>
               <select
                 value={settings?.timezone || "UTC"}
                 onChange={(e) => handleSettingChange("timezone", e.target.value)}
                 disabled={isLoading}
                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               >
                 <option value="UTC">UTC</option>
                 <option value="America/New_York">Eastern Time</option>
                 <option value="America/Chicago">Central Time</option>
                 <option value="America/Denver">Mountain Time</option>
                 <option value="America/Los_Angeles">Pacific Time</option>
                 <option value="Europe/London">London</option>
                 <option value="Europe/Paris">Paris</option>
                 <option value="Asia/Tokyo">Tokyo</option>
               </select>
               <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                 <Clock className="w-4 h-4" />
                 <span>
                   Current time: {TimezoneService.getCurrentTimeInTimezone(settings?.timezone as any || "UTC")}
                 </span>
               </div>
             </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={settings?.language || "en"}
                onChange={(e) => handleSettingChange("language", e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Reset Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <RotateCcw className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-semibold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Reset Settings
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Reset all settings to their default values. This action cannot be undone.
          </p>
          <Button
            variant="secondary"
            onClick={handleReset}
            disabled={isLoading}
            className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
          >
            {isLoading ? <Spinner className="w-4 h-4" /> : "Reset to Defaults"}
          </Button>
        </Card>

        {/* Notification Testing */}
        <NotificationTest />
      </div>
    </div>
  );
} 