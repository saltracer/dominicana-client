import React, { useState, useEffect } from 'react';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { LiturgyTemplate, LiturgyComponent, LiturgyHour } from '@/lib/types/liturgy';
import { 
  fetchLiturgyTemplates, 
  createLiturgyTemplate, 
  updateLiturgyTemplate, 
  deleteLiturgyTemplate,
  fetchLiturgyComponents
} from '@/services/liturgyService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CelebrationRank } from '@/lib/liturgical/celebrations/celebrations-types';

const hourOptions = {
  'office_of_readings': 'Office of Readings',
  'lauds': 'Morning Prayer (Lauds)',
  'terce': 'Mid-Morning Prayer (Terce)',
  'sext': 'Midday Prayer (Sext)',
  'none': 'Mid-Afternoon Prayer (None)',
  'vespers': 'Evening Prayer (Vespers)',
  'compline': 'Night Prayer (Compline)',
};

const rankOptions = {
  'SOLEMNITY': 'Solemnity',
  'FEAST': 'Feast',
  'MEMORIAL': 'Memorial',
  'OPTIONAL_MEMORIAL': 'Optional Memorial',
  'FERIAL': 'Ferial',
};

const TemplatesManager: React.FC = () => {
  const [templates, setTemplates] = useState<LiturgyTemplate[]>([]);
  const [components, setComponents] = useState<LiturgyComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<LiturgyTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hourFilter, setHourFilter] = useState<string>('all');
  
  // Form state
  const [formData, setFormData] = useState<Partial<LiturgyTemplate>>({
    name: '',
    hour: 'lauds',
    rank: 'FERIAL',
    components: {},
    season_overrides: {}
  });
  
  // Load templates and components
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [templatesData, componentsData] = await Promise.all([
          fetchLiturgyTemplates(),
          fetchLiturgyComponents()
        ]);
        
        setTemplates(templatesData);
        setComponents(componentsData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load templates and components',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHour = hourFilter === 'all' || template.hour === hourFilter;
    
    return matchesSearch && matchesHour;
  });
  
  // Filter components by type
  const getComponentsByType = (type: string) => {
    return components.filter(component => component.type === type);
  };
  
  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Update component selection
  const handleComponentSelection = (type: string, componentId: string) => {
    setFormData(prev => ({
      ...prev,
      components: {
        ...prev.components,
        [type]: componentId
      }
    }));
  };
  
  // Handle custom JSON fields
  const handleJsonChange = (field: 'components' | 'season_overrides', value: string) => {
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
  
  // Open dialog for creating/editing
  const openCreateDialog = () => {
    setEditingTemplate(null);
    setFormData({
      name: '',
      hour: 'lauds',
      rank: 'FERIAL',
      components: {},
      season_overrides: {}
    });
    setDialogOpen(true);
  };
  
  const openEditDialog = (template: LiturgyTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      hour: template.hour,
      rank: template.rank,
      components: template.components,
      season_overrides: template.season_overrides || {}
    });
    setDialogOpen(true);
  };
  
  // Save template
  const handleSave = async () => {
    try {
      if (!formData.name || !formData.hour || !formData.rank) {
        toast({
          title: 'Validation Error',
          description: 'Name, hour, and rank are required',
          variant: 'destructive',
        });
        return;
      }
      
      let result;
      if (editingTemplate) {
        result = await updateLiturgyTemplate(editingTemplate.id, formData);
      } else {
        result = await createLiturgyTemplate(formData as any);
      }
      
      if (result) {
        toast({
          title: 'Success',
          description: editingTemplate ? 'Template updated' : 'Template created',
        });
        
        // Refresh templates list
        const updatedTemplates = await fetchLiturgyTemplates();
        setTemplates(updatedTemplates);
      }
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: 'Error',
        description: `Failed to ${editingTemplate ? 'update' : 'create'} template`,
        variant: 'destructive',
      });
    }
  };
  
  // Delete template
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }
    
    try {
      const success = await deleteLiturgyTemplate(id);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Template deleted',
        });
        
        // Refresh templates list
        const updatedTemplates = await fetchLiturgyTemplates();
        setTemplates(updatedTemplates);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete template',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Hour Templates</h2>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" /> Add Template
        </Button>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={hourFilter} onValueChange={setHourFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by hour" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Hours</SelectItem>
            {Object.entries(hourOptions).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Templates Table */}
      {loading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Hour</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No templates found. Create a new one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTemplates.map(template => (
                  <TableRow key={template.id}>
                    <TableCell>{template.name}</TableCell>
                    <TableCell>{hourOptions[template.hour as keyof typeof hourOptions] || template.hour}</TableCell>
                    <TableCell>{rankOptions[template.rank as keyof typeof rankOptions] || template.rank}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openEditDialog(template)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(template.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Template Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create Template'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name || ''} 
                  onChange={handleInputChange}
                  placeholder="e.g., Sunday Lauds"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hour">Hour *</Label>
                <Select 
                  value={formData.hour as string} 
                  onValueChange={(value) => handleSelectChange('hour', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(hourOptions).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rank">Rank *</Label>
                <Select 
                  value={formData.rank as string} 
                  onValueChange={(value) => handleSelectChange('rank', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rank" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(rankOptions).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Component Mapping */}
              <div className="space-y-4">
                <Label>Components</Label>
                <ScrollArea className="h-[400px] rounded-md border p-4">
                  <div className="space-y-4">
                    {['invitatory', 'hymn', 'antiphon', 'psalm', 'canticle', 'reading', 
                      'responsory', 'gospel_canticle', 'intercessions', 'concluding_prayer', 'blessing'
                    ].map(componentType => {
                      const availableComponents = getComponentsByType(componentType);
                      const selectedId = formData.components?.[componentType] as string;
                      
                      return (
                        <div key={componentType} className="space-y-1">
                          <Label>{componentType.replace('_', ' ')}</Label>
                          <Select 
                            value={selectedId || ''} 
                            onValueChange={(value) => handleComponentSelection(componentType, value)}
                            disabled={availableComponents.length === 0}
                          >
                            <SelectTrigger>
                              <SelectValue 
                                placeholder={availableComponents.length === 0 ? 
                                  `No ${componentType} components available` : 
                                  `Select ${componentType}`} 
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">None</SelectItem>
                              {availableComponents.map(comp => (
                                <SelectItem key={comp.id} value={comp.id}>
                                  {comp.title || `${comp.type} (${comp.id.slice(0, 8)})`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
              
              {/* Advanced JSON Editing */}
              <div className="space-y-4">
                <Label>Components (JSON Format)</Label>
                <Textarea 
                  value={JSON.stringify(formData.components || {}, null, 2)} 
                  onChange={(e) => handleJsonChange('components', e.target.value)}
                  className="h-[180px] font-mono"
                />
                
                <Label>Season Overrides (JSON Format)</Label>
                <Textarea 
                  value={JSON.stringify(formData.season_overrides || {}, null, 2)} 
                  onChange={(e) => handleJsonChange('season_overrides', e.target.value)}
                  className="h-[180px] font-mono"
                  placeholder='{"advent": {"hymn": "advent-hymn-id"}, "lent": {"prayer": "lent-prayer-id"}}'
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingTemplate ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplatesManager;
