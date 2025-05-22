
import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LiturgyComponent, LiturgyHour } from '@/lib/types/liturgy';
import { useLiturgy } from '@/context/LiturgyContext';
import { useLiturgicalDay } from '@/context/LiturgicalDayContext';
import { Celebration } from '@/lib/liturgical/celebrations/celebrations-types';
import { Loader2, Calendar as CalendarIcon } from 'lucide-react';
import ComponentRenderer from './ComponentRenderer';
import { ScrollArea } from '@/components/ui/scroll-area';

const hourLabels: Record<LiturgyHour, string> = {
  'office_of_readings': 'Office of Readings',
  'lauds': 'Morning Prayer (Lauds)',
  'terce': 'Mid-Morning Prayer (Terce)',
  'sext': 'Midday Prayer (Sext)',
  'none': 'Mid-Afternoon Prayer (None)',
  'vespers': 'Evening Prayer (Vespers)',
  'compline': 'Night Prayer (Compline)',
};

const LiturgyOfHoursDisplay: React.FC = () => {
  const { 
    currentHour, 
    setCurrentHour, 
    selectedCelebration,
    setSelectedCelebration,
    activeTemplate, // Using the alias we created
    components,
    loading, // Using the alias we created
    error
  } = useLiturgy();
  
  const { 
    selectedDate, 
    setSelectedDate, 
    currentEvent, 
    alternativeEvents = [] // Provide default empty array 
  } = useLiturgicalDay();
  
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Combine all celebration options
  const celebrationOptions = useMemo(() => {
    const options: Celebration[] = [];
    if (currentEvent) options.push(currentEvent);
    if (alternativeEvents && alternativeEvents.length > 0) options.push(...alternativeEvents);
    return options;
  }, [currentEvent, alternativeEvents]);
  
  // Format date for display
  const formattedDate = useMemo(() => {
    return selectedDate ? format(selectedDate, 'PP') : '';
  }, [selectedDate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-2">
        {currentHour ? hourLabels[currentHour] : "Liturgy of the Hours"}
      </h1>

      <div className="text-center mb-6">
        <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
      </div>
      
      {/* Date and celebration selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline"
                className="w-full md:w-auto justify-start text-left font-normal"
                onClick={() => setCalendarOpen(true)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formattedDate || "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setCalendarOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {celebrationOptions.length > 0 && (
            <div className="flex-1 min-w-[200px]">
              <Select 
                value={selectedCelebration?.id || ''} 
                onValueChange={(value) => {
                  const selected = celebrationOptions.find(c => c.id === value);
                  if (selected) setSelectedCelebration(selected);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select celebration" />
                </SelectTrigger>
                <SelectContent>
                  {celebrationOptions.map((celebration) => (
                    <SelectItem key={celebration.id} value={celebration.id}>
                      <div className="flex flex-col">
                        <span>{celebration.name}</span>
                        <span className="text-xs text-muted-foreground">{celebration.rank}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
      
      {/* Hour selection tabs */}
      <Tabs value={currentHour || 'lauds'} onValueChange={(value) => setCurrentHour(value as LiturgyHour)} className="mt-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 w-full">
          <TabsTrigger value="office_of_readings">Office of Readings</TabsTrigger>
          <TabsTrigger value="lauds">Lauds</TabsTrigger>
          <TabsTrigger value="terce">Terce</TabsTrigger>
          <TabsTrigger value="sext">Sext</TabsTrigger>
          <TabsTrigger value="none">None</TabsTrigger>
          <TabsTrigger value="vespers">Vespers</TabsTrigger>
          <TabsTrigger value="compline">Compline</TabsTrigger>
        </TabsList>
        
        <Card className="mt-4 p-0">
          <ScrollArea className="h-[calc(100vh-300px)] p-6">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-dominican-burgundy" />
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500">{error}</p>
              </div>
            ) : !activeTemplate ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No prayer content available for this date and hour.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Visit the Admin panel to add content for this day.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Render each component based on the template */}
                {Object.entries(components).map(([type, component]) => (
                  <ComponentRenderer 
                    key={type} 
                    type={type as LiturgyComponent['type']} 
                    component={component} 
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </Tabs>
    </div>
  );
};

export default LiturgyOfHoursDisplay;
