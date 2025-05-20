
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Book {
  id: number;
  title: string;
  author: string;
  year: string;
  category: string;
  coverImage: string;
  description: string;
  epubPath?: string;
  epubSamplePath?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } },
      }
    );

    // Verify if the user is an admin
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Error verifying user' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || !roleData || roleData.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // All book data from our library (hardcoded to match library files)
    const booksData: Book[] = [
      // St. Thomas Aquinas books
      {
        id: 1,
        title: "Summa Theologica",
        author: "St. Thomas Aquinas",
        year: "1265-1274",
        category: "Theology",
        coverImage: "",
        description: "The masterwork of St. Thomas Aquinas, a systematic exposition of theology and philosophy."
      },
      {
        id: 2,
        title: "Summa Contra Gentiles",
        author: "St. Thomas Aquinas",
        year: "1259-1264",
        category: "Theology",
        coverImage: "",
        description: "A comprehensive work defending Christian doctrine against non-Christian thought."
      },
      {
        id: 3,
        title: "On Being and Essence",
        author: "St. Thomas Aquinas",
        year: "1252",
        category: "Philosophy",
        coverImage: "",
        description: "A treatise on metaphysics and the nature of being."
      },
      {
        id: 4,
        title: "Disputed Questions on Truth",
        author: "St. Thomas Aquinas",
        year: "1256-1259",
        category: "Theology",
        coverImage: "",
        description: "A series of theological discussions on various aspects of truth."
      },
      {
        id: 5,
        title: "Compendium of Theology",
        author: "St. Thomas Aquinas",
        year: "1272",
        category: "Theology",
        coverImage: "",
        description: "A concise summary of Christian doctrine."
      },
      {
        id: 6,
        title: "Commentary on Aristotle's Ethics",
        author: "St. Thomas Aquinas",
        year: "1269-1272",
        category: "Philosophy",
        coverImage: "",
        description: "A philosophical commentary on Aristotle's ethical works."
      },
      {
        id: 7,
        title: "On the Power of God",
        author: "St. Thomas Aquinas",
        year: "1257-1258",
        category: "Theology",
        coverImage: "",
        description: "A treatise on divine power and its effects."
      },
      {
        id: 8,
        title: "Commentary on the Sentences",
        author: "St. Thomas Aquinas",
        year: "1252-1256",
        category: "Theology",
        coverImage: "",
        description: "A comprehensive theological commentary on Peter Lombard's Sentences."
      },
      // St. Catherine of Siena books
      {
        id: 9,
        title: "The Dialogue",
        author: "St. Catherine of Siena",
        year: "1378",
        category: "Mysticism",
        coverImage: "",
        description: "A conversation between God and the human soul, dictated by St. Catherine of Siena during a state of ecstasy."
      },
      // St. Augustine books
      {
        id: 10,
        title: "Confessions",
        author: "St. Augustine of Hippo",
        year: "397-398",
        category: "Spiritual",
        coverImage: "",
        description: "St. Augustine's spiritual autobiography and theological reflection."
      },
      {
        id: 11,
        title: "City of God",
        author: "St. Augustine of Hippo",
        year: "413-426",
        category: "Theology",
        coverImage: "",
        description: "A comprehensive work on Christian theology and history."
      },
      {
        id: 12,
        title: "On the Trinity",
        author: "St. Augustine of Hippo",
        year: "399-419",
        category: "Theology",
        coverImage: "",
        description: "A treatise on the Christian doctrine of the Trinity."
      },
      // St. Teresa of Avila books
      {
        id: 13,
        title: "The Interior Castle",
        author: "St. Teresa of Ávila",
        year: "1577",
        category: "Mysticism",
        coverImage: "",
        description: "St. Teresa's description of the soul's journey to God through seven mansions or stages of prayer."
      },
      // St. Albert the Great books
      {
        id: 14,
        title: "On Minerals",
        author: "St. Albert the Great",
        year: "1260",
        category: "Science",
        coverImage: "",
        description: "A comprehensive work on mineralogy and geology."
      },
      {
        id: 15,
        title: "Commentary on Dionysius' Mystical Theology",
        author: "St. Albert the Great",
        year: "1260",
        category: "Theology",
        coverImage: "",
        description: "An exegetical work on the writings of Pseudo-Dionysius."
      },
      {
        id: 16,
        title: "On Animals",
        author: "St. Albert the Great",
        year: "1260",
        category: "Natural History",
        coverImage: "",
        description: "A comprehensive treatise on zoology and animal life."
      },
      // St. John of the Cross books
      {
        id: 17,
        title: "Dark Night of the Soul",
        author: "St. John of the Cross",
        year: "1578-1579",
        category: "Spiritual",
        coverImage: "",
        description: "A mystical treatise on the soul's journey to union with God."
      },
      {
        id: 18,
        title: "Ascent of Mount Carmel",
        author: "St. John of the Cross",
        year: "1582",
        category: "Spiritual",
        coverImage: "",
        description: "A spiritual treatise on the ascent to God through purification."
      },
      {
        id: 19,
        title: "Spiritual Canticle",
        author: "St. John of the Cross",
        year: "1577-1578",
        category: "Spiritual",
        coverImage: "",
        description: "A mystical poem about the soul's union with God."
      },
      // St. Therese of Lisieux books
      {
        id: 20,
        title: "Story of a Soul",
        author: "St. Thérèse of Lisieux",
        year: "1895-1897",
        category: "Spiritual",
        coverImage: "",
        description: "St. Thérèse's autobiography and spiritual testament."
      },
      {
        id: 21,
        title: "Letters of St. Thérèse",
        author: "St. Thérèse of Lisieux",
        year: "1884-1897",
        category: "Spiritual",
        coverImage: "",
        description: "A collection of letters written by St. Thérèse."
      },
      {
        id: 22,
        title: "Poems of St. Thérèse",
        author: "St. Thérèse of Lisieux",
        year: "1892-1897",
        category: "Spiritual",
        coverImage: "",
        description: "A collection of St. Thérèse's religious poetry."
      },
      // St. Francis de Sales books
      {
        id: 23,
        title: "Introduction to the Devout Life",
        author: "St. Francis de Sales",
        year: "1621",
        category: "Spiritual",
        coverImage: "",
        description: "A spiritual classic by St. Francis de Sales that offers practical guidance for living a devout Christian life amidst the challenges of everyday existence.",
        epubPath: "/books/st-francis-de-sales/introduction-to-the-devout-life.epub"
      }
    ];

    // Insert books into the database - use on conflict to avoid duplicates
    for (const book of booksData) {
      await supabaseClient.from('books').upsert({
        id: book.id,
        title: book.title,
        author: book.author,
        year: book.year,
        category: book.category,
        cover_image: book.coverImage || null,
        description: book.description,
        epub_path: book.epubPath || null,
        epub_sample_path: book.epubSamplePath || null,
      }, { onConflict: 'id' });
    }

    return new Response(JSON.stringify({ success: true, message: 'Books migration completed' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in book migration:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
