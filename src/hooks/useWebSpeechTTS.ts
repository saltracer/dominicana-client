
import React, { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface WebSpeechVoice {
  id: string;
  name: string;
  description: string;
  voice: SpeechSynthesisVoice;
}

export const useWebSpeechTTS = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<WebSpeechVoice[]>([]);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  // Load available voices
  const loadVoices = useCallback(() => {
    const voices = speechSynthesis.getVoices();
    console.log('🗣️ WebSpeech: Available voices:', voices.length);
    
    const webSpeechVoices: WebSpeechVoice[] = voices
      .filter(voice => voice.lang.startsWith('en'))
      .map((voice, index) => ({
        id: `voice-${index}`,
        name: voice.name,
        description: `${voice.lang} - ${voice.localService ? 'Local' : 'Network'}`,
        voice
      }));
    
    setAvailableVoices(webSpeechVoices);
    console.log('✅ WebSpeech: Loaded voices:', webSpeechVoices.length);
  }, []);

  // Initialize voices when component mounts or when voices change
  React.useEffect(() => {
    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [loadVoices]);

  const playAudio = useCallback(async (text: string, voiceId?: string) => {
    console.log('▶️ WebSpeech: Play audio requested:', {
      textLength: text.length,
      voiceId,
      preview: text.substring(0, 50) + '...'
    });
    
    if (!text.trim()) {
      console.error('❌ WebSpeech: No text provided');
      toast({
        title: "Error",
        description: "No text provided for speech",
        variant: "destructive",
      });
      return;
    }

    // Stop current speech if playing
    if (currentUtteranceRef.current) {
      console.log('⏹️ WebSpeech: Stopping current speech');
      speechSynthesis.cancel();
    }

    setIsLoading(true);
    
    try {
      console.log('🎵 WebSpeech: Creating speech utterance');
      const utterance = new SpeechSynthesisUtterance(text);
      currentUtteranceRef.current = utterance;

      // Find and set the voice
      if (voiceId && availableVoices.length > 0) {
        const selectedVoice = availableVoices.find(v => v.id === voiceId);
        if (selectedVoice) {
          utterance.voice = selectedVoice.voice;
          console.log('🎤 WebSpeech: Using voice:', selectedVoice.name);
        }
      }

      // Configure utterance
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        console.log('▶️ WebSpeech: Speech started');
        setIsPlaying(true);
        setIsLoading(false);
      };

      utterance.onend = () => {
        console.log('✅ WebSpeech: Speech ended');
        setIsPlaying(false);
        currentUtteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        console.error('💥 WebSpeech: Speech error:', event.error);
        setIsPlaying(false);
        setIsLoading(false);
        currentUtteranceRef.current = null;
        toast({
          title: "Speech Error",
          description: `Failed to play speech: ${event.error}`,
          variant: "destructive",
        });
      };

      utterance.onpause = () => {
        console.log('⏸️ WebSpeech: Speech paused');
        setIsPlaying(false);
      };

      utterance.onresume = () => {
        console.log('▶️ WebSpeech: Speech resumed');
        setIsPlaying(true);
      };

      console.log('🚀 WebSpeech: Starting speech synthesis');
      speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('💥 WebSpeech: Error in playAudio:', error);
      setIsLoading(false);
      setIsPlaying(false);
      toast({
        title: "Speech Failed",
        description: `Unable to play speech: ${error.message}`,
        variant: "destructive",
      });
    }
  }, [availableVoices, toast]);

  const stopAudio = useCallback(() => {
    console.log('⏹️ WebSpeech: Stop audio requested');
    if (currentUtteranceRef.current || speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      currentUtteranceRef.current = null;
    }
  }, []);

  const pauseAudio = useCallback(() => {
    console.log('⏸️ WebSpeech: Pause audio requested');
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
    }
  }, []);

  const resumeAudio = useCallback(() => {
    console.log('▶️ WebSpeech: Resume audio requested');
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    }
  }, []);

  return {
    isLoading,
    isPlaying,
    playAudio,
    stopAudio,
    pauseAudio,
    resumeAudio,
    availableVoices
  };
};
