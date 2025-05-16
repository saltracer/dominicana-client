
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, BookOpen, Users, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-dominican-white to-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-garamond text-5xl md:text-6xl font-bold text-dominican-burgundy mb-6">
            Dominicana
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto mb-8">
            A digital companion for the Order of Preachers supporting prayer, study, community, and preaching.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-dominican-burgundy hover:bg-dominican-burgundy/90">
              <Link to="/prayer/liturgy-of-the-hours">
                Pray the Liturgy of Hours
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10">
              <Link to="/community/liturgical-calendar">
                View Today's Celebration
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Four Pillars Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-garamond text-3xl md:text-4xl font-bold mb-2 text-dominican-black">
            The Four Pillars
          </h2>
          <div className="text-center mb-12">
            <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-dominican-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-dominican-burgundy/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-dominican-burgundy" />
              </div>
              <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-2">Prayer</h3>
              <p className="text-gray-700 mb-4">Deepen your spiritual life with the Liturgy of the Hours and the Holy Rosary.</p>
              <Button asChild variant="link" className="text-dominican-burgundy">
                <Link to="/prayer">Explore Prayer Resources</Link>
              </Button>
            </div>

            <div className="bg-dominican-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-dominican-burgundy/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-dominican-burgundy" />
              </div>
              <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-2">Study</h3>
              <p className="text-gray-700 mb-4">Access classical Catholic texts and theological resources in our digital library.</p>
              <Button asChild variant="link" className="text-dominican-burgundy">
                <Link to="/study">Browse Study Materials</Link>
              </Button>
            </div>

            <div className="bg-dominican-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-dominican-burgundy/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-dominican-burgundy" />
              </div>
              <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-2">Community</h3>
              <p className="text-gray-700 mb-4">Explore the liturgical calendar, Dominican saints, and provincial territories.</p>
              <Button asChild variant="link" className="text-dominican-burgundy">
                <Link to="/community">Discover Our Community</Link>
              </Button>
            </div>

            <div className="bg-dominican-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-dominican-burgundy/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Mic className="h-8 w-8 text-dominican-burgundy" />
              </div>
              <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-2">Preaching</h3>
              <p className="text-gray-700 mb-4">Find inspiration through daily reflections and preaching resources.</p>
              <Button asChild variant="link" className="text-dominican-burgundy">
                <Link to="/preaching">Access Preaching Materials</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-16 bg-dominican-light-gray/30">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-garamond text-3xl md:text-4xl font-bold mb-2 text-dominican-black">
            Featured Content
          </h2>
          <div className="text-center mb-12">
            <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-dominican-burgundy/20"></div>
              <div className="p-6">
                <h3 className="font-garamond text-xl font-bold text-dominican-burgundy mb-2">Today's Feast</h3>
                <p className="text-gray-700 text-sm mb-4">Explore the significance of today's celebration in the liturgical calendar.</p>
                <Button asChild variant="outline" className="w-full border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10">
                  <Link to="/community/liturgical-calendar">
                    View Details
                  </Link>
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-dominican-burgundy/20"></div>
              <div className="p-6">
                <h3 className="font-garamond text-xl font-bold text-dominican-burgundy mb-2">Pray the Dominican Rosary</h3>
                <p className="text-gray-700 text-sm mb-4">Learn about the tradition of the Rosary in the Dominican Order.</p>
                <Button asChild variant="outline" className="w-full border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10">
                  <Link to="/prayer/rosary">
                    Begin Prayer
                  </Link>
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-dominican-burgundy/20"></div>
              <div className="p-6">
                <h3 className="font-garamond text-xl font-bold text-dominican-burgundy mb-2">Dominican Saints</h3>
                <p className="text-gray-700 text-sm mb-4">Explore the lives and legacies of notable Dominican saints throughout history.</p>
                <Button asChild variant="outline" className="w-full border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10">
                  <Link to="/community/saints">
                    Meet the Saints
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
