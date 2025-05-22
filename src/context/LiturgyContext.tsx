
import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { 
  LiturgyComponent, 
  LiturgyTemplate, 
  DailyOffice, 
  LiturgyPreferences, 
  LiturgyHour 
} from '@/lib/types/liturgy';
import { 
  fetchDailyOffice, 
  fetchLiturgyTemplate, 
  fetchUserPreferences,
  createOrUpdateUserPreferences,
  getComponentsForTemplate 
} from '@/services/liturgyService';
import { useAuth } from '@/context/AuthContext';
import { useLiturgicalDay } from '@/context/LiturgicalDayContext';
import { Celebration } from '@/lib/liturgical/celebrations/celebrations-types';

interface LiturgyContextType {
  currentHour: LiturgyHour;
  setCurrentHour: (hour: LiturgyHour) => void;
  dailyOffice: DailyOffice | null;
  selectedCelebration: Celebration | null;
  setSelectedCelebration: (celebration: Celebration | null) => void;
  activeTemplate: LiturgyTemplate | null;
  components: Record<string, LiturgyComponent | LiturgyComponent[]>;
  userPreferences: LiturgyPreferences | null;
  updateUserPreferences: (prefs: Partial<LiturgyPreferences>) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const defaultPreferences: Partial<LiturgyPreferences> = {
  language: 'en',
  display_options: {
    showRubrics: true,
    showLatinTexts: false,
    textSize: 'medium',
    useNightMode: false,
  },
  memorial_preference: 'both',
  calendar_type: 'general',
};

const LiturgyContext = createContext<LiturgyContextType | undefined>(undefined);

export const LiturgyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentHour, setCurrentHour] = useState<LiturgyHour>('lauds');
  const [dailyOffice, setDailyOffice] = useState<DailyOffice | null>(null);
  const [selectedCelebration, setSelectedCelebration] = useState<Celebration | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<LiturgyTemplate | null>(null);
  const [components, setComponents] = useState<Record<string, LiturgyComponent | LiturgyComponent[]>>({});
  const [userPreferences, setUserPreferences] = useState<LiturgyPreferences | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { selectedDate, currentEvent } = useLiturgicalDay();
  
  // Load user preferences
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (user) {
        const prefs = await fetchUserPreferences(user.id);
        if (prefs) {
          setUserPreferences(prefs);
        } else {
          // Create default preferences if none exist
          const newPrefs = await createOrUpdateUserPreferences(user.id, defaultPreferences);
          if (newPrefs) setUserPreferences(newPrefs);
        }
      } else {
        // Use default preferences for non-authenticated users
        setUserPreferences({
          user_id: 'anonymous',
          ...defaultPreferences,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as LiturgyPreferences);
      }
    };
    
    loadUserPreferences();
  }, [user]);
  
  // Load daily office data when date changes
  useEffect(() => {
    const loadDailyOffice = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!selectedDate) return;
        
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        let office = await fetchDailyOffice(dateStr);
        
        // If no office exists for this date but we have currentEvent, we can create a simple one
        if (!office && currentEvent) {
          // This would normally be done by an admin, but for demonstration we'll create a basic entry
          // In production, this should be pre-populated or handled differently
          console.log('No daily office exists for this date, would create one in production');
          // Would createDailyOffice here in production
        }
        
        if (office) {
          setDailyOffice(office);
          
          // Set initial celebration (from currentEvent or other source)
          if (currentEvent && !selectedCelebration) {
            setSelectedCelebration(currentEvent);
          }
          
          // Load template for current hour
          if (office.templates[currentHour]) {
            // Fix: Get the template ID first, then fetch the template object
            const templateId = office.templates[currentHour];
            const template = await fetchLiturgyTemplate(templateId);
            if (template) {
              setActiveTemplate(template);
              
              // Load components for this template
              const templateComponents = await getComponentsForTemplate(template);
              setComponents(templateComponents);
            }
          }
        } else {
          console.log('No office data available for this date');
        }
      } catch (err) {
        console.error('Error loading liturgy data:', err);
        setError('Failed to load prayer data for this date');
      } finally {
        setLoading(false);
      }
    };
    
    loadDailyOffice();
  }, [selectedDate, currentEvent, currentHour, selectedCelebration]);
  
  // Update user preferences
  const updateUserPreferences = async (prefs: Partial<LiturgyPreferences>) => {
    if (!user) return;
    
    try {
      const updatedPrefs = await createOrUpdateUserPreferences(user.id, prefs);
      if (updatedPrefs) {
        setUserPreferences(updatedPrefs);
      }
    } catch (err) {
      console.error('Error updating preferences:', err);
    }
  };
  
  const value = {
    currentHour,
    setCurrentHour,
    dailyOffice,
    selectedCelebration,
    setSelectedCelebration,
    activeTemplate,
    components,
    userPreferences,
    updateUserPreferences,
    loading,
    error
  };
  
  return (
    <LiturgyContext.Provider value={value}>
      {children}
    </LiturgyContext.Provider>
  );
};

export const useLiturgy = () => {
  const context = useContext(LiturgyContext);
  if (context === undefined) {
    throw new Error('useLiturgy must be used within a LiturgyProvider');
  }
  return context;
};
