
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const mysteries = {
  joyful: [
    {
      title: "The Annunciation",
      description: "The angel Gabriel announces to Mary that she will conceive and bear a son.",
      scriptureRef: "Luke 1:26-38",
      reflection: "Mary's humble acceptance of God's will is a model for our own response to God's call in our lives."
    },
    {
      title: "The Visitation",
      description: "Mary visits her cousin Elizabeth, who is pregnant with John the Baptist.",
      scriptureRef: "Luke 1:39-56",
      reflection: "Mary's service to Elizabeth reminds us of our call to serve others with joy and humility."
    },
    {
      title: "The Nativity",
      description: "Jesus is born in Bethlehem.",
      scriptureRef: "Luke 2:1-20",
      reflection: "God humbles himself to be born in poverty, showing us the value of simplicity and humility."
    },
    {
      title: "The Presentation",
      description: "Mary and Joseph present Jesus at the temple.",
      scriptureRef: "Luke 2:22-38",
      reflection: "Simeon and Anna's recognition of the Christ child reminds us to be attentive to God's presence in our lives."
    },
    {
      title: "The Finding in the Temple",
      description: "Jesus is found in the temple discussing with the teachers.",
      scriptureRef: "Luke 2:41-52",
      reflection: "Jesus shows his dedication to his Father's will, teaching us to prioritize our relationship with God."
    }
  ],
  sorrowful: [
    {
      title: "The Agony in the Garden",
      description: "Jesus prays in the Garden of Gethsemane before his arrest.",
      scriptureRef: "Matthew 26:36-46",
      reflection: "Jesus' surrender to the Father's will teaches us to trust in God's plan even in our darkest moments."
    },
    {
      title: "The Scourging at the Pillar",
      description: "Jesus is scourged at the pillar by order of Pontius Pilate.",
      scriptureRef: "John 19:1",
      reflection: "Christ's suffering reminds us of the cost of our redemption and the depth of God's love."
    },
    {
      title: "The Crowning with Thorns",
      description: "Soldiers place a crown of thorns on Jesus' head.",
      scriptureRef: "Matthew 27:27-31",
      reflection: "Jesus bears the mockery of the soldiers with dignity, showing us how to respond to insults with patience."
    },
    {
      title: "The Carrying of the Cross",
      description: "Jesus carries his cross to Calvary.",
      scriptureRef: "John 19:16-17",
      reflection: "As Jesus carries his cross, we are reminded to embrace our own crosses with faith and courage."
    },
    {
      title: "The Crucifixion",
      description: "Jesus is crucified and dies on the cross.",
      scriptureRef: "John 19:18-30",
      reflection: "Jesus' ultimate sacrifice on the cross reveals the boundless extent of God's love for humanity."
    }
  ],
  glorious: [
    {
      title: "The Resurrection",
      description: "Jesus rises from the dead.",
      scriptureRef: "Matthew 28:1-10",
      reflection: "Christ's resurrection gives us hope in the promise of eternal life and victory over sin and death."
    },
    {
      title: "The Ascension",
      description: "Jesus ascends into heaven forty days after his resurrection.",
      scriptureRef: "Acts 1:6-11",
      reflection: "As Jesus returns to the Father, he promises to send us the Holy Spirit and prepares a place for us."
    },
    {
      title: "The Descent of the Holy Spirit",
      description: "The Holy Spirit descends upon the apostles at Pentecost.",
      scriptureRef: "Acts 2:1-13",
      reflection: "The coming of the Holy Spirit empowers us to bear witness to Christ in the world."
    },
    {
      title: "The Assumption",
      description: "Mary is assumed body and soul into heaven.",
      scriptureRef: "Revelation 12:1",
      reflection: "Mary's assumption gives us hope in our own bodily resurrection at the end of time."
    },
    {
      title: "The Coronation",
      description: "Mary is crowned Queen of Heaven and Earth.",
      scriptureRef: "Revelation 12:1",
      reflection: "Mary's coronation reminds us of her role as our intercessor and the glory that awaits the faithful."
    }
  ],
  luminous: [
    {
      title: "The Baptism in the Jordan",
      description: "Jesus is baptized by John the Baptist.",
      scriptureRef: "Matthew 3:13-17",
      reflection: "Jesus' baptism reveals his identity as the beloved Son and inaugurates his public ministry."
    },
    {
      title: "The Wedding at Cana",
      description: "Jesus performs his first miracle at the wedding feast in Cana.",
      scriptureRef: "John 2:1-12",
      reflection: "Through Mary's intercession, Jesus transforms water into wine, showing his power to transform our lives."
    },
    {
      title: "The Proclamation of the Kingdom",
      description: "Jesus proclaims the Kingdom of God and calls all to conversion.",
      scriptureRef: "Mark 1:14-15",
      reflection: "Jesus' call to conversion challenges us to align our lives with the values of God's Kingdom."
    },
    {
      title: "The Transfiguration",
      description: "Jesus is transfigured on the mountain before Peter, James, and John.",
      scriptureRef: "Matthew 17:1-8",
      reflection: "The Transfiguration gives us a glimpse of Christ's glory and strengthens our faith in difficult times."
    },
    {
      title: "The Institution of the Eucharist",
      description: "Jesus institutes the Eucharist at the Last Supper.",
      scriptureRef: "Matthew 26:26-29",
      reflection: "In the Eucharist, Jesus gives himself to us as spiritual food for our journey of faith."
    }
  ]
};

