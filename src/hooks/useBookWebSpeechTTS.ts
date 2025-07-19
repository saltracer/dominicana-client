
import { useState, useCallback, useRef } from 'react';
import { useWebSpeechTTS } from './useWebSpeechTTS';

export interface BookTTSOptions {
  chunkSize?: number; // Characters per TTS chunk
  pauseBetweenChunks?: number; // Milliseconds to pause between chunks
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

  // Enhanced text extraction method for EPUB iframes - fixed to match working ElevenLabs version
  const extractCurrentPageText = useCallback((rendition: any): string => {
    console.log('🔍 BookWebSpeechTTS: Starting text extraction from rendition');
    
    try {
      if (!rendition) {
        console.error('❌ BookWebSpeechTTS: No rendition provided');
        return '';
      }

      let extractedText = '';

      // Method 1: Try to access the manager views directly (as property)
      try {
        const manager = rendition.manager;
        console.log('📖 BookWebSpeechTTS: Manager found:', !!manager);
        
        if (manager && manager.views) {
          console.log('👁️ BookWebSpeechTTS: Views found:', manager.views);
          
          // Access views as property, not function
          const views = Array.isArray(manager.views) ? manager.views : Object.values(manager.views);
          console.log('📚 BookWebSpeechTTS: Processing views:', views.length);
          
          for (const view of views) {
            console.log('🔍 BookWebSpeechTTS: Processing view:', {
              displayed: view?.displayed,
              hasContents: !!view?.contents,
              hasDocument: !!view?.contents?.document
            });
            
            if (view && view.displayed && view.contents && view.contents.document) {
              try {
                const doc = view.contents.document;
                const body = doc.body || doc.documentElement;
                
                if (body) {
                  console.log('📄 BookWebSpeechTTS: Found body element in view');
                  
                  // Clone and clean the content
                  const clone = body.cloneNode(true) as HTMLElement;
                  
                  // Remove unwanted elements
                  const unwantedElements = clone.querySelectorAll('script, style, nav, header, footer, .toc, #toc');
                  unwantedElements.forEach(el => el.remove());
                  
                  const viewText = (clone as HTMLElement).textContent || (clone as HTMLElement).innerText || '';
                  console.log('✅ BookWebSpeechTTS: Extracted text from view:', {
                    length: viewText.length,
                    preview: viewText.substring(0, 100) + '...'
                  });
                  
                  if (viewText.trim()) {
                    extractedText = viewText;
                    break;
                  }
                }
              } catch (error) {
                console.warn('⚠️ BookWebSpeechTTS: Error processing view:', error);
              }
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ BookWebSpeechTTS: Error accessing manager views:', error);
      }

      // Method 2: Fallback - Direct DOM query for EPUB iframes
      if (!extractedText.trim()) {
        console.log('📖 BookWebSpeechTTS: Trying fallback method - direct iframe access');
        
        try {
          // Look for react-reader iframes
          const iframes = document.querySelectorAll('iframe');
          console.log('🔍 BookWebSpeechTTS: Found iframes:', iframes.length);
          
          for (const iframe of iframes) {
            try {
              const iframeDoc = (iframe as HTMLIFrameElement).contentDocument;
              if (iframeDoc) {
                console.log('📄 BookWebSpeechTTS: Accessing iframe document');
                
                const body = iframeDoc.body || iframeDoc.documentElement;
                if (body) {
                  // Check if iframe is visible
                  const iframeElement = iframe as HTMLIFrameElement;
                  const rect = iframeElement.getBoundingClientRect();
                  const isVisible = rect.width > 0 && rect.height > 0;
                  
                  console.log('👁️ BookWebSpeechTTS: Iframe visibility:', {
                    isVisible,
                    width: rect.width,
                    height: rect.height
                  });
                  
                  if (isVisible) {
                    const clone = body.cloneNode(true) as HTMLElement;
                    
                    // Remove unwanted elements
                    const unwantedElements = clone.querySelectorAll('script, style, nav, header, footer, .toc, #toc');
                    unwantedElements.forEach(el => el.remove());
                    
                    const text = (clone as HTMLElement).textContent || (clone as HTMLElement).innerText || '';
                    console.log('📝 BookWebSpeechTTS: Iframe text extracted:', {
                      length: text.length,
                      preview: text.substring(0, 100) + '...'
                    });
                    
                    if (text.trim()) {
                      extractedText = text;
                      break;
                    }
                  }
                }
              }
            } catch (error) {
              console.warn('⚠️ BookWebSpeechTTS: Cross-origin or other error accessing iframe:', error);
            }
          }
        } catch (error) {
          console.warn('⚠️ BookWebSpeechTTS: Error in fallback method:', error);
        }
      }

      // Clean up the extracted text
      if (extractedText.trim()) {
        const cleanedText = extractedText
          .replace(/\s+/g, ' ')
          .replace(/\n+/g, ' ')
          .replace(/[^\w\s.,!?;:'"()-]/g, '')
          .trim();
        
        console.log('✅ BookWebSpeechTTS: Successfully extracted and cleaned text:', {
          originalLength: extractedText.length,
          cleanedLength: cleanedText.length,
          preview: cleanedText.substring(0, 200) + '...'
        });
        
        return cleanedText;
      }

      console.warn('⚠️ BookWebSpeechTTS: No text could be extracted using any method');
      return '';
      
    } catch (error) {
      console.error('💥 BookWebSpeechTTS: Error extracting text from page:', error);
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
      
      // If adding this sentence would exceed chunk size, save current chunk and start new one
      if (currentChunk.length + trimmedSentence.length > chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim() + '.');
        currentChunk = trimmedSentence;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + trimmedSentence;
      }
    }
    
    // Add the last chunk if it has content
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

    console.log('📖 BookWebSpeechTTS: Starting to read current page');
    
    const pageText = extractCurrentPageText(rendition);
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
