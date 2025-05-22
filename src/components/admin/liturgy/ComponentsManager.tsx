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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { LiturgyComponent, LiturgyComponentType, LiturgicalUseType } from '@/lib/types/liturgy';
import { fetchLiturgyComponents, createLiturgyComponent, updateLiturgyComponent, deleteLiturgyComponent } from '@/services/liturgyService';

const ComponentsManager: React.FC = () => {
  const [components, setComponents] = useState<LiturgyComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<LiturgyComponent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [useFilter, setUseFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  
  // Form state
  const [formData, setFormData] = useState<Partial<LiturgyComponent>>({
    type: 'psalm',
    title: '',
    content: '',
    rubrics: '',
    liturgical_use: 'ordinary',
    language: 'en',
    rank: 0,
    psalm_number: undefined,
    antiphon: '',
    has_gloria: false,
    citation: '',
    meter: '',
    author: ''
  });
  
  // Load components
  useEffect(() => {
    const loadComponents = async () => {
      setLoading(true);
      try {
        const allComponents = await fetchLiturgyComponents();
        setComponents(allComponents);
        setTotalPages(Math.ceil(allComponents.length / itemsPerPage));
      } catch (error) {
        console.error('Error loading components:', error);
        toast({
          title: 'Error',
          description: 'Failed to load prayer components',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadComponents();
  }, []);
  
  // Filter and paginate components
  const filteredComponents = components.filter(component => {
    const matchesSearch = 
      component.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (typeof component.content === 'string' && component.content.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || component.type === typeFilter;
    const matchesUse = useFilter === 'all' || component.liturgical_use === useFilter;
    
    return matchesSearch && matchesType && matchesUse;
  });
  
  const paginatedComponents = filteredComponents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  useEffect(() => {
    setTotalPages(Math.ceil(filteredComponents.length / itemsPerPage));
    if (page > Math.ceil(filteredComponents.length / itemsPerPage) && page > 1) {
      setPage(1);
    }
  }, [filteredComponents, page]);
  
  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle content change - supports JSON or plain text
  const handleContentChange = (value: string) => {
    try {
      // Try to parse as JSON
      const jsonContent = JSON.parse(value);
      setFormData(prev => ({ ...prev, content: jsonContent }));
    } catch (e) {
      // If not valid JSON, store as string
      setFormData(prev => ({ ...prev, content: value }));
    }
  };
  
  // Open dialog for creating/editing
  const openCreateDialog = () => {
    setEditingComponent(null);
    setFormData({
      type: 'psalm',
      title: '',
      content: '',
      rubrics: '',
      liturgical_use: 'ordinary',
      language: 'en',
      rank: 0,
      psalm_number: undefined,
      antiphon: '',
      has_gloria: false,
      citation: '',
      meter: '',
      author: ''
    });
    setDialogOpen(true);
  };
  
  const openEditDialog = (component: LiturgyComponent) => {
    setEditingComponent(component);
    setFormData({
      type: component.type,
      title: component.title || '',
      content: typeof component.content === 'object' ? 
        JSON.stringify(component.content, null, 2) : 
        component.content,
      rubrics: component.rubrics || '',
      liturgical_use: component.liturgical_use,
      language: component.language,
      rank: component.rank,
      psalm_number: component.psalm_number,
      antiphon: component.antiphon || '',
      has_gloria: component.has_gloria || false,
      citation: component.citation || '',
      meter: component.meter || '',
      author: component.author || ''
    });
    setDialogOpen(true);
  };
  
  // Save component
  const handleSave = async () => {
    try {
      if (!formData.type || !formData.content) {
        toast({
          title: 'Validation Error',
          description: 'Type and content are required',
          variant: 'destructive',
        });
        return;
      }
      
      // Process content before saving
      let processedContent = formData.content;
      if (typeof formData.content === 'string') {
        try {
          // Try to parse as JSON
          processedContent = JSON.parse(formData.content as string);
        } catch (e) {
          // Keep as string if not valid JSON
          processedContent = formData.content;
        }
      }
      
      const componentData = {
        ...formData,
        content: processedContent
      };
      
      let result;
      if (editingComponent) {
        result = await updateLiturgyComponent(editingComponent.id, componentData);
      } else {
        result = await createLiturgyComponent(componentData as any);
      }
      
      if (result) {
        toast({
          title: 'Success',
          description: editingComponent ? 'Component updated' : 'Component created',
        });
        
        // Refresh components list
        const updatedComponents = await fetchLiturgyComponents();
        setComponents(updatedComponents);
      }
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving component:', error);
      toast({
        title: 'Error',
        description: `Failed to ${editingComponent ? 'update' : 'create'} component`,
        variant: 'destructive',
      });
    }
  };
  
  // Delete component
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this component?')) {
      return;
    }
    
    try {
      const success = await deleteLiturgyComponent(id);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Component deleted',
        });
        
        // Refresh components list
        const updatedComponents = await fetchLiturgyComponents();
        setComponents(updatedComponents);
      }
    } catch (error) {
      console.error('Error deleting component:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete component',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Prayer Components</h2>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" /> Add Component
        </Button>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="invitatory">Invitatory</SelectItem>
            <SelectItem value="hymn">Hymn</SelectItem>
            <SelectItem value="antiphon">Antiphon</SelectItem>
            <SelectItem value="psalm">Psalm</SelectItem>
            <SelectItem value="canticle">Canticle</SelectItem>
            <SelectItem value="reading">Reading</SelectItem>
            <SelectItem value="responsory">Responsory</SelectItem>
            <SelectItem value="gospel_canticle">Gospel Canticle</SelectItem>
            <SelectItem value="intercessions">Intercessions</SelectItem>
            <SelectItem value="concluding_prayer">Concluding Prayer</SelectItem>
            <SelectItem value="blessing">Blessing</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={useFilter} onValueChange={setUseFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by liturgical use" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Uses</SelectItem>
            <SelectItem value="ordinary">Ordinary</SelectItem>
            <SelectItem value="proper_of_seasons">Proper of Seasons</SelectItem>
            <SelectItem value="proper_of_saints">Proper of Saints</SelectItem>
            <SelectItem value="common_of_saints">Common of Saints</SelectItem>
            <SelectItem value="special">Special</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Components Table */}
      {loading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Liturgical Use</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedComponents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No components found. Create a new one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedComponents.map(component => (
                    <TableRow key={component.id}>
                      <TableCell>{component.type.replace('_', ' ')}</TableCell>
                      <TableCell>{component.title || '-'}</TableCell>
                      <TableCell>{component.liturgical_use.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openEditDialog(component)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(component.id)}
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
          
          {/* Pagination */}
          {filteredComponents.length > itemsPerPage && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setPage(pageNum)}
                      isActive={page === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
      
      {/* Component Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingComponent ? 'Edit Component' : 'Create Component'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Component Type *</Label>
                <Select 
                  value={formData.type as string} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invitatory">Invitatory</SelectItem>
                    <SelectItem value="hymn">Hymn</SelectItem>
                    <SelectItem value="antiphon">Antiphon</SelectItem>
                    <SelectItem value="psalm">Psalm</SelectItem>
                    <SelectItem value="canticle">Canticle</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="responsory">Responsory</SelectItem>
                    <SelectItem value="gospel_canticle">Gospel Canticle</SelectItem>
                    <SelectItem value="intercessions">Intercessions</SelectItem>
                    <SelectItem value="concluding_prayer">Concluding Prayer</SelectItem>
                    <SelectItem value="blessing">Blessing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="liturgical_use">Liturgical Use *</Label>
                <Select 
                  value={formData.liturgical_use as string} 
                  onValueChange={(value) => handleSelectChange('liturgical_use', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select liturgical use" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ordinary">Ordinary</SelectItem>
                    <SelectItem value="proper_of_seasons">Proper of Seasons</SelectItem>
                    <SelectItem value="proper_of_saints">Proper of Saints</SelectItem>
                    <SelectItem value="common_of_saints">Common of Saints</SelectItem>
                    <SelectItem value="special">Special</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title || ''} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea 
                id="content" 
                name="content" 
                value={typeof formData.content === 'object' ? 
                  JSON.stringify(formData.content, null, 2) : 
                  formData.content as string || ''} 
                onChange={(e) => handleContentChange(e.target.value)}
                className="min-h-[150px] font-mono"
                placeholder="Enter content text or JSON structure"
              />
              <div className="text-sm text-gray-500">
                Use plain text or JSON format for structured content
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rubrics">Rubrics</Label>
              <Textarea 
                id="rubrics" 
                name="rubrics" 
                value={formData.rubrics || ''} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input 
                  id="language" 
                  name="language" 
                  value={formData.language || 'en'} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rank">Rank</Label>
                <Input 
                  id="rank" 
                  name="rank" 
                  type="number" 
                  value={formData.rank || 0} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {/* Conditional fields based on component type */}
            {formData.type === 'psalm' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="psalm_number">Psalm Number</Label>
                  <Input 
                    id="psalm_number" 
                    name="psalm_number" 
                    type="number" 
                    value={formData.psalm_number || ''} 
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="antiphon">Antiphon</Label>
                  <Input 
                    id="antiphon" 
                    name="antiphon" 
                    value={formData.antiphon || ''} 
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="flex items-center space-x-2 col-span-2">
                  <Checkbox 
                    id="has_gloria" 
                    checked={formData.has_gloria || false} 
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('has_gloria', checked as boolean)}
                  />
                  <Label htmlFor="has_gloria">Include Gloria Patri</Label>
                </div>
              </div>
            )}
            
            {formData.type === 'reading' && (
              <div className="space-y-2">
                <Label htmlFor="citation">Citation</Label>
                <Input 
                  id="citation" 
                  name="citation" 
                  value={formData.citation || ''} 
                  onChange={handleInputChange}
                />
              </div>
            )}
            
            {formData.type === 'hymn' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meter">Meter</Label>
                  <Input 
                    id="meter" 
                    name="meter" 
                    value={formData.meter || ''} 
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input 
                    id="author" 
                    name="author" 
                    value={formData.author || ''} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingComponent ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComponentsManager;
