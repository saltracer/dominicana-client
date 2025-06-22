
import { useEffect } from 'react';

const RssRedirectPage = () => {
  useEffect(() => {
    // Redirect to the Supabase function directly
    const rssUrl = 'https://rimpzfnxwqmamplowaoq.supabase.co/functions/v1/rss-feed';
    
    // Get the current domain to pass as referer
    const referer = window.location.origin + '/';
    
    // Redirect with proper headers by creating a new request
    fetch(rssUrl, {
      method: 'GET',
      headers: {
        'Referer': referer,
        'User-Agent': navigator.userAgent
      }
    })
    .then(response => response.text())
    .then(rssContent => {
      // Create a blob with the RSS content and proper MIME type
      const blob = new Blob([rssContent], { type: 'application/rss+xml' });
      const url = URL.createObjectURL(blob);
      
      // Replace the current page with the RSS content
      window.location.replace(url);
    })
    .catch(error => {
      console.error('Error fetching RSS:', error);
      // Fallback: redirect directly to the function
      window.location.replace(rssUrl + '?referer=' + encodeURIComponent(referer));
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading RSS Feed...</h1>
        <p className="text-gray-600">Redirecting to RSS feed...</p>
      </div>
    </div>
  );
};

export default RssRedirectPage;
