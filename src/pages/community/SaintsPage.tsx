import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SaintsList from '@/components/saints/SaintsList';
import { allSaints } from '@/lib/liturgical/saints';
export interface Saint {
  id: string;
  name: string;
  feast_day: string;
  short_bio?: string;
  biography?: string[];
  image_url?: string;
  patronage?: string;
  birth_year?: number;
  death_year?: number;
  prayers?: string;
  is_dominican: boolean;
  rank?: string;
  color?: string;
  proper?: string;
  type?: string;
  books?: any[];
  canonization_date?: string;
  birth_place?: string;
  death_place?: string;
  quotes?: string[];
}
const SaintsPage: React.FC = () => {
  const {
    saintId
  } = useParams<{
    saintId?: string;
  }>();
  const navigate = useNavigate();

  // Find the selected saint if ID is in URL
  const selectedSaint = saintId ? allSaints.find(saint => saint.id === saintId) || null : null;
  const handleSaintSelect = (saint: Saint) => {
    navigate(`/community/saints/${saint.id}`, {
      replace: true
    });
  };
  const handleClosePanel = () => {
    navigate('/community/saints', {
      replace: true
    });
  };
  return <div className="container mx-auto px-4 py-8">
      <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-2">
        Saints & Blesseds
      </h1>
      <div className="text-center mb-6">
        <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
      </div>
      <p className="text-gray-700 mb-8 max-w-4xl dark:text-gray-300">
        Explore the lives and legacies of saints, blesseds, and venerables from the 
        Dominican Order, as well as other significant figures in Catholic history. 
        Learn about their contributions to the Church and the Order of Preachers.
      </p>
      
      <SaintsList selectedSaint={selectedSaint} onSaintSelect={handleSaintSelect} onClosePanel={handleClosePanel} />
    </div>;
};
export default SaintsPage;