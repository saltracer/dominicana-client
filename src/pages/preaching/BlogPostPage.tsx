
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowLeft, Clock, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { blogService, type BlogPost } from '@/services/blogService';
import { toast } from 'sonner';
import BlogContentRenderer from '@/components/blog/BlogContentRenderer';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    try {
      setLoading(true);
      setNotFound(false);
      
      const { data, error } = await blogService.getPublishedPostBySlug(postSlug);
      
      if (error) {
        if (error.code === 'PGRST116') {
          setNotFound(true);
        } else {
          throw error;
        }
        return;
      }
      
      setPost(data);
    } catch (error) {
      console.error('Error loading blog post:', error);
      toast.error('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 dark:from-amber-950/20 to-orange-50 dark:to-orange-950/20 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-lg">Loading blog post...</div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 dark:from-amber-950/20 to-orange-50 dark:to-orange-950/20 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardContent className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Blog Post Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                The blog post you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/preaching/blog">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const publishedDate = post.published_at ? new Date(post.published_at) : null;
  
  // Handle tags properly
  const tags = (() => {
    if (!post.tags) return [];
    if (typeof post.tags === 'string') {
      try {
        return JSON.parse(post.tags) as string[];
      } catch {
        return [];
      }
    }
    if (Array.isArray(post.tags)) {
      return post.tags.filter(tag => typeof tag === 'string') as string[];
    }
    return [];
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 dark:from-amber-950/20 to-orange-50 dark:to-orange-950/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/preaching/blog">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="aspect-video overflow-hidden rounded-lg mb-8">
            <img 
              src={post.featured_image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article */}
        <article>
          <Card>
            <CardContent className="p-8">
              {/* Header */}
              <header className="mb-8">
                <h1 className="font-garamond text-4xl md:text-5xl font-bold text-dominican-black dark:text-foreground mb-6">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span className="font-medium">{post.author_name}</span>
                  </div>
                  {publishedDate && (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{format(publishedDate, 'MMMM d, yyyy')}</span>
                    </div>
                  )}
                  {post.word_count && (
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <span>{post.word_count} words</span>
                    </div>
                  )}
                  {post.reading_time_minutes && (
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{post.reading_time_minutes} min read</span>
                    </div>
                  )}
                </div>

                {post.excerpt && (
                  <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6 italic border-l-4 border-dominican-burgundy pl-4">
                    {post.excerpt}
                  </p>
                )}

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </header>

              {/* Rich Content */}
              <BlogContentRenderer 
                content={post.content}
                className="mb-8"
              />
            </CardContent>
          </Card>
        </article>

        {/* Navigation Footer */}
        <div className="mt-8 text-center">
          <Link to="/preaching/blog">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Posts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
