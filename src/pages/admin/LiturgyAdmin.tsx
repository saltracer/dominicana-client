
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import ComponentsManager from '@/components/admin/liturgy/ComponentsManager';
import TemplatesManager from '@/components/admin/liturgy/TemplatesManager';
import DailyOfficeManager from '@/components/admin/liturgy/DailyOfficeManager';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const LiturgyAdmin: React.FC = () => {
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = React.useState('components');
  const navigate = useNavigate();

  if (userRole !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-garamond text-3xl font-bold text-dominican-burgundy mb-4">
          Admin Access Only
        </h1>
        <p className="text-gray-700 mb-6">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-4" 
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Admin
          </Button>
          <div>
            <h1 className="font-garamond text-3xl font-bold text-dominican-burgundy">
              Liturgy Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage liturgical components, templates, and daily offices
            </p>
          </div>
        </div>
      </div>
      
      <Card className="border-none shadow-md">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-muted/50">
            <TabsTrigger value="components">Prayer Components</TabsTrigger>
            <TabsTrigger value="templates">Hour Templates</TabsTrigger>
            <TabsTrigger value="dailyOffices">Daily Offices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="components" className="p-6">
            <ComponentsManager />
          </TabsContent>
          
          <TabsContent value="templates" className="p-6">
            <TemplatesManager />
          </TabsContent>
          
          <TabsContent value="dailyOffices" className="p-6">
            <DailyOfficeManager />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default LiturgyAdmin;