const RosaryPage: React.FC = () => {
  const [activeSet, setActiveSet] = useState<"joyful" | "sorrowful" | "glorious" | "luminous">("joyful");
  const [activeStep, setActiveStep] = useState<number>(0);
  const [activeMystery, setActiveMystery] = useState<number>(0);
  const [praying, setPraying] = useState<boolean>(false);
  
  const rosarySteps = [
    { name: "Sign of the Cross", content: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen." },
    { name: "Apostles' Creed", content: "I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord..." },
    { name: "Our Father", content: "Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven..." },
    { name: "Hail Mary (3x)", content: "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus..." },
    { name: "Glory Be", content: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen." },
    { name: "Mysteries", content: "Meditate on the mysteries of the Rosary." },
    { name: "Concluding Prayers", content: "Hail Holy Queen, Mother of Mercy, hail our life, our sweetness, and our hope..." }
  ];

  const handleNext = () => {
    if (activeStep < rosarySteps.length - 1) {
      setActiveStep(activeStep + 1);
    } else if (activeMystery < mysteries[activeSet].length - 1) {
      setActiveMystery(activeMystery + 1);
    } else {
      // End of rosary
      setPraying(false);
      setActiveStep(0);
      setActiveMystery(0);
    }
  };

  const handlePrev = () => {
    if (activeMystery > 0) {
      setActiveMystery(activeMystery - 1);
    } else if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-2">
        The Dominican Rosary
      </h1>
      <div className="text-center mb-6">
        <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
      </div>
      <p className="text-gray-700 mb-8 max-w-3xl">
        The Rosary has a special place in Dominican spirituality. St. Dominic is traditionally
        believed to have received the Rosary from the Blessed Virgin Mary as a powerful
        spiritual weapon. The Dominican Rosary is a contemplative prayer that helps us
        meditate on the life of Christ through the eyes of Mary.
      </p>
      
      {!praying ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-6">
            Select Mysteries to Pray
          </h2>
          
          <Tabs defaultValue="joyful" className="w-full" onValueChange={(value) => setActiveSet(value as any)}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="joyful">Joyful</TabsTrigger>
              <TabsTrigger value="luminous">Luminous</TabsTrigger>
              <TabsTrigger value="sorrowful">Sorrowful</TabsTrigger>
              <TabsTrigger value="glorious">Glorious</TabsTrigger>
            </TabsList>
            
            <TabsContent value="joyful" className="p-4">
              <p className="mb-4 text-gray-600">
                The Joyful Mysteries are traditionally prayed on Mondays and Saturdays, and focus on the events surrounding Christ's birth and childhood.
              </p>
              <ul className="list-disc pl-5 mb-6">
                {mysteries.joyful.map((mystery, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-medium">{mystery.title}</span> - {mystery.description}
                  </li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="luminous" className="p-4">
              <p className="mb-4 text-gray-600">
                The Luminous Mysteries are traditionally prayed on Thursdays, and focus on Christ's public ministry.
              </p>
              <ul className="list-disc pl-5 mb-6">
                {mysteries.luminous.map((mystery, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-medium">{mystery.title}</span> - {mystery.description}
                  </li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="sorrowful" className="p-4">
              <p className="mb-4 text-gray-600">
                The Sorrowful Mysteries are traditionally prayed on Tuesdays and Fridays, and focus on Christ's Passion and death.
              </p>
              <ul className="list-disc pl-5 mb-6">
                {mysteries.sorrowful.map((mystery, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-medium">{mystery.title}</span> - {mystery.description}
                  </li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="glorious" className="p-4">
              <p className="mb-4 text-gray-600">
                The Glorious Mysteries are traditionally prayed on Wednesdays and Sundays, and focus on Christ's Resurrection and the events that followed.
              </p>
              <ul className="list-disc pl-5 mb-6">
                {mysteries.glorious.map((mystery, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-medium">{mystery.title}</span> - {mystery.description}
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
          
          <Button 
            className="bg-dominican-burgundy hover:bg-dominican-burgundy/90 mt-4"
            onClick={() => setPraying(true)}
          >
            Begin Rosary
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeStep < 5 ? (
            <div className="animate-fade-in">
              <h2 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-4">
                {rosarySteps[activeStep].name}
              </h2>
              
              <div className="bg-dominican-light-gray/30 p-6 rounded-md mb-6">
                <p className="italic text-gray-700">
                  {rosarySteps[activeStep].content}
                </p>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePrev}
                  disabled={activeStep === 0}
                  className="border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                
                <Button 
                  onClick={handleNext}
                  className="bg-dominican-burgundy hover:bg-dominican-burgundy/90"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : activeStep === 5 ? (
            <div className="animate-fade-in">
              <h2 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-2">
                {mysteries[activeSet][activeMystery].title}
              </h2>
              <p className="text-gray-600 mb-4">
                {activeMystery + 1} of 5 | {activeSet.charAt(0).toUpperCase() + activeSet.slice(1)} Mysteries
              </p>
              
              <div className="mb-6">
                <div className="bg-dominican-light-gray/30 p-6 rounded-md mb-4">
                  <p className="mb-2">{mysteries[activeSet][activeMystery].description}</p>
                  <p className="italic text-sm text-gray-600">Scripture: {mysteries[activeSet][activeMystery].scriptureRef}</p>
                </div>
                
                <h3 className="font-garamond text-xl font-semibold mb-2">Reflection</h3>
                <p className="text-gray-700 mb-4">
                  {mysteries[activeSet][activeMystery].reflection}
                </p>
                
                <div className="border-t border-b border-dominican-light-gray py-4 my-4">
                  <h4 className="font-medium mb-2">Pray:</h4>
                  <p className="mb-2">1 Our Father</p>
                  <p className="mb-2">10 Hail Marys</p>
                  <p className="mb-2">1 Glory Be</p>
                  <p className="mb-2">Fatima Prayer: O my Jesus, forgive us our sins, save us from the fires of hell. Lead all souls to heaven, especially those in most need of thy mercy.</p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePrev}
                  className="border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                
                <Button 
                  onClick={handleNext}
                  className="bg-dominican-burgundy hover:bg-dominican-burgundy/90"
                >
                  {activeMystery < 4 ? "Next Mystery" : "Finish"} <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h2 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-4">
                {rosarySteps[activeStep].name}
              </h2>
              
              <div className="bg-dominican-light-gray/30 p-6 rounded-md mb-6">
                <p className="italic text-gray-700">
                  {rosarySteps[activeStep].content}
                </p>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePrev}
                  className="border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                
                <Button 
                  onClick={handleNext}
                  className="bg-dominican-burgundy hover:bg-dominican-burgundy/90"
                >
                  Finish <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RosaryPage;
