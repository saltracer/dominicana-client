
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { blogService, type BlogPost } from '@/services/blogService';
import { toast } from 'sonner';

const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchTerm, posts]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await blogService.getAllPosts();
      
      if (error) throw error;
      
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await blogService.deletePost(id);
      
      if (error) throw error;
      
      toast.success('Blog post deleted successfully');
      loadPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast.error('Failed to delete blog post');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'archived':
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg">Loading blog posts...</div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Blog Posts Management
          </CardTitle>
          <Link to="/admin/blog/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by title, author, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {searchTerm ? 'No posts found' : 'No blog posts yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms.' 
                : 'Create your first blog post to get started.'
              }
            </p>
            {!searchTerm && (
              <Link to="/admin/blog/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Post
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      {getStatusBadge(post.status)}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      By {post.author_name} • {format(new Date(post.created_at), 'MMM d, yyyy')}
                      {post.published_at && post.status === 'published' && (
                        <span> • Published {format(new Date(post.published_at), 'MMM d, yyyy')}</span>
                      )}
                    </p>
                    {post.excerpt && (
                      <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {post.status === 'published' && (
                      <Link to={`/preaching/blog/${post.slug}`} target="_blank">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Link to={`/admin/blog/edit/${post.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(post.id, post.title)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogManager;
