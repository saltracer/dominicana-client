
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import ComplineDisplay from '@/components/prayer/ComplineDisplay';
import { Button } from '@/components/ui/button';
import { useLiturgicalDay } from '@/context/LiturgicalDayContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { 
  hourToSlug, 
  slugToHour, 
  dateToUrlString, 
  urlStringToDate, 
  buildLiturgyUrl, 
  isValidHourSlug,
  hourDisplayNames 
} from '@/lib/liturgical/hours/url-utils';

const LiturgyOfHoursPage: React.FC = () => {
  const { hour: hourParam, date: dateParam } = useParams();
  const navigate = useNavigate();
  const { selectedDate, setSelectedDate } = useLiturgicalDay();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [selectedHour, setSelectedHour] = useState("office-of-readings");
  const [isInitialized, setIsInitialized] = useState(false);

  const prayerHours = [
    { value: "office-of-readings", label: "Office of Readings" },
    { value: "morning-prayer", label: "Morning Prayer" },
    { value: "daytime-prayer", label: "Daytime Prayer" },
    { value: "midday-prayer", label: "Midday Prayer" },
    { value: "afternoon-prayer", label: "Afternoon Prayer" },
    { value: "evening-prayer", label: "Evening Prayer" },
    { value: "night-prayer", label: "Night Prayer" }
  ];
  
  // Initialize state from URL parameters ONCE
  useEffect(() => {
    if (isInitialized) return;

    let initialHour = "office-of-readings";
    let shouldUpdateDate = false;

    // Handle hour parameter
    if (hourParam) {
      const hourFromSlug = slugToHour(hourParam);
      if (isValidHourSlug(hourParam) || isValidHourSlug(hourFromSlug)) {
        initialHour = hourFromSlug;
      } else {
        // Invalid hour, redirect to valid URL
        navigate('/prayer/liturgy-of-the-hours', { replace: true });
        return;
      }
    }

    // Handle date parameter - if present, update the context
    if (dateParam) {
      const dateFromUrl = urlStringToDate(dateParam);
      if (dateFromUrl) {
        setSelectedDate(dateFromUrl);
        shouldUpdateDate = true;
      } else {
        // Invalid date, redirect without date parameter
        const newUrl = hourParam ? `/prayer/liturgy-of-the-hours/${hourParam}` : '/prayer/liturgy-of-the-hours';
        navigate(newUrl, { replace: true });
        return;
      }
    }

    setSelectedHour(initialHour);
    setIsInitialized(true);
  }, [hourParam, dateParam, navigate, setSelectedDate, isInitialized]);

  // Update URL when hour changes or when selectedDate from context changes (but only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    
    const newUrl = buildLiturgyUrl(selectedHour, selectedDate);
    const currentPath = window.location.pathname;
    
    // Only navigate if the URL actually needs to change
    if (currentPath !== newUrl) {
      navigate(newUrl, { replace: true });
    }
  }, [selectedHour, selectedDate, navigate, isInitialized]);

  const handleHourChange = (newHour: string) => {
    setSelectedHour(newHour);
  };

  const handleShare = async () => {
    const currentUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast({
        title: "Link copied!",
        description: "The link to this prayer has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Share link",
        description: currentUrl,
        variant: "default",
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-2">
        Liturgy of the Hours
      </h1>
      <div className="text-center mb-6">
        <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-3xl">
        The Liturgy of the Hours, also known as the Divine Office, is the official prayer 
        of the Church marking the hours of each day. It sanctifies the day with prayer and 
        is an essential part of Dominican life.
      </p>
      
      <div className="bg-white dark:bg-card rounded-lg shadow-md">
        <div className="flex items-center justify-between p-4 border-b border-dominican-light-gray dark:border-border">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-dominican-burgundy" />
            <span className="font-medium text-foreground">Prayers for day: {format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
        
        {isMobile ? (
          <div className="p-4">
            <div className="mb-4">
              <Select value={selectedHour} onValueChange={handleHourChange}>
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
                    <h4 className="font-garamond text-xl font-semibold mb-2 text-foreground">Invitatory</h4>
                    <p className="mb-2 text-foreground">V. Lord, open my lips.</p>
                    <p className="mb-4 text-foreground">R. And my mouth will proclaim your praise.</p>
                    
                    <p className="mb-2 text-foreground">Antiphon: Come, let us worship Christ the Lord, who for our sake endured temptation and suffering.</p>
                    
                    <div className="bg-dominican-light-gray/50 dark:bg-muted/20 p-4 rounded-md mb-4">
                      <h5 className="font-medium mb-2 text-foreground">Psalm 95</h5>
                      <p className="mb-2 text-foreground">Come, let us sing to the Lord<br />
                      and shout with joy to the Rock who saves us.<br />
                      Let us approach him with praise and thanksgiving<br />
                      and sing joyful songs to the Lord.</p>
                      
                      <p className="mb-2 text-foreground">The Lord is God, the mighty God,<br />
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
                    
                    <div className="bg-dominican-light-gray/50 dark:bg-muted/20 p-4 rounded-md mb-4">
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
                <ComplineDisplay />
              </div>
            )}
          </div>
        ) : (
          <Tabs value={selectedHour} onValueChange={handleHourChange} className="w-full">
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
                  <h4 className="font-garamond text-xl font-semibold mb-2 text-foreground">Invitatory</h4>
                  <p className="mb-2 text-foreground">V. Lord, open my lips.</p>
                  <p className="mb-4 text-foreground">R. And my mouth will proclaim your praise.</p>
                  
                  <p className="mb-2 text-foreground">Antiphon: Come, let us worship Christ the Lord, who for our sake endured temptation and suffering.</p>
                  
                  <div className="bg-dominican-light-gray/50 dark:bg-muted/20 p-4 rounded-md mb-4">
                    <h5 className="font-medium mb-2 text-foreground">Psalm 95</h5>
                    <p className="mb-2 text-foreground">Come, let us sing to the Lord<br />
                    and shout with joy to the Rock who saves us.<br />
                    Let us approach him with praise and thanksgiving<br />
                    and sing joyful songs to the Lord.</p>
                    
                    <p className="mb-2 text-foreground">The Lord is God, the mighty God,<br />
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
                  
                  <div className="bg-dominican-light-gray/50 dark:bg-muted/20 p-4 rounded-md mb-4">
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
              <ComplineDisplay />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default LiturgyOfHoursPage;
