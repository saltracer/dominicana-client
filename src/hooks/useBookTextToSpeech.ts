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

  // Enhanced text extraction method focusing on currently visible content only
  const extractCurrentPageText = useCallback((rendition: any): string => {
    console.log('🔍 BookTTS: Starting text extraction from currently visible page');
    
    try {
      if (!rendition) {
        console.error('❌ BookTTS: No rendition provided');
        return '';
      }

      let extractedText = '';

      // Method 1: Extract from currently displayed view only
      try {
        const manager = rendition.manager;
        console.log('📖 BookTTS: Manager found:', !!manager);
        
        if (manager && manager.views) {
          console.log('👁️ BookTTS: Views found:', manager.views);
          
          // Access views as property, not function
          const views = Array.isArray(manager.views) ? manager.views : Object.values(manager.views);
          console.log('📚 BookTTS: Processing views:', views.length);
          
          // Focus ONLY on currently displayed/visible views
          for (const view of views) {
            console.log('🔍 BookTTS: Processing view:', {
              displayed: view?.displayed,
              hasContents: !!view?.contents,
              hasDocument: !!view?.contents?.document
            });
            
            // Only process views that are currently displayed
            if (view && view.displayed && view.contents && view.contents.document) {
              try {
                const doc = view.contents.document;
                const body = doc.body || doc.documentElement;
                
                if (body) {
                  console.log('📄 BookTTS: Found body element in displayed view');
                  
                  // Get visible content from the current view
                  const viewportContent = body.textContent || body.innerText || '';
                  
                  // Clean up the text but keep it focused on current view
                  const cleanedText = viewportContent
                    .replace(/\s+/g, ' ')
                    .replace(/\n+/g, ' ')
                    .trim();
                  
                  console.log('✅ BookTTS: Extracted visible content:', {
                    length: cleanedText.length,
                    preview: cleanedText.substring(0, 200) + '...'
                  });
                  
                  // Only use content that's reasonably sized for a page
                  if (cleanedText.length > 100 && cleanedText.length < 50000) {
                    extractedText = cleanedText;
                    break; // Take the first displayed view
                  }
                }
              } catch (error) {
                console.warn('⚠️ BookTTS: Error processing displayed view:', error);
              }
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ BookTTS: Error accessing manager views:', error);
      }

      // Method 2: Fallback - Get visible content from iframe viewport
      if (!extractedText.trim()) {
        console.log('📖 BookTTS: Trying fallback method - iframe viewport content');
        
        try {
          const iframes = document.querySelectorAll('iframe');
          console.log('🔍 BookTTS: Found iframes:', iframes.length);
          
          for (const iframe of iframes) {
            try {
              const iframeDoc = (iframe as HTMLIFrameElement).contentDocument;
              if (iframeDoc) {
                console.log('📄 BookTTS: Accessing iframe document');
                
                const body = iframeDoc.body || iframeDoc.documentElement;
                if (body) {
                  const iframeElement = iframe as HTMLIFrameElement;
                  const rect = iframeElement.getBoundingClientRect();
                  const isVisible = rect.width > 0 && rect.height > 0;
                  
                  console.log('👁️ BookTTS: Iframe visibility:', {
                    isVisible,
                    width: rect.width,
                    height: rect.height
                  });
                  
                  if (isVisible) {
                    // Try to get content that's actually visible in the viewport
                    const visibleElements = body.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6');
                    let visibleText = '';
                    
                    for (const element of visibleElements) {
                      const elementRect = element.getBoundingClientRect();
                      const iframe = element.ownerDocument?.defaultView?.frameElement as HTMLIFrameElement;
                      const iframeRect = iframe?.getBoundingClientRect();
                      
                      // Check if element is within iframe viewport
                      if (iframeRect && elementRect.top >= 0 && elementRect.top < iframeRect.height) {
                        const elementText = (element as HTMLElement).textContent || '';
                        if (elementText.trim() && elementText.length > 20) {
                          visibleText += elementText.trim() + ' ';
                        }
                      }
                    }
                    
                    // If viewport detection didn't work, get a reasonable amount of content from the start
                    if (!visibleText.trim()) {
                      const allText = body.textContent || body.innerText || '';
                      // Take first portion that's reasonable for a page (not the entire book)
                      visibleText = allText.substring(0, 5000);
                    }
                    
                    const text = visibleText.trim();
                    console.log('📝 BookTTS: Extracted viewport text:', {
                      length: text.length,
                      preview: text.substring(0, 200) + '...'
                    });
                    
                    if (text.length > 100) {
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

      // Final cleanup
      if (extractedText.trim()) {
        const finalText = extractedText
          .replace(/\s+/g, ' ')
          .replace(/[^\w\s.,!?;:'"()-]/g, ' ')
          .trim();
        
        console.log('✅ BookTTS: Successfully extracted current page text:', {
          originalLength: extractedText.length,
          cleanedLength: finalText.length,
          preview: finalText.substring(0, 200) + '...'
        });
        
        return finalText;
      }

      console.warn('⚠️ BookTTS: No meaningful content could be extracted from current page');
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
    let currentPlayingIndex = startIndex;
    
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
        
        // If it's a quota error, throw to trigger fallback
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

    // Reset quota error flag on new start
    setHasQuotaError(false);

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
      
      // Re-throw quota errors to trigger fallback
      if (error.message.includes('quota') || error.message.includes('fallback')) {
        throw error;
      }
    }
  }, [extractCurrentPageText, splitTextIntoChunks, playChunksWithImmediateStart, isReading, isLoading]);

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
    setAudioQueue([]);
    generatingChunksRef.current.clear();
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
    generatingChunksRef.current.clear();

    try {
      await playChunksWithImmediateStart(textChunks, voiceId, currentChunkIndex);
    } catch (error) {
      console.error('💥 BookTTS: Resume failed:', error);
      setIsReading(false);
      setIsLoading(false);
      
      // Re-throw quota errors to trigger fallback
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
