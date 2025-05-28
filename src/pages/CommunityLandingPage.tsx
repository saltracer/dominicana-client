import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Globe } from 'lucide-react';
const CommunityLandingPage: React.FC = () => {
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-garamond text-5xl md:text-6xl font-bold text-dominican-black mb-6">
            Community
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            "What we have contemplated, let us hand on to others." Connect with the global Dominican family 
            and celebrate our shared heritage of faith, learning, and service.
          </p>
          <p className="text-lg text-gray-600 mt-4 italic">
            - Contemplata aliis tradere
          </p>
        </div>

        {/* Community Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-amber-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-garamond text-2xl text-dominican-black flex items-center">
                <Calendar className="mr-3" size={28} />
                Liturgical Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">
                Follow the rhythm of the Church year and discover the special feasts and 
                celebrations of the Dominican liturgical tradition.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-2 bg-amber-50 rounded">
                  <span className="text-sm font-medium">Today's Celebration</span>
                  <span className="text-xs text-gray-600">Memorial</span>
                </div>
                <div className="text-sm text-gray-600">
                  • Dominican Saints & Blesseds
                </div>
                <div className="text-sm text-gray-600">
                  • Universal Church Calendar
                </div>
                <div className="text-sm text-gray-600">
                  • Seasonal Observances
                </div>
              </div>
              <Link to="/community/liturgical-calendar">
                <Button className="w-full bg-dominican-burgundy">
                  View Calendar
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-amber-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-garamond text-2xl text-dominican-black flex items-center">
                <Users className="mr-3" size={28} />
                Saints & Blesseds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">
                Be inspired by the lives of Dominican saints, blesseds, and holy men and women 
                who have lived out the charism throughout history.
              </p>
              <div className="space-y-2 mb-6">
                <div className="text-sm font-medium text-dominican-black">Featured Saints:</div>
                <div className="text-sm text-gray-600">• St. Dominic de Guzmán - Founder</div>
                <div className="text-sm text-gray-600">• St. Thomas Aquinas - Doctor Angelicus</div>
                <div className="text-sm text-gray-600">• St. Catherine of Siena - Doctor of the Church</div>
                <div className="text-sm text-gray-600">• Bl. Jordan of Saxony - Second Master</div>
                <div className="text-sm text-gray-600">• St. Rose of Lima - First Saint of the Americas</div>
              </div>
              <Link to="/community/saints">
                <Button className="w-full bg-dominican-burgundy">
                  Explore Saints
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Global Dominican Presence */}
        <Card className=" mb-8 border-amber-200 ">
          <CardHeader>
            <CardTitle className="font-garamond text-3xl text-dominican-black text-center flex items-center justify-center">
              <MapPin className="mr-3" size={32} />
              Global Dominican Provinces
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <p className="text-gray-700 text-center mb-8">
              The Order of Preachers spans the globe with provinces on every continent, 
              united in the mission of contemplation and preaching.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-amber-50 rounded">
                <Globe className="mx-auto mb-2 text-dominican-black" size={24} />
                <h4 className="font-semibold text-dominican-black">Europe</h4>
                <p className="text-xs text-gray-600 mt-1">45+ Provinces</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded">
                <Globe className="mx-auto mb-2 text-dominican-black" size={24} />
                <h4 className="font-semibold text-dominican-black">Americas</h4>
                <p className="text-xs text-gray-600 mt-1">25+ Provinces</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded">
                <Globe className="mx-auto mb-2 text-dominican-black" size={24} />
                <h4 className="font-semibold text-dominican-black">Asia-Pacific</h4>
                <p className="text-xs text-gray-600 mt-1">15+ Provinces</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded">
                <Globe className="mx-auto mb-2 text-dominican-black" size={24} />
                <h4 className="font-semibold text-dominican-black">Africa</h4>
                <p className="text-xs text-gray-600 mt-1">12+ Provinces</p>
              </div>
            </div>
            <div className="text-center">
              <Link to="/community/provinces">
                <Button className="bg-dominican-burgundy">
                  Explore Province Map
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Dominican Family */}
        <Card className="border-amber-200 mb-8">
          <CardHeader>
            <CardTitle className="font-garamond text-2xl text-dominican-black text-center">
              The Dominican Family
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-dominican-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-garamond text-xl font-bold">OP</span>
                </div>
                <h3 className="font-garamond text-xl font-semibold mb-3">Friars</h3>
                <p className="text-gray-700 text-sm">
                  Brothers dedicated to preaching, teaching, and pastoral ministry around the world. 
                  The Order of Preachers founded by St. Dominic.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-dominican-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-garamond text-xl font-bold">♕</span>
                </div>
                <h3 className="font-garamond text-xl font-semibold mb-3">Sisters</h3>
                <p className="text-gray-700 text-sm">
                  Contemplative and apostolic sisters in monasteries and congregations, 
                  living lives of prayer, study, and service to the Church.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-dominican-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-garamond text-xl font-bold">✟</span>
                </div>
                <h3 className="font-garamond text-xl font-semibold mb-3">Laity</h3>
                <p className="text-gray-700 text-sm">
                  Lay Dominicans living the Dominican charism in their families, workplaces, 
                  and communities throughout the world.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Section */}
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-100">
          <CardContent className="text-center py-8">
            <blockquote className="text-xl text-gray-800 italic font-medium mb-4">
              "We must sow the seed, not hoard it."
            </blockquote>
            <p className="text-gray-600">- St. Dominic de Guzmán</p>
            <p className="text-sm text-gray-500 mt-2">Founder of the Order of Preachers</p>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default CommunityLandingPage;