import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useLiturgicalDay } from '@/context/LiturgicalDayContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Celebration } from '@/lib/liturgical/celebrations/celebrations-types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DailyOfficeManager: React.FC = () => {
  const { selectedDate, setSelectedDate, currentEvent, alternativeEvents = [] } = useLiturgicalDay();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedCelebration, setSelectedCelebration] = useState<Celebration | null>(null);

  // Set initial celebration when currentEvent changes
  useEffect(() => {
    if (currentEvent) {
      setSelectedCelebration(currentEvent);
    }
  }, [currentEvent]);

  // Format date for display
  const formattedDate = selectedDate ? format(selectedDate, 'PP') : '';

  // All available celebrations for the selected date
  const celebrations = currentEvent 
    ? [currentEvent, ...(alternativeEvents || [])]
    : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Daily Office Manager</h2>
      </div>

      {/* Date Selection */}
      <div className="mb-4">
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[300px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formattedDate || "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Celebration Selection */}
      {currentEvent && (
        <Card>
          <CardHeader>
            <CardTitle>Celebration for {formattedDate}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="celebration">Celebration</Label>
                <Select 
                  value={selectedCelebration?.id || ''}
                  onValueChange={(value) => {
                    const selected = celebrations.find(c => c.id === value);
                    setSelectedCelebration(selected || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select celebration" />
                  </SelectTrigger>
                  <SelectContent>
                    {celebrations.map((celebration) => (
                      <SelectItem key={celebration.id} value={celebration.id}>
                        {celebration.name} ({celebration.rank})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedCelebration && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {selectedCelebration.name}
                  </h3>
                  <p>Rank: {selectedCelebration.rank}</p>
                  <p>Color: {selectedCelebration.color}</p>
                  {selectedCelebration.description && (
                    <p>Description: {selectedCelebration.description}</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DailyOfficeManager;
