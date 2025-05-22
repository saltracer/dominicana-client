
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
       {userRole === 'admin' && (
      <Button variant="outline" asChild>
        <Link to="/admin/liturgy">
          <Settings className="w-4 h-4 mr-2" />
          Manage Prayer Content
        </Link>
      </Button>
    )}
      <LiturgyProvider>

        <LiturgyOfHoursDisplay />
      </LiturgyProvider>
    </div>
  );
};

export default LiturgyOfHoursPage;
