
import { useRef, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useSpeechRecognition = (
  setIsListening: (value: boolean) => void,
  onTranscript: (transcript: string) => void
) => {
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  
  // Initialize speech recognition with better error handling
  const initializeSpeechRecognition = useCallback(() => {
    try {
      // @ts-ignore - Speech recognition not in TS types
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        throw new Error("Speech recognition not supported in this browser");
      }
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        console.log("Speech recognition started");
        setIsListening(true);
        isListeningRef.current = true;
      };
      
      recognition.onend = () => {
        console.log("Speech recognition ended");
        setIsListening(false);
        isListeningRef.current = false;
        
        // Auto-restart if we're supposed to be listening
        if (isListeningRef.current) {
          try {
            recognition.start();
            console.log("Restarted speech recognition after unexpected end");
          } catch (error) {
            console.error("Error restarting speech recognition:", error);
          }
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        
        if (event.error === 'no-speech') {
          console.log("No speech detected, continuing...");
          return; // Don't show error for no-speech
        }
        
        setIsListening(false);
        isListeningRef.current = false;
        
        toast({
          title: "Voice Recognition Error",
          description: `Error: ${event.error}. Try again or use text input.`,
          variant: "destructive",
        });
      };
      
      recognition.onresult = (event: any) => {
        console.log("Got speech recognition result");
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          console.log("Final transcript:", finalTranscript);
          onTranscript(finalTranscript);
        }
      };
      
      recognitionRef.current = recognition;
      return recognition;
    } catch (error) {
      console.error("Error initializing speech recognition:", error);
      toast({
        title: "Voice Recognition Not Available",
        description: "Your browser doesn't support speech recognition or permission was denied.",
        variant: "destructive",
      });
      return null;
    }
  }, [setIsListening, onTranscript]);
  
  // Create recognition instance on component mount
  useEffect(() => {
    if (!recognitionRef.current) {
      initializeSpeechRecognition();
    }
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error("Error stopping speech recognition:", error);
        }
      }
    };
  }, [initializeSpeechRecognition]);
  
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      const recognition = initializeSpeechRecognition();
      if (!recognition) return;
    }
    
    try {
      recognitionRef.current.start();
      isListeningRef.current = true;
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      
      // If it fails because it's already running, just set the state appropriately
      if ((error as any)?.message?.includes('already started')) {
        setIsListening(true);
        isListeningRef.current = true;
      } else {
        toast({
          title: "Voice Recognition Error",
          description: "Couldn't start voice recognition. Try again or use text input.",
          variant: "destructive",
        });
      }
    }
  }, [initializeSpeechRecognition, setIsListening]);
  
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        isListeningRef.current = false;
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    }
    
    setIsListening(false);
  }, [setIsListening]);
  
  return {
    recognitionRef,
    startListening,
    stopListening
  };
};
