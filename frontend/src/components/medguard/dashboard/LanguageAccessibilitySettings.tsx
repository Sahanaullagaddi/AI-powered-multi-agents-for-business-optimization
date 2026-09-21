import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Globe, Volume2, Eye, Moon, Sun, Languages } from "lucide-react";

interface LanguageSettings {
  language: string;
  voice: boolean;
  highContrast: boolean;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  notifications: boolean;
}

export default function LanguageAccessibilitySettings() {
  const [settings, setSettings] = useState<LanguageSettings>({
    language: 'en',
    voice: false,
    highContrast: true,
    darkMode: false,
    fontSize: 'medium',
    notifications: true
  });

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  ];

  const handleSettingChange = (key: keyof LanguageSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // In a real app, this would save to backend/localStorage
    localStorage.setItem('userSettings', JSON.stringify(settings));
    // Show success message
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Language Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-500" />
            <CardTitle>Language Settings</CardTitle>
          </div>
          <CardDescription>
            Choose your preferred language for the application interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="language">Select Language</Label>
              <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Supported Languages</h4>
              <div className="flex flex-wrap gap-2">
                {languages.map(lang => (
                  <Badge key={lang.code} variant={settings.language === lang.code ? "default" : "secondary"}>
                    {lang.flag} {lang.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-green-500" />
            <CardTitle>Accessibility Settings</CardTitle>
          </div>
          <CardDescription>
            Customize the application to meet your accessibility needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Voice Assistance */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4" />
                <Label htmlFor="voice">Voice Assistance</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Enable voice guidance for navigation and alerts
              </p>
            </div>
            <Switch
              id="voice"
              checked={settings.voice}
              onCheckedChange={(checked) => handleSettingChange('voice', checked)}
            />
          </div>

          {/* High Contrast Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <Label htmlFor="highContrast">High Contrast Mode</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Increase contrast for better visibility
              </p>
            </div>
            <Switch
              id="highContrast"
              checked={settings.highContrast}
              onCheckedChange={(checked) => handleSettingChange('highContrast', checked)}
            />
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                {settings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <Label htmlFor="darkMode">Dark Mode</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Switch to dark theme for comfortable viewing
              </p>
            </div>
            <Switch
              id="darkMode"
              checked={settings.darkMode}
              onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
            />
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <Label>Font Size</Label>
            <Select value={settings.fontSize} onValueChange={(value: any) => handleSettingChange('fontSize', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              Preview: <span className={
                settings.fontSize === 'small' ? 'text-sm' :
                settings.fontSize === 'large' ? 'text-lg' : 'text-base'
              }>This is how your text will appear</span>
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <Languages className="h-4 w-4" />
                <Label htmlFor="notifications">Push Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Receive alerts for medication reminders and updates
              </p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Save Your Preferences</h3>
              <p className="text-sm text-muted-foreground">
                Your settings will be applied immediately and saved for future sessions.
              </p>
            </div>
            <Button onClick={saveSettings} size="lg">
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Information */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Screen Reader Support</h4>
              <p className="text-sm text-muted-foreground">
                All interactive elements include proper ARIA labels and descriptions.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Keyboard Navigation</h4>
              <p className="text-sm text-muted-foreground">
                Navigate through the application using Tab, Enter, and arrow keys.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Color Blind Support</h4>
              <p className="text-sm text-muted-foreground">
                High contrast mode and alternative color schemes available.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Font Customization</h4>
              <p className="text-sm text-muted-foreground">
                Adjust font size and family for better readability.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}