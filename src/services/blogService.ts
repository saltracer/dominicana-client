
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];

export const blogService = {
  // Get all published blog posts for public viewing
  async getPublishedPosts(limit?: number, offset?: number) {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    
    if (limit) query = query.limit(limit);
    if (offset) query = query.range(offset, offset + limit - 1);
    
    return query;
  },

  // Get a single published post by slug
  async getPublishedPostBySlug(slug: string) {
    return supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
  },

  // Admin only: Get all posts (any status)
  async getAllPosts(limit?: number, offset?: number) {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (limit) query = query.limit(limit);
    if (offset) query = query.range(offset, offset + limit - 1);
    
    return query;
  },

  // Admin only: Get post by ID (any status)
  async getPostById(id: string) {
    return supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();
  },

  // Admin only: Create new post
  async createPost(post: BlogPostInsert) {
    return supabase
      .from('blog_posts')
      .insert(post)
      .select()
      .single();
  },

  // Admin only: Update post
  async updatePost(id: string, updates: BlogPostUpdate) {
    return supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  },

  // Admin only: Delete post
  async deletePost(id: string) {
    return supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
  },

  // Search published posts
  async searchPosts(searchTerm: string) {
    return supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${searchTerm}%, content.ilike.%${searchTerm}%, excerpt.ilike.%${searchTerm}%`)
      .order('published_at', { ascending: false });
  },

  // Get posts by tag
  async getPostsByTag(tag: string) {
    return supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .contains('tags', [tag])
      .order('published_at', { ascending: false });
  },

  // Generate slug from title
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
};
