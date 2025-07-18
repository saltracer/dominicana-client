import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useLiturgyPreferences } from '@/hooks/useLiturgyPreferences';
import { availableVoices } from '@/hooks/useTextToSpeech';
import { UserLiturgyPreferences, LanguageCode, BibleTranslation, AudioType, ChantNotation } from '@/lib/liturgical/types/liturgy-types';

const PreferencesTab: React.FC = () => {
  const { preferences, savePreferences, loading } = useLiturgyPreferences();
  const [localPreferences, setLocalPreferences] = useState<UserLiturgyPreferences>(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalPreferences(preferences);
    setHasChanges(false);
  }, [preferences]);

  const updatePreference = <K extends keyof UserLiturgyPreferences>(
    key: K,
    value: UserLiturgyPreferences[K]
  ) => {
    setLocalPreferences(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    const success = await savePreferences(localPreferences);
    if (success) {
      setHasChanges(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading preferences...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Language Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Language Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Primary Language</Label>
            <Select
              value={localPreferences.primaryLanguage}
              onValueChange={(value: LanguageCode) => updatePreference('primaryLanguage', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="la">Latin</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Secondary Language (Optional)</Label>
            <Select
              value={localPreferences.secondaryLanguage || 'none'}
              onValueChange={(value) => updatePreference('secondaryLanguage', value === 'none' ? undefined : value as LanguageCode)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="la">Latin</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Display Mode</Label>
            <Select
              value={localPreferences.displayMode}
              onValueChange={(value: 'primary-only' | 'bilingual' | 'secondary-only') => updatePreference('displayMode', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary-only">Primary Language Only</SelectItem>
                <SelectItem value="bilingual">Bilingual (Side by Side)</SelectItem>
                <SelectItem value="secondary-only">Secondary Language Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Bible Translation</Label>
            <Select
              value={localPreferences.bibleTranslation}
              onValueChange={(value: BibleTranslation) => updatePreference('bibleTranslation', value)}
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

      {/* Display Options */}
      <Card>
        <CardHeader>
          <CardTitle>Display Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Font Size</Label>
            <Select
              value={localPreferences.fontSize}
              onValueChange={(value: 'small' | 'medium' | 'large') => updatePreference('fontSize', value)}
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

          <div className="flex items-center justify-between">
            <Label htmlFor="show-rubrics">Show Rubrics</Label>
            <Switch
              id="show-rubrics"
              checked={localPreferences.showRubrics}
              onCheckedChange={(checked) => updatePreference('showRubrics', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="chant-notation">Show Chant Notation</Label>
            <Switch
              id="chant-notation"
              checked={localPreferences.chantNotationEnabled}
              onCheckedChange={(checked) => updatePreference('chantNotationEnabled', checked)}
            />
          </div>

          {localPreferences.chantNotationEnabled && (
            <div className="space-y-2">
              <Label>Chant Notation Style</Label>
              <Select
                value={localPreferences.chantNotation}
                onValueChange={(value: ChantNotation) => updatePreference('chantNotation', value)}
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
        </CardContent>
      </Card>
      
      {/* Audio & TTS Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Audio & Text-to-Speech</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="audio-enabled">Enable Audio</Label>
            <Switch
              id="audio-enabled"
              checked={localPreferences.audioEnabled}
              onCheckedChange={(checked) => updatePreference('audioEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="tts-enabled">Enable Text-to-Speech</Label>
            <Switch
              id="tts-enabled"
              checked={localPreferences.ttsEnabled ?? true}
              onCheckedChange={(checked) => updatePreference('ttsEnabled', checked)}
            />
          </div>

          {localPreferences.ttsEnabled && (
            <>
              <div className="space-y-2">
                <Label>Voice Selection</Label>
                <Select
                  value={localPreferences.ttsVoiceId || 'EXAVITQu4vr4xnSDxMaL'}
                  onValueChange={(value) => updatePreference('ttsVoiceId', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVoices.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        <div>
                          <div className="font-medium">{voice.name}</div>
                          <div className="text-xs text-gray-500">{voice.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Speech Speed</Label>
                <div className="px-2">
                  <Slider
                    value={[localPreferences.ttsSpeed || 1.0]}
                    onValueChange={([value]) => updatePreference('ttsSpeed', value)}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0.5x</span>
                    <span>{localPreferences.ttsSpeed || 1.0}x</span>
                    <span>2.0x</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {localPreferences.audioEnabled && (
            <div className="space-y-2">
              <Label>Audio Types</Label>
              <div className="space-y-2">
                {(['spoken', 'chant', 'organ'] as AudioType[]).map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Switch
                      id={`audio-${type}`}
                      checked={localPreferences.audioTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        const newTypes = checked
                          ? [...localPreferences.audioTypes, type]
                          : localPreferences.audioTypes.filter(t => t !== type);
                        updatePreference('audioTypes', newTypes);
                      }}
                    />
                    <Label htmlFor={`audio-${type}`} className="capitalize">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {hasChanges && (
        <div className="sticky bottom-0 bg-background border-t p-4">
          <Button onClick={handleSave} className="w-full">
            Save Preferences
          </Button>
        </div>
      )}
    </div>
  );
};

export default PreferencesTab;
