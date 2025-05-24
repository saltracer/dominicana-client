import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type LatinDisplayOption = 'off' | 'alongside' | 'only';

interface DisplayOptions {
  textSize: string;
  showRubrics: boolean;
  useNightMode: boolean;
  showLatinTexts: boolean;
  latinDisplay?: LatinDisplayOption;
}

interface UserPreferences {
  display_options: DisplayOptions;
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>({
    display_options: {
      textSize: 'medium',
      showRubrics: true,
      useNightMode: false,
      showLatinTexts: false,
      latinDisplay: 'off'
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserPreferences();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_liturgy_preferences')
        .select('display_options')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading preferences:', error);
        return;
      }

      if (data) {
        setPreferences({
          display_options: {
            ...preferences.display_options,
            ...(data.display_options as unknown as DisplayOptions),
            latinDisplay: (data.display_options as unknown as DisplayOptions)?.latinDisplay || 'off'
          }
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_liturgy_preferences')
        .upsert({
          user_id: user.id,
          display_options: preferences.display_options as any,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Settings saved",
        description: "Your liturgy preferences have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLatinDisplayChange = (value: LatinDisplayOption) => {
    setPreferences(prev => ({
      ...prev,
      display_options: {
        ...prev.display_options,
        latinDisplay: value
      }
    }));
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-4">
            Settings
          </h1>
          <p className="text-gray-600">Please sign in to access your settings.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-2">
        Settings
      </h1>
      <div className="text-center mb-6">
        <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-garamond text-xl">Liturgy of the Hours Preferences</CardTitle>
            <CardDescription>
              Configure how Latin prayers are displayed in the Liturgy of the Hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">Latin Text Display</Label>
              <RadioGroup
                value={preferences.display_options.latinDisplay}
                onValueChange={handleLatinDisplayChange}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="off" id="latin-off" />
                  <Label htmlFor="latin-off" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Hide Latin</div>
                      <div className="text-sm text-gray-600">Show only vernacular prayers</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="alongside" id="latin-alongside" />
                  <Label htmlFor="latin-alongside" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Show Latin Alongside</div>
                      <div className="text-sm text-gray-600">Display both Latin and vernacular prayers</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="only" id="latin-only" />
                  <Label htmlFor="latin-only" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Latin Only</div>
                      <div className="text-sm text-gray-600">Show only Latin prayers</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              onClick={savePreferences} 
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
    </div>
  );
};

export default SettingsPage;
