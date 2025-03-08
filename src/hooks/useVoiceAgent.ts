
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useQueryContext } from './useQueryContext';

export const useVoiceAgent = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceId, setVoiceId] = useState("9BWtsMINqrJLrRacOk9x"); // Default Aria voice
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { consensusResponse } = useQueryContext();
  
  useEffect(() => {
    // Create audio element
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
    if (!text || isSpeaking) return;
    
    try {
      setIsSpeaking(true);
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: { text, voiceId }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data.audioContent) {
        throw new Error('No audio content returned');
      }
      
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
        
        await audioRef.current.play();
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
  
  const speakConsensus = () => {
    if (consensusResponse) {
      speakResponse(consensusResponse);
    } else {
      toast({
        title: "No Response",
        description: "Ask a question first to get a response that can be spoken",
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
  
  const changeVoice = (newVoiceId: string) => {
    setVoiceId(newVoiceId);
  };
  
  return {
    isSpeaking,
    speakResponse,
    speakConsensus,
    stopSpeaking,
    changeVoice,
    voiceId
  };
};
