import React from 'react';
import { Calendar } from 'lucide-react';
import type { Saint } from '@/lib/liturgical/saints/saint-types';
import { cn } from '@/lib/utils';

interface SaintsFeastMonthProps {
  saints: Saint[];
  selectedSaint: Saint | null;
  onSaintSelect: (saint: Saint) => void;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SaintsFeastMonth: React.FC<SaintsFeastMonthProps> = ({
  saints,
  selectedSaint,
  onSaintSelect
}) => {
  // Group saints by month of their feast day
  const saintsByMonth = saints.reduce((groups, saint) => {
    if (!saint.feast_day) return groups;
    
    const [month] = saint.feast_day.split('-').map(Number);
    if (isNaN(month) || month < 1 || month > 12) return groups;
    
    if (!groups[month]) {
      groups[month] = [];
    }
    groups[month].push(saint);
    return groups;
  }, {} as Record<number, Saint[]>);

  // Sort saints within each month by day
  Object.values(saintsByMonth).forEach(monthSaints => {
    monthSaints.sort((a, b) => {
      const aDay = a.feast_day ? parseInt(a.feast_day.split('-')[1]) : 0;
      const bDay = b.feast_day ? parseInt(b.feast_day.split('-')[1]) : 0;
      return aDay - bDay;
    });
  });

  return (
    <div className="space-y-8">
      {Object.entries(saintsByMonth)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([month, monthSaints]) => (
          <div key={month} className="relative">
            <div className="sticky top-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 mb-4 border border-dominican-light-gray dark:bg-gray-800/90 dark:border-gray-700">
              <h4 className="font-garamond text-xl font-semibold text-dominican-burgundy dark:text-dominican-burgundy flex items-center">
                <Calendar className="mr-2" size={20} />
                {monthNames[Number(month) - 1]}
              </h4>
            </div>

            <div className="space-y-4 ml-4">
              {monthSaints.map((saint) => (
                <div 
                  key={saint.id} 
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md",
                    selectedSaint?.id === saint.id 
                      ? "border-dominican-burgundy bg-dominican-burgundy/5 dark:border-dominican-burgundy dark:bg-dominican-burgundy/10" 
                      : "border-dominican-light-gray bg-white hover:border-dominican-burgundy/30 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-dominican-burgundy/50"
                  )}
                  onClick={() => onSaintSelect(saint)}
                >
                  <div className="flex justify-between items-start">
                    <h5 className={cn(
                      "font-garamond font-semibold",
                      selectedSaint?.id === saint.id 
                        ? "text-dominican-burgundy dark:text-dominican-burgundy" 
                        : "text-dominican-black dark:text-gray-100"
                    )}>
                      {saint.name}
                    </h5>
                    {saint.feast_day && (
                      <span className="text-sm text-dominican-burgundy dark:text-dominican-gold font-medium">
                        {new Date(2000, parseInt(saint.feast_day.split('-')[0]) - 1, parseInt(saint.feast_day.split('-')[1]))
                          .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                  
                  {saint.short_bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {saint.short_bio}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {saint.is_dominican && (
                      <span className="bg-dominican-burgundy/10 text-dominican-burgundy dark:bg-dominican-burgundy/20 dark:text-dominican-burgundy text-xs px-2 py-0.5 rounded">
                        Dominican
                      </span>
                    )}
                    {saint.patronage && (
                      <span className="bg-dominican-light-gray/50 text-dominican-black dark:bg-gray-700 dark:text-gray-200 text-xs px-2 py-0.5 rounded">
                        {saint.patronage.split(',')[0].trim()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default SaintsFeastMonth;
