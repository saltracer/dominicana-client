
import React from 'react';
import BlogPostEditor from '@/components/admin/BlogPostEditor';

const BlogEditPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <BlogPostEditor isEdit />
    </div>
  );
};

export default BlogEditPage;
