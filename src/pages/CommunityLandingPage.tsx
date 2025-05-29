
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MapPin, Sparkles } from 'lucide-react';

const CommunityLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 dark:from-amber-950/20 to-orange-50 dark:to-orange-950/20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-garamond text-5xl md:text-6xl font-bold text-dominican-black dark:text-foreground mb-6">
            Community
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            "We are one body in Christ, and individually members one of another." 
            Discover the rich tapestry of Dominican community life around the world.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 italic">
            - Romans 12:5
          </p>
        </div>

        {/* Community Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="border-amber-200 dark:border-amber-800 hover:shadow-lg transition-shadow bg-white dark:bg-card">
            <CardHeader>
              <CardTitle className="font-garamond text-2xl text-dominican-black dark:text-foreground flex items-center">
                <Calendar className="mr-3 text-dominican-burgundy" size={28} />
                Liturgical Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Follow the rhythm of the Church year with feast days, memorials, 
                and celebrations that mark our journey of faith.
              </p>
              <div className="space-y-3 mb-6">
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-dominican-black dark:text-foreground">Today's Celebration</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Liturgical Rank</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">View today's liturgical significance</p>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">• Dominican feast days</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">• Universal celebrations</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">• Seasonal observances</div>
              </div>
              <Link to="/community/liturgical-calendar">
                <Button className="w-full bg-dominican-burgundy hover:bg-dominican-burgundy/90">
                  View Calendar
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-800 hover:shadow-lg transition-shadow bg-white dark:bg-card">
            <CardHeader>
              <CardTitle className="font-garamond text-2xl text-dominican-black dark:text-foreground flex items-center">
                <Sparkles className="mr-3 text-dominican-burgundy" size={28} />
                Dominican Saints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Explore the lives and legacies of Dominican saints, blesseds, 
                and notable figures who have shaped our Order.
              </p>
              <div className="space-y-3 mb-6">
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded">
                  <h4 className="font-semibold text-dominican-black dark:text-foreground mb-1">Featured Saints</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">St. Dominic, St. Thomas Aquinas, St. Catherine</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded">
                  <h4 className="font-semibold text-dominican-black dark:text-foreground mb-1">Search & Browse</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Timeline view and detailed biographies</p>
                </div>
              </div>
              <Link to="/community/saints">
                <Button className="w-full bg-dominican-burgundy hover:bg-dominican-burgundy/90">
                  Meet the Saints
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-800 hover:shadow-lg transition-shadow bg-white dark:bg-card">
            <CardHeader>
              <CardTitle className="font-garamond text-2xl text-dominican-black dark:text-foreground flex items-center">
                <MapPin className="mr-3 text-dominican-burgundy" size={28} />
                Global Provinces
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Discover Dominican provinces around the world and their unique 
                contributions to the mission of preaching.
              </p>
              <div className="space-y-3 mb-6">
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded">
                  <h4 className="font-semibold text-dominican-black dark:text-foreground mb-1">Interactive Map</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Explore provinces by region</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded">
                  <h4 className="font-semibold text-dominican-black dark:text-foreground mb-1">Province Details</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">History, houses, and ministries</p>
                </div>
              </div>
              <Link to="/community/provinces">
                <Button className="w-full bg-dominican-burgundy hover:bg-dominican-burgundy/90">
                  Explore Provinces
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quote Section */}
        <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 dark:from-amber-950/30 to-orange-100 dark:to-orange-950/30">
          <CardContent className="text-center py-8">
            <blockquote className="text-xl text-gray-800 dark:text-gray-200 italic font-medium mb-4">
              "The brothers should live together in community and have all things in common."
            </blockquote>
            <p className="text-gray-600 dark:text-gray-400">- Rule of St. Augustine</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Foundation of Dominican Community Life</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityLandingPage;
