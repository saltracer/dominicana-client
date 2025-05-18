import React from 'react';
import { format, addDays, subDays, isEqual, startOfDay } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Info, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useLiturgicalDay } from '@/context/LiturgicalDayContext';
import { getCelebrationsForDate } from '@/lib/liturgical/calendar-data';
import { useIsMobile } from '@/hooks/use-mobile';

const FeastBanner: React.FC = () => {
  const { selectedDate, setSelectedDate, currentEvent, setCurrentEvent } = useLiturgicalDay();
  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const isMobile = useIsMobile();

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
      'white': 'bg-liturgical-white text-dominican-black border border-gray-300',
      'red': 'bg-liturgical-red text-white',
      'rose': 'bg-liturgical-rose text-dominican-black',
      'gold': 'bg-liturgical-gold text-dominican-black',
      'violet': 'bg-liturgical-purple text-white', // Map violet to purple
    };
    
    return colorClasses[color.toLowerCase()] || '';
  };

  // Format description with proper paragraphs
  const formatDescription = (description: string | undefined) => {
    if (!description) return null;
    
    // If the description is already an array (from joined paragraphs), split it back
    const paragraphs = description.split(/(?<=\.|\?|\!) (?=[A-Z])/);
    
    return paragraphs.map((paragraph, index) => 
      <p key={index} className="text-sm text-gray-600 mb-2">{paragraph}</p>
    );
  };

  return (
    <div className="relative">
      {/* Liturgical color bar */}
      {currentEvent && (
        <div 
          className={cn(
            "h-1 w-full",
            getColorClasses(currentEvent.color).split(' ')[0] // Only take the background color class
          )}
        ></div>
      )}
      
      <div className="bg-dominican-light-gray/20 border-b border-dominican-light-gray w-full py-3">
        <div className="container mx-auto px-2 sm:px-4">
          <div className={cn(
            "flex flex-col sm:flex-row sm:items-center sm:justify-between",
            "gap-2 sm:gap-0"
          )}>
            <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap sm:flex-nowrap">
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
                  <Button variant="outline" size="sm" className="gap-1 border-dominican-light-gray max-w-full">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <h2 className="text-lg font-garamond font-semibold truncate">
                      {format(selectedDate, 'EEEE, MMM d, yyyy')}
                    </h2>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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
              <div className="flex items-center sm:justify-end flex-wrap sm:flex-nowrap gap-2">
                <div className={cn(
                  "px-3 py-1.5 rounded text-sm font-medium",
                  getColorClasses(currentEvent.color)
                )}>
                  {currentEvent.rank}
                </div>
                
                <h3 className="text-lg font-garamond font-semibold truncate max-w-[200px] sm:max-w-[300px]">
                  {currentEvent.name}
                </h3>
                
                {currentEvent.isDominican && (
                  <span className="bg-dominican-burgundy/10 text-dominican-burgundy text-xs px-2 py-0.5 rounded">
                    Dominican Feast
                  </span>
                )}
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-xl mb-1">{currentEvent.name}</h4>
                        <div className="flex items-center gap-2 mb-3">
                          <div className={cn(
                            "w-3 h-3 rounded-full",
                            getColorClasses(currentEvent.color).split(' ')[0]
                          )}></div>
                          <span className="text-sm font-medium">{currentEvent.rank}</span>
                          {currentEvent.isDominican && (
                            <span className="bg-dominican-burgundy/10 text-dominican-burgundy text-xs px-2 py-0.5 rounded">
                              Dominican
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Date information */}
                      {(currentEvent.birthYear || currentEvent.deathYear) && (
                        <div className="text-sm">
                          <span className="text-gray-500">
                            {currentEvent.birthYear && currentEvent.deathYear 
                              ? `${currentEvent.birthYear} - ${currentEvent.deathYear}` 
                              : (currentEvent.deathYear ? `d. ${currentEvent.deathYear}` : '')}
                          </span>
                        </div>
                      )}
                      
                      {/* Patronage information */}
                      {currentEvent.patronage && (
                        <div>
                          <span className="text-sm font-semibold">Patronage:</span>
                          <p className="text-sm">{currentEvent.patronage}</p>
                        </div>
                      )}
                      
                      {/* Formatted description */}
                      {currentEvent.description && (
                        <div className="mt-2">
                          {formatDescription(currentEvent.description)}
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeastBanner;
