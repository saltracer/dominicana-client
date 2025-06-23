
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

        // Create a new document with the RSS content
        const newDoc = document.implementation.createHTMLDocument();
        newDoc.documentElement.innerHTML = `<head><meta charset="utf-8"></head><body><pre>${rssContent}</pre></body>`;
        
        // Replace current document with RSS content
        document.open();
        document.write(rssContent);
        document.close();
        
        // Set the content type (this may not work in all browsers, but worth trying)
        if (document.contentType) {
          document.contentType = 'application/rss+xml';
        }

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
