
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TTSVoice {
  id: string;
  name: string;
  description: string;
}

export const availableVoices: TTSVoice[] = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'American female, warm and clear' },
  { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria', description: 'American female, gentle and soothing' },
  { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger', description: 'American male, deep and resonant' },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', description: 'American male, calm and steady' },
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', description: 'British female, elegant and refined' },
];

export const useTextToSpeech = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const generateSpeech = useCallback(async (text: string, voiceId?: string) => {
    console.log('🗣️ TTS: Generate speech requested:', {
      textLength: text.length,
      voiceId,
      preview: text.substring(0, 50) + '...'
    });
    
    if (!text.trim()) {
      console.error('❌ TTS: No text provided for speech generation');
      toast({
        title: "Error",
        description: "No text provided for speech generation",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    
    try {
      console.log('🔄 TTS: Calling Supabase function...');
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: {
          text: text.trim(),
          voice_id: voiceId || 'EXAVITQu4vr4xnSDxMaL' // Default to Sarah
        }
      });

      if (error) {
        console.error('💥 TTS: Supabase function error:', error);
        throw error;
      }

      console.log('✅ TTS: Function response received:', {
        hasData: !!data,
        hasAudioContent: !!(data && data.audioContent),
        audioContentLength: data?.audioContent?.length
      });

      // The edge function returns JSON with base64 encoded audio
      if (data && data.audioContent) {
        console.log('🎵 TTS: Creating audio blob from base64 data');
        try {
          const audioBlob = new Blob([
            Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))
          ], { type: 'audio/mpeg' });
          
          const audioUrl = URL.createObjectURL(audioBlob);
          console.log('✅ TTS: Audio URL created successfully:', {
            blobSize: audioBlob.size,
            urlLength: audioUrl.length
          });
          
          return audioUrl;
        } catch (blobError) {
          console.error('💥 TTS: Error creating audio blob:', blobError);
          throw new Error('Failed to create audio blob from response');
        }
      }

      console.error('❌ TTS: No audio content in response');
      throw new Error('No audio content received from TTS service');
    } catch (error) {
      console.error('💥 TTS: Generation error:', error);
      toast({
        title: "Speech Generation Failed",
        description: `Unable to generate speech: ${error.message}`,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const playAudio = useCallback(async (text: string, voiceId?: string) => {
    console.log('▶️ TTS: Play audio requested:', {
      textLength: text.length,
      voiceId
    });
    
    // Stop current audio if playing
    if (currentAudio) {
      console.log('⏹️ TTS: Stopping current audio');
      currentAudio.pause();
      currentAudio.currentTime = 0;
      URL.revokeObjectURL(currentAudio.src);
    }

    const audioUrl = await generateSpeech(text, voiceId);
    if (!audioUrl) {
      console.log('❌ TTS: No audio URL generated');
      return;
    }

    console.log('🎶 TTS: Creating audio element');
    const audio = new Audio(audioUrl);
    setCurrentAudio(audio);

    audio.onplay = () => {
      console.log('▶️ TTS: Audio playback started');
      setIsPlaying(true);
    };
    audio.onpause = () => {
      console.log('⏸️ TTS: Audio playback paused');
      setIsPlaying(false);
    };
    audio.onended = () => {
      console.log('✅ TTS: Audio playback ended');
      setIsPlaying(false);
      URL.revokeObjectURL(audioUrl);
      setCurrentAudio(null);
    };
    audio.onerror = (e) => {
      console.error('💥 TTS: Audio playback error:', e);
      console.error('Audio error details:', {
        error: audio.error,
        networkState: audio.networkState,
        readyState: audio.readyState
      });
      toast({
        title: "Playback Failed",
        description: "Unable to play audio. Please try again.",
        variant: "destructive",
      });
      setIsPlaying(false);
    };

    try {
      console.log('🚀 TTS: Attempting to play audio');
      await audio.play();
    } catch (error) {
      console.error('💥 TTS: Audio playback error:', error);
      toast({
        title: "Playback Failed",
        description: `Unable to play audio: ${error.message}`,
        variant: "destructive",
      });
    }
  }, [currentAudio, generateSpeech, toast]);

  const stopAudio = useCallback(() => {
    if (currentAudio) {
      console.log('⏹️ TTS: Stopping audio playback');
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
    }
  }, [currentAudio]);

  return {
    isLoading,
    isPlaying,
    playAudio,
    stopAudio,
    generateSpeech,
    availableVoices
  };
};
