
import { useState, useEffect } from 'react';
import { useVoiceAgent } from './useVoiceAgent';
import { toast } from '@/components/ui/use-toast';

export const useVoiceButtonControl = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isListening, isSpeaking, startListening, stopListening, speakResponse } = useVoiceAgent();

  useEffect(() => {
    // Initialize SpeechRecognition API when component mounts
    try {
      // @ts-ignore - Speech recognition not in TS types
      window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!window.SpeechRecognition) {
        console.error("Speech Recognition API not supported in this browser");
        toast({
          title: "Feature Not Available",
          description: "Voice features are not supported in your browser",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error initializing speech recognition:", error);
    }
  }, []);

  const handleButtonClick = () => {
    if (!isDialogOpen) {
      setIsDialogOpen(true);
      
      // Start the conversation with a greeting after a short delay
      setTimeout(() => {
        speakResponse("Hello, I'm Agent Veritas. Let me help you explore some facts today. What would you like to know about?")
          .then(() => {
            console.log("Initial greeting completed, starting listening");
            setTimeout(() => {
              startListening();
            }, 500);
          })
          .catch(error => {
            console.error("Error during initial greeting:", error);
            // Still try to start listening even if speech fails
            startListening();
          });
      }, 500);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    
    if (!open) {
      if (isListening) {
        stopListening();
      }
      
      // If the dialog is closing, speak a farewell message
      speakResponse("Thank you for chatting with Agent Veritas. Feel free to ask more questions anytime!")
        .catch(error => console.error("Error during farewell message:", error));
    }
  };

  return {
    isDialogOpen,
    isListening,
    isSpeaking,
    handleButtonClick,
    handleDialogOpenChange
  };
};
