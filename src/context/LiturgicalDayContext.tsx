
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { parseISO } from 'date-fns';

// This is temporary data - in a production app, we would fetch this from an API
import { liturgicalEvents } from '@/data/liturgicalEvents';

export interface CalendarEvent {
  date: string;
  name: string;
  type: string;
  color: string;
  isDominican: boolean;
  description?: string;
}

interface LiturgicalDayContextType {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentEvent: CalendarEvent | null;
  setCurrentEvent: (event: CalendarEvent | null) => void;
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
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent | null>(null);

  // Initialize with today's event if available
  React.useEffect(() => {
    const todayEvents = liturgicalEvents.filter(event => {
      const eventDate = parseISO(event.date);
      return (
        eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()
      );
    });
    
    if (todayEvents.length > 0) {
      setCurrentEvent(todayEvents[0]);
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
