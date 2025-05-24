import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import ComplineDisplay from '@/components/prayer/ComplineDisplay';
import EnhancedComplineDisplay from '@/components/prayer/EnhancedComplineDisplay';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useLiturgicalDay } from '@/context/LiturgicalDayContext';
import { useIsMobile } from '@/hooks/use-mobile';

const LiturgyOfHoursPage: React.FC = () => {
  const { selectedDate, setSelectedDate } = useLiturgicalDay();
  const isMobile = useIsMobile();
  const [selectedHour, setSelectedHour] = useState("night-prayer");

  const prayerHours = [
    { value: "office-of-readings", label: "Office of Readings" },
    { value: "morning-prayer", label: "Morning Prayer" },
    { value: "daytime-prayer", label: "Daytime Prayer" },
    { value: "midday-prayer", label: "Midday Prayer" },
    { value: "afternoon-prayer", label: "Afternoon Prayer" },
    { value: "evening-prayer", label: "Evening Prayer" },
    { value: "night-prayer", label: "Night Prayer" }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-2">
        Liturgy of the Hours
      </h1>
      <div className="text-center mb-6">
        <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
      </div>
      <p className="text-gray-700 mb-8 max-w-3xl">
        The Liturgy of the Hours, also known as the Divine Office, is the official prayer 
        of the Church marking the hours of each day. It sanctifies the day with prayer and 
        is an essential part of Dominican life.
      </p>
      
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between p-4 border-b border-dominican-light-gray">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-dominican-burgundy" />
            <span className="font-medium">Prayers for day: {format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="default" size="sm">
                Select Prayers
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {isMobile ? (
          <div className="p-4">
            <div className="mb-4">
              <Select value={selectedHour} onValueChange={setSelectedHour}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a prayer hour" />
                </SelectTrigger>
                <SelectContent>
                  {prayerHours.map((hour) => (
                    <SelectItem key={hour.value} value={hour.value}>
                      {hour.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Content based on selected hour */}
            {selectedHour === "office-of-readings" && (
              <div>
                <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-4">
                  Office of Readings
                </h3>
                
                <div className="space-y-6">
                  <section>
                    <h4 className="font-garamond text-xl font-semibold mb-2">Invitatory</h4>
                    <p className="mb-2">V. Lord, open my lips.</p>
                    <p className="mb-4">R. And my mouth will proclaim your praise.</p>
                    
                    <p className="mb-2">Antiphon: Come, let us worship Christ the Lord, who for our sake endured temptation and suffering.</p>
                    
                    <div className="bg-dominican-light-gray/50 p-4 rounded-md mb-4">
                      <h5 className="font-medium mb-2">Psalm 95</h5>
                      <p className="mb-2">Come, let us sing to the Lord<br />
                      and shout with joy to the Rock who saves us.<br />
                      Let us approach him with praise and thanksgiving<br />
                      and sing joyful songs to the Lord.</p>
                      
                      <p className="mb-2">The Lord is God, the mighty God,<br />
                      the great king over all the gods.<br />
                      He holds in his hands the depths of the earth<br />
                      and the highest mountains as well.<br />
                      He made the sea; it belongs to him,<br />
                      the dry land, too, for it was formed by his hands.</p>
                    </div>
                  </section>
                  
                  <section>
                    <h4 className="font-garamond text-xl font-semibold mb-2">Hymn</h4>
                    <p className="mb-2">
                      The golden star of morn<br />
                      Is climbing in the sky;<br />
                      The birth-day of the world<br />
                      Breaks to the wakeful eye.
                    </p>
                    
                    <p className="mb-2">
                      Christ our eternal Dawn,<br />
                      Sheds on our night its ray;<br />
                      No evening shall descend<br />
                      On his eternal day.
                    </p>
                  </section>
                  
                  <section>
                    <h4 className="font-garamond text-xl font-semibold mb-2">Psalmody</h4>
                    <p className="mb-2">Ant. 1: Surrender to God, and he will do everything for you.</p>
                    
                    <div className="bg-dominican-light-gray/50 p-4 rounded-md mb-4">
                      <h5 className="font-medium mb-2">Psalm 37:1-11</h5>
                      <p className="mb-2">
                        Do not fret because of the wicked;<br />
                        do not envy those who do evil:<br />
                        for they wither quickly like grass<br />
                        and fade like the green of the fields.
                      </p>
                    </div>
                  </section>
                  
                  <section>
                    <h4 className="font-garamond text-xl font-semibold mb-2">Readings</h4>
                    <div className="mb-4">
                      <h5 className="font-medium mb-2">First Reading</h5>
                      <p className="italic mb-2">From the prophet Isaiah 52:13-53:12</p>
                      <p className="mb-2">
                        See, my servant shall prosper,<br />
                        he shall be raised high and greatly exalted.<br />
                        Even as many were amazed at him—<br />
                        so marred was his look beyond human semblance<br />
                        and his appearance beyond that of the sons of man.
                      </p>
                    </div>
                  </section>
                  
                  <section>
                    <h4 className="font-garamond text-xl font-semibold mb-2">Concluding Prayer</h4>
                    <p className="mb-4">
                      Father,<br />
                      through our observance of Lent,<br />
                      help us to understand the meaning<br />
                      of your Son's death and resurrection,<br />
                      and teach us to reflect it in our lives.<br />
                      Grant this through our Lord Jesus Christ, your Son,<br />
                      who lives and reigns with you and the Holy Spirit,<br />
                      one God, for ever and ever.<br />
                      — Amen.
                    </p>
                    
                    <p className="mb-2">Let us praise the Lord.</p>
                    <p>— And give him thanks.</p>
                  </section>
                </div>
              </div>
            )}
            
            {selectedHour === "morning-prayer" && (
              <div>
                <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-4">
                  Morning Prayer (Lauds)
                </h3>
                <div className="text-center py-10">
                  <p className="text-gray-600">Morning Prayer content will be available soon.</p>
                </div>
              </div>
            )}
            
            {selectedHour === "daytime-prayer" && (
              <div>
                <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-4">
                  Daytime Prayer (Terce)
                </h3>
                <div className="text-center py-10">
                  <p className="text-gray-600">Daytime Prayer content will be available soon.</p>
                </div>
              </div>
            )}
            
            {selectedHour === "midday-prayer" && (
              <div>
                <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-4">
                  Midday Prayer (Sext)
                </h3>
                <div className="text-center py-10">
                  <p className="text-gray-600">Midday Prayer content will be available soon.</p>
                </div>
              </div>
            )}
            
            {selectedHour === "afternoon-prayer" && (
              <div>
                <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-4">
                  Afternoon Prayer (None)
                </h3>
                <div className="text-center py-10">
                  <p className="text-gray-600">Afternoon Prayer content will be available soon.</p>
                </div>
              </div>
            )}
            
            {selectedHour === "evening-prayer" && (
              <div>
                <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-4">
                  Evening Prayer (Vespers)
                </h3>
                <div className="text-center py-10">
                  <p className="text-gray-600">Evening Prayer content will be available soon.</p>
                </div>
              </div>
            )}
            
            {selectedHour === "night-prayer" && (
              <div>
                <EnhancedComplineDisplay />
              </div>
            )}
          </div>
        ) : (
          <Tabs defaultValue="office-of-readings" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
              <TabsTrigger value="office-of-readings">Office of Readings</TabsTrigger>
              <TabsTrigger value="morning-prayer">Morning Prayer</TabsTrigger>
              <TabsTrigger value="daytime-prayer">Daytime Prayer</TabsTrigger>
              <TabsTrigger value="midday-prayer">Midday Prayer</TabsTrigger>
              <TabsTrigger value="afternoon-prayer">Afternoon Prayer</TabsTrigger>
              <TabsTrigger value="evening-prayer">Evening Prayer</TabsTrigger>
              <TabsTrigger value="night-prayer">Night Prayer</TabsTrigger>
            </TabsList>
            
            {/* Sample content for Office of Readings */}
            <TabsContent value="office-of-readings" className="p-6">
              <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-4">
                Office of Readings
              </h3>
              
              <div className="space-y-6">
                <section>
                  <h4 className="font-garamond text-xl font-semibold mb-2">Invitatory</h4>
                  <p className="mb-2">V. Lord, open my lips.</p>
                  <p className="mb-4">R. And my mouth will proclaim your praise.</p>
                  
                  <p className="mb-2">Antiphon: Come, let us worship Christ the Lord, who for our sake endured temptation and suffering.</p>
                  
                  <div className="bg-dominican-light-gray/50 p-4 rounded-md mb-4">
                    <h5 className="font-medium mb-2">Psalm 95</h5>
                    <p className="mb-2">Come, let us sing to the Lord<br />
                    and shout with joy to the Rock who saves us.<br />
                    Let us approach him with praise and thanksgiving<br />
                    and sing joyful songs to the Lord.</p>
                    
                    <p className="mb-2">The Lord is God, the mighty God,<br />
                    the great king over all the gods.<br />
                    He holds in his hands the depths of the earth<br />
                    and the highest mountains as well.<br />
                    He made the sea; it belongs to him,<br />
                    the dry land, too, for it was formed by his hands.</p>
                  </div>
                </section>
                
                <section>
                  <h4 className="font-garamond text-xl font-semibold mb-2">Hymn</h4>
                  <p className="mb-2">
                    The golden star of morn<br />
                    Is climbing in the sky;<br />
                    The birth-day of the world<br />
                    Breaks to the wakeful eye.
                  </p>
                  
                  <p className="mb-2">
                    Christ our eternal Dawn,<br />
                    Sheds on our night its ray;<br />
                    No evening shall descend<br />
                    On his eternal day.
                  </p>
                </section>
                
                <section>
                  <h4 className="font-garamond text-xl font-semibold mb-2">Psalmody</h4>
                  <p className="mb-2">Ant. 1: Surrender to God, and he will do everything for you.</p>
                  
                  <div className="bg-dominican-light-gray/50 p-4 rounded-md mb-4">
                    <h5 className="font-medium mb-2">Psalm 37:1-11</h5>
                    <p className="mb-2">
                      Do not fret because of the wicked;<br />
                      do not envy those who do evil:<br />
                      for they wither quickly like grass<br />
                      and fade like the green of the fields.
                    </p>
                  </div>
                </section>
                
                <section>
                  <h4 className="font-garamond text-xl font-semibold mb-2">Readings</h4>
                  <div className="mb-4">
                    <h5 className="font-medium mb-2">First Reading</h5>
                    <p className="italic mb-2">From the prophet Isaiah 52:13-53:12</p>
                    <p className="mb-2">
                      See, my servant shall prosper,<br />
                      he shall be raised high and greatly exalted.<br />
                      Even as many were amazed at him—<br />
                      so marred was his look beyond human semblance<br />
                      and his appearance beyond that of the sons of man.
                    </p>
                  </div>
                </section>
                
                <section>
                  <h4 className="font-garamond text-xl font-semibold mb-2">Concluding Prayer</h4>
                  <p className="mb-4">
                    Father,<br />
                    through our observance of Lent,<br />
                    help us to understand the meaning<br />
                    of your Son's death and resurrection,<br />
                    and teach us to reflect it in our lives.<br />
                    Grant this through our Lord Jesus Christ, your Son,<br />
                    who lives and reigns with you and the Holy Spirit,<br />
                    one God, for ever and ever.<br />
                    — Amen.
                  </p>
                  
                  <p className="mb-2">Let us praise the Lord.</p>
                  <p>— And give him thanks.</p>
                </section>
              </div>
            </TabsContent>
            
            {/* Placeholder content for other hours */}
            <TabsContent value="morning-prayer" className="p-6">
              <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-4">
                Morning Prayer (Lauds)
              </h3>
              <div className="text-center py-10">
                <p className="text-gray-600">Morning Prayer content will be available soon.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="daytime-prayer" className="p-6">
              <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-4">
                Daytime Prayer (Terce)
              </h3>
              <div className="text-center py-10">
                <p className="text-gray-600">Daytime Prayer content will be available soon.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="midday-prayer" className="p-6">
              <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-4">
                Midday Prayer (Sext)
              </h3>
              <div className="text-center py-10">
                <p className="text-gray-600">Midday Prayer content will be available soon.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="afternoon-prayer" className="p-6">
              <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-4">
                Afternoon Prayer (None)
              </h3>
              <div className="text-center py-10">
                <p className="text-gray-600">Afternoon Prayer content will be available soon.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="evening-prayer" className="p-6">
              <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-4">
                Evening Prayer (Vespers)
              </h3>
              <div className="text-center py-10">
                <p className="text-gray-600">Evening Prayer content will be available soon.</p>
              </div>
            </TabsContent>
            
            {/* Our enhanced Night Prayer (Compline) tab */}
            <TabsContent value="night-prayer" className="p-6">
              <EnhancedComplineDisplay />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default LiturgyOfHoursPage;
