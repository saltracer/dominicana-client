
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

  // Enhanced text extraction method focusing on current reading content
  const extractCurrentPageText = useCallback((rendition: any): string => {
    console.log('🔍 BookTTS: Starting text extraction from current reading position');
    
    try {
      if (!rendition) {
        console.error('❌ BookTTS: No rendition provided');
        return '';
      }

      let extractedText = '';

      // Method 1: Try to get text from the current location/section
      try {
        const manager = rendition.manager;
        console.log('📖 BookTTS: Manager found:', !!manager);
        
        if (manager && manager.views) {
          console.log('👁️ BookTTS: Views found:', manager.views);
          
          // Get the currently displayed views
          const views = Array.isArray(manager.views) ? manager.views : Object.values(manager.views);
          console.log('📚 BookTTS: Processing views:', views.length);
          
          // Focus on displayed views only
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
                  
                  // Remove unwanted elements more aggressively
                  const unwantedSelectors = [
                    'script', 'style', 'nav', 'header', 'footer', 
                    '.toc', '#toc', '.navigation', '.header', '.footer',
                    '.title-page', '.copyright', '.dedication',
                    'h1:first-child', // Often the book title
                    '.metadata', '.publisher', '.author-info'
                  ];
                  
                  unwantedSelectors.forEach(selector => {
                    const elements = clone.querySelectorAll(selector);
                    elements.forEach(el => el.remove());
                  });
                  
                  // Try to find main content area
                  let contentElement = clone.querySelector('main, article, .content, .chapter, .section') || clone;
                  
                  // Get text and filter out very short lines (likely metadata)
                  const allText = (contentElement as HTMLElement).textContent || (contentElement as HTMLElement).innerText || '';
                  const lines = allText.split('\n').filter(line => {
                    const trimmed = line.trim();
                    return trimmed.length > 20 && !trimmed.match(/^(Chapter|Page|\d+|Title|Author|Publisher)/i);
                  });
                  
                  const viewText = lines.join(' ');
                  console.log('✅ BookTTS: Extracted content text from view:', {
                    length: viewText.length,
                    preview: viewText.substring(0, 100) + '...'
                  });
                  
                  if (viewText.trim() && viewText.length > 100) {
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

      // Method 2: Fallback - Direct DOM query for current reading content
      if (!extractedText.trim()) {
        console.log('📖 BookTTS: Trying fallback method - direct iframe content access');
        
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
                    const clone = body.cloneNode(true) as HTMLElement;
                    
                    // Remove unwanted elements
                    const unwantedSelectors = [
                      'script', 'style', 'nav', 'header', 'footer', 
                      '.toc', '#toc', '.navigation', '.header', '.footer',
                      '.title-page', '.copyright', '.dedication',
                      '.metadata', '.publisher', '.author-info'
                    ];
                    
                    unwantedSelectors.forEach(selector => {
                      const elements = clone.querySelectorAll(selector);
                      elements.forEach(el => el.remove());
                    });
                    
                    // Try to find main content
                    let contentElement = clone.querySelector('main, article, .content, .chapter, .section') || clone;
                    const allText = (contentElement as HTMLElement).textContent || (contentElement as HTMLElement).innerText || '';
                    
                    // Filter content to focus on main text
                    const lines = allText.split('\n').filter(line => {
                      const trimmed = line.trim();
                      // Skip very short lines, titles, headers, and metadata
                      return trimmed.length > 30 && 
                             !trimmed.match(/^(Project Gutenberg|eBook|Title:|Author:|Release Date:|Language:|Chapter \d+|CHAPTER|Contents)/i) &&
                             !trimmed.match(/^\d+$/) && // Page numbers
                             !trimmed.match(/^[A-Z\s]+$/) && // All caps titles
                             trimmed.split(' ').length > 5; // At least 5 words
                    });
                    
                    const text = lines.join(' ');
                    console.log('📝 BookTTS: Filtered iframe text extracted:', {
                      totalLength: allText.length,
                      filteredLength: text.length,
                      linesKept: lines.length,
                      preview: text.substring(0, 200) + '...'
                    });
                    
                    if (text.trim() && text.length > 200) {
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
        
        console.log('✅ BookTTS: Successfully extracted and cleaned current reading text:', {
          originalLength: extractedText.length,
          cleanedLength: cleanedText.length,
          preview: cleanedText.substring(0, 200) + '...'
        });
        
        return cleanedText;
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
