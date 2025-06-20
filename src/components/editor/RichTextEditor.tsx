
import React, { useRef, useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Link, Video, Image as ImageIcon } from 'lucide-react';

// Custom toolbar with media buttons
const CustomToolbar = ({ onImageUpload, onVideoEmbed, onLinkEmbed }: {
  onImageUpload: () => void;
  onVideoEmbed: () => void;
  onLinkEmbed: () => void;
}) => (
  <div id="toolbar" className="flex items-center gap-2 p-2 border-b">
    <select className="ql-header" defaultValue="">
      <option value="1">Heading 1</option>
      <option value="2">Heading 2</option>
      <option value="3">Heading 3</option>
      <option value="">Normal</option>
    </select>
    
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-underline" />
    <button className="ql-strike" />
    
    <div className="w-px h-6 bg-gray-300 mx-2" />
    
    <button className="ql-list" value="ordered" />
    <button className="ql-list" value="bullet" />
    <button className="ql-blockquote" />
    <button className="ql-code-block" />
    
    <div className="w-px h-6 bg-gray-300 mx-2" />
    
    <button className="ql-link" />
    
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onImageUpload}
      className="p-1 h-8 w-8"
    >
      <ImageIcon size={16} />
    </Button>
    
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onVideoEmbed}
      className="p-1 h-8 w-8"
    >
      <Video size={16} />
    </Button>
    
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onLinkEmbed}
      className="p-1 h-8 w-8"
    >
      <Link size={16} />
    </Button>
  </div>
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onMediaUpload?: (mediaUrl: string, type: 'image' | 'video') => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  onMediaUpload 
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);

  const modules = useMemo(() => ({
    toolbar: {
      container: '#toolbar',
      handlers: {
        image: () => handleImageUpload(),
      }
    },
    clipboard: {
      matchVisual: false,
      // Preserve HTML attributes when pasting
      matchers: [
        ['img', function(node: any, delta: any) {
          const ops = delta.ops || [];
          ops.forEach((op: any) => {
            if (op.insert && op.insert.image) {
              const img = node;
              // Preserve existing width/height attributes
              const width = img.getAttribute('width');
              const height = img.getAttribute('height');
              const style = img.getAttribute('style');
              
              if (width || height || style) {
                op.attributes = op.attributes || {};
                if (width) op.attributes.width = width;
                if (height) op.attributes.height = height;
                if (style) op.attributes.style = style;
              }
            }
          });
          return delta;
        }]
      ]
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video', 'code-block',
    'width', 'height', 'style' // Add these to preserve image dimensions
  ];

  // Add image resize functionality after component mounts
  React.useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    let selectedImage: HTMLImageElement | null = null;
    let resizeBox: HTMLDivElement | null = null;

    const addResizeCapabilities = () => {
      const images = quill.container.querySelectorAll('img');
      images.forEach((img: HTMLImageElement) => {
        if (!img.classList.contains('ql-image-resizable')) {
          img.classList.add('ql-image-resizable');
          img.style.cursor = 'pointer';
          
          // Ensure images with existing dimensions maintain them
          const width = img.getAttribute('width');
          const height = img.getAttribute('height');
          const style = img.getAttribute('style');
          
          if (width && !img.style.width) {
            img.style.width = `${width}px`;
          }
          if (height && !img.style.height) {
            img.style.height = `${height}px`;
          }
        }
      });
    };

    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' && target.classList.contains('ql-image-resizable')) {
        selectedImage = target as HTMLImageElement;
        showResizeBox(selectedImage);
      } else {
        hideResizeBox();
      }
    };

    const showResizeBox = (img: HTMLImageElement) => {
      hideResizeBox();
      
      resizeBox = document.createElement('div');
      resizeBox.className = 'ql-image-resize-box';
      
      const rect = img.getBoundingClientRect();
      const editorRect = quill.container.getBoundingClientRect();
      
      resizeBox.style.position = 'absolute';
      resizeBox.style.left = `${rect.left - editorRect.left + quill.container.scrollLeft}px`;
      resizeBox.style.top = `${rect.top - editorRect.top + quill.container.scrollTop}px`;
      resizeBox.style.width = `${rect.width}px`;
      resizeBox.style.height = `${rect.height}px`;

      // Add resize handles
      const handles = ['nw', 'ne', 'sw', 'se'];
      handles.forEach(pos => {
        const handle = document.createElement('div');
        handle.className = `ql-resize-handle ql-resize-${pos}`;

        switch (pos) {
          case 'nw':
            handle.style.top = '-4px';
            handle.style.left = '-4px';
            break;
          case 'ne':
            handle.style.top = '-4px';
            handle.style.right = '-4px';
            break;
          case 'sw':
            handle.style.bottom = '-4px';
            handle.style.left = '-4px';
            break;
          case 'se':
            handle.style.bottom = '-4px';
            handle.style.right = '-4px';
            break;
        }

        handle.addEventListener('mousedown', (e) => startResize(e, pos, img));
        resizeBox.appendChild(handle);
      });

      quill.container.appendChild(resizeBox);
    };

    const hideResizeBox = () => {
      if (resizeBox) {
        resizeBox.remove();
        resizeBox = null;
      }
      selectedImage = null;
    };

    const startResize = (e: MouseEvent, position: string, img: HTMLImageElement) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = img.offsetWidth;
      const startHeight = img.offsetHeight;
      const aspectRatio = startWidth / startHeight;

      const handleMouseMove = (e: MouseEvent) => {
        let newWidth = startWidth;
        let newHeight = startHeight;

        switch (position) {
          case 'se':
            newWidth = startWidth + (e.clientX - startX);
            newHeight = newWidth / aspectRatio;
            break;
          case 'sw':
            newWidth = startWidth - (e.clientX - startX);
            newHeight = newWidth / aspectRatio;
            break;
          case 'ne':
            newWidth = startWidth + (e.clientX - startX);
            newHeight = newWidth / aspectRatio;
            break;
          case 'nw':
            newWidth = startWidth - (e.clientX - startX);
            newHeight = newWidth / aspectRatio;
            break;
        }

        // Minimum size constraints
        newWidth = Math.max(50, newWidth);
        newHeight = Math.max(50, newHeight);

        // Update both CSS styles and HTML attributes for persistence
        img.style.width = `${newWidth}px`;
        img.style.height = `${newHeight}px`;
        img.setAttribute('width', Math.round(newWidth).toString());
        img.setAttribute('height', Math.round(newHeight).toString());

        if (resizeBox) {
          resizeBox.style.width = `${newWidth}px`;
          resizeBox.style.height = `${newHeight}px`;
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        hideResizeBox();
        
        // Trigger content change to update the saved content
        const currentContent = quill.root.innerHTML;
        onChange(currentContent);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    // Add resize capabilities to existing images and new ones
    addResizeCapabilities();
    
    // Listen for content changes to add resize to new images
    quill.on('text-change', () => {
      setTimeout(addResizeCapabilities, 100);
    });

    // Also run when content is set (like when loading existing content)
    quill.on('editor-change', () => {
      setTimeout(addResizeCapabilities, 100);
    });

    quill.container.addEventListener('click', handleImageClick);
    
    document.addEventListener('click', (e) => {
      if (!quill.container.contains(e.target as Node)) {
        hideResizeBox();
      }
    });

    return () => {
      quill.container.removeEventListener('click', handleImageClick);
      document.removeEventListener('click', handleImageClick);
      hideResizeBox();
    };
  }, [onChange]);

  // Run addResizeCapabilities when value changes (content loaded)
  React.useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    
    setTimeout(() => {
      const images = quill.container.querySelectorAll('img');
      images.forEach((img: HTMLImageElement) => {
        if (!img.classList.contains('ql-image-resizable')) {
          img.classList.add('ql-image-resizable');
          img.style.cursor = 'pointer';
          
          // Preserve existing dimensions from attributes
          const width = img.getAttribute('width');
          const height = img.getAttribute('height');
          
          if (width && !img.style.width) {
            img.style.width = `${width}px`;
          }
          if (height && !img.style.height) {
            img.style.height = `${height}px`;
          }
        }
      });
    }, 200);
  }, [value]);

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setUploading(true);
      
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `blog-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('blog-media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('blog-media')
          .getPublicUrl(filePath);

        // Insert image into editor
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection();
          quill.insertEmbed(range?.index || 0, 'image', publicUrl);
          quill.setSelection((range?.index || 0) + 1);
        }

        onMediaUpload?.(publicUrl, 'image');
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
      } finally {
        setUploading(false);
      }
    };

    input.click();
  };

  const handleVideoEmbed = () => {
    if (!videoUrl.trim()) return;

    let embedHtml = '';
    
    // YouTube embed
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = extractVideoId(videoUrl);
      if (videoId) {
        embedHtml = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
      }
    }
    // Vimeo embed
    else if (videoUrl.includes('vimeo.com')) {
      const videoId = videoUrl.split('/').pop();
      if (videoId) {
        embedHtml = `<iframe src="https://player.vimeo.com/video/${videoId}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`;
      }
    }
    // Direct video link
    else if (videoUrl.match(/\.(mp4|webm|ogg)$/i)) {
      embedHtml = `<video controls width="560" height="315"><source src="${videoUrl}" type="video/mp4">Your browser does not support the video tag.</video>`;
    }

    if (embedHtml) {
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const range = quill.getSelection();
        quill.clipboard.dangerouslyPasteHTML(range?.index || 0, embedHtml);
      }
      onMediaUpload?.(videoUrl, 'video');
    }

    setVideoUrl('');
    setShowVideoDialog(false);
  };

  const handleLinkEmbed = () => {
    if (!linkUrl.trim()) return;

    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      if (range) {
        quill.format('link', linkUrl);
      }
    }

    setLinkUrl('');
    setShowLinkDialog(false);
  };

  const extractVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <CustomToolbar 
        onImageUpload={handleImageUpload}
        onVideoEmbed={() => setShowVideoDialog(true)}
        onLinkEmbed={() => setShowLinkDialog(true)}
      />
      
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="min-h-[400px]"
        style={{ border: 'none' }}
        preserveWhitespace={true}
      />

      {uploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Upload className="animate-spin h-4 w-4" />
              <span>Uploading image...</span>
            </div>
          </div>
        </div>
      )}

      {/* Video Embed Dialog */}
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Embed Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Video URL</label>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Supports YouTube, Vimeo, and direct video links
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleVideoEmbed} disabled={!videoUrl.trim()}>
                Embed Video
              </Button>
              <Button variant="outline" onClick={() => setShowVideoDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">URL</label>
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleLinkEmbed} disabled={!linkUrl.trim()}>
                Add Link
              </Button>
              <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RichTextEditor;
