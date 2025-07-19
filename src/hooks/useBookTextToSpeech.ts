
import { useState, useCallback, useRef } from 'react';
import { useTextToSpeech } from './useTextToSpeech';
import { extractCurrentPageText, splitTextIntoChunks } from '@/utils/epubTextExtraction';

export interface BookTTSOptions {
  chunkSize?: number;
  pauseBetweenChunks?: number;
  maxConcurrentChunks?: number;
}

export const useBookTextToSpeech = (options: BookTTSOptions = {}) => {
  const { chunkSize = 1500, pauseBetweenChunks = 500, maxConcurrentChunks = 3 } = options;
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

    console.log('📖 BookTTS: Extracting visible text from current page using ePub.js APIs');
    
    const extractionResult = await extractCurrentPageText(rendition);
    if (!extractionResult.text.trim()) {
      console.warn('❌ BookTTS: No visible text found on current page');
      return;
    }

    console.log('✅ BookTTS: Text extracted successfully:', {
      length: extractionResult.text.length,
      sectionTitle: extractionResult.sectionTitle,
      chapterIndex: extractionResult.chapterIndex,
      preview: extractionResult.text.substring(0, 100) + '...'
    });
    
    const chunks = splitTextIntoChunks(extractionResult.text, chunkSize);
    if (chunks.length === 0) {
      console.warn('❌ BookTTS: No text chunks created');
      return;
    }

    console.log('✅ BookTTS: Starting immediate playback from current page position');
    
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
  }, [chunkSize, playChunksWithImmediateStart, isReading, isLoading]);

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
