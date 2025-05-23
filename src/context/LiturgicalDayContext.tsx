
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Celebration } from '@/lib/liturgical/celebrations/celebrations-types';
import { getCelebrationsForDate } from '@/lib/liturgical/calendar-data';
import { getLiturgicalSeason } from '@/lib/liturgical/liturgical-seasons';

interface LiturgicalDayContextType {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentEvent: Celebration | null;
  setCurrentEvent: (event: Celebration | null) => void;
  currentSeason: string;
  alternativeEvents: Celebration[];
}

export const LiturgicalDayContext = createContext<LiturgicalDayContextType | undefined>(undefined);

export const useLiturgicalDay = () => {
  const context = useContext(LiturgicalDayContext);
  if (!context) {
    throw new Error('useLiturgicalDay must be used within a LiturgicalDayProvider');
  }
  return context;
};

interface LiturgicalDayProviderProps {
  children: ReactNode;
}

export const LiturgicalDayProvider = ({ children }: LiturgicalDayProviderProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentEvent, setCurrentEvent] = useState<Celebration | null>(null);
  const [currentSeason, setCurrentSeason] = useState<string>('ordinary');
  const [alternativeEvents, setAlternativeEvents] = useState<Celebration[]>([]);

  // Update events and season whenever the selected date changes
  useEffect(() => {
    try {
      const celebrations = getCelebrationsForDate(selectedDate);
      
      if (celebrations.length > 0) {
        // Set the main celebration
        setCurrentEvent(celebrations[0]);
        
        // Store alternative celebrations if there are more than one
        if (celebrations.length > 1) {
          setAlternativeEvents(celebrations.slice(1));
        } else {
          setAlternativeEvents([]);
        }
        
        // Determine the liturgical season based on the current event's color
        // Since Celebration doesn't have a direct 'season' property, we'll infer from color
        const color = celebrations[0]?.color?.toLowerCase() || 'green';
        let season = 'ordinary';
        
        // Map liturgical colors to seasons
        switch(color) {
          case 'purple':
          case 'violet':
            season = 'lent'; // Could be either Advent or Lent
            // Additional logic could be added here to determine if it's Advent or Lent
            // based on date ranges
            break;
          case 'white':
          case 'gold':
            // Could be Christmas or Easter season
            // For now, defaulting to 'christmas' if in December/January
            const month = selectedDate.getMonth();
            if (month === 11 || month === 0) { // December (11) or January (0)
              season = 'christmas';
            } else {
              season = 'easter';
            }
            break;
          case 'red':
            season = 'pentecost';
            break;
          case 'green':
          default:
            season = 'ordinary';
        }
        
        setCurrentSeason(season);
      } else {
        setCurrentEvent(null);
        setAlternativeEvents([]);
        
        // If no celebrations, determine season directly
        const season = getLiturgicalSeason(selectedDate);
        setCurrentSeason(season.name.toLowerCase());
      }
    } catch (error) {
      console.error('Error in LiturgicalDayProvider:', error);
      setCurrentEvent(null);
      setAlternativeEvents([]);
      setCurrentSeason('ordinary');
    }
  }, [selectedDate]);

  const value = {
    selectedDate,
    setSelectedDate,
    currentEvent,
    setCurrentEvent,
    currentSeason,
    alternativeEvents
  };

  return (
    <LiturgicalDayContext.Provider value={value}>
      {children}
    </LiturgicalDayContext.Provider>
  );
};
