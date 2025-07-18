
import { useState, useCallback, useRef } from 'react';
import { useTextToSpeech } from './useTextToSpeech';

export interface BookTTSOptions {
  chunkSize?: number; // Characters per TTS chunk
  pauseBetweenChunks?: number; // Milliseconds to pause between chunks
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
    console.log('🔍 BookTTS: Starting enhanced text extraction from rendition');
    
    try {
      if (!rendition) {
        console.error('❌ BookTTS: No rendition provided');
        return '';
      }

      let extractedText = '';

      // Method 1: Try to get text from current location using rendition's built-in methods
      try {
        const currentLocation = rendition.currentLocation();
        console.log('📍 BookTTS: Current location:', currentLocation);
        
        if (currentLocation && currentLocation.start) {
          const section = rendition.book.spine.get(currentLocation.start.href);
          if (section) {
            console.log('📄 BookTTS: Found section for current location');
            // This is a more reliable way to get the current page content
          }
        }
      } catch (error) {
        console.warn('⚠️ BookTTS: Error getting current location:', error);
      }

      // Method 2: Get text from the current view's iframe (enhanced approach)
      const manager = rendition.manager;
      if (manager && manager.views) {
        console.log('📖 BookTTS: Trying Method 2 - enhanced iframe extraction');
        const views = manager.views();
        console.log('👁️ BookTTS: Found views:', views.length);
        
        for (const view of views) {
          if (view.displayed && view.contents) {
            console.log('🎯 BookTTS: Processing displayed view');
            try {
              // Try multiple approaches to get the content
              let viewText = '';
              
              // Approach A: Direct content access
              if (view.contents.document) {
                const doc = view.contents.document;
                const body = doc.body || doc.documentElement;
                if (body) {
                  // Remove script and style elements before extracting text
                  const clone = body.cloneNode(true) as Element;
                  const scripts = clone.querySelectorAll('script, style');
                  scripts.forEach(el => el.remove());
                  
                  viewText = clone.textContent || clone.innerText || '';
                  console.log('✅ BookTTS: Approach A successful, text length:', viewText.length);
                }
              }
              
              // Approach B: Try iframe document access
              if (!viewText && view.iframe && view.iframe.contentDocument) {
                const doc = view.iframe.contentDocument;
                const body = doc.body || doc.documentElement;
                if (body) {
                  const clone = body.cloneNode(true) as Element;
                  const scripts = clone.querySelectorAll('script, style');
                  scripts.forEach(el => el.remove());
                  
                  viewText = clone.textContent || clone.innerText || '';
                  console.log('✅ BookTTS: Approach B successful, text length:', viewText.length);
                }
              }
              
              if (viewText.trim()) {
                extractedText = viewText;
                break;
              }
            } catch (error) {
              console.warn('⚠️ BookTTS: Error in Method 2 for view:', error);
            }
          }
        }
      }

      // Method 3: Fallback - Direct DOM query in the main document
      if (!extractedText.trim()) {
        console.log('📖 BookTTS: Trying Method 3 - direct DOM query fallback');
        try {
          const iframes = document.querySelectorAll('iframe[id^="epubjs-view"]');
          console.log('🔍 BookTTS: Found EPUB iframes:', iframes.length);
          
          for (const iframe of iframes) {
            try {
              const iframeDoc = (iframe as HTMLIFrameElement).contentDocument;
              if (iframeDoc) {
                const body = iframeDoc.body || iframeDoc.documentElement;
                if (body) {
                  // Check if iframe is visible (basic visibility check)
                  const iframeElement = iframe as HTMLIFrameElement;
                  const isVisible = iframeElement.offsetWidth > 0 && iframeElement.offsetHeight > 0;
                  
                  if (isVisible) {
                    const clone = body.cloneNode(true) as Element;
                    const scripts = clone.querySelectorAll('script, style');
                    scripts.forEach(el => el.remove());
                    
                    const text = clone.textContent || clone.innerText || '';
                    if (text.trim()) {
                      extractedText = text;
                      console.log('✅ BookTTS: Method 3 successful, extracted text length:', text.length);
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
          console.warn('⚠️ BookTTS: Error in Method 3:', error);
        }
      }

      // Clean up the extracted text
      if (extractedText.trim()) {
        const cleanedText = extractedText
          .replace(/\s+/g, ' ')
          .replace(/\n+/g, ' ')
          .replace(/[^\w\s.,!?;:'"()-]/g, '') // Remove unusual characters that might cause TTS issues
          .trim();
        
        console.log('✅ BookTTS: Successfully extracted and cleaned text:', {
          originalLength: extractedText.length,
          cleanedLength: cleanedText.length,
          preview: cleanedText.substring(0, 100) + '...'
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
      chunkSize,
      preview: text.substring(0, 50) + '...'
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
    
    console.log('✅ BookTTS: Created chunks:', {
      totalChunks: chunks.length,
      averageLength: chunks.reduce((sum, chunk) => sum + chunk.length, 0) / chunks.length,
      firstChunkPreview: chunks[0]?.substring(0, 50) + '...'
    });
    
    return chunks;
  }, [chunkSize]);

  // Play audio chunks sequentially
  const playChunksSequentially = useCallback(async (chunks: string[], voiceId?: string, startIndex = 0) => {
    console.log('🎵 BookTTS: Starting sequential playback:', {
      totalChunks: chunks.length,
      startIndex,
      voiceId
    });
    
    setIsLoading(true);
    
    for (let i = startIndex; i < chunks.length; i++) {
      if (isStoppedRef.current) {
        console.log('⏹️ BookTTS: Playback stopped by user');
        break;
      }
      
      setCurrentChunkIndex(i);
      setReadingProgress(((i + 1) / chunks.length) * 100);
      
      try {
        console.log(`🎯 BookTTS: Playing chunk ${i + 1}/${chunks.length}:`, {
          chunkLength: chunks[i].length,
          preview: chunks[i].substring(0, 50) + '...'
        });
        
        setIsLoading(true);
        const audioUrl = await generateSpeech(chunks[i], voiceId);
        setIsLoading(false);
        
        console.log(`🔊 BookTTS: Generated audio URL for chunk ${i + 1}:`, {
          hasUrl: !!audioUrl,
          urlLength: audioUrl ? audioUrl.length : 0
        });
        
        if (!audioUrl || isStoppedRef.current) {
          console.warn(`⚠️ BookTTS: No audio URL or stopped for chunk ${i + 1}`);
          break;
        }

        // Play the audio chunk
        await new Promise<void>((resolve, reject) => {
          const audio = new Audio(audioUrl);
          currentAudioRef.current = audio;
          
          console.log(`▶️ BookTTS: Created audio element for chunk ${i + 1}`);
          
          const cleanup = () => {
            URL.revokeObjectURL(audioUrl);
            currentAudioRef.current = null;
          };
          
          audio.onloadeddata = () => {
            console.log(`📊 BookTTS: Audio loaded for chunk ${i + 1}, duration:`, audio.duration);
          };
          
          audio.onplay = () => {
            console.log(`🎶 BookTTS: Started playing chunk ${i + 1}`);
          };
          
          audio.onended = () => {
            console.log(`✅ BookTTS: Finished playing chunk ${i + 1}`);
            cleanup();
            
            // Pause between chunks if not the last one
            if (i < chunks.length - 1 && pauseBetweenChunks > 0) {
              console.log(`⏸️ BookTTS: Pausing ${pauseBetweenChunks}ms between chunks`);
              timeoutRef.current = setTimeout(resolve, pauseBetweenChunks);
            } else {
              resolve();
            }
          };
          
          audio.onerror = (e) => {
            console.error(`💥 BookTTS: Error playing chunk ${i + 1}:`, e);
            console.error('Audio error details:', {
              error: audio.error,
              networkState: audio.networkState,
              readyState: audio.readyState,
              src: audioUrl.substring(0, 100) + '...'
            });
            cleanup();
            reject(e);
          };
          
          // Set volume and play
          audio.volume = 1.0;
          console.log(`🚀 BookTTS: Attempting to play chunk ${i + 1}`);
          audio.play().catch((playError) => {
            console.error(`💥 BookTTS: Play promise rejected for chunk ${i + 1}:`, playError);
            cleanup();
            reject(playError);
          });
        });
        
      } catch (error) {
        console.error(`💥 BookTTS: Failed to play chunk ${i + 1}:`, error);
        // Continue to next chunk on error instead of stopping completely
        continue;
      }
    }
    
    // Reading completed or stopped
    console.log('🏁 BookTTS: Sequential playback completed');
    setIsReading(false);
    setIsLoading(false);
    setReadingProgress(100);
    setCurrentChunkIndex(0);
    currentAudioRef.current = null;
  }, [generateSpeech, pauseBetweenChunks]);

  // Start reading the current page
  const startReading = useCallback(async (rendition: any, voiceId?: string) => {
    console.log('🎬 BookTTS: Start reading requested:', {
      hasRendition: !!rendition,
      voiceId,
      isReading,
      isLoading
    });
    
    if (isReading || isLoading) {
      console.log('⚠️ BookTTS: Already reading or loading - ignoring request');
      return;
    }

    console.log('📖 BookTTS: Starting to read current page');
    
    const pageText = extractCurrentPageText(rendition);
    if (!pageText.trim()) {
      console.warn('❌ BookTTS: No text found on current page');
      return;
    }

    console.log('✅ BookTTS: Extracted text successfully:', {
      length: pageText.length,
      preview: pageText.substring(0, 100) + '...'
    });
    
    const chunks = splitTextIntoChunks(pageText);
    if (chunks.length === 0) {
      console.warn('❌ BookTTS: No text chunks created');
      return;
    }

    console.log('✅ BookTTS: Created text chunks successfully:', chunks.length);
    
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
      console.log('🔇 BookTTS: Pausing current audio');
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
    console.log('▶️ BookTTS: Resume reading requested:', {
      hasChunks: textChunks.length > 0,
      currentIndex: currentChunkIndex,
      isReading,
      isLoading
    });
    
    if (!textChunks.length || isReading || isLoading) {
      console.log('⚠️ BookTTS: Cannot resume - no chunks or already playing');
      return;
    }

    console.log('🔄 BookTTS: Resuming reading from chunk', currentChunkIndex);
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
