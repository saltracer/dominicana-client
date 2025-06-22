
import type { Plugin } from 'vite';

export function rssPlugin(): Plugin {
  return {
    name: 'rss-plugin',
    configureServer(server) {
      server.middlewares.use('/rss', async (req, res, next) => {
        if (req.method !== 'GET') {
          return next();
        }

        try {
          // Fetch RSS content from Supabase function
          const rssUrl = 'https://rimpzfnxwqmamplowaoq.supabase.co/functions/v1/rss-feed';
          
          // Forward the original request headers to maintain context
          const headers: Record<string, string> = {
            'User-Agent': req.headers['user-agent'] || 'RSS-Plugin/1.0',
          };

          // Add referer to help the function determine the website domain
          if (req.headers.host) {
            headers['Referer'] = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}/`;
          }

          const response = await fetch(rssUrl, {
            method: 'GET',
            headers,
          });

          if (!response.ok) {
            console.error('RSS function returned error:', response.status, response.statusText);
            res.statusCode = response.status;
            res.setHeader('Content-Type', 'text/plain');
            res.end(`Error fetching RSS feed: ${response.statusText}`);
            return;
          }

          const rssContent = await response.text();

          // Set proper RSS headers
          res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=3600');
          
          // Send the RSS content directly
          res.end(rssContent);
        } catch (error) {
          console.error('Error in RSS plugin:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Internal server error generating RSS feed');
        }
      });
    },
    configurePreviewServer(server) {
      // Also handle RSS in preview mode (production build preview)
      server.middlewares.use('/rss', async (req, res, next) => {
        if (req.method !== 'GET') {
          return next();
        }

        try {
          const rssUrl = 'https://rimpzfnxwqmamplowaoq.supabase.co/functions/v1/rss-feed';
          
          const headers: Record<string, string> = {
            'User-Agent': req.headers['user-agent'] || 'RSS-Plugin/1.0',
          };

          if (req.headers.host) {
            headers['Referer'] = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/`;
          }

          const response = await fetch(rssUrl, {
            method: 'GET',
            headers,
          });

          if (!response.ok) {
            console.error('RSS function returned error:', response.status, response.statusText);
            res.statusCode = response.status;
            res.setHeader('Content-Type', 'text/plain');
            res.end(`Error fetching RSS feed: ${response.statusText}`);
            return;
          }

          const rssContent = await response.text();
          res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=3600');
          res.end(rssContent);
        } catch (error) {
          console.error('Error in RSS plugin:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Internal server error generating RSS feed');
        }
      });
    },
    generateBundle() {
      // For production builds, we need to create a redirect file
      // This will be handled by the hosting platform (like Netlify/Vercel)
      this.emitFile({
        type: 'asset',
        fileName: '_redirects',
        source: '/rss https://rimpzfnxwqmamplowaoq.supabase.co/functions/v1/rss-feed 200'
      });
    }
  };
}
