import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, BookOpen } from 'lucide-react';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { blogService, type BlogPost } from '@/services/blogService';
import { toast } from 'sonner';

const BlogIndexPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      console.log('BlogIndexPage - Loading posts...');
      
      const { data, error } = await blogService.getPublishedPosts(20);
      
      console.log('BlogIndexPage - Response:', { data, error });
      
      if (error) {
        console.error('BlogIndexPage - Error loading posts:', error);
        throw error;
      }
      
      setPosts(data || []);
      console.log('BlogIndexPage - Posts loaded:', data?.length || 0);
    } catch (error) {
      console.error('BlogIndexPage - Error in loadPosts:', error);
      toast.error('Failed to load blog posts');
      // Don't keep loading state if there's an error
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadPosts();
      return;
    }

    try {
      setSearching(true);
      console.log('BlogIndexPage - Searching for:', searchTerm);
      
      const { data, error } = await blogService.searchPosts(searchTerm.trim());
      
      if (error) {
        console.error('BlogIndexPage - Search error:', error);
        throw error;
      }
      
      setPosts(data || []);
      console.log('BlogIndexPage - Search results:', data?.length || 0);
    } catch (error) {
      console.error('BlogIndexPage - Error searching blog posts:', error);
      toast.error('Failed to search blog posts');
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  console.log('BlogIndexPage - Current state:', { loading, postsCount: posts.length, searching });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 dark:from-amber-950/20 to-orange-50 dark:to-orange-950/20 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-lg">Loading blog posts...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 dark:from-amber-950/20 to-orange-50 dark:to-orange-950/20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-dominican-burgundy" />
            <h1 className="font-garamond text-5xl md:text-6xl font-bold text-dominican-black dark:text-foreground">
              Preaching Blog
            </h1>
          </div>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Insights, reflections, and guidance for preaching in the Dominican tradition.
          </p>
          <Link to="/preaching">
            <Button variant="outline" className="mt-4">
              ← Back to Preaching
            </Button>
          </Link>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search size={20} />
              Search Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Search by title, content, or excerpt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={handleSearch}
                disabled={searching}
              >
                {searching ? 'Searching...' : 'Search'}
              </Button>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    loadPosts();
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {searchTerm ? 'No posts found' : 'No blog posts yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm 
                  ? 'Try adjusting your search terms or browse all posts.' 
                  : 'Check back soon for new content about preaching and Dominican spirituality.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? `Found ${posts.length} post(s) for "${searchTerm}"` : `${posts.length} blog post(s)`}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogIndexPage;
