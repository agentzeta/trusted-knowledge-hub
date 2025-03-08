
import { useState } from 'react';
import { useVoiceAgent } from './useVoiceAgent';

export const useVoiceButtonControl = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isListening, isSpeaking, startListening, stopListening } = useVoiceAgent();

  const handleButtonClick = () => {
    if (!isDialogOpen) {
      if (!isListening && !isSpeaking) {
        startListening(); // Start listening immediately when button is clicked
      }
      setIsDialogOpen(true);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open && isListening) {
      stopListening();
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
