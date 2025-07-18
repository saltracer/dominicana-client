
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Volume2, VolumeX, Loader2, Play, Pause, Square } from 'lucide-react';
import { useBookTextToSpeech } from '@/hooks/useBookTextToSpeech';
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
  const {
    isReading,
    isLoading,
    readingProgress,
    currentChunkIndex,
    totalChunks,
    startReading,
    stopReading,
    resumeReading,
    availableVoices
  } = useBookTextToSpeech({
    chunkSize: 1500, // Slightly smaller chunks for books
    pauseBetweenChunks: 300 // Shorter pause between chunks
  });

  const handleToggleReading = async () => {
    if (isReading) {
      stopReading();
    } else if (totalChunks > 0 && currentChunkIndex > 0) {
      // Resume from where we left off
      await resumeReading(selectedVoiceId);
    } else {
      // Start from beginning
      await startReading(rendition, selectedVoiceId);
    }
  };

  const handleStop = () => {
    stopReading();
  };

  if (!rendition) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Text-to-Speech
        </h3>
        
        <div className="flex items-center gap-2">
          {/* Voice Selection */}
          <Select value={selectedVoiceId} onValueChange={setSelectedVoiceId}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue placeholder="Voice" />
            </SelectTrigger>
            <SelectContent>
              {availableVoices.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Control Buttons */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleToggleReading}
            disabled={isLoading}
            className="h-8 w-8 p-0"
            title={isReading ? "Pause reading" : "Start reading"}
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : isReading ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3" />
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleStop}
            disabled={!isReading && !isLoading && totalChunks === 0}
            className="h-8 w-8 p-0"
            title="Stop reading"
          >
            <Square className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      {(isReading || isLoading || totalChunks > 0) && (
        <div className="space-y-2">
          <Progress value={readingProgress} className="h-1" />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              {totalChunks > 0 ? `Part ${currentChunkIndex + 1} of ${totalChunks}` : 'Preparing...'}
            </span>
            <span>{Math.round(readingProgress)}%</span>
          </div>
        </div>
      )}

      {/* Status Text */}
      {isLoading && (
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Generating speech...
        </p>
      )}
      {isReading && !isLoading && (
        <p className="text-xs text-green-600 dark:text-green-400">
          Reading page aloud
        </p>
      )}
    </div>
  );
};

export default BookTTSControls;
