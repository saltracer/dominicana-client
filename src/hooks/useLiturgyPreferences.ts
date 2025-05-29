
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserLiturgyPreferences, LanguageCode, BibleTranslation, AudioType, ChantNotation } from '@/lib/liturgical/types/liturgy-types';
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
  showRubrics: true
};

// Helper functions for type validation
const isValidLanguageCode = (value: string): value is LanguageCode => {
  return ['en', 'la', 'fr', 'es', 'de', 'it'].includes(value);
};

const isValidDisplayMode = (value: string): value is 'primary-only' | 'bilingual' | 'secondary-only' => {
  return ['primary-only', 'bilingual', 'secondary-only'].includes(value);
};

const isValidBibleTranslation = (value: string): value is BibleTranslation => {
  return ['NRSV', 'NAB', 'RSV', 'DRA', 'VULGATE'].includes(value);
};

const isValidChantNotation = (value: string): value is ChantNotation => {
  return ['modern', 'gregorian', 'solesmes'].includes(value);
};

const isValidFontSize = (value: string): value is 'small' | 'medium' | 'large' => {
  return ['small', 'medium', 'large'].includes(value);
};

const isValidAudioTypes = (value: any): value is AudioType[] => {
  if (!Array.isArray(value)) return false;
  const validTypes: AudioType[] = ['spoken', 'chant', 'organ'];
  return value.every(type => validTypes.includes(type));
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
          primaryLanguage: isValidLanguageCode(data.primary_language || 'en') ? data.primary_language as LanguageCode : 'en',
          secondaryLanguage: data.secondary_language && isValidLanguageCode(data.secondary_language) ? data.secondary_language as LanguageCode : undefined,
          displayMode: isValidDisplayMode(data.display_mode || 'primary-only') ? data.display_mode as 'primary-only' | 'bilingual' | 'secondary-only' : 'primary-only',
          bibleTranslation: isValidBibleTranslation(data.bible_translation || 'NRSV') ? data.bible_translation as BibleTranslation : 'NRSV',
          audioEnabled: data.audio_enabled ?? true,
          audioTypes: isValidAudioTypes(data.audio_types) ? data.audio_types as AudioType[] : ['chant', 'spoken'],
          chantNotation: isValidChantNotation(data.chant_notation || 'gregorian') ? data.chant_notation as ChantNotation : 'gregorian',
          fontSize: isValidFontSize(data.font_size || 'medium') ? data.font_size as 'small' | 'medium' | 'large' : 'medium',
          showRubrics: data.show_rubrics ?? true
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
