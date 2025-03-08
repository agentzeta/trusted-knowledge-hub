
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import AgentVeritasAvatar from '../AgentVeritasAvatar';

interface VoiceAgentButtonUIProps {
  isListening: boolean;
  onClick: () => void;
}

const VoiceAgentButtonUI: React.FC<VoiceAgentButtonUIProps> = ({
  isListening,
  onClick
}) => {
  return (
    <Button
      className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
      size="icon"
      onClick={onClick}
    >
      {isListening ? 
        <Mic className="h-5 w-5 animate-pulse text-red-200" /> : 
        <AgentVeritasAvatar size="sm" />
      }
    </Button>
  );
};

export default VoiceAgentButtonUI;
