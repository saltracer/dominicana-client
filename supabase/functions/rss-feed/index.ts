
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('RSS Feed function called:', req.method, req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      throw new Error('Configuration error');
    }
    
    console.log('Initializing Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch published blog posts
    console.log('Fetching blog posts...');
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }

    console.log(`Found ${posts?.length || 0} published posts`);

    // Determine the website base URL from the request
    const requestUrl = new URL(req.url);
    let websiteBaseUrl: string;
    
    // Get all possible host indicators
    const host = req.headers.get('host') || requestUrl.host;
    const forwardedHost = req.headers.get('x-forwarded-host');
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    
    console.log('Host detection:', { host, forwardedHost, origin, referer });
    
    // Priority order for determining the website domain:
    // 1. X-Forwarded-Host (for proxied requests)
    // 2. Origin header (for direct requests)
    // 3. Referer header (as fallback)
    // 4. Host header (direct access)
    
    if (forwardedHost && !forwardedHost.includes('supabase.co')) {
      websiteBaseUrl = `https://${forwardedHost}`;
    } else if (origin && !origin.includes('supabase.co')) {
      websiteBaseUrl = origin;
    } else if (referer && !referer.includes('supabase.co')) {
      try {
        const refererUrl = new URL(referer);
        websiteBaseUrl = `${refererUrl.protocol}//${refererUrl.host}`;
      } catch (e) {
        throw new Error('Cannot determine website domain from referer. Please access the RSS feed through your website domain.');
      }
    } else if (!host.includes('supabase.co')) {
      websiteBaseUrl = `${requestUrl.protocol}//${host}`;
    } else {
      throw new Error('Cannot determine website domain. Please access the RSS feed through your website domain, not directly through the Supabase function URL.');
    }
    
    console.log('Using website base URL:', websiteBaseUrl);

    // Generate RSS XML with proper domain
    const rssXml = generateRSSXML(posts || [], websiteBaseUrl);

    console.log('Generated RSS XML successfully');

    return new Response(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0">
        <channel>
          <title>Dominican Preaching Blog - Error</title>
          <description>Error generating RSS feed: ${error.message}</description>
          <link>about:blank</link>
        </channel>
      </rss>`,
      {
        status: error.message.includes('Cannot determine website domain') ? 400 : 500,
        headers: {
          'Content-Type': 'application/rss+xml; charset=utf-8',
          ...corsHeaders,
        },
      }
    );
  }
});

function generateRSSXML(posts: any[], websiteBaseUrl: string): string {
  const channelTitle = 'Dominican Preaching Blog';
  const channelDescription = 'Insights, reflections, and guidance for preaching in the Dominican tradition.';
  const channelLink = `${websiteBaseUrl}/preaching/blog`;

  const items = posts.map(post => {
    const pubDate = post.published_at ? new Date(post.published_at).toUTCString() : new Date(post.created_at).toUTCString();
    const postUrl = `${websiteBaseUrl}/preaching/blog/${post.slug}`;
    
    // Clean content for RSS (remove HTML tags for description)
    const cleanContent = post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 500) : '';
    const description = post.excerpt || cleanContent || 'Read more...';

    // Handle tags safely
    let categories = '';
    if (post.tags) {
      try {
        const tags = typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags;
        if (Array.isArray(tags)) {
          categories = tags.map(tag => `<category>${escapeXml(tag)}</category>`).join('\n      ');
        }
      } catch (e) {
        console.warn('Error parsing tags for post:', post.id);
      }
    }

    return `
    <item>
      <title>${escapeXml(post.title || 'Untitled')}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(post.author_name || 'Unknown Author')}</author>
      ${categories}
      ${post.featured_image ? `<enclosure url="${post.featured_image}" type="image/jpeg" />` : ''}
    </item>`;
  }).join('');

  // RSS feed URL is always relative to the website domain
  const rssFeedUrl = `${websiteBaseUrl}/rss`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${channelLink}</link>
    <description>${escapeXml(channelDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${rssFeedUrl}" rel="self" type="application/rss+xml" />
    <generator>Dominican Portal RSS Generator</generator>
    <webMaster>webmaster@dominicanportal.com</webMaster>
    <managingEditor>editor@dominicanportal.com</managingEditor>
    <ttl>60</ttl>
    ${items}
  </channel>
</rss>`;
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
