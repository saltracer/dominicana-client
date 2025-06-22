
import { useEffect, useState } from 'react';

const RssFeedPage = () => {
  const [rssContent, setRssContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRssContent = async () => {
      try {
        // Fetch RSS content from the Supabase function
        const rssUrl = 'https://rimpzfnxwqmamplowaoq.supabase.co/functions/v1/rss-feed';
        const response = await fetch(rssUrl, {
          headers: {
            'Referer': window.location.origin
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const xmlContent = await response.text();
        setRssContent(xmlContent);

        // Set the document content type and replace the page content with raw XML
        if (xmlContent.startsWith('<?xml')) {
          // Create a new document with the RSS content
          document.open();
          document.write(xmlContent);
          document.close();
          
          // Set proper content type for RSS
          const meta = document.createElement('meta');
          meta.httpEquiv = 'Content-Type';
          meta.content = 'application/rss+xml; charset=utf-8';
          document.head.appendChild(meta);
        }
      } catch (err) {
        console.error('Error fetching RSS feed:', err);
        setError(err instanceof Error ? err.message : 'Failed to load RSS feed');
      } finally {
        setLoading(false);
      }
    };

    fetchRssContent();
  }, []);

  // If we have RSS content, don't render React components
  if (rssContent && rssContent.startsWith('<?xml')) {
    return null;
  }

  // Fallback UI for errors or loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dominican-burgundy mx-auto mb-4"></div>
          <p>Loading RSS feed...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">RSS Feed Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a 
            href="https://rimpzfnxwqmamplowaoq.supabase.co/functions/v1/rss-feed"
            className="text-dominican-burgundy hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try accessing the RSS feed directly
          </a>
        </div>
      </div>
    );
  }

  return null;
};

export default RssFeedPage;
