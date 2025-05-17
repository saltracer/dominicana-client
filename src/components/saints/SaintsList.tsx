
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generalSaints } from '@/lib/saints';
import type { Saint } from '@/lib/saints/saint-types';

const SaintsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSaint, setSelectedSaint] = useState<Saint | null>(null);
  const [filter, setFilter] = useState('all'); // 'all', 'dominican', 'other'
  
  const filteredSaints = generalSaints.filter(saint => {
    const matchesSearch = 
      saint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (saint.short_bio && saint.short_bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (saint.patronage && saint.patronage.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'dominican') return matchesSearch && saint.is_dominican;
    if (filter === 'other') return matchesSearch && !saint.is_dominican;
    return matchesSearch;
  });
  
  return (
    <div className="lg:grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4 mb-6 lg:mb-0">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search saints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex rounded-md overflow-hidden">
            <Button 
              variant="ghost" 
              className={cn(
                "flex-1", 
                filter === 'all' ? "bg-dominican-burgundy text-white" : "hover:bg-dominican-burgundy/10"
              )}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant="ghost" 
              className={cn(
                "flex-1", 
                filter === 'dominican' ? "bg-dominican-burgundy text-white" : "hover:bg-dominican-burgundy/10"
              )}
              onClick={() => setFilter('dominican')}
            >
              Dominican
            </Button>
            <Button 
              variant="ghost" 
              className={cn(
                "flex-1", 
                filter === 'other' ? "bg-dominican-burgundy text-white" : "hover:bg-dominican-burgundy/10"
              )}
              onClick={() => setFilter('other')}
            >
              Other
            </Button>
          </div>
        </div>
        
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredSaints.map((saint) => (
            <div 
              key={saint.id}
              className={cn(
                "p-3 rounded-md cursor-pointer transition-colors",
                selectedSaint?.id === saint.id 
                  ? "bg-dominican-burgundy text-white" 
                  : "hover:bg-dominican-burgundy/10"
              )}
              onClick={() => setSelectedSaint(saint)}
            >
              <h3 className={cn(
                "font-garamond font-semibold",
                selectedSaint?.id === saint.id ? "text-white" : "text-dominican-burgundy"
              )}>
                {saint.name}
              </h3>
              <p className={cn(
                "text-sm",
                selectedSaint?.id === saint.id ? "text-white/80" : "text-gray-600"
              )}>
                {saint.feast_day.replace(/^(\d{2})-(\d{2})$/, '$2/$1')} • 
                {saint.birth_year && saint.death_year ? ` ${saint.birth_year}-${saint.death_year}` : ''}
              </p>
            </div>
          ))}
          
          {filteredSaints.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No saints found matching your search.
            </div>
          )}
        </div>
      </div>
      
      <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
        {selectedSaint ? (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="font-garamond text-3xl font-bold text-dominican-burgundy mb-2">
                {selectedSaint.name}
              </h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedSaint.is_dominican && (
                  <span className="bg-dominican-burgundy/10 text-dominican-burgundy text-xs px-2 py-1 rounded">
                    Dominican
                  </span>
                )}
                {selectedSaint.rank && (
                  <span className="bg-dominican-light-gray text-dominican-black text-xs px-2 py-1 rounded">
                    {selectedSaint.rank}
                  </span>
                )}
                {selectedSaint.color && (
                  <span className="bg-dominican-light-gray text-dominican-black text-xs px-2 py-1 rounded">
                    {selectedSaint.color} vestments
                  </span>
                )}
              </div>
              <p className="text-gray-600">
                <span className="font-medium">Feast Day:</span> {selectedSaint.feast_day.replace(/^(\d{2})-(\d{2})$/, '$2/$1')}
                {selectedSaint.birth_year && selectedSaint.death_year && (
                  <>
                    <span className="font-medium ml-2">Lived:</span> {selectedSaint.birth_year}-{selectedSaint.death_year}
                  </>
                )}
              </p>
            </div>
            
            {selectedSaint.image_url ? (
              <div className="mb-6 flex justify-center">
                <div className="w-48 h-48 bg-dominican-light-gray rounded-full overflow-hidden">
                  <img 
                    src={selectedSaint.image_url} 
                    alt={selectedSaint.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="mb-6 flex justify-center">
                <div className="w-48 h-48 bg-dominican-light-gray rounded-full flex items-center justify-center">
                  <span className="font-garamond text-4xl text-dominican-burgundy">
                    {selectedSaint.name.charAt(0)}
                  </span>
                </div>
              </div>
            )}
            
            <div>
              {selectedSaint.short_bio && (
                <>
                  <h3 className="font-garamond text-xl font-semibold text-dominican-burgundy mb-2">
                    Biography
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {selectedSaint.short_bio}
                  </p>
                </>
              )}
              
              {selectedSaint.patronage && (
                <>
                  <h3 className="font-garamond text-xl font-semibold text-dominican-burgundy mb-2">
                    Patronage
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {selectedSaint.patronage}
                  </p>
                </>
              )}
              
              {selectedSaint.biography && selectedSaint.biography.length > 0 && (
                <Button className="bg-dominican-burgundy hover:bg-dominican-burgundy/90">
                  View Complete Biography
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-10">
            <div className="w-24 h-24 bg-dominican-light-gray rounded-full flex items-center justify-center mb-4">
              <span className="font-garamond text-4xl text-dominican-burgundy">
                OP
              </span>
            </div>
            <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-2">
              Select a Saint
            </h3>
            <p className="text-gray-600 max-w-md">
              Explore the lives and legacies of Dominican saints and other holy figures 
              from the Catholic tradition. Click on any saint to view their details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaintsList;
