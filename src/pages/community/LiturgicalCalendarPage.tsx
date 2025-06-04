
import React from 'react';
import LiturgicalCalendar from '@/components/calendar/LiturgicalCalendar';

const LiturgicalCalendarPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-2">
        Liturgical Calendar
      </h1>
      <div className="text-center mb-6">
        <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
      </div>
      <p className="text-gray-700 dark:text-gray-200 mb-8">
        The liturgical calendar for the Order of Preachers includes both the general 
        calendar of the Roman Catholic Church and special celebrations specific to the 
        Dominican Order. Explore feasts, solemnities, memorials, and other celebrations 
        throughout the liturgical year.
      </p>
      
      <LiturgicalCalendar />
    </div>
  );
};

export default LiturgicalCalendarPage;
