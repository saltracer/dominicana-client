
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Lightbulb, Heart, Flame } from 'lucide-react';

const PreachingLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 dark:from-amber-950/20 to-orange-50 dark:to-orange-950/20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-garamond text-5xl md:text-6xl font-bold text-dominican-black dark:text-foreground mb-6">
            Preaching
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            "To contemplate and to give to others the fruits of contemplation." 
            Discover resources for sharing the Gospel truth through the Dominican tradition of preaching.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 italic">
            - Contemplata aliis tradere
          </p>
        </div>

        {/* Preaching Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-amber-200 dark:border-amber-800 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-garamond text-2xl text-dominican-black dark:text-foreground flex items-center">
                <MessageSquare className="mr-3" size={28} />
                Daily Reflections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Drawing from the wellspring of Dominican spirituality, find daily inspiration 
                for prayer, reflection, and sharing the Good News with others.
              </p>
              <div className="space-y-3 mb-6">
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-dominican-black dark:text-foreground">Today's Reading</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Gospel Reflection</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Meditation on the Word of God</p>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">• Scripture-based reflections</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">• Dominican saint inspirations</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">• Theological insights</div>
              </div>
              <Link to="/preaching/daily-reflections">
                <Button className="w-full bg-dominican-burgundy">
                  Read Today's Reflection
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-800 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-garamond text-2xl text-dominican-black dark:text-foreground flex items-center">
                <Lightbulb className="mr-3" size={28} />
                Homiletic Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Tools and guidance for effective preaching in the Dominican tradition, 
                combining deep theology with pastoral sensitivity.
              </p>
              <div className="space-y-3 mb-6">
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded">
                  <h4 className="font-semibold text-dominican-black dark:text-foreground mb-1">Liturgical Year Themes</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Seasonal preaching guides</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded">
                  <h4 className="font-semibold text-dominican-black dark:text-foreground mb-1">Scripture Commentary</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Exegetical insights for preachers</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded">
                  <h4 className="font-semibold text-dominican-black dark:text-foreground mb-1">Dominican Wisdom</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Insights from great Dominican preachers</p>
                </div>
              </div>
              <Button disabled className="w-full bg-dominican-burgundy">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dominican Preaching Tradition */}
        <Card className="border-amber-200 dark:border-amber-800 mb-8">
          <CardHeader>
            <CardTitle className="font-garamond text-3xl text-dominican-black dark:text-foreground text-center">
              The Dominican Art of Preaching
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Heart className="mx-auto mb-4 text-dominican-black dark:text-foreground" size={32} />
                <h3 className="font-garamond text-xl font-semibold mb-3 text-foreground">From the Heart</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Preaching that flows from deep contemplation and personal encounter with Christ, 
                  touching both mind and heart of the listener.
                </p>
              </div>
              <div className="text-center">
                <Lightbulb className="mx-auto mb-4 text-dominican-black dark:text-foreground" size={32} />
                <h3 className="font-garamond text-xl font-semibold mb-3 text-foreground">Truth & Clarity</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Clear articulation of Catholic doctrine and moral teaching, presented with 
                  the precision and wisdom of Thomistic theology.
                </p>
              </div>
              <div className="text-center">
                <Flame className="mx-auto mb-4 text-dominican-black dark:text-foreground" size={32} />
                <h3 className="font-garamond text-xl font-semibold mb-3 text-foreground">Pastoral Zeal</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Preaching animated by genuine love for souls and desire to bring all people 
                  to the knowledge and love of God.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Great Dominican Preachers */}
        <Card className="border-amber-200 dark:border-amber-800 mb-8">
          <CardHeader>
            <CardTitle className="font-garamond text-2xl text-dominican-black dark:text-foreground text-center">
              Great Dominican Preachers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/30 rounded">
                <h4 className="font-garamond font-semibold text-dominican-black dark:text-foreground mb-2">St. Dominic</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Founder & Model Preacher</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">"Preaching against heresy"</p>
              </div>
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/30 rounded">
                <h4 className="font-garamond font-semibold text-dominican-black dark:text-foreground mb-2">St. Vincent Ferrer</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Angel of the Judgment</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">"Prepare ye the way"</p>
              </div>
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/30 rounded">
                <h4 className="font-garamond font-semibold text-dominican-black dark:text-foreground mb-2">Bl. Fra Angelico</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Preaching through Art</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">"Beauty of Truth"</p>
              </div>
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/30 rounded">
                <h4 className="font-garamond font-semibold text-dominican-black dark:text-foreground mb-2">St. Louis de Montfort</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Marian Preacher</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">"True Devotion"</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Method of Preaching */}
        <Card className="border-amber-200 dark:border-amber-800 mb-8">
          <CardHeader>
            <CardTitle className="font-garamond text-2xl text-dominican-black dark:text-foreground text-center">
              The Dominican Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  The Dominican approach to preaching follows a time-tested method that integrates 
                  study, prayer, and pastoral wisdom.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded">
                  <h3 className="font-garamond text-lg font-semibold text-dominican-black dark:text-foreground mb-3">Preparation</h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>• Deep study of Scripture and tradition</li>
                    <li>• Prayer and contemplation</li>
                    <li>• Understanding the audience</li>
                    <li>• Clear structure and purpose</li>
                  </ul>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded">
                  <h3 className="font-garamond text-lg font-semibold text-dominican-black dark:text-foreground mb-3">Delivery</h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>• Clarity of doctrine</li>
                    <li>• Pastoral sensitivity</li>
                    <li>• Engaging presentation</li>
                    <li>• Call to conversion</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Section */}
        <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 dark:from-amber-950/30 to-orange-100 dark:to-orange-950/30">
          <CardContent className="text-center py-8">
            <blockquote className="text-xl text-gray-800 dark:text-gray-200 italic font-medium mb-4">
              "The preacher must first be warmed by what he speaks before he warms others with his words."
            </blockquote>
            <p className="text-gray-600 dark:text-gray-400">- St. Thomas Aquinas</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">On the Art of Preaching</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PreachingLandingPage;
