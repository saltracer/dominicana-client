
import { useState, useCallback, useRef } from 'react';
import { useTextToSpeech } from './useTextToSpeech';

export interface BookTTSOptions {
  chunkSize?: number;
  pauseBetweenChunks?: number;
}

export const useBookTextToSpeech = (options: BookTTSOptions = {}) => {
  const { chunkSize = 2000, pauseBetweenChunks = 500 } = options;
  const { generateSpeech, isLoading: baseTTSLoading, availableVoices } = useTextToSpeech();
  
  const [isReading, setIsReading] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [textChunks, setTextChunks] = useState<string[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const isStoppedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced text extraction method for EPUB iframes
  const extractCurrentPageText = useCallback((rendition: any): string => {
    console.log('🔍 BookTTS: Starting text extraction from rendition');
    
    try {
      if (!rendition) {
        console.error('❌ BookTTS: No rendition provided');
        return '';
      }

      let extractedText = '';

      // Method 1: Try to access the manager views directly (not as a function)
      try {
        const manager = rendition.manager;
        console.log('📖 BookTTS: Manager found:', !!manager);
        
        if (manager && manager.views) {
          console.log('👁️ BookTTS: Views found:', manager.views);
          
          // Access views as property, not function
          const views = Array.isArray(manager.views) ? manager.views : Object.values(manager.views);
          console.log('📚 BookTTS: Processing views:', views.length);
          
          for (const view of views) {
            console.log('🔍 BookTTS: Processing view:', {
              displayed: view?.displayed,
              hasContents: !!view?.contents,
              hasDocument: !!view?.contents?.document
            });
            
            if (view && view.displayed && view.contents && view.contents.document) {
              try {
                const doc = view.contents.document;
                const body = doc.body || doc.documentElement;
                
                if (body) {
                  console.log('📄 BookTTS: Found body element in view');
                  
                  // Clone and clean the content
                  const clone = body.cloneNode(true) as HTMLElement;
                  
                  // Remove unwanted elements
                  const unwantedElements = clone.querySelectorAll('script, style, nav, header, footer, .toc, #toc');
                  unwantedElements.forEach(el => el.remove());
                  
                  const viewText = clone.textContent || clone.innerText || '';
                  console.log('✅ BookTTS: Extracted text from view:', {
                    length: viewText.length,
                    preview: viewText.substring(0, 100) + '...'
                  });
                  
                  if (viewText.trim()) {
                    extractedText = viewText;
                    break;
                  }
                }
              } catch (error) {
                console.warn('⚠️ BookTTS: Error processing view:', error);
              }
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ BookTTS: Error accessing manager views:', error);
      }

      // Method 2: Fallback - Direct DOM query for EPUB iframes
      if (!extractedText.trim()) {
        console.log('📖 BookTTS: Trying fallback method - direct iframe access');
        
        try {
          // Look for react-reader iframes
          const iframes = document.querySelectorAll('iframe');
          console.log('🔍 BookTTS: Found iframes:', iframes.length);
          
          for (const iframe of iframes) {
            try {
              const iframeDoc = (iframe as HTMLIFrameElement).contentDocument;
              if (iframeDoc) {
                console.log('📄 BookTTS: Accessing iframe document');
                
                const body = iframeDoc.body || iframeDoc.documentElement;
                if (body) {
                  // Check if iframe is visible
                  const iframeElement = iframe as HTMLIFrameElement;
                  const rect = iframeElement.getBoundingClientRect();
                  const isVisible = rect.width > 0 && rect.height > 0;
                  
                  console.log('👁️ BookTTS: Iframe visibility:', {
                    isVisible,
                    width: rect.width,
                    height: rect.height
                  });
                  
                  if (isVisible) {
                    const clone = body.cloneNode(true) as HTMLElement;
                    
                    // Remove unwanted elements
                    const unwantedElements = clone.querySelectorAll('script, style, nav, header, footer, .toc, #toc');
                    unwantedElements.forEach(el => el.remove());
                    
                    const text = clone.textContent || clone.innerText || '';
                    console.log('📝 BookTTS: Iframe text extracted:', {
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
              console.warn('⚠️ BookTTS: Cross-origin or other error accessing iframe:', error);
            }
          }
        } catch (error) {
          console.warn('⚠️ BookTTS: Error in fallback method:', error);
        }
      }

      // Clean up the extracted text
      if (extractedText.trim()) {
        const cleanedText = extractedText
          .replace(/\s+/g, ' ')
          .replace(/\n+/g, ' ')
          .replace(/[^\w\s.,!?;:'"()-]/g, '')
          .trim();
        
        console.log('✅ BookTTS: Successfully extracted and cleaned text:', {
          originalLength: extractedText.length,
          cleanedLength: cleanedText.length,
          preview: cleanedText.substring(0, 200) + '...'
        });
        
        return cleanedText;
      }

      console.warn('⚠️ BookTTS: No text could be extracted using any method');
      return '';
      
    } catch (error) {
      console.error('💥 BookTTS: Error extracting text from page:', error);
      return '';
    }
  }, []);

  // Split text into manageable chunks for TTS
  const splitTextIntoChunks = useCallback((text: string): string[] => {
    console.log('✂️ BookTTS: Splitting text into chunks:', {
      textLength: text.length,
      chunkSize
    });
    
    if (!text.trim()) {
      console.warn('⚠️ BookTTS: No text to split');
      return [];
    }
    
    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    console.log('📝 BookTTS: Found sentences:', sentences.length);
    
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
    
    console.log('✅ BookTTS: Created chunks:', chunks.length);
    return chunks;
  }, [chunkSize]);

  // Play audio chunks sequentially
  const playChunksSequentially = useCallback(async (chunks: string[], voiceId?: string, startIndex = 0) => {
    console.log('🎵 BookTTS: Starting sequential playback:', {
      totalChunks: chunks.length,
      startIndex,
      voiceId
    });
    
    for (let i = startIndex; i < chunks.length; i++) {
      if (isStoppedRef.current) {
        console.log('⏹️ BookTTS: Playback stopped by user');
        break;
      }
      
      setCurrentChunkIndex(i);
      setReadingProgress(((i + 1) / chunks.length) * 100);
      
      try {
        console.log(`🎯 BookTTS: Playing chunk ${i + 1}/${chunks.length}`);
        
        setIsLoading(true);
        const audioUrl = await generateSpeech(chunks[i], voiceId);
        setIsLoading(false);
        
        console.log(`🔊 BookTTS: Generated audio URL for chunk ${i + 1}:, audioUrl ? 'Success' : 'Failed'`);
        
        if (!audioUrl || isStoppedRef.current) {
          console.warn(`⚠️ BookTTS: No audio URL or stopped for chunk ${i + 1}`);
          break;
        }

        // Play the audio chunk
        await new Promise<void>((resolve, reject) => {
          const audio = new Audio(audioUrl);
          currentAudioRef.current = audio;
          
          console.log(`▶️ BookTTS: Playing chunk ${i + 1}`);
          
          const cleanup = () => {
            try {
              URL.revokeObjectURL(audioUrl);
            } catch (e) {
              console.warn('Warning revoking URL:', e);
            }
            currentAudioRef.current = null;
          };
          
          audio.onended = () => {
            console.log(`✅ BookTTS: Finished playing chunk ${i + 1}`);
            cleanup();
            
            if (i < chunks.length - 1 && pauseBetweenChunks > 0) {
              timeoutRef.current = setTimeout(resolve, pauseBetweenChunks);
            } else {
              resolve();
            }
          };
          
          audio.onerror = (e) => {
            console.error(`💥 BookTTS: Error playing chunk ${i + 1}:`, e);
            cleanup();
            reject(e);
          };
          
          audio.volume = 1.0;
          audio.play().catch((playError) => {
            console.error(`💥 BookTTS: Play promise rejected for chunk ${i + 1}:`, playError);
            cleanup();
            reject(playError);
          });
        });
        
      } catch (error) {
        console.error(`💥 BookTTS: Failed to play chunk ${i + 1}:`, error);
        continue;
      }
    }
    
    console.log('🏁 BookTTS: Sequential playback completed');
    setIsReading(false);
    setIsLoading(false);
    setReadingProgress(100);
    setCurrentChunkIndex(0);
    currentAudioRef.current = null;
  }, [generateSpeech, pauseBetweenChunks]);

  // Start reading the current page
  const startReading = useCallback(async (rendition: any, voiceId?: string) => {
    console.log('🎬 BookTTS: Start reading requested');
    
    if (isReading || isLoading) {
      console.log('⚠️ BookTTS: Already reading or loading');
      return;
    }

    console.log('📖 BookTTS: Extracting text from current page');
    
    const pageText = extractCurrentPageText(rendition);
    if (!pageText.trim()) {
      console.warn('❌ BookTTS: No text found on current page');
      return;
    }

    console.log('✅ BookTTS: Text extracted successfully, creating chunks');
    
    const chunks = splitTextIntoChunks(pageText);
    if (chunks.length === 0) {
      console.warn('❌ BookTTS: No text chunks created');
      return;
    }

    console.log('✅ BookTTS: Starting playback');
    
    setTextChunks(chunks);
    setIsReading(true);
    setCurrentChunkIndex(0);
    setReadingProgress(0);
    isStoppedRef.current = false;

    await playChunksSequentially(chunks, voiceId);
  }, [extractCurrentPageText, splitTextIntoChunks, playChunksSequentially, isReading, isLoading]);

  // Stop reading
  const stopReading = useCallback(() => {
    console.log('⏹️ BookTTS: Stopping TTS reading');
    isStoppedRef.current = true;
    setIsReading(false);
    setIsLoading(false);
    
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setCurrentChunkIndex(0);
    setReadingProgress(0);
    setTextChunks([]);
  }, []);

  // Resume reading from where we left off
  const resumeReading = useCallback(async (voiceId?: string) => {
    console.log('▶️ BookTTS: Resume reading requested');
    
    if (!textChunks.length || isReading || isLoading) {
      console.log('⚠️ BookTTS: Cannot resume');
      return;
    }

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
