
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, List, Clock, X, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { allSaints } from '@/lib/liturgical/saints';
import type { Saint } from '@/lib/liturgical/saints/saint-types';
import SaintsTimeline from './SaintsTimeline';
import SaintsFeastMonth from './SaintsFeastMonth';
import { SaintsInfoCard } from './SaintsInfoCard';

interface SaintsListProps {
  selectedSaint: Saint | null;
  onSaintSelect: (saint: Saint) => void;
  onClosePanel: () => void;
}

const SaintsList: React.FC<SaintsListProps> = ({
  selectedSaint,
  onSaintSelect,
  onClosePanel
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedCentury, setSelectedCentury] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'feast'>('list');
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Get unique centuries from all saints
  const allCenturies = React.useMemo(() => {
    const centuries = new Set<number>();
    allSaints.forEach(saint => {
      if (saint.birth_year) {
        const century = Math.floor((saint.birth_year - 1) / 100) + 1;
        centuries.add(century);
      }
    });
    return Array.from(centuries).sort((a, b) => a - b);
  }, []);

  // Filter saints based on search and saint type
  const filteredSaints = allSaints.filter(saint => {
    // Search term matching
    const matchesSearch = saint.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (saint.short_bio && saint.short_bio.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (saint.patronage && saint.patronage.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Saint type filter
    if (filter === 'dominican') return matchesSearch && saint.is_dominican;
    if (filter === 'other') return matchesSearch && !saint.is_dominican;
    
    return matchesSearch;
  });
  
  // Apply century filter only for timeline view
  const getFilteredSaintsForView = (view: string) => {
    if (view !== 'timeline') return filteredSaints;
    
    return filteredSaints.filter(saint => {
      if (selectedCentury === 'all' || !saint.birth_year) return true;
      const saintCentury = Math.floor((saint.birth_year - 1) / 100) + 1;
      return saintCentury === parseInt(selectedCentury);
    });
  };
  
  const currentViewSaints = getFilteredSaintsForView(viewMode);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Saint list/timeline */}
        <div className={cn(
          "lg:col-span-1 transition-all duration-300",
          selectedSaint ? "lg:pr-8" : "lg:col-span-3"
        )}>
          <div className="bg-white dark:bg-card rounded-lg shadow-md p-4 mb-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search saints..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex rounded-md overflow-hidden mb-4">
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1",
                    filter === 'all' ? "bg-dominican-burgundy text-white" : "hover:bg-dominican-burgundy/10"
                  )}
                  onClick={() => setFilter('all')}
                >
                  All Saints
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1",
                    filter === 'dominican' ? "bg-dominican-burgundy text-white" : "hover:bg-dominican-burgundy/10"
                  )}
                  onClick={() => setFilter('dominican')}
                >
                  Dominican
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1",
                    filter === 'other' ? "bg-dominican-burgundy text-white" : "hover:bg-dominican-burgundy/10"
                  )}
                  onClick={() => setFilter('other')}
                >
                  Other Saints
                </Button>
              </div>
              
              <div className="flex justify-center">
                <div className="inline-flex rounded-md shadow-sm">
                  <Button
                    variant="outline"
                    className={cn(
                      "rounded-r-none",
                      viewMode === 'list' ? "bg-dominican-burgundy text-white" : "hover:bg-dominican-burgundy/10"
                    )}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="mr-2 h-4 w-4" />
                    List
                  </Button>
                  <Button
                    variant="outline"
                    className={cn(
                      "rounded-none border-l border-gray-200 dark:border-gray-700",
                      viewMode === 'timeline' ? "bg-dominican-burgundy text-white" : "hover:bg-dominican-burgundy/10"
                    )}
                    onClick={() => setViewMode('timeline')}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Timeline
                  </Button>
                  <Button
                    variant="outline"
                    className={cn(
                      "rounded-l-none border-l border-gray-200 dark:border-gray-700",
                      viewMode === 'feast' ? "bg-dominican-burgundy text-white" : "hover:bg-dominican-burgundy/10"
                    )}
                    onClick={() => setViewMode('feast')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Feast Month
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            {viewMode === 'timeline' ? (
              <>
                  <select
                    id="century-filter"
                    value={selectedCentury}
                    onChange={(e) => setSelectedCentury(e.target.value)}
                    className="mb-6 w-full p-2 border border-dominican-light-gray rounded-md shadow-sm focus:ring-dominican-burgundy focus:border-dominican-burgundy dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="all">All Centuries</option>
                    {allCenturies.map(century => {
                      const suffix = century === 1 ? 'st' : century === 2 ? 'nd' : century === 3 ? 'rd' : 'th';
                      return (
                        <option key={century} value={century}>
                          {century}{suffix} Century
                        </option>
                      );
                    })}
                  </select>
                <SaintsTimeline 
                  saints={currentViewSaints} 
                  selectedSaint={selectedSaint}
                  onSaintSelect={onSaintSelect} 
                />
              </>
            ) : viewMode === 'feast' ? (
              <SaintsFeastMonth
                saints={currentViewSaints}
                selectedSaint={selectedSaint}
                onSaintSelect={onSaintSelect}
              />
            ) : (
              <div className="space-y-4">
                {currentViewSaints.map(saint => (
                  <div 
                    key={saint.id}
                    className={cn(
                      "p-4 rounded-lg cursor-pointer transition-colors bg-white dark:bg-card shadow-sm hover:shadow-md",
                      selectedSaint?.id === saint.id 
                        ? "ring-2 ring-dominican-burgundy" 
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    )}
                    onClick={() => onSaintSelect(saint)}
                  >
                    <h3 className="font-semibold text-dominican-burgundy dark:text-dominican-gold">
                      {saint.name}
                    </h3>
                    {saint.short_bio && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                        {saint.short_bio}
                      </p>
                    )}
                    {saint.feast_day && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {saint.feast_day}
                      </div>
                    )}
                  </div>
                ))}
                {filteredSaints.length === 0 && (
                  <div className="text-center py-16 text-gray-500 bg-white dark:bg-card rounded-lg shadow-sm p-8">
                    <div className="w-16 h-16 mx-auto bg-dominican-light-gray/20 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-dominican-burgundy" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No saints found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right column - Saint details */}
        {selectedSaint && (
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-card rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="font-garamond text-3xl font-bold text-dominican-burgundy dark:text-dominican-gold">
                  {selectedSaint.name}
                </h2>
                <button 
                  onClick={onClosePanel}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  aria-label="Close panel"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div>
                <SaintsInfoCard 
                  selectedSaint={selectedSaint} 
                  onClose={onClosePanel}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaintsList;
