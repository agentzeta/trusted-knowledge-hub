
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useSpeechSynthesis = (
  setIsSpeaking: (speaking: boolean) => void,
  voiceId: string = "pFZP5JQG7iQjIQuC4Bku" // Default to Lily voice
) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setIsSpeaking(false);
      });
      
      audioRef.current.addEventListener('pause', () => {
        setIsPlaying(false);
        setIsSpeaking(false);
      });
      
      audioRef.current.addEventListener('play', () => {
        setIsPlaying(true);
        setIsSpeaking(true);
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [setIsSpeaking]);
  
  // Function to speak text using ElevenLabs
  const speakResponse = async (text: string) => {
    try {
      if (!text) {
        console.error('No text provided for speech');
        return;
      }
      
      // Limit text length for ElevenLabs
      const truncatedText = text.length > 1000 
        ? text.substring(0, 997) + '...' 
        : text;
      
      setIsLoading(true);
      console.log('Calling ElevenLabs TTS with text:', truncatedText.substring(0, 30) + '...');
      
      // Stop any current playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: { 
          text: truncatedText,
          voiceId
        }
      });
      
      if (error) {
        console.error('TTS error:', error);
        throw new Error(`ElevenLabs API error: ${error.message || 'Unknown error'}`);
      }
      
      if (!data || !data.audioContent) {
        console.error('No audio content received');
        throw new Error('Failed to generate audio content');
      }
      
      if (data.error) {
        // API returned an error in the data
        console.error('API returned error:', data.error);
        
        if (data.code === "ELEVENLABS_API_ERROR" && data.status === 401) {
          toast({
            title: "ElevenLabs Quota Exceeded",
            description: "Your ElevenLabs account has reached its quota limit. Please try again later or upgrade your plan.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Text-to-Speech Error",
            description: data.error,
            variant: "destructive",
          });
        }
        return;
      }
      
      // Create blob URL from base64
      const blob = base64ToBlob(data.audioContent, 'audio/mpeg');
      const url = URL.createObjectURL(blob);
      
      // Set the audio source and play
      if (audioRef.current) {
        audioRef.current.src = url;
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Speech synthesis error:', error);
      
      toast({
        title: "Speech Synthesis Failed",
        description: error.message || "Failed to generate speech",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper to convert base64 to blob
  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    return new Blob(byteArrays, { type: mimeType });
  };
  
  // Function to stop speaking
  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  
  return {
    audioRef,
    isPlaying,
    isLoading,
    speakResponse,
    stopSpeaking
  };
};
