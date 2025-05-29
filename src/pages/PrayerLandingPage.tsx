
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Heart, BookOpen, Sunrise } from 'lucide-react';

const PrayerLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 dark:from-amber-950/20 to-orange-50 dark:to-orange-950/20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-garamond text-5xl md:text-6xl font-bold text-dominican-black dark:text-foreground mb-6">
            Prayer
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            "Be constant in prayer." Enter into the rhythm of Dominican prayer life 
            through the Liturgy of the Hours and the Holy Rosary.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 italic">
            - Romans 12:12
          </p>
        </div>

        {/* Prayer Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-amber-200 dark:border-amber-800 hover:shadow-lg transition-shadow bg-white dark:bg-card">
            <CardHeader>
              <CardTitle className="font-garamond text-2xl text-dominican-black dark:text-foreground flex items-center">
                <Clock className="mr-3 text-dominican-burgundy" size={28} />
                Liturgy of the Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Join the universal prayer of the Church throughout the day with 
                the traditional hours of prayer in the Dominican tradition.
              </p>
              <div className="space-y-3 mb-6">
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-dominican-black dark:text-foreground">Current Hour</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Available Now</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pray the hour appointed for this time</p>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">• Morning Prayer (Lauds)</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">• Evening Prayer (Vespers)</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">• Night Prayer (Compline)</div>
              </div>
              <Link to="/prayer/liturgy-of-the-hours">
                <Button className="w-full bg-dominican-burgundy hover:bg-dominican-burgundy/90">
                  Begin Prayer
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-800 hover:shadow-lg transition-shadow bg-white dark:bg-card">
            <CardHeader>
              <CardTitle className="font-garamond text-2xl text-dominican-black dark:text-foreground flex items-center">
                <Heart className="mr-3 text-dominican-burgundy" size={28} />
                Holy Rosary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Pray the Dominican Rosary with guided meditations on the mysteries 
                of our salvation, following our Order's treasured tradition.
              </p>
              <div className="space-y-3 mb-6">
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded">
                  <h4 className="font-semibold text-dominican-black dark:text-foreground mb-1">Today's Mystery</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Joyful, Sorrowful, Glorious, or Luminous</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded">
                  <h4 className="font-semibold text-dominican-black dark:text-foreground mb-1">Guided Prayer</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Step-by-step rosary guide</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded">
                  <h4 className="font-semibold text-dominican-black dark:text-foreground mb-1">Dominican Tradition</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Historical context and spiritual insights</p>
                </div>
              </div>
              <Link to="/prayer/rosary">
                <Button className="w-full bg-dominican-burgundy hover:bg-dominican-burgundy/90">
                  Pray the Rosary
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Dominican Prayer Tradition */}
        <Card className="border-amber-200 dark:border-amber-800 mb-8 bg-white dark:bg-card">
          <CardHeader>
            <CardTitle className="font-garamond text-3xl text-dominican-black dark:text-foreground text-center">
              The Dominican Way of Prayer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Sunrise className="mx-auto mb-4 text-dominican-black dark:text-foreground" size={32} />
                <h3 className="font-garamond text-xl font-semibold mb-3 text-foreground">Contemplative</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Prayer that draws us into deep communion with God through 
                  contemplation of divine truth and mystery.
                </p>
              </div>
              <div className="text-center">
                <BookOpen className="mx-auto mb-4 text-dominican-black dark:text-foreground" size={32} />
                <h3 className="font-garamond text-xl font-semibold mb-3 text-foreground">Liturgical</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Participation in the official prayer of the Church, 
                  sanctifying every hour of the day and night.
                </p>
              </div>
              <div className="text-center">
                <Heart className="mx-auto mb-4 text-dominican-black dark:text-foreground" size={32} />
                <h3 className="font-garamond text-xl font-semibold mb-3 text-foreground">Marian</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Devotion to Our Lady through the Rosary, fostering 
                  intimate relationship with the Mother of God.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Section */}
        <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 dark:from-amber-950/30 to-orange-100 dark:to-orange-950/30">
          <CardContent className="text-center py-8">
            <blockquote className="text-xl text-gray-800 dark:text-gray-200 italic font-medium mb-4">
              "Prayer is the raising of one's mind and heart to God."
            </blockquote>
            <p className="text-gray-600 dark:text-gray-400">- St. John Damascene</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Quoted by St. Thomas Aquinas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrayerLandingPage;
