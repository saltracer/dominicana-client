
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [loading, setLoading] = useState(true);

  // Get the resolved theme based on system preference
  const getSystemTheme = (): ResolvedTheme => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const resolvedTheme: ResolvedTheme = theme === 'system' ? getSystemTheme() : theme;

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  // Load theme preference from database
  const loadThemePreference = async () => {
    if (!user) {
      setThemeState('system');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_liturgy_preferences')
        .select('theme_preference')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading theme preference:', error);
        setThemeState('system');
        return;
      }

      if (data && data.theme_preference) {
        setThemeState(data.theme_preference as ThemeMode);
      } else {
        setThemeState('system');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
      setThemeState('system');
    } finally {
      setLoading(false);
    }
  };

  // Save theme preference to database
  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);

    if (!user) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_liturgy_preferences')
        .upsert({
          user_id: user.id,
          theme_preference: newTheme,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error saving theme preference:', error);
      toast({
        title: "Error",
        description: "Failed to save theme preference. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Force re-render when system theme changes and we're using system theme
      if (theme === 'system') {
        setThemeState('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
    loadThemePreference();
  }, [user]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        loading
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
