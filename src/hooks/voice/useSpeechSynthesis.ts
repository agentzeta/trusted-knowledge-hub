
import { useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { AudioRefValue } from './types';

export const useSpeechSynthesis = (
  setIsSpeaking: (value: boolean) => void,
  voiceId: string
) => {
  const audioRef: AudioRefValue = useRef(null);

  // Create audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const speakResponse = async (text: string) => {
    if (!text) return;
    
    try {
      setIsSpeaking(true);
      
      console.log("Calling ElevenLabs TTS with text:", text.substring(0, 50) + "...");
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: { text, voiceId }
      });
      
      if (error) {
        console.error("TTS error:", error);
        throw new Error(error.message || 'Error generating speech');
      }
      
      if (!data || !data.audioContent) {
        console.error("No audio content returned");
        throw new Error('No audio content returned');
      }
      
      console.log("Received audio response, length:", data.audioContent.length);
      
      // Convert base64 to blob URL
      const binary = atob(data.audioContent);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(blob);
      
      // Play audio
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        audioRef.current.onerror = (e) => {
          console.error('Audio playback error:', e);
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          toast({
            title: "Playback Error",
            description: "There was an error playing the voice response",
            variant: "destructive",
          });
        };
        
        try {
          await audioRef.current.play();
        } catch (playError) {
          console.error("Audio play error:", playError);
          setIsSpeaking(false);
          throw playError;
        }
      }
    } catch (error: any) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
      toast({
        title: "Voice Error",
        description: error.message || "Failed to generate voice response",
        variant: "destructive",
      });
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  };

  return {
    audioRef,
    speakResponse,
    stopSpeaking
  };
};
