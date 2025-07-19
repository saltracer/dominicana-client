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
    console.log('🔍 BookWebSpeechTTS: Starting ePub.js text extraction');
    
    try {
      if (!rendition) {
        console.error('❌ BookWebSpeechTTS: No rendition provided');
        return '';
      }

      // Method 1: Get text from current view using contents
      try {
        const manager = rendition.manager;
        if (manager && manager.views) {
          console.log('📖 BookWebSpeechTTS: Accessing manager views');
          
          const views = manager.views;
          let viewsArray = [];
          
          // Handle different view manager types
          if (Array.isArray(views)) {
            viewsArray = views;
          } else if (views && typeof views === 'object') {
            viewsArray = Object.values(views);
          }
          
          console.log('🔍 BookWebSpeechTTS: Found views:', viewsArray.length);
          
          for (const view of viewsArray) {
            if (view && view.contents) {
              console.log('📄 BookWebSpeechTTS: Processing view with contents');
              
              try {
                // Try to get the document from the view contents
                const doc = view.contents.document || view.contents.documentElement;
                if (doc) {
                  const textContent = doc.textContent || doc.innerText || '';
                  
                  if (textContent && textContent.trim().length > 50) {
                    const cleanedText = textContent
                      .replace(/\s+/g, ' ')
                      .replace(/[^\w\s.,!?;:'"()-]/g, ' ')
                      .trim();
                    
                    console.log('✅ BookWebSpeechTTS: Extracted text from view:', {
                      length: cleanedText.length,
                      preview: cleanedText.substring(0, 200) + '...'
                    });
                    
                    return cleanedText;
                  }
                }
              } catch (viewError) {
                console.warn('⚠️ BookWebSpeechTTS: Error processing view:', viewError);
              }
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ BookWebSpeechTTS: Error with view method:', error);
      }

      // Method 2: Try using the current location and spine
      try {
        const currentLocation = rendition.currentLocation();
        if (currentLocation && currentLocation.start) {
          console.log('📍 BookWebSpeechTTS: Current location found:', currentLocation.start.href);
          
          const book = rendition.book;
          if (book && book.spine) {
            // Get the spine item for current location
            const spineItem = book.spine.get(currentLocation.start.href);
            if (spineItem) {
              console.log('📚 BookWebSpeechTTS: Found spine item');
              
              // Try to get the section content directly
              try {
                const section = book.section(spineItem.href);
                if (section) {
                  await section.load();
                  const sectionText = await section.output();
                  
                  if (sectionText) {
                    // Parse the HTML content
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = sectionText;
                    const textContent = tempDiv.textContent || tempDiv.innerText || '';
                    
                    if (textContent && textContent.trim().length > 50) {
                      const cleanedText = textContent
                        .replace(/\s+/g, ' ')
                        .replace(/[^\w\s.,!?;:'"()-]/g, ' ')
                        .trim();
                      
                      // Take a reasonable chunk size (not the entire chapter)
                      const pageText = cleanedText.substring(0, 8000);
                      
                      console.log('✅ BookWebSpeechTTS: Extracted text from section:', {
                        totalLength: cleanedText.length,
                        pageLength: pageText.length,
                        preview: pageText.substring(0, 200) + '...'
                      });
                      
                      return pageText;
                    }
                  }
                }
              } catch (sectionError) {
                console.warn('⚠️ BookWebSpeechTTS: Error loading section:', sectionError);
              }
            }
          }
        }
      } catch (locationError) {
        console.warn('⚠️ BookWebSpeechTTS: Error with location method:', locationError);
      }

      // Method 3: Fallback - try to get any text from the rendition
      try {
        console.log('🔄 BookWebSpeechTTS: Trying fallback text extraction');
        
        if (rendition.book && rendition.book.spine) {
          const spine = rendition.book.spine;
          const currentItem = spine.items[0]; // Get first available item as fallback
          
          if (currentItem) {
            console.log('📖 BookWebSpeechTTS: Using fallback spine item:', currentItem.href);
            
            const section = rendition.book.section(currentItem.href);
            if (section) {
              await section.load();
              const sectionText = await section.output();
              
              if (sectionText) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = sectionText;
                const textContent = tempDiv.textContent || tempDiv.innerText || '';
                
                if (textContent && textContent.trim().length > 50) {
                  const cleanedText = textContent
                    .replace(/\s+/g, ' ')
                    .replace(/[^\w\s.,!?;:'"()-]/g, ' ')
                    .trim();
                  
                  const pageText = cleanedText.substring(0, 8000);
                  
                  console.log('✅ BookWebSpeechTTS: Fallback text extraction successful:', {
                    length: pageText.length,
                    preview: pageText.substring(0, 200) + '...'
                  });
                  
                  return pageText;
                }
              }
            }
          }
        }
      } catch (fallbackError) {
        console.warn('⚠️ BookWebSpeechTTS: Fallback method failed:', fallbackError);
      }

      console.warn('⚠️ BookWebSpeechTTS: All text extraction methods failed');
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
