
import React from 'react';
import { format, addDays, subDays, isEqual, startOfDay } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Info, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useLiturgicalDay } from '@/context/LiturgicalDayContext';
import { getCelebrationsForDate } from '@/lib/liturgical/calendar-data';

const FeastBanner: React.FC = () => {
  const { selectedDate, setSelectedDate, currentEvent, setCurrentEvent } = useLiturgicalDay();
  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    
    const celebrations = getCelebrationsForDate(date);
    
    if (celebrations.length > 0) {
      setCurrentEvent(celebrations[0]);
    } else {
      setCurrentEvent(null);
    }
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? subDays(selectedDate, 1) 
      : addDays(selectedDate, 1);
    handleDateChange(newDate);
  };

  // Map liturgical colors to Tailwind classes
  const getColorClasses = (color: string | undefined) => {
    if (!color) return '';
    
    const colorClasses: {[key: string]: string} = {
      'green': 'bg-liturgical-green text-white',
      'purple': 'bg-liturgical-purple text-white',
      'white': 'bg-liturgical-white text-dominican-black',
      'red': 'bg-liturgical-red text-white',
      'rose': 'bg-liturgical-rose text-dominican-black',
      'gold': 'bg-liturgical-gold text-dominican-black',
      'violet': 'bg-liturgical-purple text-white', // Map violet to purple
    };
    
    return colorClasses[color.toLowerCase()] || '';
  };

  return (
    <div className="bg-dominican-light-gray/20 border-b border-dominican-light-gray w-full py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigateDay('prev')}
              className="hover:bg-dominican-light-gray/30"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 border-dominican-light-gray">
                  <Calendar className="h-4 w-4" />
                  <h2 className="text-lg font-garamond font-semibold">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </h2>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {!isToday && (
              <Button 
                variant="outline" 
                size="icon" 
                className=""
                onClick={() => handleDateChange(new Date())}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigateDay('next')}
              className="hover:bg-dominican-light-gray/30"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        
          {currentEvent && (
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "px-3 py-1.5 rounded text-sm font-medium",
                getColorClasses(currentEvent.color)
              )}>
                {currentEvent.rank}
              </div>
              
              <h3 className="text-lg font-garamond font-semibold">
                {currentEvent.name}
              </h3>
              
              {currentEvent.isDominican && (
                <span className="bg-dominican-burgundy/10 text-dominican-burgundy text-xs px-2 py-0.5 rounded">
                  Dominican Feast
                </span>
              )}
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold">{currentEvent.name}</h4>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      getColorClasses(currentEvent.color)
                    )}></div>
                    <span className="text-sm">{currentEvent.rank}</span>
                  </div>
                  {currentEvent.description && (
                    <p className="text-sm text-gray-600">{currentEvent.description}</p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}

        </div>
        
      </div>
    </div>
  );
};

export default FeastBanner;
