
import type { Plugin } from 'vite';

export function rssPlugin(): Plugin {
  return {
    name: 'rss-plugin',
    configureServer(server) {
      // Handle RSS in development mode - add this early in middleware stack
      server.middlewares.use((req, res, next) => {
        // Only handle GET requests to /rss exactly
        if (req.method === 'GET' && req.url === '/rss') {
          console.log('RSS Plugin: Intercepting /rss request in development');
          
          (async () => {
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
          })();
          
          return; // Important: don't call next() to prevent further processing
        }
        
        next(); // Call next for all other requests
      });
    },
    configurePreviewServer(server) {
      // Handle RSS in preview mode (production build preview)
      server.middlewares.use((req, res, next) => {
        if (req.method === 'GET' && req.url === '/rss') {
          console.log('RSS Plugin: Intercepting /rss request in preview');

          (async () => {
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
          })();
          
          return; // Important: don't call next() to prevent further processing
        }
        
        next();
      });
    },
    generateBundle() {
      // For production builds, create a redirect file for hosting platforms
      this.emitFile({
        type: 'asset',
        fileName: '_redirects',
        source: '/rss https://rimpzfnxwqmamplowaoq.supabase.co/functions/v1/rss-feed 200'
      });
      
      // Also create a Netlify function for direct RSS serving if the redirect doesn't work
      this.emitFile({
        type: 'asset',
        fileName: 'netlify/functions/rss.js',
        source: `
exports.handler = async (event, context) => {
  try {
    const response = await fetch('https://rimpzfnxwqmamplowaoq.supabase.co/functions/v1/rss-feed', {
      headers: {
        'Referer': event.headers.referer || 'https://your-domain.com/',
        'User-Agent': event.headers['user-agent'] || 'Netlify-Function/1.0'
      }
    });
    
    const rssContent = await response.text();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      },
      body: rssContent
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Error generating RSS feed'
    };
  }
};
        `.trim()
      });
    }
  };
}
