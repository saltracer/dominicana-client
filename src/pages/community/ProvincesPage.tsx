
import React from 'react';

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
        <div className="text-center py-20">
          <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-4">
            Map Coming Soon
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            An interactive map of Dominican provinces around the world will be available soon.
            Check back later for this feature.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProvincesPage;
