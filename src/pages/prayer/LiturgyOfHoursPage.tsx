
import React from 'react';
import { LiturgyProvider } from '@/context/LiturgyContext';
import LiturgyOfHoursDisplay from '@/components/liturgy/LiturgyOfHoursDisplay';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

const LiturgyOfHoursPage: React.FC = () => {
  const { userRole } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy">
          Liturgy of the Hours
        </h1>
        
        {userRole === 'admin' && (
          <Button variant="outline" asChild>
            <Link to="/admin/liturgy">
              <Settings className="w-4 h-4 mr-2" />
              Manage Prayer Content
            </Link>
          </Button>
        )}
      </div>
      
      <div className="text-center mb-6">
        <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
      </div>
      
      <LiturgyProvider>
        <LiturgyOfHoursDisplay />
      </LiturgyProvider>
    </div>
  );
};

export default LiturgyOfHoursPage;
