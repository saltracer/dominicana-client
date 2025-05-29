
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Lightbulb, Search, Star } from 'lucide-react';

const StudyLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 dark:from-amber-950/20 to-orange-50 dark:to-orange-950/20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-garamond text-5xl md:text-6xl font-bold text-dominican-black dark:text-foreground mb-6">
            Study
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            "Study with passion the truth that faith reveals." 
            Immerse yourself in the rich intellectual tradition of the Dominican Order.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 italic">
            - Veritas
          </p>
        </div>

        {/* Study Resources */}
        <div className="grid grid-cols-1 gap-8 mb-12">
          <Card className="border-amber-200 dark:border-amber-800 hover:shadow-lg transition-shadow bg-white dark:bg-card">
            <CardHeader>
              <CardTitle className="font-garamond text-2xl text-dominican-black dark:text-foreground flex items-center">
                <BookOpen className="mr-3 text-dominican-burgundy" size={28} />
                Digital Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Access a curated collection of classical Catholic texts, 
                Dominican writings, and theological resources for deep study.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded">
                  <h4 className="font-semibold text-dominican-black dark:text-foreground mb-2">Dominican Masters</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Works by St. Thomas Aquinas, St. Albert the Great, and other Dominican scholars</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded">
                  <h4 className="font-semibold text-dominican-black dark:text-foreground mb-2">Spiritual Classics</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mystical theology and spiritual writings from Dominican saints</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded">
                  <h4 className="font-semibold text-dominican-black dark:text-foreground mb-2">Contemporary Works</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Modern Dominican scholarship and theological insights</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/study/library" className="flex-1">
                  <Button className="w-full bg-dominican-burgundy hover:bg-dominican-burgundy/90">
                    Browse Library
                  </Button>
                </Link>
                <Button variant="outline" className="flex-1 border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10">
                  <Search className="mr-2 h-4 w-4" />
                  Search Texts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Authors */}
        <Card className="border-amber-200 dark:border-amber-800 mb-8 bg-white dark:bg-card">
          <CardHeader>
            <CardTitle className="font-garamond text-2xl text-dominican-black dark:text-foreground text-center">
              Featured Dominican Authors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/30 rounded">
                <Star className="mx-auto mb-2 text-dominican-burgundy" size={24} />
                <h4 className="font-garamond font-semibold text-dominican-black dark:text-foreground mb-2">St. Thomas Aquinas</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Summa Theologica, Summa Contra Gentiles</p>
              </div>
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/30 rounded">
                <Star className="mx-auto mb-2 text-dominican-burgundy" size={24} />
                <h4 className="font-garamond font-semibold text-dominican-black dark:text-foreground mb-2">St. Albert the Great</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Commentary on Aristotle, Natural Philosophy</p>
              </div>
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/30 rounded">
                <Star className="mx-auto mb-2 text-dominican-burgundy" size={24} />
                <h4 className="font-garamond font-semibold text-dominican-black dark:text-foreground mb-2">St. Catherine of Siena</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">The Dialogue, Letters</p>
              </div>
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/30 rounded">
                <Star className="mx-auto mb-2 text-dominican-burgundy" size={24} />
                <h4 className="font-garamond font-semibold text-dominican-black dark:text-foreground mb-2">Meister Eckhart</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Mystical Sermons, Spiritual Treatises</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dominican Intellectual Tradition */}
        <Card className="border-amber-200 dark:border-amber-800 mb-8 bg-white dark:bg-card">
          <CardHeader>
            <CardTitle className="font-garamond text-3xl text-dominican-black dark:text-foreground text-center">
              The Dominican Intellectual Tradition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Lightbulb className="mx-auto mb-4 text-dominican-black dark:text-foreground" size={32} />
                <h3 className="font-garamond text-xl font-semibold mb-3 text-foreground">Faith & Reason</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  The harmonious relationship between faith and reason, 
                  demonstrating that truth is one and can be approached through multiple avenues.
                </p>
              </div>
              <div className="text-center">
                <BookOpen className="mx-auto mb-4 text-dominican-black dark:text-foreground" size={32} />
                <h3 className="font-garamond text-xl font-semibold mb-3 text-foreground">Thomistic Synthesis</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  The integration of Aristotelian philosophy with Christian theology, 
                  creating a comprehensive worldview centered on truth.
                </p>
              </div>
              <div className="text-center">
                <Search className="mx-auto mb-4 text-dominican-black dark:text-foreground" size={32} />
                <h3 className="font-garamond text-xl font-semibold mb-3 text-foreground">Contemplative Study</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Study as a form of prayer and contemplation, 
                  seeking God through the pursuit of truth and wisdom.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Section */}
        <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 dark:from-amber-950/30 to-orange-100 dark:to-orange-950/30">
          <CardContent className="text-center py-8">
            <blockquote className="text-xl text-gray-800 dark:text-gray-200 italic font-medium mb-4">
              "Study without prayer is sterile; prayer without study is empty."
            </blockquote>
            <p className="text-gray-600 dark:text-gray-400">- Dominican Proverb</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">The Unity of Study and Prayer</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudyLandingPage;
