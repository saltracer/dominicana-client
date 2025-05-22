
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { createLiturgyTemplate, fetchLiturgyTemplates } from '@/services/liturgyService';
import { LiturgyTemplate } from '@/lib/types/liturgy';
import { sundayComplineTemplate } from '@/data/templates/sunday-compline-template';
import { mondayComplineTemplate } from '@/data/templates/monday-compline-template';
import { tuesdayComplineTemplate } from '@/data/templates/tuesday-compline-template';
import { wednesdayComplineTemplate } from '@/data/templates/wednesday-compline-template';
import { thursdayComplineTemplate } from '@/data/templates/thursday-compline-template';
import { fridayComplineTemplate } from '@/data/templates/friday-compline-template';
import { saturdayComplineTemplate } from '@/data/templates/saturday-compline-template';
import { weekdayComplineTemplate } from '@/data/templates/weekday-compline-template';

// Template options map
const templateOptions = {
  'sunday': sundayComplineTemplate,
  'monday': mondayComplineTemplate,
  'tuesday': tuesdayComplineTemplate,
  'wednesday': wednesdayComplineTemplate,
  'thursday': thursdayComplineTemplate,
  'friday': fridayComplineTemplate,
  'saturday': saturdayComplineTemplate,
  'weekday': weekdayComplineTemplate,
};

const dayOptions = [
  { label: 'Sunday', value: 'sunday' },
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
  { label: 'Generic Weekday', value: 'weekday' },
];

const DaySpecificTemplateHelper: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('sunday');
  const [existingTemplates, setExistingTemplates] = useState<string[]>([]);
  
  useEffect(() => {
    // Check which templates already exist
    const checkExistingTemplates = async () => {
      try {
        const templates = await fetchLiturgyTemplates();
        const existingDays: string[] = [];
        
        dayOptions.forEach(day => {
          const dayName = day.label;
          if (templates.some(t => t.name.toLowerCase().includes(dayName.toLowerCase()))) {
            existingDays.push(day.value);
          }
        });
        
        setExistingTemplates(existingDays);
      } catch (error) {
        console.error('Error checking existing templates:', error);
      }
    };
    
    checkExistingTemplates();
  }, []);
  
  const createTemplate = async () => {
    if (!selectedDay) {
      toast({
        title: 'Selection Required',
        description: 'Please select a day for the template',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    try {
      const templateData = templateOptions[selectedDay as keyof typeof templateOptions];
      if (!templateData) {
        throw new Error(`No template data found for ${selectedDay}`);
      }
      
      await createLiturgyTemplate(templateData);
      
      toast({
        title: 'Success',
        description: `${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)} Compline template created successfully`,
      });
      
      // Update existing templates list
      setExistingTemplates(prev => [...prev, selectedDay]);
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: 'Error',
        description: 'Failed to create template',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="border rounded-md p-4">
      <h3 className="text-lg font-semibold mb-4">Day-specific Compline Templates</h3>
      
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Day of Week</label>
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger>
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {dayOptions.map(option => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  disabled={existingTemplates.includes(option.value)}
                >
                  {option.label} {existingTemplates.includes(option.value) ? '(Exists)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={createTemplate}
          disabled={loading || existingTemplates.includes(selectedDay)}
          className="w-full"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calendar className="mr-2 h-4 w-4" />}
          Create {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)} Template
        </Button>
        
        {existingTemplates.length > 0 && (
          <Alert className="mt-4">
            <AlertTitle>Templates Created</AlertTitle>
            <AlertDescription>
              The following templates already exist: {existingTemplates.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default DaySpecificTemplateHelper;
