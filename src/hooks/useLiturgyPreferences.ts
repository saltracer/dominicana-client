import { useState, useEffect } from 'react';

export interface LiturgyPreferences {
  primaryLanguage: 'en' | 'la';
  secondaryLanguage?: 'en' | 'la';
  displayMode: 'primary-only' | 'secondary-only' | 'bilingual';
  fontSize: 'small' | 'normal' | 'large';
  textSize: 'normal' | 'large' | 'xlarge';
  showRubrics: boolean;
  chantNotationEnabled: boolean;
  audioEnabled: boolean;
}

const defaultPreferences: LiturgyPreferences = {
  primaryLanguage: 'en',
  secondaryLanguage: 'la',
  displayMode: 'primary-only',
  fontSize: 'normal',
  textSize: 'normal',
  showRubrics: true,
  chantNotationEnabled: false,
  audioEnabled: false
};

export const useLiturgyPreferences = () => {
  const [preferences, setPreferences] = useState<LiturgyPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Try to load preferences from localStorage
      const saved = localStorage.getItem('liturgy-preferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPreferences({ ...defaultPreferences, ...parsed });
      }
    } catch (error) {
      console.warn('Error loading liturgy preferences:', error);
      // Keep default preferences
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePreferences = (newPreferences: Partial<LiturgyPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    
    try {
      localStorage.setItem('liturgy-preferences', JSON.stringify(updated));
    } catch (error) {
      console.warn('Error saving liturgy preferences:', error);
    }
  };

  return {
    preferences,
    loading,
    updatePreferences
  };
};
