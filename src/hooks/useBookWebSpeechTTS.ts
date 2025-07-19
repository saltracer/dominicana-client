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

  // Enhanced text extraction using proper ePub.js APIs
  const extractCurrentPageText = useCallback(async (rendition: any): Promise<string> => {
    console.log('🔍 BookWebSpeechTTS: Starting proper ePub.js text extraction');
    
    try {
      if (!rendition) {
        console.error('❌ BookWebSpeechTTS: No rendition provided');
        return '';
      }

      // Method 1: Use current location and section content
      try {
        const currentLocation = rendition.currentLocation();
        
        if (currentLocation && currentLocation.start) {
          console.log('📍 BookWebSpeechTTS: Current location:', {
            cfi: currentLocation.start.cfi,
            href: currentLocation.start.href,
            index: currentLocation.start.index
          });

          // Get the current section from the book
          const book = rendition.book;
          if (book && book.spine) {
            const spineItem = book.spine.get(currentLocation.start.href);
            
            if (spineItem) {
              console.log('📖 BookWebSpeechTTS: Found current spine item:', spineItem.href);
              
              // Load the section content
              const section = await book.load(spineItem.href);
              if (section && section.document) {
                console.log('📄 BookWebSpeechTTS: Loaded section document');
                
                // Extract text from the section
                const body = section.document.body || section.document.documentElement;
                if (body) {
                  const sectionText = body.textContent || body.innerText || '';
                  
                  // Try to find the current position within the section
                  // For now, we'll take a reasonable chunk from the beginning of the section
                  // In a more advanced implementation, we could use the CFI to find exact position
                  const cleanedText = sectionText
                    .replace(/\s+/g, ' ')
                    .replace(/[^\w\s.,!?;:'"()-]/g, ' ')
                    .trim();
                  
                  // Take a page-sized chunk (not the entire section)
                  const pageText = cleanedText.substring(0, 8000);
                  
                  console.log('✅ BookWebSpeechTTS: Extracted section text:', {
                    sectionLength: cleanedText.length,
                    pageLength: pageText.length,
                    preview: pageText.substring(0, 200) + '...'
                  });
                  
                  if (pageText.length > 100) {
                    return pageText;
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ BookWebSpeechTTS: Error with ePub.js API method:', error);
      }

      // Method 2: Fallback - try to get content from current view
      try {
        const manager = rendition.manager;
        
        if (manager && manager.views) {
          console.log('📚 BookWebSpeechTTS: Trying fallback method with manager views');
          
          // Get views from manager
          const views = Array.isArray(manager.views) ? manager.views : Object.values(manager.views);
          
          for (const view of views) {
            if (view && view.displayed && view.contents && view.contents.document) {
              const doc = view.contents.document;
              const body = doc.body || doc.documentElement;
              
              if (body) {
                const viewText = body.textContent || body.innerText || '';
                const cleanedText = viewText
                  .replace(/\s+/g, ' ')
                  .replace(/[^\w\s.,!?;:'"()-]/g, ' ')
                  .trim();
                
                console.log('✅ BookWebSpeechTTS: Fallback method extracted text:', {
                  length: cleanedText.length,
                  preview: cleanedText.substring(0, 200) + '...'
                });
                
                if (cleanedText.length > 100 && cleanedText.length < 50000) {
                  return cleanedText;
                }
              }
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ BookWebSpeechTTS: Error with fallback method:', error);
      }

      console.warn('⚠️ BookWebSpeechTTS: No text could be extracted from current page');
      return '';
      
    } catch (error) {
      console.error('💥 BookWebSpeechTTS: Error extracting text from current page:', error);
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

    console.log('📖 BookWebSpeechTTS: Starting to read current page using ePub.js APIs');
    
    const pageText = await extractCurrentPageText(rendition);
    if (!pageText.trim()) {
      console.warn('❌ BookWebSpeechTTS: No text found on current page');
      return;
    }

    console.log('✅ BookWebSpeechTTS: Extracted text successfully:', {
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
