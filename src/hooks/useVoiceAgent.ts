import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useQueryContext } from './useQueryContext';

export const useVoiceAgent = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceId, setVoiceId] = useState("9BWtsMINqrJLrRacOk9x"); // Default Aria voice
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const { consensusResponse, submitQuery, isLoading } = useQueryContext();
  
  useEffect(() => {
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log('Voice recognition result:', transcript);
          if (transcript) {
            processVoiceInput(transcript);
          }
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          toast({
            title: "Voice Recognition Error",
            description: `Error: ${event.error}. Please try again.`,
            variant: "destructive",
          });
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak now. I'm listening.",
      });
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
      toast({
        title: "Error",
        description: "Failed to start voice recognition. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const processVoiceInput = (transcript: string) => {
    console.log('Processing voice input:', transcript);
    const normalizedText = transcript.toLowerCase().trim();
    
    // Check for speaking to agent intent
    if (normalizedText.includes('speak') || normalizedText.includes('agent') || 
        normalizedText.includes('voice') || normalizedText.includes('talk')) {
      console.log('User wants to speak to agent');
      speakResponse("Great! Would you like me to use video or just voice for our conversation?");
    } 
    // Check for text intent
    else if (normalizedText.includes('text') || normalizedText.includes('type') || 
             normalizedText.includes('chat')) {
      console.log('User wants to use text');
      speakResponse("Switching to text mode. Please type your question in the search box.");
    }
    // Check for video intent  
    else if (normalizedText.includes('video')) {
      console.log('User wants video mode');
      speakResponse("Starting video mode. Please allow camera access if prompted.");
      // Additional logic to trigger video mode would go here
    }
    // Otherwise treat as a question
    else {
      console.log('Processing as a question:', normalizedText);
      submitQuery(normalizedText);
      speakResponse("I'll find an answer to that question for you.");
    }
  };

  const speakResponse = async (text: string) => {
    if (!text || isSpeaking) return;
    
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
    isListening,
    speakResponse,
    speakConsensus,
    stopSpeaking,
    startListening,
    stopListening,
    changeVoice,
    voiceId
  };
};
