import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import type { Saint } from '@/lib/liturgical/saints/saint-types';
import { cn } from '@/lib/utils';
interface SaintsTimelineProps {
  saints: Saint[];
  selectedSaint: Saint | null;
  onSaintSelect: (saint: Saint) => void;
}
const SaintsTimeline: React.FC<SaintsTimelineProps> = ({
  saints,
  selectedSaint,
  onSaintSelect
}) => {
  // Filter and sort saints by birth year
  const timelineSaints = saints.filter(saint => saint.birth_year && saint.death_year).sort((a, b) => (a.birth_year || 0) - (b.birth_year || 0));

  // Group saints by century for better organization
  const centuryGroups = timelineSaints.reduce((groups, saint) => {
    const century = Math.floor((saint.birth_year || 0) / 100) + 1;
    if (!groups[century]) {
      groups[century] = [];
    }
    groups[century].push(saint);
    return groups;
  }, {} as Record<number, Saint[]>);
  const getCenturyLabel = (century: number) => {
    const suffix = century === 1 ? 'st' : century === 2 ? 'nd' : century === 3 ? 'rd' : 'th';
    return `${century}${suffix} Century`;
  };
  return <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-2">
          Saints Timeline
        </h3>
        <p className="text-gray-600">
          Explore saints and blesseds arranged chronologically by their birth years
        </p>
      </div>

      {Object.entries(centuryGroups).sort(([a], [b]) => Number(a) - Number(b)).map(([century, saints]) => <div key={century} className="relative">
            <div className="sticky top-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 mb-4 border border-dominican-light-gray dark:background-dark-gray">
              <h4 className="font-garamond text-xl font-semibold text-dominican-burgundy flex items-center">
                <Calendar className="mr-2" size={20} />
                {getCenturyLabel(Number(century))}
              </h4>
            </div>

            <div className="relative ml-4">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-dominican-gold"></div>

              <div className="space-y-6">
                {saints.map((saint, index) => <div key={saint.id} className="relative flex items-start">
                    {/* Timeline dot */}
                    <div className={cn("absolute left-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-xs font-bold z-10", saint.is_dominican ? "bg-dominican-burgundy text-white" : "bg-dominican-gold text-dominican-black")}>
                      {saint.is_dominican ? "OP" : "†"}
                    </div>

                    {/* Saint card */}
                    <div className={cn("ml-12 p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md", selectedSaint?.id === saint.id ? "border-dominican-burgundy bg-dominican-burgundy/5" : "border-dominican-light-gray bg-white hover:border-dominican-burgundy/30")} onClick={() => onSaintSelect(saint)}>
                      <div className="flex justify-between items-start mb-2">
                        <h5 className={cn("font-garamond font-semibold", selectedSaint?.id === saint.id ? "text-dominican-burgundy" : "text-dominican-black")}>
                          {saint.name}
                        </h5>
                        <div className="flex flex-col items-end text-xs text-gray-500">
                          <span>{saint.birth_year} - {saint.death_year}</span>
                          <span className="text-dominican-burgundy font-medium">
                            {saint.feast_day.replace(/^(\d{2})-(\d{2})$/, '$2/$1')}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {saint.short_bio}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {saint.is_dominican && <span className="bg-dominican-burgundy/10 text-dominican-burgundy text-xs px-2 py-1 rounded">
                            Dominican
                          </span>}
                        {saint.patronage && <span className="bg-dominican-light-gray text-dominican-black text-xs px-2 py-1 rounded">
                            Patron: {saint.patronage.split(',')[0].trim()}
                          </span>}
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>)}
    </div>;
};
export default SaintsTimeline;