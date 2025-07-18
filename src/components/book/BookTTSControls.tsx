
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Volume2, VolumeX, Loader2, Play, Pause, Square } from 'lucide-react';
import { useBookTextToSpeech } from '@/hooks/useBookTextToSpeech';
import { useBookWebSpeechTTS } from '@/hooks/useBookWebSpeechTTS';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface BookTTSControlsProps {
  rendition: any;
  className?: string;
}

const BookTTSControls: React.FC<BookTTSControlsProps> = ({
  rendition,
  className
}) => {
  const [selectedVoiceId, setSelectedVoiceId] = useState('EXAVITQu4vr4xnSDxMaL'); // Default to Sarah
  const [useFallback, setUseFallback] = useState(false);
  
  // ElevenLabs TTS (primary)
  const elevenLabsTTS = useBookTextToSpeech({
    chunkSize: 1500,
    pauseBetweenChunks: 300
  });

  // Web Speech TTS (fallback)
  const webSpeechTTS = useBookWebSpeechTTS({
    chunkSize: 1500,
    pauseBetweenChunks: 300
  });

  // Use the appropriate TTS based on fallback state
  const currentTTS = useFallback ? webSpeechTTS : elevenLabsTTS;

  const handleToggleReading = async () => {
    console.log('🎯 BookTTSControls: Toggle reading clicked:', {
      isReading: currentTTS.isReading,
      hasRendition: !!rendition,
      totalChunks: currentTTS.totalChunks,
      currentChunkIndex: currentTTS.currentChunkIndex,
      useFallback
    });
    
    if (currentTTS.isReading) {
      console.log('⏹️ BookTTSControls: Stopping reading');
      currentTTS.stopReading();
    } else if (currentTTS.totalChunks > 0 && currentTTS.currentChunkIndex > 0) {
      console.log('▶️ BookTTSControls: Resuming reading');
      await currentTTS.resumeReading(useFallback ? selectedVoiceId : selectedVoiceId);
    } else {
      console.log('🎬 BookTTSControls: Starting reading from beginning');
      
      // Try ElevenLabs first if not already using fallback
      if (!useFallback) {
        try {
          await elevenLabsTTS.startReading(rendition, selectedVoiceId);
        } catch (error) {
          console.warn('⚠️ ElevenLabs failed, switching to Web Speech:', error);
          setUseFallback(true);
          // Start with Web Speech instead
          await webSpeechTTS.startReading(rendition, selectedVoiceId);
        }
      } else {
        await webSpeechTTS.startReading(rendition, selectedVoiceId);
      }
    }
  };

  const handleStop = () => {
    console.log('⏹️ BookTTSControls: Stop clicked');
    currentTTS.stopReading();
  };

  const handleVoiceChange = (newVoiceId: string) => {
    setSelectedVoiceId(newVoiceId);
    
    // If changing to a Web Speech voice, switch to fallback mode
    if (webSpeechTTS.availableVoices.some(v => v.id === newVoiceId)) {
      setUseFallback(true);
    } else if (elevenLabsTTS.availableVoices.some(v => v.id === newVoiceId)) {
      setUseFallback(false);
    }
  };

  if (!rendition) {
    console.log('⚠️ BookTTSControls: No rendition provided - not rendering controls');
    return null;
  }

  console.log('🎛️ BookTTSControls: Rendering controls:', {
    isReading: currentTTS.isReading,
    isLoading: currentTTS.isLoading,
    readingProgress: currentTTS.readingProgress,
    currentChunkIndex: currentTTS.currentChunkIndex,
    totalChunks: currentTTS.totalChunks,
    availableVoices: currentTTS.availableVoices.length,
    useFallback
  });

  // Combine voices from both TTS systems
  const allVoices = [
    ...elevenLabsTTS.availableVoices.map(v => ({ ...v, source: 'ElevenLabs' })),
    ...webSpeechTTS.availableVoices.map(v => ({ ...v, source: 'WebSpeech' }))
  ];

  return (
    <div className={cn("flex flex-col gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Volume2 className="h-4 w-4" />
          Text-to-Speech {useFallback && <span className="text-xs text-amber-600">(Web Speech)</span>}
        </h3>
        
        <div className="flex items-center gap-2">
          {/* Voice Selection */}
          <Select value={selectedVoiceId} onValueChange={handleVoiceChange}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue placeholder="Voice" />
            </SelectTrigger>
            <SelectContent>
              {elevenLabsTTS.availableVoices.length > 0 && (
                <>
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500">ElevenLabs</div>
                  {elevenLabsTTS.availableVoices.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name}
                    </SelectItem>
                  ))}
                </>
              )}
              {webSpeechTTS.availableVoices.length > 0 && (
                <>
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500">Browser Voices</div>
                  {webSpeechTTS.availableVoices.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>

          {/* Control Buttons */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleToggleReading}
            disabled={currentTTS.isLoading}
            className="h-8 w-8 p-0"
            title={currentTTS.isReading ? "Pause reading" : "Start reading"}
          >
            {currentTTS.isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : currentTTS.isReading ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3" />
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleStop}
            disabled={!currentTTS.isReading && !currentTTS.isLoading && currentTTS.totalChunks === 0}
            className="h-8 w-8 p-0"
            title="Stop reading"
          >
            <Square className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      {(currentTTS.isReading || currentTTS.isLoading || currentTTS.totalChunks > 0) && (
        <div className="space-y-2">
          <Progress value={currentTTS.readingProgress} className="h-1" />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              {currentTTS.totalChunks > 0 ? `Part ${currentTTS.currentChunkIndex + 1} of ${currentTTS.totalChunks}` : 'Preparing...'}
            </span>
            <span>{Math.round(currentTTS.readingProgress)}%</span>
          </div>
        </div>
      )}

      {/* Status Text */}
      {currentTTS.isLoading && (
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Preparing speech...
        </p>
      )}
      {currentTTS.isReading && !currentTTS.isLoading && (
        <p className="text-xs text-green-600 dark:text-green-400">
          Reading page aloud {useFallback ? '(using browser voice)' : '(using ElevenLabs)'}
        </p>
      )}
      {allVoices.length === 0 && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          Loading voices...
        </p>
      )}
    </div>
  );
};

export default BookTTSControls;
