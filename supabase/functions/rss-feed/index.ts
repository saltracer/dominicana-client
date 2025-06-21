
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

    // Get the actual website domain from the request origin or use a default
    const requestUrl = new URL(req.url);
    const origin = req.headers.get('origin') || req.headers.get('referer');
    
    // Determine the website base URL
    let websiteBaseUrl = 'https://dominicanportal.com'; // Default fallback
    
    if (origin) {
      try {
        const originUrl = new URL(origin);
        // Only use the origin if it's not the Supabase domain
        if (!originUrl.hostname.includes('supabase.co')) {
          websiteBaseUrl = `${originUrl.protocol}//${originUrl.host}`;
        }
      } catch (e) {
        console.warn('Could not parse origin header:', origin);
      }
    }
    
    console.log('Using website base URL:', websiteBaseUrl);

    // Generate RSS XML with proper domain
    const rssXml = generateRSSXML(posts || [], websiteBaseUrl, requestUrl.origin);

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
          <link>https://dominicanportal.com</link>
        </channel>
      </rss>`,
      {
        status: 500,
        headers: {
          'Content-Type': 'application/rss+xml; charset=utf-8',
          ...corsHeaders,
        },
      }
    );
  }
});

function generateRSSXML(posts: any[], websiteBaseUrl: string, feedOrigin: string): string {
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

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${channelLink}</link>
    <description>${escapeXml(channelDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${feedOrigin}/functions/v1/rss-feed" rel="self" type="application/rss+xml" />
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
