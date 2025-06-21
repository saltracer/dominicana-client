
import { useEffect } from 'react';

const RssRedirectPage = () => {
  useEffect(() => {
    // Redirect to the Supabase edge function
    window.location.href = `https://rimpzfnxwqmamplowaoq.supabase.co/functions/v1/rss-feed`;
  }, []);

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Loading RSS feed...</div>
    </div>
  );
};

export default RssRedirectPage;
