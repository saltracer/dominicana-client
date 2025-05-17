
import React from 'react';
import ProvincesMap from '@/components/map/ProvincesMap';

const ProvincesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-2">
        Dominican Provinces
      </h1>
      <div className="text-center mb-6">
        <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
      </div>
      <p className="text-gray-700 mb-8">
        The Order of Preachers is organized into provinces throughout the world. 
        Explore the global presence of the Dominican Order and learn about its provinces, 
        houses, and ministries.
      </p>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <ProvincesMap />
      </div>
    </div>
  );
};

export default ProvincesPage;
