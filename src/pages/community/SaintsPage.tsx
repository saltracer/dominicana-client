
import React from 'react';
import SaintsList from '@/components/saints/SaintsList';

const SaintsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-2">
        Saints & Blesseds
      </h1>
      <div className="text-center mb-6">
        <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
      </div>
      <p className="text-gray-700 mb-8 max-w-3xl">
        Explore the lives and legacies of saints, blesseds, and venerables from the 
        Dominican Order, as well as other significant figures in Catholic history. 
        Learn about their contributions to the Church and the Order of Preachers.
      </p>
      
      <SaintsList />
    </div>
  );
};

export default SaintsPage;
