
import { useEffect } from 'react';

const RssRedirectPage = () => {
  useEffect(() => {
    // Get the current domain and redirect to the RSS function
    const currentDomain = window.location.origin;
    const rssUrl = `${currentDomain}/functions/v1/rss-feed`;
    
    // Redirect to the RSS function
    window.location.replace(rssUrl);
  }, []);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dominican-burgundy mx-auto mb-4"></div>
        <p>Loading RSS feed...</p>
      </div>
    </div>
  );
};

export default RssRedirectPage;
