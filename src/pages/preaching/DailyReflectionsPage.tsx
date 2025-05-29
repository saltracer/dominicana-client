
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

// Sample reflection data
const todaysReflection = {
  date: new Date(),
  title: "Finding God in All Things",
  scripture: "Matthew 7:7-12",
  scriptureText: "\"Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.\"",
  content: "In today's Gospel, Jesus encourages us to be persistent in prayer. He assures us that God, our loving Father, will respond to our sincere requests. But we must be careful not to misunderstand this teaching. Jesus is not promising that we will receive everything we ask for exactly as we envision it. Rather, he is assuring us that God hears our prayers and responds with what is truly good for us.\n\nThe Dominican tradition has always emphasized the importance of study and contemplation as forms of prayer. St. Thomas Aquinas teaches that prayer is the ascent of the mind to God. When we study Scripture or theology, when we contemplate the mysteries of faith, we are engaging in a form of prayer that draws us closer to God.\n\nToday's Gospel challenges us to persist in our search for God, to keep knocking at the door of divine wisdom. The Dominican motto, 'Veritas' (Truth), reminds us that this search for truth is ultimately a search for God, who is Truth itself. When we approach this search with humility and persistence, we discover that God is already reaching out to us, inviting us into deeper communion.",
  author: "Fr. Thomas Joseph, OP",
  audioUrl: ""
};

const DailyReflectionsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-2">
        Daily Reflections
      </h1>
      <div className="text-center mb-6">
        <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-3xl">
        Daily reflections on the Scripture readings from Dominican friars, sisters, and laity.
        These reflections offer insight into applying the Word of God to daily life in the Dominican tradition.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-card rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-5 w-5 text-dominican-burgundy" />
            <span className="font-medium text-foreground">{format(todaysReflection.date, "EEEE, MMMM d, yyyy")}</span>
          </div>
          
          <h2 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-4">
            {todaysReflection.title}
          </h2>
          
          <div className="mb-6">
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Scripture: {todaysReflection.scripture}</p>
            <div className="bg-dominican-light-gray/30 dark:bg-muted p-4 rounded-md italic">
              <span className="text-gray-700 dark:text-gray-300">{todaysReflection.scriptureText}</span>
            </div>
          </div>
          
          <div className="prose max-w-none mb-6">
            {todaysReflection.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4 text-gray-700 dark:text-gray-300">{paragraph}</p>
            ))}
          </div>
          
          <div className="border-t border-dominican-light-gray dark:border-border pt-4 mt-6 text-right">
            <p className="italic text-gray-600 dark:text-gray-400">Written by {todaysReflection.author}</p>
          </div>
          
          {todaysReflection.audioUrl && (
            <div className="mt-6 bg-dominican-burgundy/10 dark:bg-dominican-burgundy/20 p-4 rounded-md">
              <h3 className="font-garamond text-lg font-semibold text-dominican-burgundy mb-2">
                Audio Version
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Listen to today's reflection read by the author.
              </p>
              <Button className="bg-dominican-burgundy hover:bg-dominican-burgundy/90">
                Listen Now (Subscription Required)
              </Button>
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-card rounded-lg shadow-md p-6">
          <h3 className="font-garamond text-xl font-bold text-dominican-burgundy mb-4">
            Previous Reflections
          </h3>
          
          <div className="space-y-4">
            <div className="border-b border-dominican-light-gray dark:border-border pb-3">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{format(new Date(todaysReflection.date.setDate(todaysReflection.date.getDate() - 1)), "MMMM d, yyyy")}</p>
              <h4 className="font-garamond font-medium text-dominican-burgundy hover:text-dominican-burgundy/80 transition-colors">
                <a href="#">The Call to Discipleship</a>
              </h4>
            </div>
            
            <div className="border-b border-dominican-light-gray dark:border-border pb-3">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{format(new Date(todaysReflection.date.setDate(todaysReflection.date.getDate() - 1)), "MMMM d, yyyy")}</p>
              <h4 className="font-garamond font-medium text-dominican-burgundy hover:text-dominican-burgundy/80 transition-colors">
                <a href="#">Mercy and Forgiveness</a>
              </h4>
            </div>
            
            <div className="border-b border-dominican-light-gray dark:border-border pb-3">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{format(new Date(todaysReflection.date.setDate(todaysReflection.date.getDate() - 1)), "MMMM d, yyyy")}</p>
              <h4 className="font-garamond font-medium text-dominican-burgundy hover:text-dominican-burgundy/80 transition-colors">
                <a href="#">The Light of Christ</a>
              </h4>
            </div>
            
            <div className="border-b border-dominican-light-gray dark:border-border pb-3">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{format(new Date(todaysReflection.date.setDate(todaysReflection.date.getDate() - 1)), "MMMM d, yyyy")}</p>
              <h4 className="font-garamond font-medium text-dominican-burgundy hover:text-dominican-burgundy/80 transition-colors">
                <a href="#">Faith in Action</a>
              </h4>
            </div>
            
            <div className="border-b border-dominican-light-gray dark:border-border pb-3">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{format(new Date(todaysReflection.date.setDate(todaysReflection.date.getDate() - 1)), "MMMM d, yyyy")}</p>
              <h4 className="font-garamond font-medium text-dominican-burgundy hover:text-dominican-burgundy/80 transition-colors">
                <a href="#">The Beatitudes Today</a>
              </h4>
            </div>
          </div>
          
          <div className="mt-6">
            <Button variant="outline" className="w-full border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10">
              View Archive
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReflectionsPage;
