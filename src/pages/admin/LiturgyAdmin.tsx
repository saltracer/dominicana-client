
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import ComponentsManager from '@/components/admin/liturgy/ComponentsManager';
import TemplatesManager from '@/components/admin/liturgy/TemplatesManager';
import DailyOfficeManager from '@/components/admin/liturgy/DailyOfficeManager';

const LiturgyAdmin: React.FC = () => {
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = React.useState('components');

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
      <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-2">
        Liturgy Management
      </h1>
      <div className="text-center mb-6">
        <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6">
          <TabsTrigger value="components">Prayer Components</TabsTrigger>
          <TabsTrigger value="templates">Hour Templates</TabsTrigger>
          <TabsTrigger value="dailyOffices">Daily Offices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="components" className="bg-white rounded-lg shadow-md p-6">
          <ComponentsManager />
        </TabsContent>
        
        <TabsContent value="templates" className="bg-white rounded-lg shadow-md p-6">
          <TemplatesManager />
        </TabsContent>
        
        <TabsContent value="dailyOffices" className="bg-white rounded-lg shadow-md p-6">
          <DailyOfficeManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiturgyAdmin;
