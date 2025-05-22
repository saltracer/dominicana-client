
import React, { useState, useEffect } from 'react';
import { format, parse, addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { DailyOffice, LiturgyTemplate } from '@/lib/types/liturgy';
import { Celebration } from '@/lib/liturgical/celebrations/celebrations-types';
import { useLiturgicalDay } from '@/context/LiturgicalDayContext';
import { 
  fetchDailyOffice, 
  createDailyOffice, 
  updateDailyOffice,
  fetchLiturgyTemplates
} from '@/services/liturgyService';
import { Textarea } from '@/components/ui/textarea';

const DailyOfficeManager: React.FC = () => {
  const [dailyOffice, setDailyOffice] = useState<DailyOffice | null>(null);
  const [templates, setTemplates] = useState<LiturgyTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { currentEvent, alternativeEvents } = useLiturgicalDay();
  
  // Form state
  const [formData, setFormData] = useState<Partial<DailyOffice>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    celebration_id: '',
    alternative_celebrations: [],
    templates: {},
    component_overrides: {}
  });
  
  // Load templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templatesData = await fetchLiturgyTemplates();
        setTemplates(templatesData);
      } catch (error) {
        console.error('Error loading templates:', error);
        toast({
          title: 'Error',
          description: 'Failed to load templates',
          variant: 'destructive',
        });
      }
    };
    
    loadTemplates();
  }, []);
  
  // Load daily office when date changes
  useEffect(() => {
    const loadDailyOffice = async () => {
      if (!selectedDate) return;
      
      setLoading(true);
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const office = await fetchDailyOffice(formattedDate);
        
        setDailyOffice(office);
        
        if (office) {
          setFormData({
            date: office.date,
            celebration_id: office.celebration_id,
            alternative_celebrations: office.alternative_celebrations || [],
            templates: office.templates || {},
            component_overrides: office.component_overrides || {}
          });
        } else {
          // Initialize with current date and default values
          setFormData({
            date: formattedDate,
            celebration_id: currentEvent?.id || '',
            alternative_celebrations: alternativeEvents?.map(e => e.id) || [],
            templates: {},
            component_overrides: {}
          });
        }
      } catch (error) {
        console.error('Error loading daily office:', error);
        toast({
          title: 'Error',
          description: 'Failed to load office data for this date',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadDailyOffice();
  }, [selectedDate, currentEvent, alternativeEvents]);
  
  // Filter templates by hour
  const getTemplatesByHour = (hour: string) => {
    return templates.filter(template => template.hour === hour);
  };
  
  // Handle form changes
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
    setCalendarOpen(false);
  };
  
  const handleCelebrationSelect = (celebrationId: string) => {
    setFormData(prev => ({ ...prev, celebration_id: celebrationId }));
  };
  
  const handleTemplateSelect = (hour: string, templateId: string) => {
    setFormData(prev => ({
      ...prev,
      templates: {
        ...prev.templates,
        [hour]: templateId
      }
    }));
  };
  
  // Handle JSON fields
  const handleJsonChange = (field: 'templates' | 'component_overrides' | 'alternative_celebrations', value: string) => {
    try {
      const parsedValue = JSON.parse(value);
      setFormData(prev => ({ ...prev, [field]: parsedValue }));
    } catch (e) {
      console.error(`Invalid JSON for ${field}:`, e);
      toast({
        title: 'Invalid JSON',
        description: `The ${field} field must contain valid JSON`,
        variant: 'destructive',
      });
    }
  };
  
  // Open dialog for editing
  const openDialog = () => {
    setDialogOpen(true);
  };
  
  // Save daily office
  const handleSave = async () => {
    try {
      if (!formData.date || !formData.celebration_id) {
        toast({
          title: 'Validation Error',
          description: 'Date and celebration are required',
          variant: 'destructive',
        });
        return;
      }
      
      let result;
      if (dailyOffice) {
        // Update existing
        result = await updateDailyOffice(dailyOffice.id, formData);
      } else {
        // Create new
        result = await createDailyOffice(formData as any);
      }
      
      if (result) {
        toast({
          title: 'Success',
          description: dailyOffice ? 'Office updated' : 'Office created',
        });
        
        setDailyOffice(result);
      }
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving daily office:', error);
      toast({
        title: 'Error',
        description: `Failed to ${dailyOffice ? 'update' : 'create'} daily office`,
        variant: 'destructive',
      });
    }
  };
  
  // Navigate to adjacent days
  const navigateDay = (direction: 'prev' | 'next') => {
    if (!selectedDate) return;
    
    const newDate = direction === 'prev' ? 
      addDays(selectedDate, -1) : 
      addDays(selectedDate, 1);
    
    setSelectedDate(newDate);
  };
  
  const hourOptions = [
    { value: 'office_of_readings', label: 'Office of Readings' },
    { value: 'lauds', label: 'Morning Prayer (Lauds)' },
    { value: 'terce', label: 'Mid-Morning Prayer (Terce)' },
    { value: 'sext', label: 'Midday Prayer (Sext)' },
    { value: 'none', label: 'Mid-Afternoon Prayer (None)' },
    { value: 'vespers', label: 'Evening Prayer (Vespers)' },
    { value: 'compline', label: 'Night Prayer (Compline)' },
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Daily Office Configuration</h2>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigateDay('prev')}>
            Previous Day
          </Button>
          
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PP') : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" onClick={() => navigateDay('next')}>
            Next Day
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Date and Celebration Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Date</h3>
                <p className="text-xl">{selectedDate ? format(selectedDate, 'PPP') : ""}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Primary Celebration</h3>
                <p className="text-xl">{currentEvent?.name || "None"}</p>
                {currentEvent && (
                  <p className="text-sm text-gray-500">{currentEvent.rank}</p>
                )}
              </div>
              
              {alternativeEvents && alternativeEvents.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Alternative Celebrations</h3>
                  <ul className="list-disc pl-5">
                    {alternativeEvents.map(event => (
                      <li key={event.id}>
                        {event.name} <span className="text-sm text-gray-500">({event.rank})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-lg font-semibold mb-2">Office Status</h3>
              {dailyOffice ? (
                <div className="flex justify-between items-center">
                  <p className="text-green-600">Office configured for this date</p>
                  <Button onClick={openDialog}>
                    <Pencil className="w-4 h-4 mr-2" /> Edit Configuration
                  </Button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-amber-600">No office configured for this date</p>
                  <Button onClick={openDialog}>
                    <Plus className="w-4 h-4 mr-2" /> Create Configuration
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Current Configuration */}
          {dailyOffice && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Current Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700">Selected Celebration</h4>
                  <p>{currentEvent?.name || dailyOffice.celebration_id}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Hour Templates</h4>
                  <div className="border rounded-md overflow-x-auto mt-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Hour</TableHead>
                          <TableHead>Template</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(dailyOffice.templates).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center py-4">
                              No templates assigned
                            </TableCell>
                          </TableRow>
                        ) : (
                          Object.entries(dailyOffice.templates).map(([hour, templateId]) => {
                            const template = templates.find(t => t.id === templateId);
                            return (
                              <TableRow key={hour}>
                                <TableCell>
                                  {hourOptions.find(h => h.value === hour)?.label || hour}
                                </TableCell>
                                <TableCell>
                                  {template ? template.name : templateId}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                {dailyOffice.component_overrides && Object.keys(dailyOffice.component_overrides).length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700">Component Overrides</h4>
                    <pre className="bg-gray-50 p-3 rounded text-sm mt-2 overflow-x-auto">
                      {JSON.stringify(dailyOffice.component_overrides, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Configuration Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {dailyOffice ? 'Edit Office Configuration' : 'Create Office Configuration'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                {/* Date (read-only) */}
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input 
                    value={formData.date || ''} 
                    readOnly 
                  />
                </div>
                
                {/* Primary Celebration */}
                <div className="space-y-2">
                  <Label htmlFor="celebration_id">Primary Celebration *</Label>
                  <Select 
                    value={formData.celebration_id || ''} 
                    onValueChange={handleCelebrationSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select celebration" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentEvent && (
                        <SelectItem value={currentEvent.id}>
                          {currentEvent.name} ({currentEvent.rank})
                        </SelectItem>
                      )}
                      {alternativeEvents && alternativeEvents.map(event => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name} ({event.rank})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Alternative Celebrations (JSON) */}
                <div className="space-y-2">
                  <Label htmlFor="alternative_celebrations">Alternative Celebrations (JSON Array)</Label>
                  <Textarea 
                    id="alternative_celebrations"
                    value={JSON.stringify(formData.alternative_celebrations || [], null, 2)} 
                    onChange={(e) => handleJsonChange('alternative_celebrations', e.target.value)}
                    className="font-mono"
                    placeholder="[]"
                  />
                </div>
                
                {/* Hour Templates Assignment */}
                <div className="space-y-4">
                  <Label>Hour Templates</Label>
                  <div className="space-y-2">
                    {hourOptions.map(({ value: hour, label }) => {
                      const templatesForHour = getTemplatesByHour(hour);
                      const selectedId = formData.templates?.[hour] as string;
                      
                      return (
                        <div key={hour} className="grid grid-cols-3 items-center gap-2">
                          <Label className="text-right">{label}</Label>
                          <Select 
                            value={selectedId || ''} 
                            onValueChange={(value) => handleTemplateSelect(hour, value)}
                            disabled={templatesForHour.length === 0}
                          >
                            <SelectTrigger className="col-span-2">
                              <SelectValue 
                                placeholder={templatesForHour.length === 0 ? 
                                  `No templates available for ${hour}` : 
                                  `Select template for ${hour}`} 
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">None</SelectItem>
                              {templatesForHour.map(template => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Templates (JSON) */}
                <div className="space-y-2">
                  <Label htmlFor="templates">Templates (JSON)</Label>
                  <Textarea 
                    id="templates"
                    value={JSON.stringify(formData.templates || {}, null, 2)} 
                    onChange={(e) => handleJsonChange('templates', e.target.value)}
                    className="font-mono"
                    placeholder="{}"
                  />
                </div>
                
                {/* Component Overrides (JSON) */}
                <div className="space-y-2">
                  <Label htmlFor="component_overrides">Component Overrides (JSON)</Label>
                  <Textarea 
                    id="component_overrides"
                    value={JSON.stringify(formData.component_overrides || {}, null, 2)} 
                    onChange={(e) => handleJsonChange('component_overrides', e.target.value)}
                    className="font-mono"
                    placeholder="{}"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {dailyOffice ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default DailyOfficeManager;
