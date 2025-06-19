import React, { useEffect, useRef } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Book } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Celebration } from '@/lib/liturgical/celebrations/celebrations-types';
interface CelebrationDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  celebration: Celebration | null;
}
const CelebrationDetailsDialog: React.FC<CelebrationDetailsDialogProps> = ({
  isOpen,
  onClose,
  celebration
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  if (!celebration) return null;

  // Map liturgical colors to Tailwind classes
  const getColorClasses = (color: string | undefined) => {
    if (!color) return '';
    const colorClasses: {
      [key: string]: string;
    } = {
      'green': 'bg-liturgical-green text-white',
      'purple': 'bg-liturgical-purple text-white',
      'white': 'bg-liturgical-white text-dominican-black border border-gray-300',
      'red': 'bg-liturgical-red text-white',
      'rose': 'bg-liturgical-rose text-dominican-black',
      'gold': 'bg-liturgical-gold text-dominican-black',
      'violet': 'bg-liturgical-purple text-white' // Map violet to purple
    };
    return colorClasses[color.toLowerCase()] || '';
  };

  // Format description with proper paragraphs
  const formatDescription = (description: string | string[] | undefined) => {
    if (!description) return null;
    //console.log(typeof description);
    //console.log(description);
    // If the description is already an array (from joined paragraphs), split it back
    const paragraphs = description;//.split(/(?<=\.|\?|\!) (?=[A-Z])/);
    if (Array.isArray(paragraphs)) {
      return paragraphs.map((paragraph, index) => <p key={index} className="text-gray-700 mb-3 dark:text-gray-200">{paragraph}</p>);
    } else {
      return <p className="text-gray-700 mb-3 dark:text-gray-200">{paragraphs}</p>;
    }
  };
  return <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" ref={dialogRef}>
        <AlertDialogHeader>
          <div className={cn("px-4 py-2 rounded mb-4 flex justify-between items-center", getColorClasses(celebration.color))}>
            <AlertDialogTitle className="text-xl">{celebration.name}</AlertDialogTitle>
            <span className="text-sm px-2 py-0.5 rounded bg-white/20">
              {celebration.rank}
            </span>
          </div>
          
          {/* Year information and Dominican badge */}
          <div className="flex flex-wrap justify-between items-center mb-3">
            <div>
              {(celebration.birthYear || celebration.deathYear) && <span className="text-gray-500 font-medium">
                  {celebration.birthYear && celebration.deathYear ? `${celebration.birthYear} - ${celebration.deathYear}` : celebration.deathYear ? `d. ${celebration.deathYear}` : ''}
                </span>}
            </div>
            
            {celebration.isDominican && <span className="bg-dominican-burgundy/10 text-dominican-burgundy text-sm px-2 py-0.5 rounded-md">
                Dominican Feast
              </span>}
          </div>
          
          {celebration.patronage && <div className="mb-4">
              <h3 className="font-semibold mb-1">Patronage</h3>
              <p>{celebration.patronage}</p>
            </div>}

          <Separator className="my-4" />
          
          <AlertDialogDescription asChild>
            <div className="text-black">
              {formatDescription(celebration.description)}
              
              {celebration.biography && <>
                  <h3 className="font-semibold text-lg mb-2">Biography</h3>
                  {celebration.biography.map((paragraph, index) => <p key={index} className="text-gray-700 mb-3 dark:text-gray-300">{paragraph}</p>)}
                </>}
              
              {celebration.prayers && <>
                  <h3 className="font-semibold text-lg mb-2">Prayers</h3>
                  <div className="bg-dominican-light-gray/10 p-3 rounded-md italic">
                    {celebration.prayers}
                  </div>
                </>}
              
              {celebration.books && celebration.books.length > 0 && <>
                  <h3 className="font-semibold text-lg mb-2 mt-4">Recommended Books</h3>
                  <ul className="space-y-1">
                    {celebration.books.map((book, index) => <li key={index} className="flex items-start mb-2">
                        <Book className="h-5 w-5 mr-2 mt-0.5 text-dominican-burgundy" />
                        <span>{book}</span>
                      </li>)}
                  </ul>
                </>}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>;
};
export default CelebrationDetailsDialog;