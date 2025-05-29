
import React from 'react';
import ProvincesMap from '@/components/map/ProvincesMap';

const ProvincesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 dark:from-amber-950/20 to-orange-50 dark:to-orange-950/20 py-8">
      <div className="container mx-auto px-4">
        <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-2">
          Dominican Provinces
        </h1>
        <div className="text-center mb-6">
          <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-8">
          The Order of Preachers is organized into provinces throughout the world. 
          Explore the global presence of the Dominican Order and learn about its provinces, 
          houses, and ministries.
        </p>
        
        <div className="bg-white dark:bg-card rounded-lg shadow-md p-6">
          <ProvincesMap />
        </div>
      </div>
    </div>
  );
};

export default ProvincesPage;
