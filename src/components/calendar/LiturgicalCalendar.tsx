import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLiturgicalDay } from '@/context/LiturgicalDayContext';
import { getCelebrationsForDate, getSpecialSeasonClass } from '@/lib/liturgical/calendar-data';

const LiturgicalCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { selectedDate, setSelectedDate, setCurrentEvent } = useLiturgicalDay();

  // Update selected date when clicking on a day
  const onDateClick = (day: Date) => {
    setSelectedDate(day);
    
    // Get celebrations for this day
    const celebrations = getCelebrationsForDate(day);
    
    if (celebrations.length > 0) {
      // Set the highest ranking celebration as the current event
      setCurrentEvent(celebrations[0]);
    } else {
      setCurrentEvent(null);
    }
  };

  // Navigation functions - now properly manage the month view
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between py-4">
        <Button
          onClick={prevMonth}
          variant="ghost"
          className="text-dominican-burgundy hover:bg-dominican-burgundy/10"
        >
          <ChevronLeft />
        </Button>
        <h2 className="font-garamond text-2xl font-bold text-dominican-burgundy">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <Button
          onClick={nextMonth}
          variant="ghost"
          className="text-dominican-burgundy hover:bg-dominican-burgundy/10"
        >
          <ChevronRight />
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEEEEE";
    const weekStart = startOfWeek(currentMonth, { weekStartsOn: 0 });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center text-xs font-medium text-gray-600 uppercase" key={i}>
          {format(addDays(weekStart, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const getLiturgicalColor = (day: Date) => {
    const celebrations = getCelebrationsForDate(day);
    return celebrations.length > 0 ? celebrations[0].color : '';
  };

  const getEventType = (day: Date) => {
    const celebrations = getCelebrationsForDate(day);
    return celebrations.length > 0 ? celebrations[0].rank : '';
  };

  const isDominicanFeast = (day: Date) => {
    const celebrations = getCelebrationsForDate(day);
    return celebrations.length > 0 ? celebrations[0].isDominican : false;
  };

  const getEventName = (day: Date) => {
    const celebrations = getCelebrationsForDate(day);
    return celebrations.length > 0 ? celebrations[0].name : '';
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const liturgicalColor = getLiturgicalColor(day);
        const eventType = getEventType(day);
        const isDominican = isDominicanFeast(day);
        const eventName = getEventName(day);
        const seasonClass = getSpecialSeasonClass(day);
        
        // Map liturgical colors to Tailwind classes
        const colorClasses: {[key: string]: string} = {
          'green': 'bg-liturgical-green text-white',
          'purple': 'bg-liturgical-purple text-white',
          'white': 'bg-liturgical-white text-dominican-black',
          'red': 'bg-liturgical-red text-white',
          'rose': 'bg-liturgical-rose text-dominican-black',
          'gold': 'bg-liturgical-gold text-dominican-black',
          'violet': 'bg-liturgical-purple text-white', // Map violet to purple
        };
        
        days.push(
          <div
            className={cn(
              "h-24 border border-dominican-light-gray p-1 relative",
              !isSameMonth(day, monthStart) && "bg-gray-100 text-gray-400",
              seasonClass && `${seasonClass}-bg`,
              isSameDay(day, selectedDate) && "ring-2 ring-dominican-burgundy ring-inset"
            )}
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
          >
            <div className={cn(
              "flex justify-between"
            )}>
              <span className="text-sm p-1">{formattedDate}</span>
              {isDominican && (
                <span className="w-2 h-2 rounded-full bg-dominican-burgundy"></span>
              )}
            </div>
            
            {liturgicalColor && (
              <div className={cn(
                "text-xs p-1 mt-1 rounded",
                colorClasses[liturgicalColor.toLowerCase()] || ''
              )}>
                {eventType}
              </div>
            )}
            
            {/* Event name - show if there's an event */}
            {eventName && (
              <div className="text-xs mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {eventName}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="lg:grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4 mb-6 lg:mb-0">
        <h2 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-4">Liturgical Calendar</h2>
        <div className="calendar">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center">
            <span className="w-4 h-4 rounded mr-2 bg-liturgical-green"></span>
            <span className="text-sm">Ordinary Time</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 rounded mr-2 bg-liturgical-purple"></span>
            <span className="text-sm">Advent/Lent</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 rounded mr-2 bg-liturgical-white"></span>
            <span className="text-sm">White Feasts</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 rounded mr-2 bg-liturgical-red"></span>
            <span className="text-sm">Martyrs</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 rounded mr-2 bg-liturgical-rose"></span>
            <span className="text-sm">Gaudete/Laetare</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 rounded mr-2 bg-dominican-burgundy"></span>
            <span className="text-sm">Dominican Feast</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-4">
          {getEventName(selectedDate) || "Selected Day"}
        </h3>
        <div className="mb-4">
          <p className="text-gray-600">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
        </div>
        
        {getCelebrationsForDate(selectedDate).length > 0 ? (
          <div className="space-y-4">
            <div className={cn(
              "p-2 rounded",
              getLiturgicalColor(selectedDate) === 'green' && "bg-liturgical-green text-white",
              getLiturgicalColor(selectedDate) === 'purple' && "bg-liturgical-purple text-white",
              getLiturgicalColor(selectedDate) === 'white' && "bg-liturgical-white text-dominican-black",
              getLiturgicalColor(selectedDate) === 'red' && "bg-liturgical-red text-white",
              getLiturgicalColor(selectedDate) === 'rose' && "bg-liturgical-rose text-dominican-black",
              getLiturgicalColor(selectedDate) === 'gold' && "bg-liturgical-gold text-dominican-black",
              getLiturgicalColor(selectedDate) === 'violet' && "bg-liturgical-purple text-white"
            )}>
              {getEventType(selectedDate)}
            </div>
            
            {isDominicanFeast(selectedDate) && (
              <div className="bg-dominican-burgundy/10 text-dominican-burgundy p-2 rounded">
                Dominican Feast
              </div>
            )}
            
            <p className="text-gray-700">
              {getCelebrationsForDate(selectedDate)[0]?.description || "No additional information available for this celebration."}
            </p>
            
            <Button variant="outline" className="border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10 mt-2">
              View Full Details
            </Button>
          </div>
        ) : (
          <div className="text-gray-600">
            <p>No celebrations or feasts on this day.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiturgicalCalendar;
