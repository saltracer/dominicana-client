
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fetchLiturgyComponentsByType, createLiturgyTemplate } from '@/services/liturgyService';
import { LiturgyComponent } from '@/lib/types/liturgy';

const ComplineTemplateCreator: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [components, setComponents] = useState<{
    hymns: LiturgyComponent[];
    psalms: LiturgyComponent[];
    readings: LiturgyComponent[];
    prayers: LiturgyComponent[];
    antiphons: LiturgyComponent[];
  }>({
    hymns: [],
    psalms: [],
    readings: [],
    prayers: [],
    antiphons: [],
  });
  
  const [selectedComponents, setSelectedComponents] = useState<{
    hymn: string;
    psalm: string;
    reading: string;
    prayer: string;
    antiphon: string;
  }>({
    hymn: '',
    psalm: '',
    reading: '',
    prayer: '',
    antiphon: '',
  });
  
  const [includeSundayOptions, setIncludeSundayOptions] = useState({
    longIntroduction: true,
    specialAntiphon: true,
    longerBlessing: true,
  });
  
  // Fetch available components
  useEffect(() => {
    const fetchComponents = async () => {
      setLoading(true);
      try {
        const [hymnsData, psalmsData, readingsData, prayersData, antiphonsData] = await Promise.all([
          fetchLiturgyComponentsByType('hymn'),
          fetchLiturgyComponentsByType('psalm'),
          fetchLiturgyComponentsByType('reading'),
          fetchLiturgyComponentsByType('concluding_prayer'),
          fetchLiturgyComponentsByType('antiphon'),
        ]);
        
        setComponents({
          hymns: hymnsData.data || [],
          psalms: psalmsData.data || [],
          readings: readingsData.data || [],
          prayers: prayersData.data || [],
          antiphons: antiphonsData.data || [],
        });
      } catch (error) {
        console.error('Error fetching components:', error);
        toast({
          title: 'Error',
          description: 'Failed to load liturgical components',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchComponents();
  }, [toast]);
  
  const handleComponentSelect = (type: string, value: string) => {
    setSelectedComponents(prev => ({
      ...prev,
      [type]: value,
    }));
  };
  
  const handleOptionChange = (option: keyof typeof includeSundayOptions) => {
    setIncludeSundayOptions(prev => ({
      ...prev,
      [option]: !prev[option],
    }));
  };
  
  const createComplineTemplate = async () => {
    // Validate selections
    if (!selectedComponents.hymn || !selectedComponents.psalm || 
        !selectedComponents.reading || !selectedComponents.prayer) {
      toast({
        title: 'Missing Components',
        description: 'Please select all required components for the template',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    try {
      // Create template structure
      const templateData = {
        name: 'Sunday Compline',
        hour: 'compline',
        rank: 'SOLEMNITY', // Sunday is typically highest rank
        components: {
          hymn: selectedComponents.hymn,
          psalm: selectedComponents.psalm,
          reading: selectedComponents.reading,
          concluding_prayer: selectedComponents.prayer,
        },
        // Add conditional components
        ...(selectedComponents.antiphon ? { 
          antiphon: selectedComponents.antiphon 
        } : {}),
      };
      
      // Add Sunday specific options if selected
      if (includeSundayOptions.specialAntiphon && selectedComponents.antiphon) {
        templateData.components.antiphon = selectedComponents.antiphon;
      }
      
      const result = await createLiturgyTemplate(templateData);
      
      if (result) {
        toast({
          title: 'Success',
          description: 'Sunday Compline template has been created',
        });
        setSuccess(true);
      }
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: 'Error',
        description: 'Failed to create Sunday Compline template',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Sunday Compline Template Creator</h2>
      </div>
      
      {success ? (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <AlertDescription className="text-green-700">
            Sunday Compline template was successfully created and saved to the database.
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Create Sunday Compline Template</CardTitle>
            <CardDescription>
              Select components to include in the Sunday Compline template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Required Components */}
            <div className="space-y-4">
              <h3 className="font-medium">Required Components</h3>
              
              {/* Hymn Selection */}
              <div className="space-y-2">
                <Label htmlFor="hymn">Hymn</Label>
                <Select
                  value={selectedComponents.hymn}
                  onValueChange={(value) => handleComponentSelect('hymn', value)}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a hymn" />
                  </SelectTrigger>
                  <SelectContent>
                    {components.hymns.map((hymn) => (
                      <SelectItem key={hymn.id} value={hymn.id}>{hymn.title || 'Untitled Hymn'}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Psalm Selection */}
              <div className="space-y-2">
                <Label htmlFor="psalm">Psalm</Label>
                <Select
                  value={selectedComponents.psalm}
                  onValueChange={(value) => handleComponentSelect('psalm', value)}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a psalm" />
                  </SelectTrigger>
                  <SelectContent>
                    {components.psalms.map((psalm) => (
                      <SelectItem key={psalm.id} value={psalm.id}>
                        {psalm.title || `Psalm ${psalm.psalm_number || 'Untitled'}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Reading Selection */}
              <div className="space-y-2">
                <Label htmlFor="reading">Reading</Label>
                <Select
                  value={selectedComponents.reading}
                  onValueChange={(value) => handleComponentSelect('reading', value)}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a reading" />
                  </SelectTrigger>
                  <SelectContent>
                    {components.readings.map((reading) => (
                      <SelectItem key={reading.id} value={reading.id}>
                        {reading.title || reading.citation || 'Untitled Reading'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Prayer Selection */}
              <div className="space-y-2">
                <Label htmlFor="prayer">Concluding Prayer</Label>
                <Select
                  value={selectedComponents.prayer}
                  onValueChange={(value) => handleComponentSelect('prayer', value)}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a prayer" />
                  </SelectTrigger>
                  <SelectContent>
                    {components.prayers.map((prayer) => (
                      <SelectItem key={prayer.id} value={prayer.id}>
                        {prayer.title || 'Untitled Prayer'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Optional Components */}
            <div className="space-y-4">
              <h3 className="font-medium">Optional Components</h3>
              
              {/* Antiphon Selection */}
              <div className="space-y-2">
                <Label htmlFor="antiphon">Gospel Canticle Antiphon</Label>
                <Select
                  value={selectedComponents.antiphon}
                  onValueChange={(value) => handleComponentSelect('antiphon', value)}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an antiphon (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {components.antiphons.map((antiphon) => (
                      <SelectItem key={antiphon.id} value={antiphon.id}>
                        {antiphon.title || 'Untitled Antiphon'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Sunday Options */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Sunday Specific Options</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="longIntro" 
                      checked={includeSundayOptions.longIntroduction} 
                      onCheckedChange={() => handleOptionChange('longIntroduction')}
                    />
                    <Label htmlFor="longIntro">Use longer introduction</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="specialAnt" 
                      checked={includeSundayOptions.specialAntiphon} 
                      onCheckedChange={() => handleOptionChange('specialAntiphon')}
                    />
                    <Label htmlFor="specialAnt">Use special Sunday antiphon</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="blessing" 
                      checked={includeSundayOptions.longerBlessing} 
                      onCheckedChange={() => handleOptionChange('longerBlessing')}
                    />
                    <Label htmlFor="blessing">Include solemn blessing</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center pt-4">
              <Button 
                onClick={createComplineTemplate} 
                disabled={loading || success}
                className="ml-auto"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {success ? 'Template Created' : 'Create Sunday Compline Template'}
              </Button>
            </div>
            
            {/* Info Message */}
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-5 w-5 text-blue-500" />
              <AlertDescription className="text-blue-700">
                This will create a complete Sunday Compline template that can be used in the daily office.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComplineTemplateCreator;
