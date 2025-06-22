
import type { Plugin } from 'vite';

export function rssPlugin(): Plugin {
  return {
    name: 'rss-handler',
    configureServer(server) {
      server.middlewares.use('/rss', async (req, res, next) => {
        try {
          console.log('RSS request intercepted:', req.method, req.url);
          
          // Only handle GET requests
          if (req.method !== 'GET') {
            return next();
          }

          // Fetch RSS content from Supabase function
          const rssUrl = 'https://rimpzfnxwqmamplowaoq.supabase.co/functions/v1/rss-feed';
          const response = await fetch(rssUrl, {
            headers: {
              'Origin': req.headers.origin || 'https://dominicana-client.lovable.app',
              'Referer': req.headers.referer || 'https://dominicana-client.lovable.app'
            }
          });

          if (!response.ok) {
            console.error('Error fetching RSS:', response.status, response.statusText);
            res.statusCode = response.status;
            res.setHeader('Content-Type', 'text/plain');
            res.end(`Error fetching RSS feed: ${response.status} ${response.statusText}`);
            return;
          }

          const xmlContent = await response.text();
          console.log('RSS content fetched successfully, length:', xmlContent.length);

          // Set proper RSS headers
          res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
          res.setHeader('X-Content-Type-Options', 'nosniff');
          
          // Return raw XML content
          res.end(xmlContent);
        } catch (error) {
          console.error('RSS plugin error:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Internal server error while fetching RSS feed');
        }
      });
    }
  };
}
