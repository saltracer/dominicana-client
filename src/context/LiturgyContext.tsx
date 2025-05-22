import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LiturgyComponent, LiturgyHour, LiturgyPreferences, LiturgyTemplate } from '@/lib/types/liturgy';
import { fetchLiturgyComponentById, fetchLiturgyTemplate, fetchUserPreferences, getComponentsForTemplate } from '@/services/liturgyService';
import { useAuth } from './AuthContext';
import { useLiturgicalDay } from './LiturgicalDayContext';

interface LiturgyContextType {
  currentHour: LiturgyHour | null;
  setCurrentHour: (hour: LiturgyHour) => void;
  currentTemplate: LiturgyTemplate | null;
  setCurrentTemplate: (template: LiturgyTemplate | string) => void;
  components: Record<string, LiturgyComponent[]>;
  isLoading: boolean;
  userPreferences: LiturgyPreferences | null;
  refreshComponents: () => Promise<void>;
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
  const { currentSeason } = useLiturgicalDay();
  
  const [currentHour, setCurrentHour] = useState<LiturgyHour | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<LiturgyTemplate | null>(null);
  const [components, setComponents] = useState<Record<string, LiturgyComponent[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userPreferences, setUserPreferences] = useState<LiturgyPreferences | null>(null);

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

  // Handle template changes and load components
  const handleTemplateChange = async (template: LiturgyTemplate | string) => {
    setIsLoading(true);
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
    setCurrentTemplate: handleTemplateChange,
    components,
    isLoading,
    userPreferences,
    refreshComponents: () => refreshComponents(),
  };

  return (
    <LiturgyContext.Provider value={value}>
      {children}
    </LiturgyContext.Provider>
  );
};
