
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { cn } from '@/lib/utils';

interface TTSControlsProps {
  text: string;
  voiceId?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

const TTSControls: React.FC<TTSControlsProps> = ({
  text,
  voiceId,
  className,
  size = 'sm',
  variant = 'outline'
}) => {
  const { isLoading, isPlaying, playAudio, stopAudio } = useTextToSpeech();

  const handleToggleAudio = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio(text, voiceId);
    }
  };

  if (!text?.trim()) {
    return null;
  }

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleToggleAudio}
      disabled={isLoading}
      className={cn("h-7 w-7 p-1", className)}
      title={isPlaying ? "Stop audio" : "Play audio"}
    >
      {isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : isPlaying ? (
        <VolumeX className="h-3 w-3" />
      ) : (
        <Volume2 className="h-3 w-3" />
      )}
    </Button>
  );
};

export default TTSControls;
