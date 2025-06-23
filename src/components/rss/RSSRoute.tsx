
import { useEffect } from 'react';

export default function RSSRoute() {
  useEffect(() => {
    const fetchAndServeRSS = async () => {
      try {
        // Fetch RSS content from Supabase function
        const response = await fetch('https://rimpzfnxwqmamplowaoq.supabase.co/functions/v1/rss-feed', {
          headers: {
            'Referer': window.location.origin + '/',
            'User-Agent': 'Dominican-Portal-RSS/1.0'
          }
        });

        if (!response.ok) {
          throw new Error(`RSS function returned ${response.status}`);
        }

        const rssContent = await response.text();

        // Replace current document with RSS content
        document.open();
        document.write(rssContent);
        document.close();

      } catch (error) {
        console.error('Error serving RSS:', error);
        document.open();
        document.write(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Dominican Preaching Blog - Error</title>
    <description>Error loading RSS feed. Please try again later.</description>
    <link>${window.location.origin}/preaching/blog</link>
  </channel>
</rss>`);
        document.close();
      }
    };

    fetchAndServeRSS();
  }, []);

  // Return empty div while loading
  return <div style={{ display: 'none' }}>Loading RSS feed...</div>;
}
