
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, List, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { allSaints } from '@/lib/liturgical/saints';
import type { Saint } from '@/lib/liturgical/saints/saint-types';
import SaintsTimeline from './SaintsTimeline';
import { SaintsInfoCard } from './SaintsInfoCard';

const SaintsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSaint, setSelectedSaint] = useState<Saint | null>(null);
  const [filter, setFilter] = useState('all'); // 'all', 'dominican', 'other'
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');

  const filteredSaints = allSaints.filter(saint => {
    const matchesSearch = saint.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      saint.short_bio && saint.short_bio.toLowerCase().includes(searchTerm.toLowerCase()) || 
      saint.patronage && saint.patronage.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'dominican') return matchesSearch && saint.is_dominican;
    if (filter === 'other') return matchesSearch && !saint.is_dominican;
    return matchesSearch;
  });

  return (
    <div className="lg:grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-white dark:bg-card rounded-lg shadow-md p-4 mb-6 lg:mb-0 flex flex-col">
        <div className="mb-6 flex-shrink-0">
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
        
        <div className="mb-6 flex-shrink-0">
          <div className="flex rounded-md overflow-hidden mb-4">
            <Button
              variant="ghost"
              className={cn(
                "flex-1",
                filter === 'all' ? "bg-dominican-burgundy text-white" : "hover:bg-dominican-burgundy/10"
              )}
              onClick={() => setFilter('all')}
            >
              All ({allSaints.length})
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "flex-1",
                filter === 'dominican' ? "bg-dominican-burgundy text-white" : "hover:bg-dominican-burgundy/10"
              )}
              onClick={() => setFilter('dominican')}
            >
              Dominican ({allSaints.filter(s => s.is_dominican).length})
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "flex-1",
                filter === 'other' ? "bg-dominican-burgundy text-white" : "hover:bg-dominican-burgundy/10"
              )}
              onClick={() => setFilter('other')}
            >
              Other ({allSaints.filter(s => !s.is_dominican).length})
            </Button>
          </div>

          <div className="flex rounded-md overflow-hidden">
            <Button
              variant="ghost"
              className={cn(
                "flex-1",
                viewMode === 'list' ? "bg-dominican-burgundy text-white" : "hover:bg-dominican-burgundy/10"
              )}
              onClick={() => setViewMode('list')}
            >
              <List className="mr-2" size={16} />
              List
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "flex-1",
                viewMode === 'timeline' ? "bg-dominican-burgundy text-white" : "hover:bg-dominican-burgundy/10"
              )}
              onClick={() => setViewMode('timeline')}
            >
              <Clock className="mr-2" size={16} />
              Timeline
            </Button>
          </div>
        </div>
        
        {viewMode === 'list' && (
          <div className="space-y-2 overflow-y-auto flex-1 min-h-0 max-h-[900px]">
            {filteredSaints.map(saint => (
              <div
                key={saint.id}
                className={cn(
                  "p-3 rounded-md cursor-pointer transition-colors flex-shrink-0",
                  selectedSaint?.id === saint.id
                    ? "bg-dominican-burgundy text-white"
                    : "hover:bg-dominican-burgundy/10 dark:hover:bg-dominican-burgundy/20"
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
                  selectedSaint?.id === saint.id ? "text-white/80" : "text-gray-600 dark:text-gray-400"
                )}>
                  {saint.feast_day.replace(/^(\d{2})-(\d{2})$/, '$1/$2')} • 
                  {saint.birth_year && saint.death_year ? ` ${saint.birth_year}-${saint.death_year}` : ''}
                </p>
              </div>
            ))}
            
            {filteredSaints.length === 0 && (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No saints found matching your search.
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="lg:col-span-2 bg-white dark:bg-card rounded-lg shadow-md overflow-hidden">
        {viewMode === 'timeline' ? (
          <SaintsTimeline 
            saints={filteredSaints} 
            selectedSaint={selectedSaint} 
            onSaintSelect={setSelectedSaint} 
          />
        ) : selectedSaint ? (
          <SaintsInfoCard selectedSaint={selectedSaint} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-10">
            <div className="w-24 h-24 bg-dominican-light-gray dark:bg-muted rounded-full flex items-center justify-center mb-4">
              <span className="font-garamond text-4xl text-dominican-burgundy">
                OP
              </span>
            </div>
            <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-2">
              Select a Saint
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Explore the lives and legacies of Dominican saints and other holy figures from the Catholic tradition. Click on any saint to view their details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaintsList;
