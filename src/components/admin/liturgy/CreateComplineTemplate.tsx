
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { fetchLiturgyComponents, createSundayComplineTemplate } from '@/services/liturgyService';
import { LiturgyComponent, LiturgyComponentType } from '@/lib/types/liturgy';
import { Loader2, Save } from 'lucide-react';

const componentTypes: LiturgyComponentType[] = [
  'invitatory',
  'hymn',
  'psalm',
  'reading',
  'responsory',
  'gospel_canticle',
  'concluding_prayer'
];

const CreateComplineTemplate: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [components, setComponents] = useState<LiturgyComponent[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<Record<LiturgyComponentType, string>>({} as Record<LiturgyComponentType, string>);

  useEffect(() => {
    const loadComponents = async () => {
      setLoading(true);
      try {
        const data = await fetchLiturgyComponents();
        setComponents(data);
      } catch (error) {
        console.error('Error loading components:', error);
        toast({
          title: 'Error',
          description: 'Failed to load liturgical components',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadComponents();
  }, []);

  const handleComponentSelect = (type: LiturgyComponentType, componentId: string) => {
    setSelectedComponents(prev => ({
      ...prev,
      [type]: componentId
    }));
  };

  const handleCreateTemplate = async () => {
    setCreating(true);
    try {
      // Check if we have at least the required components
      const requiredTypes: LiturgyComponentType[] = ['psalm', 'reading', 'concluding_prayer'];
      const missingTypes = requiredTypes.filter(type => !selectedComponents[type]);
      
      if (missingTypes.length > 0) {
        toast({
          title: 'Missing components',
          description: `Please select at least ${missingTypes.join(', ')} components`,
          variant: 'destructive',
        });
        return;
      }
      
      const result = await createSundayComplineTemplate(selectedComponents);
      
      if (result) {
        toast({
          title: 'Success',
          description: 'Sunday Compline template created successfully',
        });
        
        // Reset selections
        setSelectedComponents({} as Record<LiturgyComponentType, string>);
      }
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: 'Error',
        description: 'Failed to create Sunday Compline template',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const getComponentsByType = (type: LiturgyComponentType): LiturgyComponent[] => {
    return components.filter(comp => comp.type === type);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Sunday Compline Template</CardTitle>
        <CardDescription>
          Select components to create a Night Prayer (Compline) template for Sundays
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {componentTypes.map(type => {
            const availableComponents = getComponentsByType(type);
            return (
              <div key={type} className="space-y-2">
                <Label htmlFor={`${type}-select`}>
                  {type.replace('_', ' ')}
                </Label>
                <Select
                  value={selectedComponents[type] || ''}
                  onValueChange={(value) => handleComponentSelect(type, value)}
                  disabled={availableComponents.length === 0}
                >
                  <SelectTrigger id={`${type}-select`}>
                    <SelectValue placeholder={
                      availableComponents.length === 0
                        ? `No ${type} components available`
                        : `Select ${type}`
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {availableComponents.length === 0 ? (
                      <SelectItem value="none" disabled>No components available</SelectItem>
                    ) : (
                      <>
                        <SelectItem value="none">None</SelectItem>
                        {availableComponents.map(comp => (
                          <SelectItem key={comp.id} value={comp.id}>
                            {comp.title || `${comp.type} (${comp.id.slice(0, 8)})`}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCreateTemplate} 
          disabled={creating}
          className="ml-auto"
        >
          {creating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Create Template
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreateComplineTemplate;
