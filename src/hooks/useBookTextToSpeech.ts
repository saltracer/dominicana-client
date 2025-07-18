
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
    try {
      // Get the current location's content
      const currentLocation = rendition.currentLocation();
      if (!currentLocation?.start?.cfi) {
        console.warn('No current location found in rendition');
        return '';
      }

      // Try to get the text content from the current section
      const manager = rendition.manager;
      const view = manager.views().find((v: any) => v.displayed);
      
      if (view && view.contents) {
        const document = view.contents.document;
        if (document && document.body) {
          // Extract text content, cleaning up formatting
          const textContent = document.body.textContent || document.body.innerText || '';
          return textContent
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, ' ')
            .trim();
        }
      }
      
      console.warn('Could not extract text from current page');
      return '';
    } catch (error) {
      console.error('Error extracting text from page:', error);
      return '';
    }
  }, []);

  // Split text into manageable chunks for TTS
  const splitTextIntoChunks = useCallback((text: string): string[] => {
    if (!text.trim()) return [];
    
    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
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
    
    return chunks;
  }, [chunkSize]);

  // Play audio chunks sequentially
  const playChunksSequentially = useCallback(async (chunks: string[], voiceId?: string, startIndex = 0) => {
    setIsLoading(true);
    
    for (let i = startIndex; i < chunks.length; i++) {
      if (isStoppedRef.current) {
        break;
      }
      
      setCurrentChunkIndex(i);
      setReadingProgress((i / chunks.length) * 100);
      
      try {
        console.log(`Playing chunk ${i + 1}/${chunks.length}:`, chunks[i].substring(0, 50) + '...');
        
        const audioUrl = await generateSpeech(chunks[i], voiceId);
        if (!audioUrl || isStoppedRef.current) {
          break;
        }

        // Play the audio chunk
        await new Promise<void>((resolve, reject) => {
          const audio = new Audio(audioUrl);
          currentAudioRef.current = audio;
          
          audio.onplay = () => {
            console.log(`Started playing chunk ${i + 1}`);
          };
          
          audio.onended = () => {
            console.log(`Finished playing chunk ${i + 1}`);
            URL.revokeObjectURL(audioUrl);
            currentAudioRef.current = null;
            
            // Pause between chunks if not the last one
            if (i < chunks.length - 1 && pauseBetweenChunks > 0) {
              setTimeout(resolve, pauseBetweenChunks);
            } else {
              resolve();
            }
          };
          
          audio.onerror = (e) => {
            console.error(`Error playing chunk ${i + 1}:`, e);
            URL.revokeObjectURL(audioUrl);
            currentAudioRef.current = null;
            reject(e);
          };
          
          audio.play().catch(reject);
        });
        
      } catch (error) {
        console.error(`Failed to play chunk ${i + 1}:`, error);
        // Continue to next chunk on error
      }
    }
    
    // Reading completed or stopped
    setIsReading(false);
    setIsLoading(false);
    setReadingProgress(100);
    setCurrentChunkIndex(0);
    currentAudioRef.current = null;
  }, [generateSpeech, pauseBetweenChunks]);

  // Start reading the current page
  const startReading = useCallback(async (rendition: any, voiceId?: string) => {
    if (isReading || isLoading) {
      console.log('Already reading or loading');
      return;
    }

    console.log('Starting to read current page');
    
    const pageText = extractCurrentPageText(rendition);
    if (!pageText.trim()) {
      console.warn('No text found on current page');
      return;
    }

    console.log('Extracted text length:', pageText.length);
    
    const chunks = splitTextIntoChunks(pageText);
    if (chunks.length === 0) {
      console.warn('No text chunks created');
      return;
    }

    console.log('Created chunks:', chunks.length);
    
    setTextChunks(chunks);
    setIsReading(true);
    setCurrentChunkIndex(0);
    setReadingProgress(0);
    isStoppedRef.current = false;

    await playChunksSequentially(chunks, voiceId);
  }, [extractCurrentPageText, splitTextIntoChunks, playChunksSequentially, isReading, isLoading]);

  // Stop reading
  const stopReading = useCallback(() => {
    console.log('Stopping TTS reading');
    isStoppedRef.current = true;
    setIsReading(false);
    setIsLoading(false);
    
    if (currentAudioRef.current) {
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
    if (!textChunks.length || isReading || isLoading) {
      return;
    }

    console.log('Resuming reading from chunk', currentChunkIndex);
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
