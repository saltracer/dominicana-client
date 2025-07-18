
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
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: {
          text: text.trim(),
          voice_id: voiceId || 'EXAVITQu4vr4xnSDxMaL' // Default to Sarah
        },
        responseType: 'arraybuffer'
      });

      if (error) {
        throw error;
      }

      // Convert array buffer to blob and create audio URL
      const audioBlob = new Blob([data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      return audioUrl;
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
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      URL.revokeObjectURL(currentAudio.src);
    }

    const audioUrl = await generateSpeech(text, voiceId);
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    setCurrentAudio(audio);

    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => {
      setIsPlaying(false);
      URL.revokeObjectURL(audioUrl);
      setCurrentAudio(null);
    };

    try {
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
