import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Crown, Heart, Sun, Star, Play, Pause, RotateCcw } from 'lucide-react';
interface Prayer {
  title: string;
  text: string;
}
interface Mystery {
  title: string;
  meditation: string;
}
interface Mysteries {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  feastDay?: string;
  mysteries: Mystery[];
}
const mysteriesData: Mysteries[] = [{
  id: 'joyful',
  title: 'The Joyful Mysteries',
  description: 'Reflect on the joyous events in the lives of Jesus and Mary.',
  icon: <Sun className="h-5 w-5" />,
  mysteries: [{
    title: 'The Annunciation',
    meditation: 'The Angel Gabriel announces to Mary that she will conceive and bear a son.'
  }, {
    title: 'The Visitation',
    meditation: 'Mary visits her cousin Elizabeth, who is also with child.'
  }, {
    title: 'The Nativity',
    meditation: 'Jesus is born in a manger in Bethlehem.'
  }, {
    title: 'The Presentation',
    meditation: 'Mary and Joseph present Jesus in the Temple.'
  }, {
    title: 'The Finding in the Temple',
    meditation: 'Mary and Joseph find Jesus teaching in the Temple.'
  }]
}, {
  id: 'luminous',
  title: 'The Luminous Mysteries',
  description: 'Meditate on the key moments in the public ministry of Jesus.',
  icon: <Star className="h-5 w-5" />,
  feastDay: 'May 17',
  mysteries: [{
    title: 'The Baptism of Jesus',
    meditation: 'Jesus is baptized by John the Baptist in the Jordan River.'
  }, {
    title: 'The Wedding at Cana',
    meditation: 'Jesus performs his first miracle at the wedding in Cana.'
  }, {
    title: 'The Proclamation of the Kingdom',
    meditation: 'Jesus proclaims the Kingdom of God and calls for repentance.'
  }, {
    title: 'The Transfiguration',
    meditation: 'Jesus is transfigured on Mount Tabor in the presence of Peter, James, and John.'
  }, {
    title: 'The Institution of the Eucharist',
    meditation: 'Jesus institutes the Eucharist at the Last Supper.'
  }]
}, {
  id: 'sorrowful',
  title: 'The Sorrowful Mysteries',
  description: 'Contemplate the suffering and death of Jesus.',
  icon: <Heart className="h-5 w-5" />,
  mysteries: [{
    title: 'The Agony in the Garden',
    meditation: 'Jesus prays in the Garden of Gethsemane before his arrest.'
  }, {
    title: 'The Scourging at the Pillar',
    meditation: 'Jesus is scourged at the pillar.'
  }, {
    title: 'The Crowning with Thorns',
    meditation: 'Jesus is crowned with thorns.'
  }, {
    title: 'The Carrying of the Cross',
    meditation: 'Jesus carries his cross to Calvary.'
  }, {
    title: 'The Crucifixion',
    meditation: 'Jesus is crucified on the cross.'
  }]
}, {
  id: 'glorious',
  title: 'The Glorious Mysteries',
  description: 'Celebrate the glory of Jesus and Mary after the Resurrection.',
  icon: <Crown className="h-5 w-5" />,
  mysteries: [{
    title: 'The Resurrection',
    meditation: 'Jesus rises from the dead.'
  }, {
    title: 'The Ascension',
    meditation: 'Jesus ascends to heaven.'
  }, {
    title: 'The Descent of the Holy Spirit',
    meditation: 'The Holy Spirit descends upon the apostles and Mary.'
  }, {
    title: 'The Assumption',
    meditation: 'Mary is assumed into heaven.'
  }, {
    title: 'The Coronation of Mary',
    meditation: 'Mary is crowned Queen of Heaven and Earth.'
  }]
}];
const prayers: {
  [key: string]: Prayer;
} = {
  sign_of_the_cross: {
    title: 'The Sign of the Cross',
    text: 'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.'
  },
  apostles_creed: {
    title: "The Apostles' Creed",
    text: `I believe in God, the Father almighty,
      creator of heaven and earth.
      I believe in Jesus Christ, his only Son, our Lord,
      who was conceived by the Holy Spirit,
      born of the Virgin Mary,
      suffered under Pontius Pilate,
      was crucified, died, and was buried;
      he descended into hell;
      on the third day he rose again from the dead;
      he ascended into heaven,
      and is seated at the right hand of God the Father almighty;
      from there he will come to judge the living and the dead.
      I believe in the Holy Spirit,
      the holy catholic Church,
      the communion of saints,
      the forgiveness of sins,
      the resurrection of the body,
      and life everlasting. Amen.`
  },
  our_father: {
    title: 'Our Father',
    text: `Our Father, who art in heaven,
      hallowed be thy name;
      thy kingdom come,
      thy will be done,
      on earth as it is in heaven.
      Give us this day our daily bread,
      and forgive us our trespasses,
      as we forgive those who trespass against us;
      and lead us not into temptation,
      but deliver us from evil. Amen.`
  },
  hail_mary: {
    title: 'Hail Mary',
    text: `Hail Mary, full of grace,
      the Lord is with thee.
      Blessed art thou among women,
      and blessed is the fruit of thy womb, Jesus.
      Holy Mary, Mother of God,
      pray for us sinners,
      now and at the hour of our death. Amen.`
  },
  glory_be: {
    title: 'Glory Be',
    text: `Glory be to the Father,
      and to the Son,
      and to the Holy Spirit.
      As it was in the beginning,
      is now, and ever shall be,
      world without end. Amen.`
  },
  fatima_prayer: {
    title: 'Fatima Prayer',
    text: `O my Jesus, forgive us our sins,
      save us from the fires of hell;
      lead all souls to heaven,
      especially those in most need of thy mercy.`
  },
  hail_holy_queen: {
    title: 'Hail Holy Queen',
    text: `Hail, holy Queen, Mother of Mercy,
      hail, our life, our sweetness, and our hope.
      To thee do we cry, poor banished children of Eve,
      to thee do we send up our sighs,
      mourning and weeping in this valley of tears.
      Turn then, most gracious Advocate,
      thine eyes of mercy toward us,
      and after this our exile
      show unto us the blessed fruit of thy womb, Jesus.
      O clement, O loving, O sweet Virgin Mary!`
  }
};
const RosaryPage: React.FC = () => {
  const [selectedMystery, setSelectedMystery] = useState<Mysteries | null>(null);
  const [currentDecade, setCurrentDecade] = useState(0);
  const [currentBead, setCurrentBead] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const getTotalBeads = () => {
    if (!selectedMystery) return 0;
    return selectedMystery.mysteries.length * 10 + 6; // 10 Hail Marys per decade + initial prayers
  };
  const getCurrentPrayer = (): Prayer => {
    if (!selectedMystery) return {
      title: '',
      text: ''
    };
    const decade = selectedMystery.mysteries[currentDecade];
    if (currentBead === 0) {
      return prayers.sign_of_the_cross;
    } else if (currentBead === 1) {
      return prayers.apostles_creed;
    } else if (currentBead === 2) {
      return prayers.our_father;
    } else if (currentBead <= 5) {
      return prayers.hail_mary;
    } else if (currentBead === 6) {
      return prayers.glory_be;
    }

    // Prayers within the decade
    const beadInDecade = (currentBead - 6) % 10;
    if (beadInDecade === 0) {
      return prayers.our_father;
    } else {
      return prayers.hail_mary;
    }
  };
  const nextBead = () => {
    if (!selectedMystery) return;
    const totalDecades = selectedMystery.mysteries.length;
    const totalBeadsInDecade = 10;
    if (currentBead < 6) {
      setCurrentBead(currentBead + 1);
    } else {
      const decadeProgress = (currentBead - 6) % totalBeadsInDecade;
      if (decadeProgress < totalBeadsInDecade - 1) {
        setCurrentBead(currentBead + 1);
      } else {
        if (currentDecade < totalDecades - 1) {
          setCurrentDecade(currentDecade + 1);
          setCurrentBead(currentBead + 1);
        } else {
          // Rosary is complete
          setIsPlaying(false);
          alert("Rosary is complete!");
        }
      }
    }
  };
  return <div className="container mx-auto px-4 py-8">
      <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-2">
        The Dominican Rosary
      </h1>
      <div className="text-center mb-6">
        <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-8 ">
        The Holy Rosary is a cherished devotion in the Dominican tradition. St. Dominic received this prayer 
        from Our Lady herself, and it has been a cornerstone of Dominican spirituality for over 800 years.
      </p>

      <Tabs defaultValue="pray" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pray">Pray the Rosary</TabsTrigger>
          <TabsTrigger value="mysteries">Mysteries</TabsTrigger>
          <TabsTrigger value="history">Dominican History</TabsTrigger>
        </TabsList>

        <TabsContent value="pray" className="space-y-6">
          {/* Prayer Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-card rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-garamond text-2xl font-bold text-dominican-burgundy">
                  {selectedMystery ? selectedMystery.title : 'Select Mysteries to Begin'}
                </h2>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)} disabled={!selectedMystery}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                  setCurrentBead(0);
                  setCurrentDecade(0);
                  setIsPlaying(false);
                }} disabled={!selectedMystery}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {selectedMystery ? <div className="space-y-6">
                  {/* Current Mystery */}
                  <div className="bg-dominican-burgundy/10 dark:bg-dominican-burgundy/20 p-4 rounded-md">
                    <h3 className="font-garamond text-lg font-semibold text-dominican-burgundy mb-2">
                      {currentDecade + 1}. {selectedMystery.mysteries[currentDecade]?.title || 'Complete'}
                    </h3>
                    {selectedMystery.mysteries[currentDecade] && <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {selectedMystery.mysteries[currentDecade].meditation}
                      </p>}
                  </div>

                  {/* Current Prayer */}
                  <div className="bg-white dark:bg-card border border-dominican-light-gray dark:border-border p-6 rounded-md">
                    <h4 className="font-garamond text-xl font-semibold text-dominican-burgundy mb-4">
                      {getCurrentPrayer().title}
                    </h4>
                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {getCurrentPrayer().text}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Decade {currentDecade + 1} of 5 • Bead {currentBead + 1} of {getTotalBeads()}
                    </span>
                    <Button onClick={nextBead} className="bg-dominican-burgundy hover:bg-dominican-burgundy/90">
                      Next Prayer
                    </Button>
                  </div>
                </div> : <div className="text-center py-12">
                  <div className="w-24 h-24 bg-dominican-light-gray dark:bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="font-garamond text-4xl text-dominican-burgundy">†</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Select a set of mysteries to begin praying the Rosary</p>
                </div>}
            </div>

            {/* Mystery Selection */}
            <div className="bg-white dark:bg-card rounded-lg shadow-md p-6">
              <h3 className="font-garamond text-xl font-bold text-dominican-burgundy mb-4">
                Select a Mystery
              </h3>
              <div className="space-y-4">
                {mysteriesData.map(mystery => <Card key={mystery.id} className="border-dominican-light-gray dark:border-border cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                setSelectedMystery(mystery);
                setCurrentBead(0);
                setCurrentDecade(0);
              }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        {mystery.icon}
                        <span className="ml-2">{mystery.title}</span>
                      </CardTitle>
                      {mystery.feastDay && <Badge variant="secondary">Feast: {mystery.feastDay}</Badge>}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{mystery.description}</p>
                    </CardContent>
                  </Card>)}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Mysteries Tab */}
        <TabsContent value="mysteries">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mysteriesData.map(mystery => <Card key={mystery.id} className="bg-white dark:bg-card rounded-lg shadow-md">
                <CardHeader>
                  <CardTitle className="font-garamond text-xl font-bold text-dominican-burgundy">
                    {mystery.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{mystery.description}</p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                    {mystery.mysteries.map((m, index) => <li key={index} className="mb-2">{m.title} - {m.meditation}</li>)}
                  </ul>
                </CardContent>
              </Card>)}
          </div>
        </TabsContent>

        {/* Dominican History Tab */}
        <TabsContent value="history">
          <Card className="bg-white dark:bg-card rounded-lg shadow-md">
            <CardHeader>
              <CardTitle className="font-garamond text-2xl font-bold text-dominican-burgundy">
                The Rosary in Dominican History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                The Rosary has deep roots in the Dominican Order, traditionally said to have been given to St. Dominic by the Virgin Mary in a vision.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                It became a key element in Dominican preaching and spirituality, used to teach the faithful about the life of Christ.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Dominicans helped spread the Rosary throughout the world, establishing confraternities and promoting its use among the laity.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
export default RosaryPage;