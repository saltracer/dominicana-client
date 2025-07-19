
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Book } from '@/lib/types';
import { generateBookCover, updateBookCover } from '@/services/bookCoverService';
import { Loader2, ImageIcon } from 'lucide-react';

interface BookCoverGeneratorProps {
  book: Book;
  onCoverGenerated: (imageUrl: string) => void;
  size?: 'sm' | 'default';
}

const BookCoverGenerator: React.FC<BookCoverGeneratorProps> = ({ 
  book, 
  onCoverGenerated, 
  size = 'sm' 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCover = async () => {
    setIsGenerating(true);

    try {
      console.log('Generating cover for:', book.title);
      
      const result = await generateBookCover(book.title, book.author, book.category);
      
      if (result.success && result.imageUrl) {
        await updateBookCover(book.id, result.imageUrl);
        onCoverGenerated(result.imageUrl);
        
        toast({
          title: 'Success',
          description: `Generated cover for "${book.title}"`,
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to generate cover',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error generating cover:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate book cover',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleGenerateCover}
      disabled={isGenerating}
      className="border-dominican-burgundy text-dominican-burgundy hover:bg-dominican-burgundy/10"
      title="Generate AI cover"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ImageIcon className="h-4 w-4" />
      )}
      {size === 'default' && (
        <span className="ml-2">
          {isGenerating ? 'Generating...' : 'Generate Cover'}
        </span>
      )}
    </Button>
  );
};

export default BookCoverGenerator;
