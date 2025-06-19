import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Save, ArrowLeft, X, Clock, BookOpen } from 'lucide-react';
import { blogService, type BlogPost, type BlogPostInsert, type BlogPostUpdate } from '@/services/blogService';
import { toast } from 'sonner';
import RichTextEditor from '@/components/editor/RichTextEditor';
import '@/components/editor/quill-custom.css';

interface BlogPostEditorProps {
  isEdit?: boolean;
}

const BlogPostEditor: React.FC<BlogPostEditorProps> = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [mediaAttachments, setMediaAttachments] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(1);

  useEffect(() => {
    if (isEdit && id) {
      loadPost(id);
    }
  }, [isEdit, id]);

  useEffect(() => {
    // Auto-generate slug from title
    if (title && !isEdit) {
      setSlug(blogService.generateSlug(title));
    }
  }, [title, isEdit]);

  const loadPost = async (postId: string) => {
    try {
      setLoading(true);
      const { data, error } = await blogService.getPostById(postId);
      
      if (error) throw error;
      
      const post = data;
      setTitle(post.title);
      setSlug(post.slug);
      setContent(post.content);
      setExcerpt(post.excerpt || '');
      setFeaturedImage(post.featured_image || '');
      setStatus(post.status);
      setWordCount(post.word_count || 0);
      setReadingTime(post.reading_time_minutes || 1);
      
      // Handle tags properly
      const postTags = (() => {
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
      
      setTags(postTags);

      // Handle media attachments
      const attachments = (() => {
        if (!post.media_attachments) return [];
        if (typeof post.media_attachments === 'string') {
          try {
            return JSON.parse(post.media_attachments) as string[];
          } catch {
            return [];
          }
        }
        if (Array.isArray(post.media_attachments)) {
          return post.media_attachments as string[];
        }
        return [];
      })();
      
      setMediaAttachments(attachments);
    } catch (error) {
      console.error('Error loading blog post:', error);
      toast.error('Failed to load blog post');
      navigate('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!content.trim()) {
      toast.error('Content is required');
      return;
    }

    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    try {
      setSaving(true);
      
      const postData = {
        title: title.trim(),
        slug: slug.trim() || blogService.generateSlug(title),
        content: content.trim(),
        content_type: 'html',
        excerpt: excerpt.trim() || null,
        featured_image: featuredImage.trim() || null,
        status,
        tags: JSON.stringify(tags),
        media_attachments: JSON.stringify(mediaAttachments),
        author_name: user.email || 'Unknown Author',
        ...(status === 'published' && { published_at: new Date().toISOString() })
      };

      if (isEdit && id) {
        const { error } = await blogService.updatePost(id, postData as BlogPostUpdate);
        if (error) throw error;
        toast.success('Blog post updated successfully');
      } else {
        const { error } = await blogService.createPost({
          ...postData,
          author_id: user.id
        } as BlogPostInsert);
        if (error) throw error;
        toast.success('Blog post created successfully');
      }
      
      navigate('/admin/blog');
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast.error('Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleMediaUpload = (mediaUrl: string, type: 'image' | 'video') => {
    setMediaAttachments(prev => [...prev, mediaUrl]);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    
    // Calculate word count and reading time
    const textContent = newContent.replace(/<[^>]*>/g, '');
    const words = textContent.split(/\s+/).filter(word => word.length > 0);
    const newWordCount = words.length;
    const newReadingTime = Math.max(1, Math.round(newWordCount / 200));
    
    setWordCount(newWordCount);
    setReadingTime(newReadingTime);
  };

  const addTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg">Loading blog post...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}
            </CardTitle>
            <div className="flex items-center gap-4">
              {/* Word count and reading time display */}
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <BookOpen size={14} />
                  <span>{wordCount} words</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{readingTime} min read</span>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate('/admin/blog')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog post title..."
            />
          </div>

          {/* Slug */}
          <div>
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-friendly-slug"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              URL: /preaching/blog/{slug || 'your-slug'}
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description of the post..."
              rows={3}
            />
          </div>

          {/* Featured Image */}
          <div>
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input
              id="featuredImage"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={(value: 'draft' | 'published' | 'archived') => setStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const trimmedTag = newTag.trim();
                    if (trimmedTag && !tags.includes(trimmedTag)) {
                      setTags([...tags, trimmedTag]);
                      setNewTag('');
                    }
                  }
                }}
                placeholder="Add a tag..."
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={() => {
                  const trimmedTag = newTag.trim();
                  if (trimmedTag && !tags.includes(trimmedTag)) {
                    setTags([...tags, trimmedTag]);
                    setNewTag('');
                  }
                }}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setTags(tags.filter(t => t !== tag))}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Rich Text Content Editor */}
          <div>
            <Label>Content *</Label>
            <RichTextEditor
              value={content}
              onChange={handleContentChange}
              onMediaUpload={handleMediaUpload}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : (isEdit ? 'Update Post' : 'Create Post')}
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/blog')}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPostEditor;
