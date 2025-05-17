
import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useLiturgicalDay } from '@/context/LiturgicalDayContext';
import { parseISO } from 'date-fns';
import { liturgicalEvents } from '@/data/liturgicalEvents';

const FeastBanner: React.FC = () => {
  const { selectedDate, setSelectedDate, currentEvent, setCurrentEvent } = useLiturgicalDay();

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    
    const dateEvents = liturgicalEvents.filter(event => {
      const eventDate = parseISO(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
    
    if (dateEvents.length > 0) {
      setCurrentEvent(dateEvents[0]);
    } else {
      setCurrentEvent(null);
    }
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
    };
    
    return colorClasses[color] || '';
  };

  return (
    <div className="bg-dominican-light-gray/20 border-b border-dominican-light-gray w-full py-2">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {currentEvent ? (
            <>
              <div className={cn(
                "px-3 py-1.5 rounded text-sm font-medium",
                getColorClasses(currentEvent.color)
              )}>
                {currentEvent.type}
              </div>
              
              <h2 className="text-lg font-garamond font-semibold">
                {currentEvent.name}
              </h2>
              
              {currentEvent.isDominican && (
                <span className="bg-dominican-burgundy/10 text-dominican-burgundy text-xs px-2 py-0.5 rounded">
                  Dominican Feast
                </span>
              )}
            </>
          ) : (
            <h2 className="text-lg font-garamond font-semibold">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h2>
          )}
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1 border-dominican-light-gray">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Select Date</span>
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
      </div>
    </div>
  );
};

export default FeastBanner;
