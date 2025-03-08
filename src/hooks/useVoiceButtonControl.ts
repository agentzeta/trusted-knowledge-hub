
import { useState, useEffect } from 'react';
import { useVoiceAgent } from './useVoiceAgent';

export const useVoiceButtonControl = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isListening, isSpeaking, startListening, stopListening, speakResponse } = useVoiceAgent();

  const handleButtonClick = () => {
    if (!isDialogOpen) {
      setIsDialogOpen(true);
      
      // Start the conversation with a greeting
      setTimeout(() => {
        speakResponse("Hello, I'm Agent Veritas. Let me help you explore some facts today. What would you like to know about?")
          .then(() => {
            console.log("Initial greeting completed, starting listening");
            startListening();
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
