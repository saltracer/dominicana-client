
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
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "No text provided for speech generation",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    
    try {
      console.log('Generating TTS for text:', text.substring(0, 100) + '...');
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: {
          text: text.trim(),
          voice_id: voiceId || 'EXAVITQu4vr4xnSDxMaL' // Default to Sarah
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('TTS response received:', data ? 'Success' : 'No data');

      // The edge function returns JSON with base64 encoded audio
      if (data && data.audioContent) {
        console.log('Creating audio blob from base64 data');
        const audioBlob = new Blob([
          Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))
        ], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log('Audio URL created successfully');
        return audioUrl;
      }

      throw new Error('No audio content received from TTS service');
    } catch (error) {
      console.error('TTS generation error:', error);
      toast({
        title: "Speech Generation Failed",
        description: "Unable to generate speech. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const playAudio = useCallback(async (text: string, voiceId?: string) => {
    console.log('Play audio requested for text length:', text.length);
    
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      URL.revokeObjectURL(currentAudio.src);
    }

    const audioUrl = await generateSpeech(text, voiceId);
    if (!audioUrl) {
      console.log('No audio URL generated');
      return;
    }

    console.log('Creating audio element with URL:', audioUrl.substring(0, 50) + '...');
    const audio = new Audio(audioUrl);
    setCurrentAudio(audio);

    audio.onplay = () => {
      console.log('Audio playback started');
      setIsPlaying(true);
    };
    audio.onpause = () => {
      console.log('Audio playback paused');
      setIsPlaying(false);
    };
    audio.onended = () => {
      console.log('Audio playback ended');
      setIsPlaying(false);
      URL.revokeObjectURL(audioUrl);
      setCurrentAudio(null);
    };
    audio.onerror = (e) => {
      console.error('Audio playback error:', e);
      toast({
        title: "Playback Failed",
        description: "Unable to play audio. Please try again.",
        variant: "destructive",
      });
      setIsPlaying(false);
    };

    try {
      console.log('Attempting to play audio');
      await audio.play();
    } catch (error) {
      console.error('Audio playback error:', error);
      toast({
        title: "Playback Failed",
        description: "Unable to play audio. Please try again.",
        variant: "destructive",
      });
    }
  }, [currentAudio, generateSpeech, toast]);

  const stopAudio = useCallback(() => {
    if (currentAudio) {
      console.log('Stopping audio playback');
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
