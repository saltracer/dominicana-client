import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LiturgyComponent, LiturgyHour, LiturgyPreferences, LiturgyTemplate } from '@/lib/types/liturgy';
import { 
  fetchLiturgyComponentById, 
  fetchLiturgyTemplate, 
  fetchUserPreferences, 
  getComponentsForTemplate,
  getTemplateForDateAndHour 
} from '@/services/liturgyService';
import { useAuth } from './AuthContext';
import { useLiturgicalDay } from './LiturgicalDayContext';
import { Celebration } from '@/lib/liturgical/celebrations/celebrations-types';

interface LiturgyContextType {
  currentHour: LiturgyHour | null;
  setCurrentHour: (hour: LiturgyHour) => void;
  currentTemplate: LiturgyTemplate | null;
  activeTemplate: LiturgyTemplate | null; // Add this for compatibility
  setCurrentTemplate: (template: LiturgyTemplate | string) => void;
  components: Record<string, LiturgyComponent[]>;
  isLoading: boolean;
  loading: boolean; // Add this for compatibility
  userPreferences: LiturgyPreferences | null;
  refreshComponents: () => Promise<void>;
  selectedCelebration: Celebration | null; // Add this
  setSelectedCelebration: (celebration: Celebration | null) => void; // Add this
  error: string | null; // Add this
}

const LiturgyContext = createContext<LiturgyContextType | undefined>(undefined);

export const useLiturgy = () => {
  const context = useContext(LiturgyContext);
  if (context === undefined) {
    throw new Error('useLiturgy must be used within a LiturgyProvider');
  }
  return context;
};

interface LiturgyProviderProps {
  children: ReactNode;
}

export const LiturgyProvider: React.FC<LiturgyProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { currentSeason, currentEvent, selectedDate } = useLiturgicalDay();
  
  const [currentHour, setCurrentHour] = useState<LiturgyHour | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<LiturgyTemplate | null>(null);
  const [components, setComponents] = useState<Record<string, LiturgyComponent[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userPreferences, setUserPreferences] = useState<LiturgyPreferences | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCelebration, setSelectedCelebration] = useState<Celebration | null>(null);

  // Set initial celebration based on liturgical day context
  useEffect(() => {
    if (currentEvent && !selectedCelebration) {
      setSelectedCelebration(currentEvent);
    }
  }, [currentEvent, selectedCelebration]);

  // Load user preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (user?.id) {
        try {
          const prefs = await fetchUserPreferences(user.id);
          setUserPreferences(prefs);
        } catch (error) {
          console.error('Error loading user preferences:', error);
        }
      }
    };
    
    loadPreferences();
  }, [user]);

  // Update template when the hour or date changes
  useEffect(() => {
    const loadTemplate = async () => {
      if (!currentHour) {
        // Default to a common hour
        setCurrentHour('compline');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Get the template based on the current date and hour
        const template = await getTemplateForDateAndHour(selectedDate, currentHour);
        
        if (template) {
          await handleTemplateChange(template);
        } else {
          setError(`No template available for ${currentHour} on ${selectedDate.toLocaleDateString()}`);
        }
      } catch (err) {
        console.error('Error loading template for date and hour:', err);
        setError('Failed to load the prayer template');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTemplate();
  }, [currentHour, selectedDate]);

  // Handle template changes and load components
  const handleTemplateChange = async (template: LiturgyTemplate | string) => {
    setIsLoading(true);
    setError(null);
    try {
      let templateObj: LiturgyTemplate | null = null;
      
      if (typeof template === 'string') {
        // If we received a template ID, fetch the template
        templateObj = await fetchLiturgyTemplate(template);
        if (!templateObj) {
          throw new Error(`Template with ID ${template} not found`);
        }
      } else {
        templateObj = template;
      }
      
      setCurrentTemplate(templateObj);
      
      // Load components for this template
      await refreshComponents(templateObj);
    } catch (error) {
      console.error('Error setting template:', error);
      setError('Failed to load template');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh components based on current template and season
  const refreshComponents = async (templateToUse?: LiturgyTemplate) => {
    const template = templateToUse || currentTemplate;
    if (!template) return;
    
    setIsLoading(true);
    try {
      // Get base components for the template
      const baseComponents = await getComponentsForTemplate(template);
      
      // Check for seasonal overrides
      if (currentSeason && template.season_overrides?.[currentSeason]) {
        const seasonalOverrides = template.season_overrides[currentSeason];
        
        // For each overridden component, fetch and replace the base component
        for (const [type, componentId] of Object.entries(seasonalOverrides)) {
          if (componentId) {
            const component = await fetchLiturgyComponentById(componentId as string);
            if (component) {
              // Replace the base component with the seasonal one
              baseComponents[type] = [component];
            }
          }
        }
      }
      
      setComponents(baseComponents);
    } catch (error) {
      console.error('Error loading components:', error);
      setError('Failed to load prayer components');
    } finally {
      setIsLoading(false);
    }
  };

  // Update components when season changes
  useEffect(() => {
    if (currentTemplate) {
      refreshComponents();
    }
  }, [currentSeason, currentTemplate]);

  const value = {
    currentHour,
    setCurrentHour,
    currentTemplate,
    activeTemplate: currentTemplate, // Alias for compatibility
    setCurrentTemplate: handleTemplateChange,
    components,
    isLoading,
    loading: isLoading, // Alias for compatibility
    userPreferences,
    refreshComponents: () => refreshComponents(),
    selectedCelebration,
    setSelectedCelebration,
    error,
  };

  return (
    <LiturgyContext.Provider value={value}>
      {children}
    </LiturgyContext.Provider>
  );
};
