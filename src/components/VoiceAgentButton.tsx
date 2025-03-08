
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { VoiceVideoAgent } from './VoiceVideoAgent';
import AgentVeritasAvatar from './AgentVeritasAvatar';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import { Mic, MicOff } from 'lucide-react';

const VoiceAgentButton: React.FC = () => {
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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div id="voice-agent-button">
        <Button
          className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
          size="icon"
          onClick={handleButtonClick}
        >
          {isListening ? <Mic className="h-5 w-5 animate-pulse text-red-200" /> : <AgentVeritasAvatar size="sm" />}
        </Button>
      </div>
      {isDialogOpen && (
        <VoiceVideoAgent 
          initialMode="voice" 
          isOpen={isDialogOpen} 
          onOpenChange={handleDialogOpenChange}
        />
      )}
    </div>
  );
};

export default VoiceAgentButton;
