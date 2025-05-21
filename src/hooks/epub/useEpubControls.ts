
import { useCallback } from 'react';

interface UseEpubControlsProps {
  renditionInstanceRef: React.RefObject<any>;
}

export const useEpubControls = ({ renditionInstanceRef }: UseEpubControlsProps) => {
  // Navigation functions
  const nextPage = useCallback(() => {
    if (renditionInstanceRef.current) {
      renditionInstanceRef.current.next();
    }
  }, [renditionInstanceRef]);

  const prevPage = useCallback(() => {
    if (renditionInstanceRef.current) {
      renditionInstanceRef.current.prev();
    }
  }, [renditionInstanceRef]);

  // Font size controls
  const changeFontSize = useCallback((increase: boolean) => {
    if (!renditionInstanceRef.current) return;
    
    try {
      const currentSize = renditionInstanceRef.current.themes.fontSize();
      const newSize = increase ? 
        (parseFloat(currentSize) * 1.2) + 'px' : 
        (parseFloat(currentSize) / 1.2) + 'px';
      
      renditionInstanceRef.current.themes.fontSize(newSize);
    } catch (e) {
      console.error('Error changing font size:', e);
    }
  }, [renditionInstanceRef]);

  // Toggle theme (dark/light mode)
  const toggleTheme = useCallback(() => {
    if (!renditionInstanceRef.current) return;
    
    try {
      const theme = document.body.classList.contains('dark') ? 'light' : 'dark';
      
      if (theme === 'dark') {
        renditionInstanceRef.current.themes.register('dark', {
          body: { 
            color: '#ffffff !important', 
            background: '#121212 !important' 
          }
        });
        renditionInstanceRef.current.themes.select('dark');
      } else {
        renditionInstanceRef.current.themes.register('light', {
          body: { 
            color: '#000000 !important', 
            background: '#ffffff !important' 
          }
        });
        renditionInstanceRef.current.themes.select('light');
      }
    } catch (e) {
      console.error('Error toggling theme:', e);
    }
  }, [renditionInstanceRef]);

  return {
    nextPage,
    prevPage,
    changeFontSize,
    toggleTheme
  };
};
