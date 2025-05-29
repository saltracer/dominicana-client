
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 dark:from-amber-950/20 to-orange-50 dark:to-orange-950/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="font-garamond text-4xl md:text-5xl font-bold text-dominican-black dark:text-foreground mb-4">
            About Dominicana
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            A digital sanctuary supporting the four pillars of Dominican life: Prayer, Study, Community, and Preaching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-amber-200 dark:border-amber-800 bg-white dark:bg-card">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black dark:text-foreground flex items-center">
                <span className="mr-2">🙏</span>
                Prayer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                Access the Liturgy of the Hours, traditional prayers, and contemplative resources 
                that nourish the spiritual life of Dominicans and all seekers of truth.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-800 bg-white dark:bg-card">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black dark:text-foreground flex items-center">
                <span className="mr-2">📚</span>
                Study
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                Explore the rich intellectual tradition of the Order through works of great Dominican 
                theologians, philosophers, and mystics from St. Thomas Aquinas to the present day.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-800 bg-white dark:bg-card">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black dark:text-foreground flex items-center">
                <span className="mr-2">🤝</span>
                Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                Connect with the global Dominican family through liturgical calendars, saint 
                commemorations, and resources celebrating our worldwide provinces and communities.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-800 bg-white dark:bg-card">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black dark:text-foreground flex items-center">
                <span className="mr-2">✨</span>
                Preaching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                Discover daily reflections, homiletic resources, and spiritual insights to support 
                the Dominican mission of contemplata aliis tradere - sharing contemplated truth.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-amber-200 dark:border-amber-800 mb-8 bg-white dark:bg-card">
          <CardHeader>
            <CardTitle className="font-garamond text-2xl text-dominican-black dark:text-foreground text-center">
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Founded in the spirit of St. Dominic, this digital platform serves as a companion 
              for those called to the Dominican way of life. Whether you are a friar, sister, 
              lay Dominican, or simply drawn to our charism, Dominicana offers resources to 
              deepen your spiritual journey and intellectual formation.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-4 italic">
              "To contemplate and to give to others the fruits of contemplation"
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              - Contemplata aliis tradere
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-800 bg-white dark:bg-card">
          <CardHeader>
            <CardTitle className="font-garamond text-2xl text-dominican-black dark:text-foreground text-center">
              The Dominican Family
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 text-center mb-4">
              The Order of Preachers, founded by St. Dominic in 1216, encompasses:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <h4 className="font-semibold text-dominican-black dark:text-foreground mb-2">Friars</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Brothers dedicated to preaching, teaching, and pastoral ministry
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-dominican-black dark:text-foreground mb-2">Sisters</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Contemplative and apostolic sisters in monasteries and congregations
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-dominican-black dark:text-foreground mb-2">Laity</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Lay Dominicans living the charism in the world
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
