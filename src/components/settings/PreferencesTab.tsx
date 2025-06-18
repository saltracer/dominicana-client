
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLiturgyPreferences } from '@/hooks/useLiturgyPreferences';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Monitor, Moon, Sun } from 'lucide-react';
import { UserLiturgyPreferences } from '@/lib/liturgical/types/liturgy-types';

const PreferencesTab: React.FC = () => {
  const { user } = useAuth();
  const { preferences, loading, savePreferences } = useLiturgyPreferences();
  const { theme, setTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [localPreferences, setLocalPreferences] = useState<UserLiturgyPreferences>(preferences);

  React.useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleSave = async () => {
    setSaving(true);
    await savePreferences(localPreferences);
    setSaving(false);
  };

  const updatePreference = (key: keyof UserLiturgyPreferences, value: any) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to access your preferences.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading your preferences...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-garamond text-xl">Appearance</CardTitle>
          <CardDescription>
            Configure the visual appearance of Dominicana.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                className="flex flex-col gap-2 h-auto py-3"
                onClick={() => setTheme('light')}
              >
                <Sun className="h-5 w-5" />
                <span className="text-sm">Light</span>
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                className="flex flex-col gap-2 h-auto py-3"
                onClick={() => setTheme('dark')}
              >
                <Moon className="h-5 w-5" />
                <span className="text-sm">Dark</span>
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                className="flex flex-col gap-2 h-auto py-3"
                onClick={() => setTheme('system')}
              >
                <Monitor className="h-5 w-5" />
                <span className="text-sm">System</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Choose your preferred theme. System theme will follow your device's settings.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size</Label>
            <Select
              value={localPreferences.fontSize}
              onValueChange={(value) => updatePreference('fontSize', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-garamond text-xl">Language & Display Preferences</CardTitle>
          <CardDescription>
            Configure how prayers are displayed in the Liturgy of the Hours.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Display Mode</Label>
            <RadioGroup
              value={localPreferences.displayMode}
              onValueChange={(value) => updatePreference('displayMode', value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="primary-only" id="primary-only" />
                <Label htmlFor="primary-only" className="cursor-pointer">
                  <div>
                    <div className="font-medium">Primary Language Only</div>
                    <div className="text-sm text-gray-600">Show only in your primary language</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bilingual" id="bilingual" />
                <Label htmlFor="bilingual" className="cursor-pointer">
                  <div>
                    <div className="font-medium">Bilingual</div>
                    <div className="text-sm text-gray-600">Display both primary and secondary languages</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="secondary-only" id="secondary-only" />
                <Label htmlFor="secondary-only" className="cursor-pointer">
                  <div>
                    <div className="font-medium">Secondary Language Only</div>
                    <div className="text-sm text-gray-600">Show only in your secondary language</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-language">Primary Language</Label>
              <Select
                value={localPreferences.primaryLanguage}
                onValueChange={(value) => updatePreference('primaryLanguage', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="la">Latin</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-language">Secondary Language</Label>
              <Select
                value={localPreferences.secondaryLanguage || 'none'}
                onValueChange={(value) => updatePreference('secondaryLanguage', value === 'none' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="la">Latin</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bible-translation">Bible Translation</Label>
            <Select
              value={localPreferences.bibleTranslation}
              onValueChange={(value) => updatePreference('bibleTranslation', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NRSV">NRSV</SelectItem>
                <SelectItem value="NAB">NAB</SelectItem>
                <SelectItem value="RSV">RSV</SelectItem>
                <SelectItem value="DRA">Douay-Rheims</SelectItem>
                <SelectItem value="VULGATE">Vulgate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-garamond text-xl">Audio & Display Options</CardTitle>
          <CardDescription>
            Configure audio and visual preferences for prayers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="audio-enabled" className="text-base">Enable Audio</Label>
              <div className="text-sm text-gray-600">Allow audio playback for prayers and chants</div>
            </div>
            <Switch
              id="audio-enabled"
              checked={localPreferences.audioEnabled}
              onCheckedChange={(checked) => updatePreference('audioEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-rubrics" className="text-base">Show Rubrics</Label>
              <div className="text-sm text-gray-600">Display liturgical instructions and notes</div>
            </div>
            <Switch
              id="show-rubrics"
              checked={localPreferences.showRubrics}
              onCheckedChange={(checked) => updatePreference('showRubrics', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="chant-notation-enabled" className="text-base">Enable Chant Notation</Label>
              <div className="text-sm text-gray-600">Show chant notation and musical formatting</div>
            </div>
            <Switch
              id="chant-notation-enabled"
              checked={localPreferences.chantNotationEnabled}
              onCheckedChange={(checked) => updatePreference('chantNotationEnabled', checked)}
            />
          </div>

          {localPreferences.audioEnabled && (
            <div className="space-y-2">
              <Label htmlFor="chant-notation">Chant Notation</Label>
              <Select
                value={localPreferences.chantNotation}
                onValueChange={(value) => updatePreference('chantNotation', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="gregorian">Gregorian</SelectItem>
                  <SelectItem value="solesmes">Solesmes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full sm:w-auto"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreferencesTab;
