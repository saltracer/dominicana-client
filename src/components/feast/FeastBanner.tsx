
import React from 'react';
import { format, addDays, subDays, isEqual, startOfDay } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Info, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useLiturgicalDay } from '@/context/LiturgicalDayContext';
import { useIsMobile } from '@/hooks/use-mobile';
import CelebrationDetailsDialog from '@/components/calendar/CelebrationDetailsDialog';

const FeastBanner: React.FC = () => {
  const { selectedDate, setSelectedDate, currentEvent, setCurrentEvent } = useLiturgicalDay();
  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const isMobile = useIsMobile();
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = React.useState(false);

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    // Simply update the selected date - let the LiturgicalDayContext handle the rest
    setSelectedDate(date);
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
            "gap-2 sm:gap-0",
            "items-center sm:items-start" // Center on mobile, align start on desktop
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
              <div className="flex items-center justify-center sm:justify-end flex-wrap sm:flex-nowrap gap-2">
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
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsDetailsDialogOpen(true)}
                >
                  <Info className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Use the same CelebrationDetailsDialog component */}
      {currentEvent && (
        <CelebrationDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          celebration={currentEvent}
        />
      )}
    </div>
  );
};

export default FeastBanner;
