import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Heart, Star, BookOpen } from 'lucide-react';
const PrayerLandingPage: React.FC = () => {
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-garamond text-5xl md:text-6xl font-bold text-dominican-black mb-6">
            Prayer
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            "Prayer is the raising of one's mind and heart to God or the requesting of good things from God." 
            Discover the rich liturgical tradition of the Dominican Order through our digital prayer resources.
          </p>
          <p className="text-lg text-gray-600 mt-4 italic">
            - St. John Damascene
          </p>
        </div>

        {/* Main Prayer Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-amber-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-garamond text-2xl text-dominican-black flex items-center">
                <Clock className="mr-3" size={28} />
                Liturgy of the Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">
                Join the universal Church in praying the Divine Office throughout the day. 
                Experience the rhythm of prayer that has sustained religious communities for centuries.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Lauds (Morning Prayer)</span>
                  <span className="text-dominican-black font-medium">6:00 AM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vespers (Evening Prayer)</span>
                  <span className="text-dominican-black font-medium">6:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Compline (Night Prayer)</span>
                  <span className="text-dominican-black font-medium">9:00 PM</span>
                </div>
              </div>
              <Link to="/prayer/liturgy-of-the-hours">
                <Button className="w-full bg-dominican-burgundy">
                  Enter the Hours
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-amber-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-garamond text-2xl text-dominican-black flex items-center">
                <Heart className="mr-3" size={28} />
                The Holy Rosary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">
                Contemplate the mysteries of Christ's life through the beloved prayer of the Rosary. 
                St. Dominic received this devotion from Our Lady herself.
              </p>
              <div className="space-y-2 mb-6">
                <div className="text-sm text-gray-600">• Joyful Mysteries (Monday, Saturday)</div>
                <div className="text-sm text-gray-600">• Sorrowful Mysteries (Tuesday, Friday)</div>
                <div className="text-sm text-gray-600">• Glorious Mysteries (Wednesday, Sunday)</div>
                <div className="text-sm text-gray-600">• Luminous Mysteries (Thursday)</div>
              </div>
              <Link to="/prayer/rosary">
                <Button className="w-full bg-dominican-burgundy">
                  Pray the Rosary
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Dominican Prayer Tradition */}
        <Card className="border-amber-200 mb-8">
          <CardHeader>
            <CardTitle className="font-garamond text-3xl text-dominican-black text-center">
              The Dominican Way of Prayer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Star className="mx-auto mb-4 text-dominican-black" size={32} />
                <h3 className="font-garamond text-xl font-semibold mb-3">Contemplative</h3>
                <p className="text-gray-700 text-sm">
                  Deep contemplation of God's truth through silent prayer, meditation, and 
                  the study of Scripture and theology.
                </p>
              </div>
              <div className="text-center">
                <BookOpen className="mx-auto mb-4 text-dominican-black" size={32} />
                <h3 className="font-garamond text-xl font-semibold mb-3">Liturgical</h3>
                <p className="text-gray-700 text-sm">
                  Participation in the public prayer of the Church through the celebration 
                  of Mass and the Liturgy of the Hours.
                </p>
              </div>
              <div className="text-center">
                <Heart className="mx-auto mb-4 text-dominican-black" size={32} />
                <h3 className="font-garamond text-xl font-semibold mb-3">Apostolic</h3>
                <p className="text-gray-700 text-sm">
                  Prayer that flows into preaching and service, sharing the fruits of 
                  contemplation with others in need.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Section */}
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-100">
          <CardContent className="text-center py-8">
            <blockquote className="text-xl text-gray-800 italic font-medium mb-4">
              "Nothing is so strong as gentleness, nothing so gentle as real strength."
            </blockquote>
            <p className="text-gray-600">- St. Francis de Sales</p>
            <p className="text-sm text-gray-500 mt-2">Patron of the Dominican Spirituality</p>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default PrayerLandingPage;