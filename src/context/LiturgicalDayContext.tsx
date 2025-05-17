
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Celebration } from '@/lib/liturgical/celebrations/celebrations-types';
import { getCelebrationsForDate } from '@/lib/liturgical/calendar-data';

interface LiturgicalDayContextType {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentEvent: Celebration | null;
  setCurrentEvent: (event: Celebration | null) => void;
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

  // Initialize with today's event if available
  React.useEffect(() => {
    const celebrations = getCelebrationsForDate(new Date());
    
    if (celebrations.length > 0) {
      setCurrentEvent(celebrations[0]);
    } else {
      setCurrentEvent(null);
    }
  }, []);

  const value = {
    selectedDate,
    setSelectedDate,
    currentEvent,
    setCurrentEvent,
  };

  return (
    <LiturgicalDayContext.Provider value={value}>
      {children}
    </LiturgicalDayContext.Provider>
  );
};
