
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Heart, Book, Quote } from 'lucide-react';
import type { Saint } from '@/lib/liturgical/saints/saint-types';

interface SaintsInfoCardProps {
  selectedSaint: Saint | null;
}

export function SaintsInfoCard({ selectedSaint }: SaintsInfoCardProps) {
  if (!selectedSaint) return null;

  const formatDate = (dateString: string) => {
    const [month, day] = dateString.split('-');
    const date = new Date(2000, parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  const lifespan = selectedSaint.birth_year && selectedSaint.death_year 
    ? `${selectedSaint.birth_year} - ${selectedSaint.death_year}`
    : null;

  return (
    <div className="h-full overflow-y-auto">
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-6">
          <div className="space-y-4">
            {/* Title and Dominican Badge */}
            <div className="flex items-start justify-between">
              <h1 className="font-garamond text-3xl font-bold text-dominican-burgundy leading-tight">
                {selectedSaint.name}
              </h1>
              {selectedSaint.is_dominican && (
                <Badge className="bg-dominican-burgundy hover:bg-dominican-burgundy/90 text-white font-medium">
                  Dominican
                </Badge>
              )}
            </div>

            {/* Rank and Type */}
            <div className="flex flex-wrap gap-2">
              {selectedSaint.rank && (
                <Badge variant="outline" className="border-dominican-burgundy text-dominican-burgundy">
                  {selectedSaint.rank}
                </Badge>
              )}
              {selectedSaint.type && (
                <Badge variant="outline" className="border-dominican-gold text-dominican-gold">
                  {selectedSaint.type === 'universal' ? 'Universal' : 
                   selectedSaint.type === 'dominican' ? 'Dominican' : 'Both'}
                </Badge>
              )}
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-dominican-burgundy" />
                <span className="font-medium">Feast Day:</span>
                <span>{formatDate(selectedSaint.feast_day)}</span>
              </div>
              
              {lifespan && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="w-4 h-4 text-dominican-burgundy font-bold">†</span>
                  <span className="font-medium">Life:</span>
                  <span>{lifespan}</span>
                </div>
              )}

              {selectedSaint.birth_place && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-dominican-burgundy" />
                  <span className="font-medium">Born:</span>
                  <span>{selectedSaint.birth_place}</span>
                </div>
              )}

              {selectedSaint.death_place && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-dominican-burgundy" />
                  <span className="font-medium">Died:</span>
                  <span>{selectedSaint.death_place}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Biography Section */}
          {selectedSaint.short_bio && (
            <section>
              <h2 className="font-garamond text-xl font-semibold text-dominican-burgundy mb-3 flex items-center gap-2">
                <Book className="w-5 h-5" />
                Biography
              </h2>
              <p className="text-gray-700 leading-relaxed text-justify">
                {selectedSaint.short_bio}
              </p>
            </section>
          )}

          {/* Patronage Section */}
          {selectedSaint.patronage && (
            <>
              <Separator className="my-6" />
              <section>
                <h2 className="font-garamond text-xl font-semibold text-dominican-burgundy mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Patronage
                </h2>
                <div className="bg-dominican-light-gray/30 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedSaint.patronage}
                  </p>
                </div>
              </section>
            </>
          )}

          {/* Quotes Section */}
          {selectedSaint.quotes && selectedSaint.quotes.length > 0 && (
            <>
              <Separator className="my-6" />
              <section>
                <h2 className="font-garamond text-xl font-semibold text-dominican-burgundy mb-3 flex items-center gap-2">
                  <Quote className="w-5 h-5" />
                  Notable Quotes
                </h2>
                <div className="space-y-3">
                  {selectedSaint.quotes.map((quote, index) => (
                    <blockquote key={index} className="border-l-4 border-dominican-gold pl-4 py-2 bg-dominican-white/50 rounded-r-lg">
                      <p className="font-garamond text-gray-700 italic leading-relaxed">
                        "{quote}"
                      </p>
                    </blockquote>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* Canonization Information */}
          {selectedSaint.canonization_date && (
            <>
              <Separator className="my-6" />
              <section>
                <h2 className="font-garamond text-xl font-semibold text-dominican-burgundy mb-3">
                  Canonization
                </h2>
                <p className="text-gray-700">
                  Canonized on {selectedSaint.canonization_date}
                </p>
              </section>
            </>
          )}

          {/* Prayers Section */}
          {selectedSaint.prayers && (
            <>
              <Separator className="my-6" />
              <section>
                <h2 className="font-garamond text-xl font-semibold text-dominican-burgundy mb-3">
                  Prayer
                </h2>
                <div className="bg-dominican-burgundy/5 rounded-lg p-4 border border-dominican-burgundy/10">
                  <p className="font-garamond text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedSaint.prayers}
                  </p>
                </div>
              </section>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            {selectedSaint.biography && selectedSaint.biography.length > 0 && (
              <Button className="bg-dominican-burgundy hover:bg-dominican-burgundy/90 text-white">
                <Book className="w-4 h-4 mr-2" />
                View Complete Biography
              </Button>
            )}
            
            {selectedSaint.books && selectedSaint.books.length > 0 && (
              <Button variant="outline" className="border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10">
                <Book className="w-4 h-4 mr-2" />
                Related Books ({selectedSaint.books.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
