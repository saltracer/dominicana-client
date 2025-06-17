
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import type { BlogPost } from '@/services/blogService';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const publishedDate = post.published_at ? new Date(post.published_at) : null;
  
  // Handle tags properly - they come from the database as Json but should be strings
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
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
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
        {tags.length > 0 && (
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
        )}
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;
