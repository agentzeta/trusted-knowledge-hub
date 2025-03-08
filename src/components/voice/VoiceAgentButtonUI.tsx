
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MessageSquare } from 'lucide-react';
import AgentVeritasAvatar from '../AgentVeritasAvatar';

interface VoiceAgentButtonUIProps {
  isListening?: boolean;
  onClick: () => void;
  type?: 'voice' | 'chat';
  label?: string;
  className?: string;
}

const VoiceAgentButtonUI: React.FC<VoiceAgentButtonUIProps> = ({
  isListening = false,
  onClick,
  type = 'voice',
  label,
  className = ""
}) => {
  // Different color schemes based on button type
  const defaultClass = type === 'voice' 
    ? "rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
    : "rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white";
  
  return (
    <Button
      className={`${defaultClass} ${className} flex items-center gap-2`}
      size={label ? "default" : "icon"}
      onClick={onClick}
    >
      {type === 'voice' ? (
        isListening ? 
          <Mic className="h-5 w-5 animate-pulse text-red-200" /> : 
          <AgentVeritasAvatar size="sm" />
      ) : (
        <MessageSquare className="h-5 w-5" />
      )}
      {label && <span>{label}</span>}
    </Button>
  );
};

export default VoiceAgentButtonUI;
