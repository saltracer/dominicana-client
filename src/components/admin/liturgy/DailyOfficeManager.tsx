
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daily Office Manager</h2>
      </div>

      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-[240px] justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formattedDate || "Pick a date"}
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
            
            {selectedDate && (
              <div className="text-sm text-muted-foreground">
                {format(selectedDate, 'EEEE')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Celebration Selection */}
      {currentEvent && (
        <Card>
          <CardHeader>
            <CardTitle>Celebration for {formattedDate}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="celebration">Select Celebration</Label>
                <Select 
                  value={selectedCelebration?.id || ''}
                  onValueChange={(value) => {
                    const selected = celebrations.find(c => c.id === value);
                    setSelectedCelebration(selected || null);
                  }}
                >
                  <SelectTrigger className="w-full">
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
                <Card className="bg-gray-50 border border-gray-200">
                  <CardContent className="pt-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {selectedCelebration.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Rank:</span> {selectedCelebration.rank}
                      </div>
                      <div>
                        <span className="font-medium">Color:</span> {selectedCelebration.color}
                      </div>
                    </div>
                    {selectedCelebration.description && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Description:</span> {selectedCelebration.description}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline">Cancel</Button>
                <Button 
                  className="bg-dominican-burgundy hover:bg-dominican-burgundy/90"
                  disabled={!selectedCelebration}
                >
                  Save Configuration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DailyOfficeManager;
