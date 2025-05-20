
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check, Music, BookOpen } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  const { userRole } = useAuth();
  
  const basicFeatures = [
    "Access to Liturgical Calendar",
    "Browse Provincial Territories",
    "Read Daily Reflections",
    "View Dominican Saints"
  ];
  
  const authenticatedFeatures = [
    ...basicFeatures,
    "Access Full Texts in Library",
    "Save Favorite Prayers",
    "Bookmark Reading Progress"
  ];
  
  const subscribedFeatures = [
    ...authenticatedFeatures,
    "Audio Playback for Prayers",
    "Audio Narration for Books",
    "Download Resources Offline",
    "Premium Support"
  ];
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-garamond text-3xl md:text-4xl font-bold text-dominican-burgundy mb-2 text-center">
        Subscription Plans
      </h1>
      
      <div className="text-center mb-6">
        <span className="inline-block w-20 h-1 bg-dominican-gold"></span>
      </div>
      
      <p className="text-gray-700 mb-12 text-center max-w-2xl mx-auto">
        Choose the plan that best supports your spiritual journey with the Dominican tradition.
        Support our mission while gaining access to enhanced features.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Plan */}
        <div className={`border rounded-lg p-6 flex flex-col ${userRole === 'free' ? 'border-dominican-burgundy bg-dominican-burgundy/5' : 'border-gray-200'}`}>
          <div className="flex-1">
            <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-2">Basic Access</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold">Free</span>
            </div>
            <p className="text-gray-600 mb-6">No signup required for basic content access.</p>
            
            <ul className="space-y-2 mb-6">
              {basicFeatures.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check size={18} className="text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Button 
            variant={userRole === 'free' ? "default" : "outline"} 
            className={userRole === 'free' ? 'bg-dominican-burgundy hover:bg-dominican-burgundy/90' : 'border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10'}
            asChild
          >
            <Link to="/auth">Sign Up Now</Link>
          </Button>
        </div>
        
        {/* Authenticated Plan */}
        <div className={`border rounded-lg p-6 flex flex-col ${userRole === 'authenticated' ? 'border-dominican-burgundy bg-dominican-burgundy/5' : 'border-gray-200'}`}>
          <div className="flex-1">
            <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-2">Full Access</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold">Free</span>
              <span className="text-gray-500"> with account</span>
            </div>
            <p className="text-gray-600 mb-6">Create an account to unlock additional features.</p>
            
            <ul className="space-y-2 mb-6">
              {authenticatedFeatures.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check size={18} className="text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Button 
            variant={userRole === 'authenticated' ? "default" : "outline"} 
            className={userRole === 'authenticated' ? 'bg-dominican-burgundy hover:bg-dominican-burgundy/90' : 'border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10'}
            asChild
          >
            <Link to={userRole === 'free' ? '/auth' : '/'}>
              {userRole === 'free' ? 'Sign Up Now' : 'Current Plan'}
            </Link>
          </Button>
        </div>
        
        {/* Subscribed Plan */}
        <div className={`border rounded-lg p-6 flex flex-col ${userRole === 'subscribed' || userRole === 'admin' ? 'border-dominican-burgundy bg-dominican-burgundy/5' : 'border-gray-200'}`}>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy">Premium Access</h3>
              <span className="bg-dominican-gold text-white text-xs px-2 py-1 rounded-full">RECOMMENDED</span>
            </div>
            
            <div className="mb-4">
              <span className="text-3xl font-bold">$5.99</span>
              <span className="text-gray-500">/month</span>
            </div>
            
            <p className="text-gray-600 mb-6">Complete access to all premium features and content.</p>
            
            <ul className="space-y-2 mb-6">
              {subscribedFeatures.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check size={18} className="text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Button 
            variant={userRole === 'subscribed' || userRole === 'admin' ? "default" : "outline"} 
            className={userRole === 'subscribed' || userRole === 'admin' ? 'bg-dominican-burgundy hover:bg-dominican-burgundy/90' : 'border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10'}
            disabled={userRole === 'subscribed' || userRole === 'admin'}
          >
            {userRole === 'subscribed' || userRole === 'admin' ? 'Current Plan' : 'Subscribe Now'}
          </Button>
        </div>
      </div>
      
      {/* Feature Highlights */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-dominican-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-dominican-burgundy/10 rounded-full w-12 h-12 flex items-center justify-center mr-4">
              <BookOpen className="h-6 w-6 text-dominican-burgundy" />
            </div>
            <h3 className="font-garamond text-xl font-bold text-dominican-burgundy">Complete Digital Library</h3>
          </div>
          <p className="text-gray-700">
            Access our extensive collection of classical Catholic texts and theological resources,
            including works by Dominican authors and other significant writers in the Catholic tradition.
          </p>
        </div>
        
        <div className="bg-dominican-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-dominican-burgundy/10 rounded-full w-12 h-12 flex items-center justify-center mr-4">
              <Music className="h-6 w-6 text-dominican-burgundy" />
            </div>
            <h3 className="font-garamond text-xl font-bold text-dominican-burgundy">Audio Prayer Experience</h3>
          </div>
          <p className="text-gray-700">
            Enhance your prayer experience with professional audio recordings of the Liturgy of the Hours,
            the Holy Rosary, and other prayers in the Dominican tradition.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
