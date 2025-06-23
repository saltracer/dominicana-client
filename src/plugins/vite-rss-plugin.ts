
import type { Plugin } from 'vite';

export function rssPlugin(): Plugin {
  return {
    name: 'rss-plugin',
    configureServer(server) {
      // Add middleware at the beginning of the stack to intercept /rss before React Router
      server.middlewares.use('/rss', async (req, res, next) => {
        // Only handle GET requests to /rss exactly
        if (req.method === 'GET') {
          console.log('RSS Plugin: Intercepting /rss request in development');
          
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

            // Set proper RSS headers - this is critical for feed readers
            res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=3600');
            
            // Send the RSS content directly
            res.end(rssContent);
            console.log('RSS Plugin: Successfully served RSS feed');
          } catch (error) {
            console.error('Error in RSS plugin:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Internal server error generating RSS feed');
          }
        } else {
          next();
        }
      });
    },
    configurePreviewServer(server) {
      // Handle RSS in preview mode (production build preview)
      server.middlewares.use('/rss', async (req, res, next) => {
        if (req.method === 'GET') {
          console.log('RSS Plugin: Intercepting /rss request in preview');

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
        } else {
          next();
        }
      });
    },
    generateBundle() {
      // Create multiple redirect configurations for different hosting platforms
      
      // Netlify _redirects file
      this.emitFile({
        type: 'asset',
        fileName: '_redirects',
        source: '/rss https://rimpzfnxwqmamplowaoq.supabase.co/functions/v1/rss-feed 200!'
      });
      
      // Vercel configuration (vercel.json)
      this.emitFile({
        type: 'asset',
        fileName: 'vercel.json',
        source: JSON.stringify({
          rewrites: [
            {
              source: '/rss',
              destination: 'https://rimpzfnxwqmamplowaoq.supabase.co/functions/v1/rss-feed'
            }
          ]
        }, null, 2)
      });

      // Generic hosting configuration (_routes.json for Cloudflare Pages)
      this.emitFile({
        type: 'asset',
        fileName: '_routes.json',
        source: JSON.stringify({
          version: 1,
          include: ['/*'],
          exclude: ['/rss']
        }, null, 2)
      });

      // Create a static rss.xml file as fallback that redirects to the function
      this.emitFile({
        type: 'asset',
        fileName: 'rss.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Dominican Preaching Blog</title>
    <description>This RSS feed has moved to /rss</description>
    <link>/rss</link>
    <item>
      <title>RSS Feed Moved</title>
      <description>Please update your feed reader to use /rss instead of /rss.xml</description>
      <link>/rss</link>
    </item>
  </channel>
</rss>`
      });
    }
  };
}
