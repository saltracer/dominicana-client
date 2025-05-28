import { Button } from '@/components/ui/button';
import type { Saint } from '@/lib/liturgical/saints/saint-types';

interface SaintsInfoCardProps {
  selectedSaint: Saint | null;
}

export function SaintsInfoCard({ selectedSaint }: SaintsInfoCardProps) {
  if (!selectedSaint) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="overflow-y-auto p-6">
        <h2 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-4">
          {selectedSaint.name}
        </h2>
        <div className="flex items-center text-gray-600 mb-6">
          <span className="text-sm">
            {selectedSaint.feast_day}
            {selectedSaint.birth_year && selectedSaint.death_year && (
              <span className="mx-2">•</span>
            )}
            {selectedSaint.birth_year && selectedSaint.death_year && (
              <span>{selectedSaint.birth_year} - {selectedSaint.death_year}</span>
            )}
          </span>
        </div>

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
  );
}
