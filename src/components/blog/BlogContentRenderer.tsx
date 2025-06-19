
import React from 'react';
import DOMPurify from 'dompurify';

interface BlogContentRendererProps {
  content: string;
  className?: string;
}

const BlogContentRenderer: React.FC<BlogContentRendererProps> = ({ 
  content, 
  className = '' 
}) => {
  // Configure DOMPurify to allow safe HTML elements and attributes
  const cleanContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img', 'iframe', 'video',
      'source', 'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'width', 'height', 'frameborder', 
      'allowfullscreen', 'controls', 'type', 'class', 'style'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|blob|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });

  return (
    <div 
      className={`prose prose-lg dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanContent }}
      style={{
        // Custom styles for embedded content
        '--prose-body': 'rgb(55 65 81)',
        '--prose-headings': 'rgb(17 24 39)',
        '--prose-links': 'rgb(147 51 102)',
        '--prose-bold': 'rgb(17 24 39)',
        '--prose-counters': 'rgb(107 114 128)',
        '--prose-bullets': 'rgb(209 213 219)',
        '--prose-hr': 'rgb(229 231 235)',
        '--prose-quotes': 'rgb(17 24 39)',
        '--prose-quote-borders': 'rgb(229 231 235)',
        '--prose-captions': 'rgb(107 114 128)',
        '--prose-code': 'rgb(17 24 39)',
        '--prose-code-bg': 'rgb(243 244 246)',
        '--prose-pre-code': 'rgb(229 231 235)',
        '--prose-pre-bg': 'rgb(17 24 39)',
        '--prose-th-borders': 'rgb(209 213 219)',
        '--prose-td-borders': 'rgb(229 231 235)',
      } as React.CSSProperties}
    />
  );
};

export default BlogContentRenderer;
