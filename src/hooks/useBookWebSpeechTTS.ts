import { useState, useCallback, useRef } from 'react';
import { useWebSpeechTTS } from './useWebSpeechTTS';

export interface BookTTSOptions {
  chunkSize?: number;
  pauseBetweenChunks?: number;
}

export const useBookWebSpeechTTS = (options: BookTTSOptions = {}) => {
  const { chunkSize = 2000, pauseBetweenChunks = 500 } = options;
  const { playAudio: playWebSpeech, stopAudio: stopWebSpeech, isLoading: baseTTSLoading, availableVoices } = useWebSpeechTTS();
  
  const [isReading, setIsReading] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [textChunks, setTextChunks] = useState<string[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const isStoppedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extract visible text from current page using proper viewport detection
  const extractCurrentPageText = useCallback(async (rendition: any): Promise<string> => {
    console.log('🔍 BookWebSpeechTTS: Starting visible text extraction from current page');
    
    try {
      if (!rendition) {
        console.error('❌ BookWebSpeechTTS: No rendition provided');
        return '';
      }

      // Get the current location to understand what's visible
      const currentLocation = rendition.currentLocation();
      console.log('📍 BookWebSpeechTTS: Current location:', currentLocation);

      // Get the current view that's actually being displayed
      const manager = rendition.manager;
      if (!manager || !manager.views) {
        console.error('❌ BookWebSpeechTTS: No view manager found');
        return '';
      }

      console.log('📖 BookWebSpeechTTS: Accessing current view manager');
      
      // Get the currently displayed view
      let currentView = null;
      
      // Try different ways to get the current view
      if (manager.views._views) {
        const viewsArray = Object.values(manager.views._views);
        currentView = viewsArray.find((view: any) => view && view.displayed);
        if (!currentView && viewsArray.length > 0) {
          currentView = viewsArray[0]; // Fallback to first view
        }
      } else if (Array.isArray(manager.views)) {
        currentView = manager.views.find((view: any) => view && view.displayed);
        if (!currentView && manager.views.length > 0) {
          currentView = manager.views[0]; // Fallback to first view
        }
      }

      if (!currentView || !currentView.contents) {
        console.warn('⚠️ BookWebSpeechTTS: No current view with contents found');
        return '';
      }

      console.log('📄 BookWebSpeechTTS: Found current view with contents');

      // Get the iframe document from the current view
      const doc = currentView.contents.document;
      if (!doc) {
        console.warn('⚠️ BookWebSpeechTTS: No document in current view');
        return '';
      }

      // Try to get only the visible text by looking at the viewport
      let visibleText = '';

      // Method 1: Try to get text from elements that are actually in the viewport
      if (currentView.contents.window) {
        const win = currentView.contents.window;
        const viewportHeight = win.innerHeight;
        const scrollTop = win.pageYOffset || doc.documentElement.scrollTop;
        
        console.log('📐 BookWebSpeechTTS: Viewport info:', {
          height: viewportHeight,
          scrollTop: scrollTop
        });

        // Get all text elements and filter by visibility in viewport
        const textElements = doc.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6');
        const visibleElements: HTMLElement[] = [];

        for (const element of textElements) {
          const rect = element.getBoundingClientRect();
          // Check if element is in viewport
          if (rect.top < viewportHeight && rect.bottom > 0 && rect.height > 0) {
            const text = element.textContent || element.innerText;
            if (text && text.trim().length > 10) { // Only meaningful text
              visibleElements.push(element as HTMLElement);
            }
          }
        }

        if (visibleElements.length > 0) {
          visibleText = visibleElements
            .map(el => (el.textContent || el.innerText || '').trim())
            .filter(text => text.length > 0)
            .join(' ');
          
          console.log('✅ BookWebSpeechTTS: Extracted visible text from viewport elements:', {
            elementsCount: visibleElements.length,
            textLength: visibleText.length,
            preview: visibleText.substring(0, 200) + '...'
          });
        }
      }

      // Method 2: Fallback - get a reasonable chunk from current position
      if (!visibleText || visibleText.length < 100) {
        console.log('🔄 BookWebSpeechTTS: Using fallback method - getting text chunk from current position');
        
        const bodyText = doc.body ? (doc.body.textContent || doc.body.innerText || '') : '';
        
        if (bodyText && bodyText.length > 0) {
          // Take a reasonable chunk (not the whole document)
          const maxChunkSize = 8000; // Reasonable size for one "page"
          
          // If we have current location info, try to start from a relevant position
          let startIndex = 0;
          if (currentLocation && currentLocation.start && currentLocation.start.percentage) {
            const percentage = currentLocation.start.percentage;
            startIndex = Math.floor(bodyText.length * percentage);
            console.log('📊 BookWebSpeechTTS: Using location percentage to start at:', percentage, 'index:', startIndex);
          }
          
          visibleText = bodyText.substring(startIndex, startIndex + maxChunkSize);
          
          console.log('✅ BookWebSpeechTTS: Extracted text chunk from position:', {
            startIndex,
            chunkLength: visibleText.length,
            totalLength: bodyText.length,
            preview: visibleText.substring(0, 200) + '...'
          });
        }
      }

      if (!visibleText || visibleText.trim().length < 50) {
        console.warn('⚠️ BookWebSpeechTTS: No sufficient visible text found');
        return '';
      }

      // Clean up the text
      const cleanedText = visibleText
        .replace(/\s+/g, ' ')
        .trim();
      
      console.log('✅ BookWebSpeechTTS: Final extracted text:', {
        length: cleanedText.length,
        preview: cleanedText.substring(0, 200) + '...'
      });
      
      return cleanedText;
      
    } catch (error) {
      console.error('💥 BookWebSpeechTTS: Error extracting visible text:', error);
      return '';
    }
  }, []);

  // Split text into manageable chunks for TTS
  const splitTextIntoChunks = useCallback((text: string): string[] => {
    console.log('✂️ BookWebSpeechTTS: Splitting text into chunks:', {
      textLength: text.length,
      chunkSize,
      preview: text.substring(0, 50) + '...'
    });
    
    if (!text.trim()) {
      console.warn('⚠️ BookWebSpeechTTS: No text to split');
      return [];
    }
    
    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    console.log('📝 BookWebSpeechTTS: Found sentences:', sentences.length);
    
    let currentChunk = '';
    
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;
      
      if (currentChunk.length + trimmedSentence.length > chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim() + '.');
        currentChunk = trimmedSentence;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + trimmedSentence;
      }
    }
    
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim() + '.');
    }
    
    console.log('✅ BookWebSpeechTTS: Created chunks:', {
      totalChunks: chunks.length,
      averageLength: chunks.reduce((sum, chunk) => sum + chunk.length, 0) / chunks.length,
      firstChunkPreview: chunks[0]?.substring(0, 50) + '...'
    });
    
    return chunks;
  }, [chunkSize]);

  // Play audio chunks sequentially
  const playChunksSequentially = useCallback(async (chunks: string[], voiceId?: string, startIndex = 0) => {
    console.log('🎵 BookWebSpeechTTS: Starting sequential playback:', {
      totalChunks: chunks.length,
      startIndex,
      voiceId
    });
    
    setIsLoading(true);
    
    const playNextChunk = (index: number) => {
      if (isStoppedRef.current || index >= chunks.length) {
        console.log('🏁 BookWebSpeechTTS: Sequential playback completed or stopped');
        setIsReading(false);
        setIsLoading(false);
        setReadingProgress(100);
        setCurrentChunkIndex(0);
        return;
      }

      setCurrentChunkIndex(index);
      setReadingProgress((index / chunks.length) * 100);
      
      console.log(`🎯 BookWebSpeechTTS: Playing chunk ${index + 1}/${chunks.length}:`, {
        chunkLength: chunks[index].length,
        preview: chunks[index].substring(0, 50) + '...'
      });

      // Create a custom speech utterance with our own event handling
      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      
      // Find and set the voice
      if (voiceId && availableVoices.length > 0) {
        const selectedVoice = availableVoices.find(v => v.id === voiceId);
        if (selectedVoice) {
          utterance.voice = selectedVoice.voice;
        }
      }

      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => {
        console.log(`✅ BookWebSpeechTTS: Finished chunk ${index + 1}`);
        
        if (isStoppedRef.current) {
          console.log('⏹️ BookWebSpeechTTS: Stopping due to user request');
          return;
        }
        
        // Pause between chunks if not the last one
        if (index < chunks.length - 1 && pauseBetweenChunks > 0) {
          console.log(`⏸️ BookWebSpeechTTS: Pausing ${pauseBetweenChunks}ms between chunks`);
          timeoutRef.current = setTimeout(() => {
            playNextChunk(index + 1);
          }, pauseBetweenChunks);
        } else {
          playNextChunk(index + 1);
        }
      };

      utterance.onerror = (event) => {
        console.error(`💥 BookWebSpeechTTS: Error playing chunk ${index + 1}:`, event.error);
        // Continue to next chunk on error
        playNextChunk(index + 1);
      };

      speechSynthesis.speak(utterance);
    };

    setIsLoading(false);
    playNextChunk(startIndex);
  }, [availableVoices, pauseBetweenChunks]);

  // Start reading the current page
  const startReading = useCallback(async (rendition: any, voiceId?: string) => {
    console.log('🎬 BookWebSpeechTTS: Start reading requested:', {
      hasRendition: !!rendition,
      voiceId,
      isReading,
      isLoading
    });
    
    if (isReading || isLoading) {
      console.log('⚠️ BookWebSpeechTTS: Already reading or loading - ignoring request');
      return;
    }

    console.log('📖 BookWebSpeechTTS: Starting to read visible content from current page');
    
    const pageText = await extractCurrentPageText(rendition);
    if (!pageText.trim()) {
      console.warn('❌ BookWebSpeechTTS: No visible text found on current page');
      return;
    }

    console.log('✅ BookWebSpeechTTS: Visible text extracted successfully:', {
      length: pageText.length,
      preview: pageText.substring(0, 100) + '...'
    });
    
    const chunks = splitTextIntoChunks(pageText);
    if (chunks.length === 0) {
      console.warn('❌ BookWebSpeechTTS: No text chunks created');
      return;
    }

    console.log('✅ BookWebSpeechTTS: Created text chunks successfully:', chunks.length);
    
    setTextChunks(chunks);
    setIsReading(true);
    setCurrentChunkIndex(0);
    setReadingProgress(0);
    isStoppedRef.current = false;

    await playChunksSequentially(chunks, voiceId);
  }, [extractCurrentPageText, splitTextIntoChunks, playChunksSequentially, isReading, isLoading]);

  // Stop reading
  const stopReading = useCallback(() => {
    console.log('⏹️ BookWebSpeechTTS: Stopping TTS reading');
    isStoppedRef.current = true;
    setIsReading(false);
    setIsLoading(false);
    
    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Stop speech synthesis
    speechSynthesis.cancel();
    
    setCurrentChunkIndex(0);
    setReadingProgress(0);
    setTextChunks([]);
  }, []);

  // Resume reading from where we left off
  const resumeReading = useCallback(async (voiceId?: string) => {
    console.log('▶️ BookWebSpeechTTS: Resume reading requested:', {
      hasChunks: textChunks.length > 0,
      currentIndex: currentChunkIndex,
      isReading,
      isLoading
    });
    
    if (!textChunks.length || isReading || isLoading) {
      console.log('⚠️ BookWebSpeechTTS: Cannot resume - no chunks or already playing');
      return;
    }

    console.log('🔄 BookWebSpeechTTS: Resuming reading from chunk', currentChunkIndex);
    setIsReading(true);
    isStoppedRef.current = false;

    await playChunksSequentially(textChunks, voiceId, currentChunkIndex);
  }, [textChunks, currentChunkIndex, playChunksSequentially, isReading, isLoading]);

  return {
    isReading,
    isLoading: isLoading || baseTTSLoading,
    readingProgress,
    currentChunkIndex,
    totalChunks: textChunks.length,
    startReading,
    stopReading,
    resumeReading,
    availableVoices
  };
};
