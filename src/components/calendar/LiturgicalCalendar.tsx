
import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLiturgicalDay } from '@/context/LiturgicalDayContext';
import { getCelebrationsForDate, getSpecialSeasonClass } from '@/lib/liturgical/calendar-data';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import CelebrationDetailsDialog from './CelebrationDetailsDialog';
import { Celebration } from '@/lib/liturgical/celebrations/celebrations-types';
import { AlertDialogTitle } from '@/components/ui/alert-dialog';

const LiturgicalCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { selectedDate, setSelectedDate, setCurrentEvent } = useLiturgicalDay();
  const [celebrations, setCelebrations] = useState(getCelebrationsForDate(selectedDate));
  const [selectedCelebration, setSelectedCelebration] = useState<Celebration | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  useEffect(() => {
    // Update celebrations when selected date changes
    const newCelebrations = getCelebrationsForDate(selectedDate);
    setCelebrations(newCelebrations);
    
    // Update current event in context
    if (newCelebrations.length > 0) {
      setCurrentEvent(newCelebrations[0]);
    } else {
      setCurrentEvent(null);
    }
  }, [selectedDate, setCurrentEvent]);

  // Update selected date when clicking on a day
  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  // Navigation functions for month view
  const nextMonth = () => {
    const nextMonthDate = addMonths(currentMonth, 1);
    setCurrentMonth(nextMonthDate);
  };

  const prevMonth = () => {
    const prevMonthDate = subMonths(currentMonth, 1);
    setCurrentMonth(prevMonthDate);
  };

  const openDetailsDialog = (celebration: Celebration) => {
    setSelectedCelebration(celebration);
    setIsDetailsDialogOpen(true);
  };

  // Format description with proper paragraphs for preview
  const formatDescriptionPreview = (description: string | undefined, maxLength: number = 150) => {
    if (!description) return '';
    
    if (description.length <= maxLength) return description;
    
    return description.substring(0, maxLength) + '...';
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between py-4">
        <Button
          onClick={prevMonth}
          variant="ghost"
          className="text-dominican-burgundy hover:bg-dominican-burgundy/10 dark:hover:bg-dominican-burgundy/50"
        >
          <ChevronLeft />
        </Button>
        <h2 className="font-garamond text-2xl font-bold text-dominican-burgundy">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <Button
          onClick={nextMonth}
          variant="ghost"
          className="text-dominican-burgundy hover:bg-dominican-burgundy/10 dark:hover:bg-dominican-burgundy/50"
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
        <div className="text-center text-xs font-medium dark:text-gray-200 text-gray-600 uppercase" key={i}>
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

  const getMultipleCelebrationCount = (day: Date) => {
    const celebrations = getCelebrationsForDate(day);
    return celebrations.length;
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
        const celebrationsCount = getMultipleCelebrationCount(day);
        const seasonClass = getSpecialSeasonClass(day);
        
        // Map liturgical colors to Tailwind classes
        const colorClasses: {[key: string]: string} = {
          'green': 'bg-liturgical-green text-white',
          'purple': 'bg-liturgical-purple text-white',
          'white': 'bg-liturgical-white text-dominican-black border border-gray-300',
          'red': 'bg-liturgical-red text-white',
          'rose': 'bg-liturgical-rose text-dominican-black',
          'gold': 'bg-liturgical-gold text-dominican-black',
          'violet': 'bg-liturgical-purple text-white', // Map violet to purple
        };
        
        days.push(
          <div
            className={cn(
              "h-24 border border-dominican-light-gray dark:border-gray-600 dark:bg-gray-900 p-1 relative",
              !isSameMonth(day, monthStart) && "bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-400",
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
              
              {liturgicalColor && (
                <span className={cn(
                  "text-xs p-1 mt-1 rounded",
                  colorClasses[liturgicalColor.toLowerCase()] || ''
                )}>
                  {eventType.split(' ')[0]}
                </span>
              )}

              {isDominican && (
                <span className="w-2 h-2 rounded-full bg-dominican-burgundy"></span>
              )}
              
            </div>
                        
            {/* Event name - show if there's an event */}
            {eventName && (
              <div className="text-xs mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {eventName}
              </div>
            )}

            {/* Multiple celebrations indicator */}
            {celebrationsCount > 1 && (
              <div className="absolute bottom-1 right-1 dark:bg-dominican-dark-gray">
                <Badge variant="outline" className="text-[10px] h-5 bg-white dark:bg-gray-300 dark:text-gray-700">+{celebrationsCount - 1}</Badge>
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
    <>
      <div className="lg:grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-dominican-light-gray rounded-lg shadow-md p-4 mb-6 lg:mb-0">
          <h2 className="font-garamond text-2xl font-bold text-dominican-burgundy dark:text-white mb-4">Liturgical Calendar</h2>
          <div className="calendar">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center">
              <span className="w-4 h-4 rounded mr-2 bg-dominican-burgundy"></span>
              <span className="text-sm">Dominican Feast</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 rounded mr-2 bg-liturgical-red"></span>
              <span className="text-sm">Martyrs</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 rounded mr-2 bg-liturgical-white border border-gray-300"></span>
              <span className="text-sm">White Feasts</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 rounded mr-2 bg-liturgical-green"></span>
              <span className="text-sm">Ordinary Time</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 rounded mr-2 bg-liturgical-purple"></span>
              <span className="text-sm">Advent/Lent</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 rounded mr-2 bg-liturgical-rose"></span>
              <span className="text-sm">Gaudete/Laetare</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dominican-light-gray rounded-lg shadow-md p-4">
          <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy dark:text-white mb-4">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          
          {celebrations.length > 0 ? (
            <div className="space-y-4">
              {celebrations.map((celebration, index) => (
                <div key={celebration.id || index} className="pb-4">
                  {index > 0 && <Separator className="my-4" />}
                  
                  <div className={cn(
                    "p-2 rounded mb-3",
                    celebration.color === 'green' && "bg-liturgical-green text-white",
                    celebration.color === 'purple' && "bg-liturgical-purple text-white",
                    celebration.color === 'white' && "bg-liturgical-white text-dominican-black border border-gray-300",
                    celebration.color === 'red' && "bg-liturgical-red text-white",
                    celebration.color === 'rose' && "bg-liturgical-rose text-dominican-black",
                    celebration.color === 'gold' && "bg-liturgical-gold text-dominican-black",
                    celebration.color === 'violet' && "bg-liturgical-purple text-white"
                  )}>
                    <div className="flex justify-between items-center">
                      <span className="font-garamond text-lg font-semibold">{celebration.name}</span>
                      {celebration.isDominican && (
                        <span className="text-xs px-2 py-0.5 rounded bg-dominican-burgundy text-white">Dominican</span>
                      )}
                      <span className="text-sm">{celebration.rank}</span>
                    </div>
                  </div>
                  
                  
                  
                  {/* Additional details if available */}
                  {(celebration.birthYear || celebration.deathYear) && (
                    <p className="text-sm text-gray-500 mb-2">
                      {celebration.birthYear && celebration.deathYear 
                        ? `${celebration.birthYear} - ${celebration.deathYear}` 
                        : (celebration.deathYear ? `d. ${celebration.deathYear}` : '')}
                    </p>
                  )}
                  
                  {celebration.patronage && (
                    <p className="text-sm mb-3">
                      <span className="font-semibold">Patronage:</span> {celebration.patronage}
                    </p>
                  )}
                  
                  {celebration.description && (
                    <p className="text-gray-700 dark:text-gray-200 text-sm mb-3">
                      {formatDescriptionPreview(celebration.description)}
                    </p>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10 w-full mt-2"
                    onClick={() => openDetailsDialog(celebration)}
                  >
                    View Full Details
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-200">
              <p>No celebrations or feasts on this day.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Details Dialog */}
      <CelebrationDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        celebration={selectedCelebration}
      />
    </>
  );
};

export default LiturgicalCalendar;
