
-- Add TTS columns to user_liturgy_preferences table
ALTER TABLE public.user_liturgy_preferences 
ADD COLUMN IF NOT EXISTS tts_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS tts_voice_id TEXT DEFAULT 'EXAVITQu4vr4xnSDxMaL',
ADD COLUMN IF NOT EXISTS tts_speed DECIMAL DEFAULT 1.0;
