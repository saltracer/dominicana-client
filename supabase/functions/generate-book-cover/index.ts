
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, author, category } = await req.json();

    if (!title || !author) {
      return new Response(
        JSON.stringify({ error: 'Title and author are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Create a detailed prompt for a book cover
    const prompt = `Create an elegant book cover design for "${title}" by ${author}. ${category ? `This is a ${category} book. ` : ''}The cover should be professional, classical, and scholarly in style. Include elegant typography for the title and author name. Use warm, sophisticated colors like deep burgundy, gold, cream, or dark blue. The design should reflect the intellectual and spiritual nature of the content. No photographs of people, focus on symbolic elements, ornate borders, or abstract designs that convey wisdom and learning.`;

    console.log('Generating cover for:', title, 'by', author);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        n: 1,
        size: '1024x1536', // Book cover aspect ratio
        quality: 'high',
        output_format: 'png'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.data || !data.data[0]) {
      throw new Error('No image data received from OpenAI');
    }

    // The image is returned as base64 for gpt-image-1
    const imageBase64 = data.data[0].b64_json;
    
    if (!imageBase64) {
      throw new Error('No base64 image data received');
    }

    // Convert base64 to blob
    const imageBuffer = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));
    
    // Upload to Supabase storage
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const fileName = `generated_cover_${Date.now()}_${Math.random().toString(36).substring(7)}.png`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('book_covers')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('book_covers')
      .getPublicUrl(fileName);

    console.log('Successfully generated and uploaded cover:', urlData.publicUrl);

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: urlData.publicUrl,
        fileName: fileName
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-book-cover function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
