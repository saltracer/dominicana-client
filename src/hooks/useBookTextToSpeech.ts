
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

  // Enhanced text extraction using proper ePub.js APIs
  const extractCurrentPageText = useCallback(async (rendition: any): Promise<string> => {
    console.log('🔍 BookTTS: Starting ePub.js text extraction');
    
    try {
      if (!rendition) {
        console.error('❌ BookTTS: No rendition provided');
        return '';
      }

      // Method 1: Get text from current view using contents
      try {
        const manager = rendition.manager;
        if (manager && manager.views) {
          console.log('📖 BookTTS: Accessing manager views');
          
          const views = manager.views;
          let viewsArray = [];
          
          // Handle different view manager types
          if (Array.isArray(views)) {
            viewsArray = views;
          } else if (views && typeof views === 'object') {
            viewsArray = Object.values(views);
          }
          
          console.log('🔍 BookTTS: Found views:', viewsArray.length);
          
          for (const view of viewsArray) {
            if (view && view.contents) {
              console.log('📄 BookTTS: Processing view with contents');
              
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
                    
                    console.log('✅ BookTTS: Extracted text from view:', {
                      length: cleanedText.length,
                      preview: cleanedText.substring(0, 200) + '...'
                    });
                    
                    return cleanedText;
                  }
                }
              } catch (viewError) {
                console.warn('⚠️ BookTTS: Error processing view:', viewError);
              }
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ BookTTS: Error with view method:', error);
      }

      // Method 2: Try using the current location and spine
      try {
        const currentLocation = rendition.currentLocation();
        if (currentLocation && currentLocation.start) {
          console.log('📍 BookTTS: Current location found:', currentLocation.start.href);
          
          const book = rendition.book;
          if (book && book.spine) {
            // Get the spine item for current location
            const spineItem = book.spine.get(currentLocation.start.href);
            if (spineItem) {
              console.log('📚 BookTTS: Found spine item');
              
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
                      
                      console.log('✅ BookTTS: Extracted text from section:', {
                        totalLength: cleanedText.length,
                        pageLength: pageText.length,
                        preview: pageText.substring(0, 200) + '...'
                      });
                      
                      return pageText;
                    }
                  }
                }
              } catch (sectionError) {
                console.warn('⚠️ BookTTS: Error loading section:', sectionError);
              }
            }
          }
        }
      } catch (locationError) {
        console.warn('⚠️ BookTTS: Error with location method:', locationError);
      }

      // Method 3: Fallback - try to get any text from the rendition
      try {
        console.log('🔄 BookTTS: Trying fallback text extraction');
        
        if (rendition.book && rendition.book.spine) {
          const spine = rendition.book.spine;
          const currentItem = spine.items[0]; // Get first available item as fallback
          
          if (currentItem) {
            console.log('📖 BookTTS: Using fallback spine item:', currentItem.href);
            
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
                  
                  console.log('✅ BookTTS: Fallback text extraction successful:', {
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
        console.warn('⚠️ BookTTS: Fallback method failed:', fallbackError);
      }

      console.warn('⚠️ BookTTS: All text extraction methods failed');
      return '';
      
    } catch (error) {
      console.error('💥 BookTTS: Error extracting text from current page:', error);
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

    console.log('📖 BookTTS: Extracting text from current page using ePub.js APIs');
    
    const pageText = await extractCurrentPageText(rendition);
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
