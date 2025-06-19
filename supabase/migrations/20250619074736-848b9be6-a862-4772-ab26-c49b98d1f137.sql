
-- Add media storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-media', 'blog-media', true);

-- Create policy to allow authenticated users to upload blog media
CREATE POLICY "Authenticated users can upload blog media" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'blog-media');

-- Create policy to allow everyone to view blog media
CREATE POLICY "Anyone can view blog media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-media');

-- Create policy to allow authors to update their blog media
CREATE POLICY "Authors can update blog media" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'blog-media');

-- Create policy to allow authors to delete their blog media
CREATE POLICY "Authors can delete blog media" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'blog-media');

-- Add new columns to blog_posts table for rich content support
ALTER TABLE public.blog_posts 
ADD COLUMN content_type text DEFAULT 'html' CHECK (content_type IN ('html', 'markdown')),
ADD COLUMN media_attachments jsonb DEFAULT '[]'::jsonb,
ADD COLUMN word_count integer DEFAULT 0,
ADD COLUMN reading_time_minutes integer DEFAULT 1;

-- Create function to update word count and reading time
CREATE OR REPLACE FUNCTION public.update_blog_post_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate word count (approximate)
  NEW.word_count = array_length(string_to_array(regexp_replace(NEW.content, '<[^>]*>', '', 'g'), ' '), 1);
  
  -- Calculate reading time (average 200 words per minute)
  NEW.reading_time_minutes = GREATEST(1, ROUND(NEW.word_count / 200.0));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update stats
CREATE TRIGGER update_blog_post_stats_trigger
  BEFORE INSERT OR UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_blog_post_stats();
