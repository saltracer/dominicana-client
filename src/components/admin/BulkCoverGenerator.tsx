
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Book } from '@/lib/types';
import { generateMissingBookCovers } from '@/services/bookCoverService';
import { Loader2, ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BulkCoverGeneratorProps {
  books: Book[];
  onCoversGenerated: () => void;
}

const BulkCoverGenerator: React.FC<BulkCoverGeneratorProps> = ({ books, onCoversGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const booksWithoutCovers = books.filter(book => !book.coverImage || book.coverImage.trim() === '');

  const handleGenerateCovers = async () => {
    if (booksWithoutCovers.length === 0) {
      toast({
        title: 'No covers needed',
        description: 'All books already have cover images.',
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setResults(null);

    try {
      const results = await generateMissingBookCovers(books);
      
      setResults(results);
      
      if (results.successful > 0) {
        toast({
          title: 'Cover generation completed',
          description: `Generated ${results.successful} covers successfully${results.failed > 0 ? `, ${results.failed} failed` : ''}.`,
        });
        onCoversGenerated();
      } else {
        toast({
          title: 'Cover generation failed',
          description: 'No covers were generated successfully.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error generating covers:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate book covers.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
      setProgress(100);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          AI Cover Generation
        </CardTitle>
        <CardDescription>
          Generate cover images for books that don't have them using AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Books without covers: <span className="font-medium">{booksWithoutCovers.length}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Total books: <span className="font-medium">{books.length}</span>
            </p>
          </div>
          
          <Button 
            onClick={handleGenerateCovers}
            disabled={isGenerating || booksWithoutCovers.length === 0}
            className="bg-dominican-burgundy hover:bg-dominican-burgundy/90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Generate Missing Covers
              </>
            )}
          </Button>
        </div>

        {isGenerating && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              Generating book covers...
            </p>
          </div>
        )}

        {results && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium">Generation Results</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">
                  {results.successful} successful
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-4 w-4" />
                <span className="text-sm">
                  {results.failed} failed
                </span>
              </div>
            </div>

            {results.errors.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-muted-foreground mb-2">Errors:</p>
                <div className="text-xs text-red-600 space-y-1 max-h-32 overflow-y-auto">
                  {results.errors.map((error, index) => (
                    <p key={index}>• {error}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkCoverGenerator;
