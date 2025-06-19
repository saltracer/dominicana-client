
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import type { BlogPost } from '@/services/blogService';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
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
    <Card className="hover:shadow-lg transition-shadow">
      {post.featured_image && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={post.featured_image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{post.author_name}</span>
          </div>
          {publishedDate && (
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{format(publishedDate, 'MMM d, yyyy')}</span>
            </div>
          )}
          {post.reading_time_minutes && (
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{post.reading_time_minutes} min read</span>
            </div>
          )}
        </div>
        <Link to={`/preaching/blog/${post.slug}`} className="group">
          <h3 className="font-garamond text-xl font-semibold text-dominican-black dark:text-foreground group-hover:text-dominican-burgundy transition-colors">
            {post.title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent>
        {post.excerpt && (
          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
          {post.word_count && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <BookOpen size={12} />
              <span>{post.word_count} words</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;
