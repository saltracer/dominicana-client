
import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, parseISO, addDays, getDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Temporary data for liturgical feasts and celebrations
// In a production app, this would come from an API or database
const liturgicalEvents = [
  {
    date: '2024-05-16',
    name: 'St. Andrew Bobola',
    type: 'Optional Memorial',
    color: 'red',
    isDominican: false
  },
  {
    date: '2024-05-20',
    name: 'St. Bernardine of Siena',
    type: 'Optional Memorial',
    color: 'white',
    isDominican: false
  },
  {
    date: '2024-05-21',
    name: 'Bl. Hyacinth Mary Cormier',
    type: 'Optional Memorial',
    color: 'white',
    isDominican: true
  },
  {
    date: '2024-05-24',
    name: 'Translation of Our Holy Father Dominic',
    type: 'Feast',
    color: 'white',
    isDominican: true
  },
  {
    date: '2024-05-25',
    name: 'St. Mary Magdalene de' Pazzi',
    type: 'Optional Memorial',
    color: 'white',
    isDominican: false
  },
  {
    date: '2024-05-26',
    name: 'Solemnity of the Most Holy Trinity',
    type: 'Solemnity',
    color: 'white',
    isDominican: false
  },
  {
    date: '2024-05-27',
    name: 'St. Augustine of Canterbury',
    type: 'Memorial',
    color: 'white',
    isDominican: false
  },
  {
    date: '2024-05-29',
    name: 'Bl. William and Companions',
    type: 'Optional Memorial',
    color: 'red',
    isDominican: true
  },
  {
    date: '2024-05-31',
    name: 'Visitation of the Blessed Virgin Mary',
    type: 'Feast',
    color: 'white',
    isDominican: false
  },
  // June events
  {
    date: '2024-06-01',
    name: 'St. Justin Martyr',
    type: 'Memorial',
    color: 'red',
    isDominican: false
  },
  {
    date: '2024-06-03',
    name: 'St. Charles Lwanga and Companions',
    type: 'Memorial',
    color: 'red',
    isDominican: false
  },
  {
    date: '2024-06-05',
    name: 'St. Boniface',
    type: 'Memorial',
    color: 'red',
    isDominican: false
  },
  {
    date: '2024-06-06',
    name: 'Corpus Christi',
    type: 'Solemnity',
    color: 'white',
    isDominican: false
  },
  {
    date: '2024-06-08',
    name: 'Bl. Diana and Blessed Cecilia',
    type: 'Memorial',
    color: 'white',
    isDominican: true
  },
  {
    date: '2024-06-09',
    name: 'St. Ephrem',
    type: 'Optional Memorial',
    color: 'white',
    isDominican: false
  },
  {
    date: '2024-06-10',
    name: 'Blessed John Dominici',
    type: 'Optional Memorial',
    color: 'white',
    isDominican: true
  },
];

interface CalendarEvent {
  date: string;
  name: string;
  type: string;
  color: string;
  isDominican: boolean;
  description?: string;
}

const LiturgicalCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
    
    // Find any events for this day
    const events = liturgicalEvents.filter(event => 
      isSameDay(parseISO(event.date), day)
    );
    
    if (events.length > 0) {
      setSelectedEvent(events[0]);
    } else {
      setSelectedEvent(null);
    }
  };

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
    const event = liturgicalEvents.find(event => 
      isSameDay(parseISO(event.date), day)
    );
    
    return event?.color || '';
  };

  const getEventType = (day: Date) => {
    const event = liturgicalEvents.find(event => 
      isSameDay(parseISO(event.date), day)
    );
    
    return event?.type || '';
  };

  const isDominicanFeast = (day: Date) => {
    const event = liturgicalEvents.find(event => 
      isSameDay(parseISO(event.date), day) && event.isDominican
    );
    
    return !!event;
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
        
        // Map liturgical colors to Tailwind classes
        const colorClasses: {[key: string]: string} = {
          'green': 'bg-liturgical-green text-white',
          'purple': 'bg-liturgical-purple text-white',
          'white': 'bg-liturgical-white text-dominican-black',
          'red': 'bg-liturgical-red text-white',
          'rose': 'bg-liturgical-rose text-dominican-black',
          'gold': 'bg-liturgical-gold text-dominican-black',
        };
        
        days.push(
          <div
            className={cn(
              "h-24 border border-dominican-light-gray p-1 relative",
              !isSameMonth(day, monthStart) && "bg-gray-100 text-gray-400"
            )}
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
          >
            <div className={cn(
              "flex justify-between",
              isSameDay(day, selectedDate) && "bg-dominican-burgundy/10 rounded"
            )}>
              <span className="text-sm p-1">{formattedDate}</span>
              {isDominican && (
                <span className="w-2 h-2 rounded-full bg-dominican-burgundy"></span>
              )}
            </div>
            
            {liturgicalColor && (
              <div className={cn(
                "text-xs p-1 mt-1 rounded",
                colorClasses[liturgicalColor] || ''
              )}>
                {eventType}
              </div>
            )}
            
            {/* Event name - show if there's an event */}
            {liturgicalColor && (
              <div className="text-xs mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {liturgicalEvents.find(event => isSameDay(parseISO(event.date), day))?.name}
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
          {selectedEvent ? selectedEvent.name : "Selected Day"}
        </h3>
        <div className="mb-4">
          <p className="text-gray-600">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
        </div>
        
        {selectedEvent ? (
          <div className="space-y-4">
            <div className={cn(
              "p-2 rounded",
              selectedEvent.color === 'green' && "bg-liturgical-green text-white",
              selectedEvent.color === 'purple' && "bg-liturgical-purple text-white",
              selectedEvent.color === 'white' && "bg-liturgical-white text-dominican-black",
              selectedEvent.color === 'red' && "bg-liturgical-red text-white",
              selectedEvent.color === 'rose' && "bg-liturgical-rose text-dominican-black",
              selectedEvent.color === 'gold' && "bg-liturgical-gold text-dominican-black"
            )}>
              {selectedEvent.type}
            </div>
            
            {selectedEvent.isDominican && (
              <div className="bg-dominican-burgundy/10 text-dominican-burgundy p-2 rounded">
                Dominican Feast
              </div>
            )}
            
            <p className="text-gray-700">
              {selectedEvent.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porta condimentum urna, vel elementum erat maximus at."}
            </p>
            
            {/* Additional information could be shown here */}
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
