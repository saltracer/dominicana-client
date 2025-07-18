
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

  // Extract text from the current page in the EPUB rendition
  const extractCurrentPageText = useCallback((rendition: any): string => {
    console.log('🔍 BookTTS: Starting text extraction from rendition');
    
    try {
      if (!rendition) {
        console.error('❌ BookTTS: No rendition provided');
        return '';
      }

      console.log('📖 BookTTS: Rendition object:', {
        hasBook: !!rendition.book,
        hasManager: !!rendition.manager,
        hasCurrentLocation: !!rendition.currentLocation
      });

      // Get the current location's content
      const currentLocation = rendition.currentLocation();
      console.log('📍 BookTTS: Current location:', currentLocation);
      
      if (!currentLocation?.start?.cfi) {
        console.warn('⚠️ BookTTS: No current location found in rendition');
        return '';
      }

      // Try to get the text content from the current section
      const manager = rendition.manager;
      if (!manager) {
        console.error('❌ BookTTS: No manager found in rendition');
        return '';
      }

      const view = manager.views().find((v: any) => v.displayed);
      console.log('👁️ BookTTS: Found view:', {
        hasView: !!view,
        isDisplayed: view?.displayed,
        hasContents: !!view?.contents
      });
      
      if (view && view.contents) {
        const document = view.contents.document;
        console.log('📄 BookTTS: Document info:', {
          hasDocument: !!document,
          hasBody: !!document?.body,
          bodyType: typeof document?.body
        });
        
        if (document && document.body) {
          // Extract text content, cleaning up formatting
          const textContent = document.body.textContent || document.body.innerText || '';
          const cleanedText = textContent
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, ' ')
            .trim();
          
          console.log('✅ BookTTS: Successfully extracted text:', {
            originalLength: textContent.length,
            cleanedLength: cleanedText.length,
            preview: cleanedText.substring(0, 100) + '...'
          });
          
          return cleanedText;
        }
      }
      
      console.warn('⚠️ BookTTS: Could not extract text from current page - trying alternative method');
      
      // Alternative method: try to get text from the current section directly
      if (rendition.book && currentLocation.start.href) {
        console.log('🔄 BookTTS: Trying alternative extraction method');
        const section = rendition.book.spine.get(currentLocation.start.href);
        if (section) {
          console.log('📑 BookTTS: Found section for alternative extraction');
          // This is a fallback - we'll return a placeholder for now
          return 'Alternative text extraction method - section found but content parsing needed.';
        }
      }
      
      console.error('❌ BookTTS: All text extraction methods failed');
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
      setReadingProgress((i / chunks.length) * 100);
      
      try {
        console.log(`🎯 BookTTS: Playing chunk ${i + 1}/${chunks.length}:`, {
          chunkLength: chunks[i].length,
          preview: chunks[i].substring(0, 50) + '...'
        });
        
        const audioUrl = await generateSpeech(chunks[i], voiceId);
        console.log(`🔊 BookTTS: Generated audio URL for chunk ${i + 1}:`, {
          hasUrl: !!audioUrl,
          urlPreview: audioUrl ? audioUrl.substring(0, 50) + '...' : 'null'
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
          
          audio.onplay = () => {
            console.log(`🎶 BookTTS: Started playing chunk ${i + 1}`);
          };
          
          audio.onended = () => {
            console.log(`✅ BookTTS: Finished playing chunk ${i + 1}`);
            URL.revokeObjectURL(audioUrl);
            currentAudioRef.current = null;
            
            // Pause between chunks if not the last one
            if (i < chunks.length - 1 && pauseBetweenChunks > 0) {
              console.log(`⏸️ BookTTS: Pausing ${pauseBetweenChunks}ms between chunks`);
              setTimeout(resolve, pauseBetweenChunks);
            } else {
              resolve();
            }
          };
          
          audio.onerror = (e) => {
            console.error(`💥 BookTTS: Error playing chunk ${i + 1}:`, e);
            console.error('Audio error details:', {
              error: audio.error,
              networkState: audio.networkState,
              readyState: audio.readyState
            });
            URL.revokeObjectURL(audioUrl);
            currentAudioRef.current = null;
            reject(e);
          };
          
          console.log(`🚀 BookTTS: Attempting to play chunk ${i + 1}`);
          audio.play().catch((playError) => {
            console.error(`💥 BookTTS: Play promise rejected for chunk ${i + 1}:`, playError);
            reject(playError);
          });
        });
        
      } catch (error) {
        console.error(`💥 BookTTS: Failed to play chunk ${i + 1}:`, error);
        // Continue to next chunk on error
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
