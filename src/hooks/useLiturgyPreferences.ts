
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserLiturgyPreferences } from '@/lib/liturgical/types/liturgy-types';
import { useToast } from '@/hooks/use-toast';

const defaultPreferences: UserLiturgyPreferences = {
  primaryLanguage: 'en',
  secondaryLanguage: undefined,
  displayMode: 'primary-only',
  bibleTranslation: 'NRSV',
  audioEnabled: true,
  audioTypes: ['chant', 'spoken'],
  chantNotation: 'gregorian',
  fontSize: 'medium',
  showRubrics: true,
  useNightMode: false
};

export const useLiturgyPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserLiturgyPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  const loadPreferences = async () => {
    if (!user) {
      setPreferences(defaultPreferences);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_liturgy_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading liturgy preferences:', error);
        setPreferences(defaultPreferences);
        return;
      }

      if (data) {
        const userPrefs: UserLiturgyPreferences = {
          primaryLanguage: data.primary_language || 'en',
          secondaryLanguage: data.secondary_language || undefined,
          displayMode: data.display_mode || 'primary-only',
          bibleTranslation: data.bible_translation || 'NRSV',
          audioEnabled: data.audio_enabled ?? true,
          audioTypes: data.audio_types || ['chant', 'spoken'],
          chantNotation: data.chant_notation || 'gregorian',
          fontSize: data.font_size || 'medium',
          showRubrics: data.show_rubrics ?? true,
          useNightMode: data.use_night_mode ?? false
        };
        setPreferences(userPrefs);
      } else {
        setPreferences(defaultPreferences);
      }
    } catch (error) {
      console.error('Error loading liturgy preferences:', error);
      setPreferences(defaultPreferences);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (newPreferences: UserLiturgyPreferences) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save preferences.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_liturgy_preferences')
        .upsert({
          user_id: user.id,
          primary_language: newPreferences.primaryLanguage,
          secondary_language: newPreferences.secondaryLanguage,
          display_mode: newPreferences.displayMode,
          bible_translation: newPreferences.bibleTranslation,
          audio_enabled: newPreferences.audioEnabled,
          audio_types: newPreferences.audioTypes,
          chant_notation: newPreferences.chantNotation,
          font_size: newPreferences.fontSize,
          show_rubrics: newPreferences.showRubrics,
          use_night_mode: newPreferences.useNightMode,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        throw error;
      }

      setPreferences(newPreferences);
      toast({
        title: "Settings saved",
        description: "Your liturgy preferences have been updated successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error saving liturgy preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    loadPreferences();
  }, [user]);

  return {
    preferences,
    loading,
    savePreferences,
    refetchPreferences: loadPreferences
  };
};
