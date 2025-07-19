import { useState, useCallback, useRef } from 'react';
import { useTextToSpeech } from './useTextToSpeech';

export interface BookTTSOptions {
  chunkSize?: number;
  pauseBetweenChunks?: number;
  maxConcurrentChunks?: number;
}

export const useBookTextToSpeech = (options: BookTTSOptions = {}) => {
  const { chunkSize = 2000, pauseBetweenChunks = 500, maxConcurrentChunks = 3 } = options;
  const { generateSpeech, isLoading: baseTTSLoading, availableVoices } = useTextToSpeech();
  
  const [isReading, setIsReading] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [textChunks, setTextChunks] = useState<string[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [hasQuotaError, setHasQuotaError] = useState(false);
  
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const isStoppedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const generatingChunksRef = useRef<Set<number>>(new Set());

  // Extract visible text from current page using proper viewport detection
  const extractCurrentPageText = useCallback(async (rendition: any): Promise<string> => {
    console.log('🔍 BookTTS: Starting visible text extraction from current page');
    
    try {
      if (!rendition) {
        console.error('❌ BookTTS: No rendition provided');
        return '';
      }

      // Get the current location to understand what's visible
      const currentLocation = rendition.currentLocation();
      console.log('📍 BookTTS: Current location:', currentLocation);

      // Get the current view that's actually being displayed
      const manager = rendition.manager;
      if (!manager || !manager.views) {
        console.error('❌ BookTTS: No view manager found');
        return '';
      }

      console.log('📖 BookTTS: Accessing current view manager');
      
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
        console.warn('⚠️ BookTTS: No current view with contents found');
        return '';
      }

      console.log('📄 BookTTS: Found current view with contents');

      // Get the iframe document from the current view
      const doc = currentView.contents.document;
      if (!doc) {
        console.warn('⚠️ BookTTS: No document in current view');
        return '';
      }

      // Try to get only the visible text by looking at the viewport
      let visibleText = '';

      // Method 1: Try to get text from elements that are actually in the viewport
      if (currentView.contents.window) {
        const win = currentView.contents.window;
        const viewportHeight = win.innerHeight;
        const scrollTop = win.pageYOffset || doc.documentElement.scrollTop;
        
        console.log('📐 BookTTS: Viewport info:', {
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
          
          console.log('✅ BookTTS: Extracted visible text from viewport elements:', {
            elementsCount: visibleElements.length,
            textLength: visibleText.length,
            preview: visibleText.substring(0, 200) + '...'
          });
        }
      }

      // Method 2: Fallback - get a reasonable chunk from current position
      if (!visibleText || visibleText.length < 100) {
        console.log('🔄 BookTTS: Using fallback method - getting text chunk from current position');
        
        const bodyText = doc.body ? (doc.body.textContent || doc.body.innerText || '') : '';
        
        if (bodyText && bodyText.length > 0) {
          // Take a reasonable chunk (not the whole document)
          const maxChunkSize = 8000; // Reasonable size for one "page"
          
          // If we have current location info, try to start from a relevant position
          let startIndex = 0;
          if (currentLocation && currentLocation.start && currentLocation.start.percentage) {
            const percentage = currentLocation.start.percentage;
            startIndex = Math.floor(bodyText.length * percentage);
            console.log('📊 BookTTS: Using location percentage to start at:', percentage, 'index:', startIndex);
          }
          
          visibleText = bodyText.substring(startIndex, startIndex + maxChunkSize);
          
          console.log('✅ BookTTS: Extracted text chunk from position:', {
            startIndex,
            chunkLength: visibleText.length,
            totalLength: bodyText.length,
            preview: visibleText.substring(0, 200) + '...'
          });
        }
      }

      if (!visibleText || visibleText.trim().length < 50) {
        console.warn('⚠️ BookTTS: No sufficient visible text found');
        return '';
      }

      // Clean up the text
      const cleanedText = visibleText
        .replace(/\s+/g, ' ')
        .trim();
      
      console.log('✅ BookTTS: Final extracted text:', {
        length: cleanedText.length,
        preview: cleanedText.substring(0, 200) + '...'
      });
      
      return cleanedText;
      
    } catch (error) {
      console.error('💥 BookTTS: Error extracting visible text:', error);
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

  // Generate audio for a specific chunk with quota error handling
  const generateChunkAudio = useCallback(async (chunkText: string, chunkIndex: number, voiceId?: string): Promise<string | null> => {
    if (generatingChunksRef.current.has(chunkIndex)) {
      console.log(`⚠️ BookTTS: Chunk ${chunkIndex} already being generated`);
      return null;
    }

    generatingChunksRef.current.add(chunkIndex);
    
    try {
      console.log(`🎯 BookTTS: Generating audio for chunk ${chunkIndex + 1}`);
      const audioUrl = await generateSpeech(chunkText, voiceId);
      
      if (!audioUrl) {
        console.warn(`⚠️ BookTTS: No audio URL returned for chunk ${chunkIndex + 1}, may be quota issue`);
        setHasQuotaError(true);
        throw new Error('ElevenLabs quota exceeded or API error');
      }
      
      console.log(`🔊 BookTTS: Generated audio URL for chunk ${chunkIndex + 1}: Success`);
      return audioUrl;
    } catch (error) {
      console.error(`💥 BookTTS: Failed to generate chunk ${chunkIndex + 1}:`, error);
      
      // Check if it's a quota error
      if (error.message.includes('quota') || error.message.includes('credits')) {
        console.warn('⚠️ BookTTS: Quota exceeded, setting quota error flag');
        setHasQuotaError(true);
      }
      
      throw error;
    } finally {
      generatingChunksRef.current.delete(chunkIndex);
    }
  }, [generateSpeech]);

  // Play audio chunks with immediate playback and limited concurrent generation
  const playChunksWithImmediateStart = useCallback(async (chunks: string[], voiceId?: string, startIndex = 0) => {
    console.log('🎵 BookTTS: Starting immediate playback:', {
      totalChunks: chunks.length,
      startIndex,
      voiceId,
      maxConcurrentChunks
    });
    
    const audioUrls: (string | null)[] = new Array(chunks.length).fill(null);
    
    // Generate the first chunk immediately
    if (chunks[startIndex]) {
      console.log(`🚀 BookTTS: Generating first chunk ${startIndex + 1} immediately`);
      setIsLoading(true);
      
      try {
        audioUrls[startIndex] = await generateChunkAudio(chunks[startIndex], startIndex, voiceId);
        setIsLoading(false);
        
        if (!audioUrls[startIndex] || isStoppedRef.current) {
          console.warn('❌ BookTTS: Failed to generate first chunk or stopped');
          setIsReading(false);
          return;
        }
      } catch (error) {
        console.error('💥 BookTTS: ElevenLabs failed for first chunk:', error);
        setIsLoading(false);
        setIsReading(false);
        
        if (hasQuotaError || error.message.includes('quota') || error.message.includes('credits')) {
          throw new Error('ElevenLabs quota exceeded - fallback required');
        }
        return;
      }
    }

    // Start playing immediately while generating more chunks
    for (let i = startIndex; i < chunks.length; i++) {
      if (isStoppedRef.current) {
        console.log('⏹️ BookTTS: Playback stopped by user');
        break;
      }
      
      setCurrentChunkIndex(i);
      setReadingProgress(((i + 1) / chunks.length) * 100);
      
      // Generate next chunks in background (up to maxConcurrentChunks ahead)
      const generatePromises: Promise<void>[] = [];
      for (let j = i + 1; j <= Math.min(i + maxConcurrentChunks, chunks.length - 1); j++) {
        if (!audioUrls[j] && !generatingChunksRef.current.has(j)) {
          generatePromises.push(
            generateChunkAudio(chunks[j], j, voiceId).then(url => {
              audioUrls[j] = url;
            }).catch(error => {
              console.warn(`⚠️ BookTTS: Failed to generate chunk ${j + 1}:`, error);
              audioUrls[j] = null;
            })
          );
        }
      }
      
      // Wait for current chunk if not ready yet
      if (!audioUrls[i]) {
        console.log(`⏳ BookTTS: Waiting for chunk ${i + 1} to be generated`);
        setIsLoading(true);
        
        try {
          audioUrls[i] = await generateChunkAudio(chunks[i], i, voiceId);
          setIsLoading(false);
        } catch (error) {
          console.error(`💥 BookTTS: Failed to generate chunk ${i + 1}:`, error);
          setIsLoading(false);
          break;
        }
      }
      
      if (!audioUrls[i] || isStoppedRef.current) {
        console.warn(`⚠️ BookTTS: No audio URL or stopped for chunk ${i + 1}`);
        break;
      }

      // Play the audio chunk
      await new Promise<void>((resolve, reject) => {
        const audio = new Audio(audioUrls[i]!);
        currentAudioRef.current = audio;
        
        console.log(`▶️ BookTTS: Playing chunk ${i + 1}`);
        
        const cleanup = () => {
          try {
            URL.revokeObjectURL(audioUrls[i]!);
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
    }
    
    console.log('🏁 BookTTS: Playback completed');
    setIsReading(false);
    setIsLoading(false);
    setReadingProgress(100);
    setCurrentChunkIndex(0);
    currentAudioRef.current = null;
  }, [generateChunkAudio, pauseBetweenChunks, maxConcurrentChunks, hasQuotaError]);

  // Start reading the current page
  const startReading = useCallback(async (rendition: any, voiceId?: string) => {
    console.log('🎬 BookTTS: Start reading requested');
    
    if (isReading || isLoading) {
      console.log('⚠️ BookTTS: Already reading or loading');
      return;
    }

    setHasQuotaError(false);

    console.log('📖 BookTTS: Extracting visible text from current page');
    
    const pageText = await extractCurrentPageText(rendition);
    if (!pageText.trim()) {
      console.warn('❌ BookTTS: No visible text found on current page');
      return;
    }

    console.log('✅ BookTTS: Visible text extracted successfully, creating chunks');
    
    const chunks = splitTextIntoChunks(pageText);
    if (chunks.length === 0) {
      console.warn('❌ BookTTS: No text chunks created');
      return;
    }

    console.log('✅ BookTTS: Starting immediate playback');
    
    setTextChunks(chunks);
    setIsReading(true);
    setCurrentChunkIndex(0);
    setReadingProgress(0);
    setAudioQueue([]);
    isStoppedRef.current = false;
    generatingChunksRef.current.clear();

    try {
      await playChunksWithImmediateStart(chunks, voiceId);
    } catch (error) {
      console.error('💥 BookTTS: Playback failed:', error);
      setIsReading(false);
      setIsLoading(false);
      
      if (error.message.includes('quota') || error.message.includes('fallback')) {
        throw error;
      }
    }
  }, [extractCurrentPageText, splitTextIntoChunks, playChunksWithImmediateStart, isReading, isLoading]);

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
    setAudioQueue([]);
    generatingChunksRef.current.clear();
  }, []);

  const resumeReading = useCallback(async (voiceId?: string) => {
    console.log('▶️ BookTTS: Resume reading requested');
    
    if (!textChunks.length || isReading || isLoading) {
      console.log('⚠️ BookTTS: Cannot resume');
      return;
    }

    setIsReading(true);
    isStoppedRef.current = false;
    generatingChunksRef.current.clear();

    try {
      await playChunksWithImmediateStart(textChunks, voiceId, currentChunkIndex);
    } catch (error) {
      console.error('💥 BookTTS: Resume failed:', error);
      setIsReading(false);
      setIsLoading(false);
      
      if (error.message.includes('quota') || error.message.includes('fallback')) {
        throw error;
      }
    }
  }, [textChunks, currentChunkIndex, playChunksWithImmediateStart, isReading, isLoading]);

  return {
    isReading,
    isLoading: isLoading || baseTTSLoading,
    readingProgress,
    currentChunkIndex,
    totalChunks: textChunks.length,
    startReading,
    stopReading,
    resumeReading,
    availableVoices,
    hasQuotaError
  };
};
