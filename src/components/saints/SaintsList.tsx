
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample saints data
// In a production app, this would come from an API or database
const saintsData = [
  {
    id: 1,
    name: 'St. Dominic de Guzmán',
    feast: 'August 8',
    year: '1170-1221',
    role: 'Founder of the Dominican Order',
    isDominican: true,
    attributes: ['Founder', 'Preacher'],
    imageUrl: '',
    description: 'St. Dominic founded the Order of Preachers (Dominicans) in 1216. He was known for his dedication to study, prayer, and preaching for the salvation of souls.'
  },
  {
    id: 2,
    name: 'St. Thomas Aquinas',
    feast: 'January 28',
    year: '1225-1274',
    role: 'Doctor of the Church',
    isDominican: true,
    attributes: ['Doctor', 'Theologian', 'Philosopher'],
    imageUrl: '',
    description: 'St. Thomas Aquinas was a Dominican friar and one of the most influential theologians and philosophers in history. His work, Summa Theologica, remains a cornerstone of Catholic theology.'
  },
  {
    id: 3,
    name: 'St. Catherine of Siena',
    feast: 'April 29',
    year: '1347-1380',
    role: 'Doctor of the Church',
    isDominican: true,
    attributes: ['Doctor', 'Mystic', 'Stigmatist'],
    imageUrl: '',
    description: 'St. Catherine was a tertiary of the Dominican Order and a Scholastic philosopher and theologian. She is one of the four female Doctors of the Church.'
  },
  {
    id: 4,
    name: 'St. Martin de Porres',
    feast: 'November 3',
    year: '1579-1639',
    role: 'Brother of the Dominican Order',
    isDominican: true,
    attributes: ['Healer', 'Social Justice', 'Charity'],
    imageUrl: '',
    description: 'St. Martin was a Peruvian Dominican brother known for his social work and care for the poor, sick, and orphaned. He is the patron saint of mixed-race people and those seeking racial harmony.'
  },
  {
    id: 5,
    name: 'St. Rose of Lima',
    feast: 'August 23',
    year: '1586-1617',
    role: 'First canonized saint of the Americas',
    isDominican: true,
    attributes: ['Mystic', 'Ascetic', 'Tertiary'],
    imageUrl: '',
    description: 'St. Rose was a member of the Third Order of St. Dominic. She took the habit of a Dominican tertiary and lived in a small hut in her parents' garden, devoting herself to prayer and penance.'
  },
  {
    id: 6,
    name: 'St. Vincent Ferrer',
    feast: 'April 5',
    year: '1350-1419',
    role: 'Missionary and Preacher',
    isDominican: true,
    attributes: ['Preacher', 'Missionary', 'Thaumaturge'],
    imageUrl: '',
    description: 'St. Vincent was a Dominican friar known for his powerful preaching and missionary work throughout Europe. He is the patron saint of builders, plumbers, and construction workers.'
  },
  {
    id: 7,
    name: 'St. Albert the Great',
    feast: 'November 15',
    year: '1200-1280',
    role: 'Doctor of the Church',
    isDominican: true,
    attributes: ['Doctor', 'Scientist', 'Philosopher'],
    imageUrl: '',
    description: 'St. Albert was a Dominican friar who made significant contributions to the natural sciences. He was the teacher of St. Thomas Aquinas and is the patron saint of scientists.'
  },
  {
    id: 8,
    name: 'St. Hyacinth of Poland',
    feast: 'August 17',
    year: '1185-1257',
    role: 'Missionary of Eastern Europe',
    isDominican: true,
    attributes: ['Missionary', 'Preacher'],
    imageUrl: '',
    description: 'St. Hyacinth was one of the first Dominicans and was known as the "Apostle of the North" for his missionary work in Northern Europe and Scandinavia.'
  },
  {
    id: 9,
    name: 'St. Agnes of Montepulciano',
    feast: 'April 20',
    year: '1268-1317',
    role: 'Abbess',
    isDominican: true,
    attributes: ['Mystic', 'Abbess'],
    imageUrl: '',
    description: 'St. Agnes was a Dominican abbess known for her holiness and miraculous gifts. She founded a monastery at Montepulciano that followed the Rule of St. Augustine.'
  },
  {
    id: 10,
    name: 'St. Pius V',
    feast: 'April 30',
    year: '1504-1572',
    role: 'Pope',
    isDominican: true,
    attributes: ['Pope', 'Reformer'],
    imageUrl: '',
    description: 'St. Pius V was a Dominican friar who became pope and implemented the reforms of the Council of Trent. He standardized the Roman Missal and excommunicated Queen Elizabeth I of England.'
  },
];

interface Saint {
  id: number;
  name: string;
  feast: string;
  year: string;
  role: string;
  isDominican: boolean;
  attributes: string[];
  imageUrl: string;
  description: string;
}

const SaintsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSaint, setSelectedSaint] = useState<Saint | null>(null);
  const [filter, setFilter] = useState('all'); // 'all', 'dominican', 'other'
  
  const filteredSaints = saintsData.filter(saint => {
    const matchesSearch = saint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         saint.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         saint.attributes.some(attr => attr.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'dominican') return matchesSearch && saint.isDominican;
    if (filter === 'other') return matchesSearch && !saint.isDominican;
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
                {saint.feast} • {saint.year}
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
                {selectedSaint.isDominican && (
                  <span className="bg-dominican-burgundy/10 text-dominican-burgundy text-xs px-2 py-1 rounded">
                    Dominican
                  </span>
                )}
                {selectedSaint.attributes.map((attr, idx) => (
                  <span key={idx} className="bg-dominican-light-gray text-dominican-black text-xs px-2 py-1 rounded">
                    {attr}
                  </span>
                ))}
              </div>
              <p className="text-gray-600">
                <span className="font-medium">Feast Day:</span> {selectedSaint.feast} • 
                <span className="font-medium ml-2">Lived:</span> {selectedSaint.year}
              </p>
            </div>
            
            {selectedSaint.imageUrl ? (
              <div className="mb-6 flex justify-center">
                <div className="w-48 h-48 bg-dominican-light-gray rounded-full"></div>
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
              <h3 className="font-garamond text-xl font-semibold text-dominican-burgundy mb-2">
                Biography
              </h3>
              <p className="text-gray-700 mb-4">
                {selectedSaint.description}
              </p>
              
              <h3 className="font-garamond text-xl font-semibold text-dominican-burgundy mb-2">
                Role and Significance
              </h3>
              <p className="text-gray-700 mb-4">
                {selectedSaint.role}
              </p>
              
              <Button className="bg-dominican-burgundy hover:bg-dominican-burgundy/90">
                View Complete Profile
              </Button>
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
